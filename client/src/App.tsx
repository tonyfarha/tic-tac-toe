import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Board from './components/Board';
import { GameIdForm } from './components/GameIdForm';
import io from 'socket.io-client';

import './App.css'

const socket = io(import.meta.env.VITE_SERVER_URI);

function App() {

  useEffect(() => {

    return () => {
      socket.close()
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<GameIdForm socket={socket} />} />
      <Route path="/:id" element={<Board socket={socket} />} />
    </Routes>
  )
}

export default App
