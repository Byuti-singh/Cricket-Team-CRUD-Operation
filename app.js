const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
    cricket_team;`
  const playersList = await db.all(getPlayersQuery)
  const ans = playersList => {
    return {
      playerId: playersList.player_id,
      playerName: playersList.player_name,
      jerseyNumber: playersList.jersey_number,
      role: playersList.role,
    }
  }
  response.send(playersList.map(eachPlayer => ans(eachPlayer)))
})

// app.get('/players/:playerId', async (request, response) => {
//   const {playerId} = request.params
//   const getPlayersQuery = `
//     SELECT
//       *
//     FROM
//     cricket_team
//     WHERE
//     player_id = ${playerId};`
//   const player = await db.get(getPlayersQuery)
//   response.send(player)
//   // const playersList = await db.get(getPlayersQuery)
//   // const ans = playersList => {
//   //   return {
//   //     playerId: playersList.player_id,
//   //     playerName: playersList.player_name,
//   //     jerseyNumber: playersList.jersey_number,
//   //     role: playersList.role,
//   //   }
//   // }
//   // response.send(playersList.map(eachPlayer => ans(eachPlayer)))
// })
module.exports = app
