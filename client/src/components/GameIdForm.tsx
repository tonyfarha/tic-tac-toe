import { useState } from 'react'
import { useNavigate } from "react-router-dom";

export const GameIdForm = ({ socket }: any) => {

  const [game, setGame] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const navigate = useNavigate();

  const handleCreateGame = () => {
    if (game.trim() == '') return;
    socket.emit('check-room', { room: game }, (val: any) => {
      if (val == 0) {
        setErrMessage('This room is already exists. Try another name')
      } else {
        navigate(`${game}`)
      }
    });
  }
  return (
    <>
      {errMessage && <h4>{errMessage}</h4>}
      <input style={{ padding: '5px 10px' }} type='text' placeholder='Enter an ID' value={game} onChange={e => setGame(e.target.value)} />
      <a style={{ display: 'block', marginTop: '20px', cursor: 'pointer', textTransform: 'uppercase' }} onClick={handleCreateGame} >Create/Join a game</a>
    </>
  )
}