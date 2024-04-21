import { useEffect, useState } from 'react'
import Square from '../components/Square'
import { calculateWinner } from '../functions/functions'
import { useParams } from "react-router-dom";

function Board({ socket }: any) {

  const { id: roomId } = useParams();

  const [me, setMe] = useState('')
  const [values, setValues] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null)
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)

  useEffect(() => {

    socket.emit('join-room', { room: roomId })

    socket.on('player', (val: any) => {
      if (val == 1) {
        setMe('X')
      } else if (val == 2) {
        setMe('O')
      }
    });

    socket.on('move', (values: any) => {
      setValues(values)
      setIsXNext(old => !old)
    });

    socket.on('reset', () => {
      setValues(Array(9).fill(null))
      setIsXNext(true)
      setWinner(null)
    });

    return () => {
      socket.off('connect');
      socket.off('player');
      socket.off('move');
      socket.off('reset');
      //socket.close()
    };
  }, []);

  useEffect(() => {
    if (!winner) {
      const theWinner = calculateWinner(values)
      if (theWinner) {
        setWinner(theWinner)
        if (theWinner == '❌') {
          setXWins(prev => prev + 1)
        } else {
          setOWins(prev => prev + 1)
        }
      }
    }

    return () => {

    }
  }, [values])

  const makeMove = (i: number) => {
    if (values[i] || winner) return
    if ((isXNext && me != 'X') || (!isXNext && me == 'X')) return;
    const newValues = [...values]
    newValues[i] = getPlayer();
    socket.emit('move', { values: newValues, room: roomId })
  }

  const getPlayer = () => {
    return isXNext ? '❌' : '⭕';
  }

  const resetTheGame = () => {
    socket.emit('reset', { room: roomId })
  }

  const getMessage = () => {
    let message = ''

    if (winner) {
      message = `${winner} Wins 🎉`
    } else if (values.every(Boolean) && !winner) {
      message = 'No Winner 😕'
    } else if (!winner) {
      message = `Player: ${getPlayer()}`
    }

    return message;

  }

  return (
    <>
      <h3 style={{ marginBottom: '30px' }}>{getMessage()}</h3>
      <div style={{ padding: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>❌: {xWins}</p>
        <p>⭕: {oWins}</p>
      </div>
      <div className="board">
        {values.map((val, i) => <Square key={i} val={val} makeMove={() => makeMove(i)} />)}
      </div>
      <h5>You are {me == 'X' ? '❌' : '⭕'}</h5>
      {(values.every(Boolean) && !winner || winner) && <a style={{ cursor: 'pointer', padding: '10px', display: 'inline-block' }} onClick={resetTheGame}>Reset</a>}
    </>
  )
}

export default Board
