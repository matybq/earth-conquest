import data2 from '../../data2.json'

import { Cell } from '../Cell/Cell'
import { alterator, team } from '../../constants.js'
import './Board.css'
import { useState } from 'react'

export const Board = ({ board, setBoard, newAlterator, setAlter, setTeleporterEnabled, teleporterEnabled, gameId }) => {
  const FREE_POSITION = 'http://127.0.0.1:5000/games/isFreePosition' // verificar
  const SEND_ALTERATOR = 'http://127.0.0.1:5000/games/setAlterator' // verificar
  const [teleportX, setTeleportX] = useState(null)
  const [teleportY, setTeleportY] = useState(null)
  const TELEPORT_RANGE = 4

  const greenOvniRange = data2.green_ovni_range
  const blueOvniRange = data2.blue_ovni_range

  // Funcion para dar el rango de teleport
  const outOfTeleportRange = (row, col, x, y) => {
    return (Math.abs(row - x) >= TELEPORT_RANGE || Math.abs(col - y) >= TELEPORT_RANGE)
  }

  // Funcion para dar el rango de la base segun el team
  const isBase = (row, col, x, y, teamBase) => {
    if (teamBase === team.green) {
      return (row <= x && col <= y)
    } else {
      return (row >= x && col >= y)
    }
  }

  const updateBoard = async (row, col) => {
    if (newAlterator === null) return
    if (!await isFreePosition(row, col)) return
    if (
      (outOfTeleportRange(row, col, teleportX, teleportY) &&
      (isBase(row, col, greenOvniRange.x, greenOvniRange.y, team.green) ||
      isBase(row, col, blueOvniRange.x, blueOvniRange.y, team.blue)))
    ) return
    if (outOfTeleportRange(row, col, teleportX, teleportY) && (newAlterator === alterator.teleporter_out)) return

    const newBoard = [...board]
    setAlteratorInCell(row, col, newAlterator, newBoard)
    setBoard(newBoard) // es necesario setearlo si ya detecta el cambio y lo escucha?
  }

  const sendAlterator = async (row, col, newAlterator) => {
    try {
      const response = await fetch(`${SEND_ALTERATOR}/${gameId}?x=${row}&y=${col}`, {
        method: 'PUT',
        body: JSON.stringify({ alterator: newAlterator })
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    } catch (error) {
      console.error('Error set alterator', error)
    }
  }

  const isFreePosition = async (row, col) => {
    try {
      const response = await fetch(`${FREE_POSITION}/${gameId}?x=${row}&y=${col}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return (data.success)
    } catch (error) {
      console.error('Error is valid position', error)
    }
  }

  const setAlteratorInCell = async (row, col, newAlterator, newBoard) => {
    if (await isFreePosition(row, col)) {
      if (newAlterator === alterator.trap) {
        const newTrap = {
          name: newAlterator,
          positionInit: { x: row, y: col },
          positionEnd: null,
          direction: null
          // ver que falta que team lo seteo, ellos esperan eso en el json
        }
        await sendAlterator(row, col, newTrap)
      } else {
        const alteratorSplit = newAlterator.split('_')
        const alteratorName = alteratorSplit[0]
        const alteratorDirection = alteratorSplit[1]

        if (alteratorName === 'directioner') {
          const newDirectioner = {
            name: alteratorName,
            positionInit: { x: row, y: col },
            positionEnd: null,
            direction: alteratorDirection
          }
          await sendAlterator(row, col, newDirectioner)
        } else if (alteratorName === 'teleport') {
          const newTeleport = {
            name: alteratorName,
            positionInit: { x: row, y: col },
            positionEnd: null,
            direction: alteratorDirection
          }
          if (alteratorDirection === 'in') {
            newBoard[row][col].alterator = newAlterator
            // cambia estado a teleport out
            setAlter(alterator.teleporter_out)
            setTeleporterEnabled(false)
            setTeleportX(row)
            setTeleportY(col)
          } else {
            newTeleport.positionEnd.x = row
            newTeleport.positionEnd.y = col
            await sendAlterator(row, col, newTeleport)
            setAlter(null)
            setTeleporterEnabled(true)
          }
        }
      }
    }
  }
  return (
    <section className='board'>
      {
        board.map((row, i) => {
          return (
            row.map((cell, j) => {
              return (
                <Cell
                  key={j}
                  col={j}
                  row={i}
                  updateBoard={updateBoard}
                  greenBase={greenOvniRange}
                  blueBase={blueOvniRange}
                  teleporterEnabled={teleporterEnabled}
                  teleportX={teleportX}
                  teleportY={teleportY}
                  isBase={isBase}
                  outOfTeleportRange={outOfTeleportRange}
                >
                  {cell}
                </Cell>
              )
            })
          )
        })
      }
    </section>
  )
}
