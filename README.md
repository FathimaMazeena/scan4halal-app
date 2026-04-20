# 🕌 Scan4Halal — AI-Powered Halal Ingredient Verification System

An intelligent full-stack web application that analyzes food product ingredients and classifies them as **Halal, Haram, or Mushbooh (Doubtful)** using a hybrid pipeline of **OCR, semantic similarity, and Retrieval-Augmented Generation (RAG)**.

---

## 🚀 Overview

Scan4Halal bridges the gap between **raw ingredient labels** and **consumer understanding** by combining:

* 📸 OCR-based text extraction
* 🧠 Semantic embedding + similarity matching
* 📚 Curated halal knowledge base
* 🤖 LLM-powered contextual explanations

The system enables users to **scan, analyze, understand, and store ingredient insights** in a seamless workflow.

---

## 🏗️ System Architecture

### 🔹 High-Level Workflow

```text
Image Upload
   ↓
OCR (PyTesseract)
   ↓
Text Preprocessing
   ↓
Ingredient Parsing
   ↓
Multi-Stage Matching Pipeline
   ↓
Semantic Similarity (Embeddings)
   ↓
Halal Classification
   ↓
RAG Explanation (LLM)
   ↓
Frontend Display + User Actions
```

---
🎥 Demo
![App Demo](./demo/demo.gif)
---

### 🔹 Layered Architecture

#### 1. Frontend Layer

* React + DaisyUI SPA
* Handles:

  * Image upload
  * Results visualization
  * Chat interface
  * Bookmarking & history

#### 2. API Gateway Layer (Flask)

* Centralized request handling
* JWT-based authentication
* Routes:

  * OCR processing
  * Ingredient matching
  * RAG explanation
  * User operations

#### 3. Core Processing Services

##### 🔍 OCR Service

* Extracts raw text using **PyTesseract**

##### 🧹 Text Preprocessing

* Regex + string normalization
* Removes noise like:

  * "Ingredients:"
  * Special characters
  * Formatting inconsistencies

##### ⚙️ Ingredient Matching Pipeline (Core Innovation)

A **3-stage hybrid matching system**:

1. **Exact Matching**

   * Direct string comparison

2. **Fuzzy Matching**

   * Handles typos using Levenshtein distance

3. **Semantic Similarity Engine**

   * Uses embeddings for contextual understanding
   * Matches:

     * Synonyms
     * E-numbers
     * Misspellings

---

#### 4. AI Layer

##### 🧠 Embedding Model

* **SentenceTransformers (`all-MiniLM-L6-v2`)**
* Fine-tuned on ingredient variants
* Generates **384-dimensional vectors**

##### 📊 Similarity Search

* Cosine similarity using NumPy
* Finds closest ingredient match in database

##### 🤖 RAG Explanation Engine

* Powered by **Mistral 7B (via Hugging Face)**
* Combines:

  * Retrieved ingredient context
  * LLM generation
* Produces human-readable explanations

---

#### 5. Database Layer (MongoDB)

Collections:

* `ingredients` → canonical data + embeddings
* `users` → authentication + profiles
* `scans` → history
* `bookmarks` → saved ingredients
* `submissions` → unknown ingredient requests

---

## 🧠 Core Innovation

### 🔥 Semantic Similarity Engine

Traditional systems rely on exact matching.
Scan4Halal introduces **embedding-based semantic matching**:

* Handles:

  * “E471” ↔ “Mono- and Diglycerides”
  * Misspellings
  * Variants across regions

* Enables:

  * High accuracy with small datasets (~100+ ingredients)
  * Reduced dependency on strict naming conventions

---

## 🧪 Model Training & Fine-Tuning

* Base Model: `all-MiniLM-L6-v2`
* Training Platform: Google Colab + Hugging Face

### Dataset Preparation

* Generated **700,000+ pairs**
* Balanced to **8,000+ high-quality pairs**

### Training Strategy

* Positive pairs → synonym matches
* Negative pairs → unrelated ingredients

### Outcome

* Improved recognition of:

  * Variants
  * Abbreviations
  * E-number mappings

---

## 📊 Ingredient Classification Logic

Each ingredient is classified into:

| Status      | Meaning            |
| ----------- | ------------------ |
| ✅ Halal     | Permissible        |
| ❌ Haram     | Forbidden          |
| ⚠️ Mushbooh | Doubtful / unclear |

---

## 📦 Ingredient Categorization System

Custom taxonomy:

* `ENA-1000+` → E-Numbers
* `NOI-2000+` → Natural Ingredients
* `NUS-3000+` → Nutrients
* `PAM-4000+` → Additives

Each entry includes:

* Synonyms
* Halal status
* Source
* Processing info
* Usage context

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS + DaisyUI
* Context API

### Backend

* Flask
* Flask-JWT-Extended
* PyMongo

### AI / ML

* PyTesseract (OCR)
* Sentence Transformers
* NumPy (cosine similarity)
* Mistral 7B (RAG)

### Database

* MongoDB Atlas

### Dev Tools

* VS Code
* Postman
* Git & GitHub
* Google Colab

---

## ⚙️ Setup Instructions

### 🔹 Backend

```bash
cd scan4halal-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret
```

Run:

```bash
python app.py
```

---

### 🔹 Frontend

```bash
cd scan4halal-frontend
npm install
npm start
```

---

## 🌐 Key API Endpoints

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/ocr`         | Extract text              |
| POST   | `/match`       | Ingredient classification |
| POST   | `/rag/explain` | AI explanation            |
| POST   | `/rag/chat`    | Chat interaction          |
| POST   | `/bookmark`    | Save ingredient           |
| GET    | `/bookmarks`   | Retrieve bookmarks        |

---

## 🎯 Use Cases

* Muslim consumers verifying food products
* Educational tool for ingredient awareness
* Smart retail or scanning applications

---

## ⚠️ Limitations
* Limited Training Data
The semantic embedding model was trained on a relatively small and curated dataset of ingredients and their variants. As a result, the system may struggle when processing real-world product labels that contain unfamiliar, rare, or untrained ingredients. This can lead to a higher number of ingredients being classified as unknown or requiring further verification.

* Surface-Level Halal Verification
The system performs analysis primarily at the ingredient level based on available label information. However, true halal verification often depends on deeper factors such as:

    * Source of ingredients (e.g., animal-derived vs plant-based)
    * Processing methods
    * Cross-contamination during manufacturing
    * Certification standards

Since such information is typically not disclosed on product labels, the system cannot provide definitive halal certification, but rather serves as an informational and decision-support tool.

---

## 🔍 Enhancements to Address Current Limitations

**📚 Expand and Continuously Update Ingredient Dataset**
Increase the size and diversity of the training dataset to better handle real-world ingredient variations and reduce the number of unknown classifications.

**🧠 Adaptive Learning / Feedback Loop**
Incorporate user-submitted ingredients and feedback into the system to continuously improve model accuracy and database coverage.
🏭 Deeper Ingredient Context Awareness
Enhance the system to consider additional factors such as ingredient sources, processing methods, and certification data where available, moving beyond surface-level label analysis.

**🏷️ Positioning as a General Ingredient Awareness Tool**
Extend the application beyond halal verification to serve as an ingredient awareness platform for all consumers, providing insights into:

* Additives and preservatives
* Nutritional and health implications
* Potential allergens or dietary concerns

This broadens the usability of the system and makes it valuable for a wider audience focused on informed food choices and transparency.
---

## 📈 Future Improvements

* 📱 Mobile app version
* 📷 Barcode scanning
* 🌍 Multi-language support
* ⚡ Vector database integration (Pinecone / Weaviate)
* ☁️ External model hosting

---

## 📅 Project Details

- **Type:** Final Year Dissertation Project  
- **Duration:** June 2025 – Sep 2025  
- **Affiliation:** Cardiff Metropolitan University  

---

## 👩‍💻 Author

**Mazeena Cader**
Software Engineering Graduate | MERN Stack Developer | ML Enthusiast
🔗 Portfolio: https://mazeenacader.netlify.app

---

## 📄 License

This project is developed for academic and educational purposes.

---

## ⭐ If you found this useful
Give this project a ⭐ on GitHub!

---
