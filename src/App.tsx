import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { RetroBoard } from './components/RetroBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/retro/:roomId" element={<RetroBoard />} />
      </Routes>
    </Router>
  );
}

export default App;