// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './components/Hero';
import Accordion from './components/accordion';
import Navbar from './components/Navbar';
import BrowseIngredients from './pages/BrowseIngredients';
import AuthPage from './pages/Authentication';
import Home from './pages/Home';
import {AuthProvider} from './contexts/AuthContext';
import AuthService from './services/authService';

function App() {


  return (


<div data-theme="pastel">
      <AuthProvider>
      <Router>
    <Navbar />
      <Routes>
        <Route path="/browse" element={<BrowseIngredients />} />
        <Route path="/login" element={<AuthService />} />
        <Route path="/" element={<Home/>} />
      </Routes>
      
  </Router>
    </AuthProvider>
  
      
</div>
  );
}

export default App;
