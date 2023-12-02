import { useState } from 'react'
import './Lobby.css'

export const Lobby = ({ allGames, cuandoSeJoinea }) => {
  const [nameBlue, setNameBlue] = useState(new Array(allGames.length).fill(''))

  const handleNameBlueChange = (name, index) => {
    const updatedNameBlue = [...nameBlue]
    updatedNameBlue[index] = name
    setNameBlue(updatedNameBlue)
  }

  const handleJoinPlayer = (index, currentGameId) => {
    cuandoSeJoinea('BLUE', nameBlue[index], currentGameId)
  }

  return (
    <div className='tabla-scroll'>
      <table>
        <thead>
          <tr>
            <th>Game Id</th>
            <th>Blue Player</th>
            <th>Green Player</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
          allGames.map((game, index) => {
            return (

              <tr key={index}>
                <td>{game.game_id}</td>
                <td>{game.blue_player}</td>
                <td>{game.green_player}</td>
                <td>{game.status}</td>
                <td>
                  <label className='label-lobby'>
                    <input
                      type='text'
                      placeholder='Insert name'
                      value={nameBlue[index] || ''}
                      onChange={(e) => handleNameBlueChange(e.target.value, index)}
                    />
                    <button
                      onClick={() => handleJoinPlayer(index, game.game_id)}
                      disabled={!nameBlue[index]}
                      className='btn-lobby'
                    >Join
                    </button>
                  </label>
                </td>
              </tr>

            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}
