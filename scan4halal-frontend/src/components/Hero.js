import React, { useState } from "react";
import { uploadImageForOCR } from "../services/ocrService";
import IngredientResults from "./IngredientResults";


function Hero() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert("Please select an image");

    try {
      setLoading(true);
      const data = await uploadImageForOCR(selectedImage);
      setOcrText(data.raw_text || "No text extracted");
      setIngredients(data.ingredients);

      // const parsed = parseIngredients(data.extracted_text || "");
      // setIngredients(parsed);
    } catch (error) {
      console.error("Upload failed", error);
      setOcrText("Error occurred while processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/8356322/pexels-photo-8356322.jpeg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Scan4Halal - Your Pocket Halal Checker
            </h1>
            <p className="mb-5">
              Snap a product label, and we’ll tell you if it’s Halal, Haram, or
              Doubtful — in seconds.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-warning file-input-lg rounded-full"
            />
            <button onClick={handleUpload} className="btn btn-ghost">
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto my-8">
        {loading && (
          <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-xl shadow-md">
            <span className="loading loading-dots loading-lg text-primary"></span>
            <p className="mt-3 font-medium text-gray-600">
              Processing your image...
            </p>
          </div>
        )}

        {ocrText && (
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-lg font-bold text-primary">
                Extracted Text
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {ocrText}
              </p>
            </div>
          </div>
        )}

   

        {/* {ingredients.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold">Parsed Ingredients:</h4>
            <ul className="list-disc list-inside">
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>

         {ingredients.length > 0 && (
          <IngredientResults ingredients={ingredients} />
  
      )}

      <div className="flex justify-center m-20">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Ingredients</div>
            <div className="stat-value">2000+</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>

          <div className="stat">
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>

          <div className="stat">
            <div className="stat-title">New Registers</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>

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
              Our system scans the ingredients and cross-matches them with our
              halal database.
            </p>
          </li>

          <li className="step">
            <div className="font-semibold">Get Instant Verdict</div>
            <p className="text-sm text-gray-600 mt-2">
              Instantly know whether your product is{" "}
              <span className="text-green-600 font-bold">Halal</span>,
              <span className="text-red-600 font-bold"> Haram</span>, or{" "}
              <span className="text-yellow-600 font-bold">Doubtful</span>.
            </p>
          </li>

          <li className="step">
            <div className="font-semibold">Save & Learn</div>
            <p className="text-sm text-gray-600 mt-2">
              Save your scan results for future reference and explore detailed
              ingredient explanations.
            </p>
          </li>
        </ul>
      </section>
    </>
  );
}

export default Hero;
