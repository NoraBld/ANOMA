

// Assure-toi que le chemin est correct
import React from 'react';
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Prediction from './pages/prediction';
import Historique from './pages/Historique';
import Acceuil from './pages/acceuil';
import Dashboard from './pages/dashboard';
import Profile from './pages/Profile';
import ProfileCl from './pages/profileCl';
import VisualisationCl from './pages/visualisationCl';
import DashboardCl from './pages/dashboardCl';
import Client from './pages/Client';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ProfileCl" element={<ProfileCl />} />
        <Route path="/VisualisationCl" element={<VisualisationCl />} />
        <Route path="/dashboardCl" element={<DashboardCl />} />
        <Route path="Client" element={<Client />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App



