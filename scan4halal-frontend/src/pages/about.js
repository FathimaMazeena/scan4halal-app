import React from 'react'

function about() {
  return (
    <div>
        <section className="max-w-4xl mx-auto my-16 px-4">
  <h2 className="text-3xl font-bold text-center mb-8 text-primary tracking-wide">
    How Scan4Halal Works
  </h2>
  
  <ul className="steps steps-vertical lg:steps-horizontal w-full">
    <li className="step step-primary">
      <div className="font-semibold">Upload / Scan</div>
      <p className="text-sm text-gray-600 mt-2">
        Take a picture of the ingredients list or upload a product label.
      </p>
    </li>
    
    <li className="step step-primary">
      <div className="font-semibold">AI Ingredient Check</div>
      <p className="text-sm text-gray-600 mt-2">
        Our system scans the ingredients and cross-matches them with our halal database.
      </p>
    </li>
    
    <li className="step">
      <div className="font-semibold">Get Instant Verdict</div>
      <p className="text-sm text-gray-600 mt-2">
        Instantly know whether your product is <span className="text-green-600 font-bold">Halal</span>, 
        <span className="text-red-600 font-bold"> Haram</span>, or <span className="text-yellow-600 font-bold">Doubtful</span>.
      </p>
    </li>
    
    <li className="step">
      <div className="font-semibold">Save & Learn</div>
      <p className="text-sm text-gray-600 mt-2">
        Save your scan results for future reference and explore detailed ingredient explanations.
      </p>
    </li>
  </ul>
</section>

    </div>
  )
}

export default about