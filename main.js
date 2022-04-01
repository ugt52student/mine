'use strict'

const canvas = document.querySelector( '#canvas' )
const g = canvas.getContext( '2d' )

const jiraigen = new Array( nJiraigen )
const kosuu    = new Array( nJiraigen )
const mask     = new Array( nJiraigen )
const michi    = new Array( nJiraigen )
const grid = 25

canvas.width  = nxJiraigen * grid
canvas.height = nyJiraigen * grid

init()
draw()