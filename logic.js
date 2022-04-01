let fGameover, fGameclear

function init() {
    initJiraigen()
    initMask()
    initKosuu()
    initMichi()
    fGameover = false
    fGameclear = false
}

function initJiraigen() {
    let erabu = nBomb
    for( let i = 0; i < nJiraigen; i++ ) {
        if( (nJiraigen - i) * Math.random() < erabu ) {
            jiraigen[ i ] = 1
            erabu--
        } else {
            jiraigen[ i ] = 0
        }
    }
    // 村と町の周囲は地雷撤去
    [ 0, 1, nxJiraigen, nxJiraigen + 1 ].forEach( i => {
        jiraigen[ i ] = 0
        jiraigen[ nJiraigen - 1 - i ] = 0
    })
}
function initMask() {
    for( let i = 0; i < nJiraigen; i++ ) {
        mask[ i ] = 1
    }
    mask[ nJiraigen - 1 ] = 8
    mask[ 0 ] = 9
}
function initKosuu() {
    const dir = [
        [-1,-1], [ 0,-1], [ 1,-1],
        [-1, 0],          [ 1, 0],
        [-1, 1], [ 0, 1], [ 1, 1]
    ]
    for( let i = 0; i < nJiraigen; i++ ) {
        const x = i % nxJiraigen
            , y = Math.floor( i / nxJiraigen )
        kosuu[ i ] = dir.filter( item => {
            if( x + item[0] < 0 ) return false
            if( x + item[0] >= nxJiraigen ) return false
            if( y + item[1] < 0 ) return false
            if( y + item[1] >= nyJiraigen) return false
            return true
        }).map( item => {
            return jiraigen[ x + item[0] + (y + item[1]) * nxJiraigen ]
        }).reduce( (a,b) => a + b, 0 )
    }
}
function initMichi() {
    for( let i = 0; i < nJiraigen; i++ ) {
        michi[ i ] = null
    }
    michi[0] = 0
}
function flagMasu( i ) {
    if( mask[ i ] === 0 ) return
    if( mask[ i ] === 1 ) {
        mask[ i ] = 2
        return
    }
    if( mask[ i ] === 2 ) {
        mask[ i ] = 1
        return
    }
}
function openMasu( i ) {
    if( mask[ i ] === 2 ) return
    if( mask[ i ] === 1 ) {
        if( jiraigen[ i ] === 1 ) {
            mask[ i ] = 0
            gameover()
            return
        } else {
            saikiOpen( i )
        }
        return
    }
    if( mask[ i ] === 0 ) {
        jidouOpen( i )
    }
}
function saikiOpen( i ) {
    if( mask[ i ] !== 1 ) return
    mask[ i ] = 0
    if( kosuu[ i ] === 0 ) {
        const dir = [
            [-1,-1], [ 0,-1], [ 1,-1],
            [-1, 0],          [ 1, 0],
            [-1, 1], [ 0, 1], [ 1, 1]
        ]
        const x = i % nxJiraigen
            , y = Math.floor( i / nxJiraigen )
        dir.filter( item => {
            if( x + item[0] < 0 ) return false
            if( x + item[0] >= nxJiraigen ) return false
            if( y + item[1] < 0 ) return false
            if( y + item[1] >= nyJiraigen) return false
            return true
        }).map( item => {
            return x + item[0] + (y + item[1]) * nxJiraigen
        })
        .forEach( j => {
            saikiOpen( j )
        })
    }

}
function jidouOpen( i ) {
    const x = i % nxJiraigen
        , y = Math.floor( i / nxJiraigen )
    const dir = [
        [-1,-1], [ 0,-1], [ 1,-1],
        [-1, 0],          [ 1, 0],
        [-1, 1], [ 0, 1], [ 1, 1]
    ]
    const kinjo = dir.filter( item => {
        if( x + item[0] < 0 ) return false
        if( x + item[0] >= nxJiraigen ) return false
        if( y + item[1] < 0 ) return false
        if( y + item[1] >= nyJiraigen) return false
        return true
    })
    const flagKosuu = kinjo.filter( item => {
        return mask[ x + item[0] + ( y + item[1] ) * nxJiraigen ] === 2
    }).length
    if( flagKosuu !== kosuu[ i ] ) return
    kinjo.filter( item => {
        return mask[ x + item[0] + ( y + item[1] ) * nxJiraigen ] === 1
    }).forEach( item => {
        openMasu( x + item[0] + ( y + item[1] ) * nxJiraigen )
    })
}
function fullOpen( i ) {
    for( let i = 0; i < nJiraigen; i++ ) {
        if( mask[ i ] !== 1 ) continue
        mask[ i ] = 0
    }
    draw()
}
function gameover() {
    fGameover = true
}
function gameclear() {
    fGameclear = true
}
function findMichi() {
    const dir = [
                 [ 0,-1],
        [-1, 0],          [ 1, 0],
                 [ 0, 1],
    ]
    const queue = []
    initMichi()
    michi[0] = 0
    queue.push(0)
    while( queue.length !== 0 ) {
        const node = queue.shift()
        const x = node % nxJiraigen
            , y = Math.floor( node / nxJiraigen )
        const children = dir.filter( item => {
            if( x + item[0] < 0 ) return false
            if( x + item[0] >= nxJiraigen ) return false
            if( y + item[1] < 0 ) return false
            if( y + item[1] >= nyJiraigen ) return false
            return true
        }).map( item => x + item[0] + ( y + item[1] ) * nxJiraigen ).filter( i => mask[i] === 0 || mask[i] === 8 || mask[i] === 9 )
        for( child of children ) {
            if( child === nJiraigen - 1 ) {
                gameclear()
                return
            }
            if( michi[ child ] === null ) {
                michi[ child ] = michi[ node ] + 1
                queue.push( child )
            }
        }
    }
}