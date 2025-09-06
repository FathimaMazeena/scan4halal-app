export async function uploadImageForOCR(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://localhost:5000/ocr", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("OCR request failed");
  }

  return await response.json();
}

// export const uploadImageForOCR = async (file) => {
//   setOcrRunning(true);
//   setOcrProgress(0);

//   // Simulate progress bar
//   const interval = setInterval(() => {
//     setOcrProgress((prev) => {
//       if (prev < 90) return prev + 5; // go up to 90% while waiting
//       return prev;
//     });
//   }, 300);

//   try {
//     const result = await uploadImageForOCR(file);
//     setOcrProgress(100); // done
//     clearInterval(interval);

//     // handle the OCR result (update ingredientMatches, etc.)
//     setIngredientMatches(result.ingredients || []);
//   } catch (err) {
//     clearInterval(interval);
//     setOcrProgress(0);
//     console.error(err);
//   } finally {
//     setTimeout(() => setOcrRunning(false), 500); // hide after short delay
//   }
// };
