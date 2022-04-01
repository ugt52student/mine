function draw() {
    clearCanvas()
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = '20px meiryo'
    drawJiraigen()
    drawPlayer()
    if( fGameover && !fGameclear ) {
        drawGameover()
    }
    if( fGameclear && !fGameover ) {
        drawMichi()
        drawGameclear()
    }
}

function drawJiraigen() {
    for( let i = 0; i < nJiraigen; i++ ) {
        if( mask[ i ] === 0 ) { // open
            if( jiraigen[ i ] === 1 ) {
                drawJirai( i )
            } else {
                drawKosuu( i )
            }
            continue
        }
        if( mask[ i ] === 1 ) { // unopen
            drawMoji( '', i, '#000000', '#000000')
            continue
        }
        if( mask[ i ] === 2 ) { // flag
            drawFlag( i )
            continue
        }
        if( mask[ i ] === 9 ) { // mura
            drawMoji( '#', i, '#000000', '#cccccc' )
            continue
        }
        if( mask[ i ] === 8 ) { // machi
            drawMoji( '$', i, '#000000', '#cccccc' )
            continue
        }
    }
}
function drawMoji( moji, i, mojiColor, bgColor ) {
    const px = ( i % nxJiraigen ) * grid
        , py = Math.floor( i / nxJiraigen ) * grid
    g.fillStyle = bgColor
    g.fillRect( px, py, grid, grid )
    g.fillStyle = mojiColor
    g.fillText( moji, px + grid / 2, py + grid / 2, grid )
}
function drawJirai( i ) { drawMoji( '@', i, '#000000', '#ff0000' ) }
function drawFlag( i )  { drawMoji( '!', i, '#ffffff', '#000000' ) }
function drawKosuu( i ) {
    if( kosuu[ i ] === 0 ) {
        drawMoji( '', i, '#000000', '#cccccc' )
    } else {
        drawMoji( kosuu[i], i, '#000000', '#cccccc' )
    }
}


function drawPlayer() {
    const px = ( playerPos % nxJiraigen ) * grid
        , py = Math.floor( playerPos / nxJiraigen ) * grid
    g.strokeStyle = '#ffffff'
    g.lineWidth = 2.0
    g.strokeRect( px + 1.0, py + 1.0, grid - 2.0, grid - 2.0 )
}
function drawMichi() {
    let node = nJiraigen - 1
    while( node !== 0 ) {
        // 自分を塗る
        drawMoji( '', node, '#000000', 'rgba(255,0,0,0.3)' )
        // 4方で一番小さいノードに移る
        const x = node % nxJiraigen
            , y = Math.floor( node / nxJiraigen )
            , dir = [[0,-1],[-1,0],[0,1],[0,1]]
        node = dir.filter( item => {
            if( x + item[0] < 0 ) return false
            if( x + item[0] >= nxJiraigen ) return false
            if( y + item[1] < 0 ) return false
            if( y + item[1] >= nyJiraigen ) return false
            return true
        }).map( item => node + item[0] + item[1] * nxJiraigen )
        .filter( i => michi[ i ] !== null )
        .reduce( (i,j) => {
            return michi[i] > michi[j] ? j : i
        })
    }
    // 村を塗る
    drawMoji( '', 0, '#000000', 'rgba(255,0,0,0.3)' )
}
function drawGameover() {
    g.font = '30px serif'
    g.strokeStyle = '#000000'
    g.lineWidth = 2.5
    g.strokeText( '死んでしまった...', grid * nxJiraigen / 2, grid * nyJiraigen / 2 )
    g.fillStyle = '#ffffff'
    g.fillText( '死んでしまった...', grid * nxJiraigen / 2, grid * nyJiraigen / 2 )
}
function drawGameclear() {
    g.font = '30px serif'
    g.strokeStyle = '#000000'
    g.lineWidth = 2.5
    g.strokeText( '村人A「ありがとう。助かったよ」', grid * nxJiraigen / 2, grid * nyJiraigen / 2 )
    g.fillStyle = '#ffffff'
    g.fillText( '村人A「ありがとう。助かったよ」', grid * nxJiraigen / 2, grid * nyJiraigen / 2 )
}
function clearCanvas() {
    g.fillStyle = '#ffffff'
    g.fillRect( 0, 0, nxJiraigen * grid, nyJiraigen * grid )
}