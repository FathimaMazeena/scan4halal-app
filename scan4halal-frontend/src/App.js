// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './components/Hero';
import Accordion from './components/accordion';
import Navbar from './components/Navbar';
import BrowseIngredients from './pages/BrowseIngredients';

function App() {


  return (


<div data-theme="pastel">
  <Router>
    <Navbar />
      <Routes>
        <Route path="/browse" element={<BrowseIngredients />} />
      </Routes>
      <Hero />
      <Accordion />
      
  </Router>
      
</div>
  );
}

export default App;
