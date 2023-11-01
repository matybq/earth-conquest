import { useState, useEffect } from 'react'
import { Board } from '../Board/Board'
import { Panel } from '../Panel/Panel'
import { StatsGame } from '../StatGame/StatsGame'
import './Game.css'

export function Game ({ gameId, board, setBoard }) {
  const [alter, setAlterator] = useState(null)
  const [teleporterEnabled, setTeleporterEnabled] = useState(true)
  const [changeTic, setChangeTic] = useState(true)
  const [winner, setWinner] = useState(null)

  // eslint-disable-next-line no-undef
  const NOMBRE_G = JSON.parse(localStorage.getItem('hostPlayer'))

  // eslint-disable-next-line no-undef
  const NOMBRE_B = JSON.parse(localStorage.getItem('guestPlayer'))

  let CONT_TICS = 0
  const REFRESH = 'http://127.0.0.1:5000/games/refresh_board'
  const ACT = 'http://127.0.0.1:5000/games/act_board'
  const SPAWN_ALIENS = 'http://127.0.0.1:5000/games/spawn_aliens'

  // vida de las bases
  let lifeGreenOvni
  let lifeBlueOvni

  // cantidad de aliens vivos
  let liveBlueAliens
  let liveGreenAliens

  const refresh = async (gameId) => {
    try {
      const response = await fetch(`${REFRESH}/${gameId}`,
        { method: 'PUT' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      CONT_TICS = CONT_TICS + 1
      if (CONT_TICS === 5) {
        spawnAliens()
        CONT_TICS = 0
      } else {
        console.log(data)
        setBoard(data.board)
      }
    } catch (error) {
      console.error('Error fetching data in refresh:', error)
    }
  }

  const act = async (gameId) => {
    try {
      const response = await fetch(`${ACT}/${gameId}`,
        { method: 'PUT' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      setBoard(data.board)
      lifeGreenOvni = data.green_ovni_life
      lifeBlueOvni = data.blue_ovni_life
      liveBlueAliens = data.live_blue_aliens
      liveGreenAliens = data.live_green_aliens

      if (data.winner) {
        setWinner(data.winner.team)
        // aca habría que hacer el game over
      }
    } catch (error) {
      console.error('Error fetching data in act:', error)
    }
  }

  const spawnAliens = async (gameId) => {
    try {
      const response = await fetch(`${SPAWN_ALIENS}/${gameId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setBoard(data.board)
    } catch (error) {
      console.error('Error spawn aliens in base:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (changeTic) {
        refresh(gameId)
      } else {
        act(gameId)
      }
      setChangeTic(!changeTic)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [board])

  const setAlter = (newAlterator) => {
    setAlterator(newAlterator)
  }

  return (
    <>

      <Board board={board} setBoard={setBoard} newAlterator={alter} setAlter={setAlter} setTeleporterEnabled={setTeleporterEnabled} teleporterEnabled={teleporterEnabled} gameId={gameId} />

      <section className='statsGame'>
        <StatsGame team='green' lifeOvni={lifeGreenOvni} liveAliens={liveGreenAliens} playerName={NOMBRE_G.playerName} />
        <StatsGame team='blue' lifeOvni={lifeBlueOvni} liveAliens={liveBlueAliens} playerName={NOMBRE_B.playerName} />
      </section>
      <Panel setAlter={setAlter} teleporterEnabled={teleporterEnabled} />
      <img src='../public/panel_left.jpg' className='panel_left' />
      <img src='../public/panel_right.jpg' className='panel_right' />

    </>
  )
}
