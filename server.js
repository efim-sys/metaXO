const express = require('express')
const app = express()
var path = require('path')

let template = {players: new Array(), step: 0,  grid: new Array(9)}

let winner = null

let games = new Array()
//var fs = require('fs')
//var index = fs.readFileSync('game/index.html')
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/game/index.html')
})

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/game/style.css')
})

app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/game/main.js')
})

app.get('/get', (req, res) => {
  const roomID = Number(req.query.roomID)
  if(isNaN(roomID)) {
    res.send({status: "badrequest"})
    return
  }
  if(games[roomID] === undefined) {
    res.send({status: "nogame"})
    return
  }
  if(winner !== null) {
    res.send({status: "win", winner: winner, game: games[roomID]})
    games[roomID].grid.fill(null)
    winner = null
    return
  }
  res.send({status: "ok", game: games[roomID]})
})

function clearRoom(id) {
  games[id] = undefined
}

app.get('/clear', (req, res) => {
  const roomID = Number(req.query.roomID)
  if(isNaN(roomID)) {
    res.send({status: "badrequest"})
    return
  }
  clearRoom(roomID)
  res.send({status: "ok"})
})

app.get('/clearGrid', (req, res) => {
  const roomID = Number(req.query.roomID)
  if(isNaN(roomID)) {
    res.send({status: "badrequest"})
    return
  }
  games[roomID].grid.fill(null)
  winner = null
  res.send({status: "ok"})
})

app.get('/step', (req, res) => {
  const roomID = Number(req.query.roomID)
  const playerID = req.query.playerID
  const cellID = Number(req.query.cellID)
  console.log("Room ID: " + roomID)
  console.log("Player ID: " + playerID)
  console.log("cell ID: " + cellID)
  if(isNaN(roomID) || playerID === undefined || isNaN(cellID) || games[roomID] === undefined || !(cellID >= 0 && cellID <= 8)) {
    res.send({status: "badrequest"})
    return
  }
  if(games[roomID].players.length !== 2) {
    res.send({status: "notstarted"})
    return
  }
  if(games[roomID].players.indexOf(playerID) === -1) {
    res.send({status: "notingame"})
    return
  }
  if(games[roomID].step != games[roomID].players.indexOf(playerID)) {
    res.send({status: "notyourstep"})
    return
  }
  if(games[roomID].grid[cellID] != null) {
    res.send({status: "busy"})
    return
  }
  games[roomID].step = + !games[roomID].step
  games[roomID].grid[cellID] = playerID

  let standing

  //res.send({status: "done"})
  for(let i = 0; i < 3; i++) {
    standing = games[roomID].grid[i*3] + games[roomID].grid[i*3+1] + games[roomID].grid[i*3+2]
    if(standing == games[roomID].players[0].repeat(3)) winner = games[roomID].players[0]
    if(standing == games[roomID].players[1].repeat(3)) winner = games[roomID].players[1]
    console.log(standing)
  }
  for(let i = 0; i < 3; i++) {
    standing = games[roomID].grid[i] + games[roomID].grid[i+3] + games[roomID].grid[i+6]
    if(standing == games[roomID].players[0].repeat(3)) winner = games[roomID].players[0]
    if(standing == games[roomID].players[1].repeat(3)) winner = games[roomID].players[1]
  console.log(standing)}

  standing = games[roomID].grid[0] + games[roomID].grid[4] + games[roomID].grid[8]
  if(standing == games[roomID].players[0].repeat(3)) winner = games[roomID].players[0]
  if(standing == games[roomID].players[1].repeat(3)) winner = games[roomID].players[1]
console.log(standing)
  standing = games[roomID].grid[2] + games[roomID].grid[4] + games[roomID].grid[6]
  if(standing == games[roomID].players[0].repeat(3)) winner = games[roomID].players[0]
  if(standing == games[roomID].players[1].repeat(3)) winner = games[roomID].players[1]
console.log(standing)/*
  standings[i] = Ar[i*3] + Ar[i*3+1] + Ar[i*3+2]
        standings[i+3] = Ar[i] + Ar[i+3] + Ar[i+6]*/
  res.send({status: "ok"})

})

app.get('/join', (req, res) => {
  const roomID = Number(req.query.roomID)
  const playerID = req.query.playerID
  if(isNaN(roomID) || playerID === undefined) {
    res.send({status: "badrequest"})
    return
  }

  console.log("Room ID: " + roomID)
  console.log("Player ID: " + playerID)
  if(games[roomID] !== undefined) {
    if(games[roomID].players.length === 1) {
      if(games[roomID].players[0] === playerID) {
        res.send({status: "already"})
        return
      }
      games[roomID].players.push(playerID)
      res.send({status: "ready"})
      games[roomID].step = 0
      console.log(games[roomID])
      return
    }
    if(games[roomID].players.indexOf(playerID) !== -1) {
      res.send({status: "already"})
      return
    }
    res.send({status: "full"})
    console.log(games[roomID])
    return
  }
  games[roomID] = {...template}
  games[roomID].players.push(playerID)
  console.log(games[roomID])
  res.send({status: "wait"})

})

app.listen(8000, () => {
  console.log('Application listening on port 8000!')
})
