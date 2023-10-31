import { useState } from 'react'
import { Game } from './components/Game/Game'
import { Menu } from './components/Menu/Menu'
import { gameStatus } from './constants'

function App () {
  const [board, setBoard] = useState(null)
  const [statusGame, setStatusGame] = useState(null)
  const [gameId, setGameId] = useState(null)
  const [message, setMessage] = useState('')
  const CREATE_GAME = 'http://127.0.0.1:5000/games/'
  const START_GAME = 'http://127.0.0.1:5000/games/start_game'

  const createGame = async () => {
    try {
      const response = await fetch(CREATE_GAME, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log(data)
      setGameId(data.data.gameId)
      setStatusGame(gameStatus.notStarted)
      setMessage(data.message)
      setBoard(data.data.game.board)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const startGame = async (gameId) => {
    try {
      const response = await fetch(`${START_GAME}/${gameId}`, {
        method: 'PUT'
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log(data)
      if (data.success) {
        setStatusGame(gameStatus.started)
        setBoard(data.data.game.board)
      }
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }
  return (
    <main>
      {
        statusGame !== gameStatus.started &&
          <Menu createGame={createGame} setBoard={setBoard} startGame={startGame} gameId={gameId} message={message} />
      }
      {
        statusGame === gameStatus.started &&
          <Game gameId={gameId} board={board} setBoard={setBoard} />
      }

    </main>
  )
}

export default App
