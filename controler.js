let playerPos = 0

window.addEventListener( 'keydown', ev => {
    switch( ev.key ) {
        case 'ArrowRight': case 'd':
            movePlayer( 1, 0 )
            ev.preventDefault()
            break
        case 'ArrowLeft': case 'a':
            movePlayer( -1, 0 )
            ev.preventDefault()
            break
        case 'ArrowDown': case 's':
            movePlayer( 0, 1 )
            ev.preventDefault()
            break
        case 'ArrowUp': case 'w':
            movePlayer( 0, -1 )
            ev.preventDefault()
            break
        case ' ':
            openMasu( playerPos )
            findMichi()
            ev.preventDefault()
            break
        case 'f':
            flagMasu( playerPos )
            ev.preventDefault()
            break
        case 'r':
            window.location.href = './index.html'
            ev.preventDefault()
            break
    }
    draw()
})
function movePlayer( dx, dy ) {
    const x = playerPos % nxJiraigen
        , y = Math.floor( playerPos / nxJiraigen )
    if( x + dx < 0 ) return
    if( x + dx >= nxJiraigen ) return
    if( y + dy < 0 ) return
    if( y + dy >= nyJiraigen ) return
    playerPos += dx * 1
    playerPos += dy * nxJiraigen
}
