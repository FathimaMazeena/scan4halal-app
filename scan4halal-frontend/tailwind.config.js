/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI plugin
  // daisyui: {
  //   themes: ["light", "dark", "cupcake"], 
  // },
  daisyui: {
    themes: [
      "cupcake",
      "pastel",  
      "light",   
      "dark",
    ],
    base: true,  
    styled: true, 
    utils: true,  
  },
  
  // daisyui: {
  //   themes: ["pastel"], 
  //   base: true,      
  //   styled: true,     
  // }
  // daisyui: {
  //   themes: ["pastel"], // Force Pastel
  //   darkTheme: "pastel", // Even if in dark mode, still pastel
  //   base: true,
  //   styled: true,
  //   utils: true,
  // },
}