import { alterator } from '../../constants.js'
import { useState } from 'react'
import './Panel.css'

export const Panel = ({ setAlter, teleporterEnabled }) => {
  const [showDirections, setShowDirections] = useState(false)

  const [showAlterators, setshowAlterators] = useState(true)

  const handleAlterator = (newAlterator) => {
    if (!teleporterEnabled) return
    setAlter(newAlterator) // setea el objeto
  }

  const handleShowDirections = () => {
    setShowDirections(true)
    setshowAlterators(false)
  }

  const handleDirectionClick = (direction) => {
    setShowDirections(false)
    setshowAlterators(true)
    handleAlterator(direction)
  }

  return (
    <section className='alterators-panel'>
      <h1 className='tittle'>ALTERADORES</h1>
      <section className='buttons'>
        {showAlterators && (
          <>
            <button onClick={() => handleAlterator('trap')} value={alterator.trap}>
              <img className='button_img_trap' src='/../public/trap.png' alt='Trap' />
            </button>
            <button onClick={() => handleAlterator(alterator.teleporter_in)}>
              <img className='button_img_teleport1' src='/../public/teleport_in.gif' alt='Teleporter' />
              <img className='button_img_teleport1' src='/../public/teleport_out.gif' alt='Teleporter' />
            </button>
            <button onClick={handleShowDirections}>
              <img className='button_img_dir1' src='/../public/directioner_up.png' alt='Directioner' />
              <img className='button_img_dir1' src='/../public/directioner_right.png' alt='Directioner' />
              <img className='button_img_dir1' src='/../public/directioner_down.png' alt='Directioner' />
              <img className='button_img_dir1' src='/../public/directioner_left.png' alt='Directioner' />
            </button>
          </>
        )}
        {showDirections && (
          <div className='type_dir'>
            <button onClick={() => handleDirectionClick('directioner_up')} value={alterator.directioner_up}>
              <img className='button_img_dir' src='/../public/directioner_up.png' alt='Directioner' />
            </button>
            <button onClick={() => handleDirectionClick('directioner_down')} value={alterator.directioner_down}>
              <img className='button_img_dir' src='/../public/directioner_down.png' alt='Directioner' />
            </button>
            <button onClick={() => handleDirectionClick('directioner_right')} value={alterator.directioner_right}>
              <img className='button_img_dir' src='/../public/directioner_right.png' alt='Directioner' />
            </button>
            <button onClick={() => handleDirectionClick('directioner_left')} value={alterator.directioner_left}>
              <img className='button_img_dir' src='/../public/directioner_left.png' alt='Directioner' />
            </button>
          </div>
        )}
      </section>
    </section>
  )
}
