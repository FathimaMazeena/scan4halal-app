// src/App.js
import './App.css';
import Hero from './components/Hero';
import Accordion from './components/accordion';
import Navbar from './components/Navbar';

function App() {


  return (
    // <div className="App">
    //   <h1>Scan4Halal OCR</h1>
    //   <input type="file" accept="image/*" onChange={handleImageChange} />
    //   <button onClick={handleUpload}>Upload & Extract Text</button>

    //   {loading && <p>Processing...</p>}
    //   {ocrText && (
    //     <div>
    //       <h3>Extracted Text:</h3>
    //       <p>{ocrText}</p>
    //     </div>
    //   )}
    // </div>

//     <div
//   className="hero min-h-screen"
//   style={{
//     backgroundImage:
//       "url(https://images.pexels.com/photos/8356322/pexels-photo-8356322.jpeg)",
//   }}
// >
//   <div className="hero-overlay"></div>
//   <div className="hero-content text-neutral-content text-center">
//     <div className="max-w-md">
//       <h1 className="mb-5 text-5xl font-bold">Scan4Halal - Your Pocket Halal Checker</h1>
//       <p className="mb-5">
//       Snap a product label, and we’ll tell you if it’s Halal, Haram, or Doubtful — in seconds.  
//       </p>
//       <input type="file" className="file-input file-input-success file-input-ghost file-input-lg" />
//     </div>
//   </div>
// </div>


<div data-theme="pastel">
      <Navbar />
      <Hero />
      <Accordion />
      
</div>
  );
}

export default App;
