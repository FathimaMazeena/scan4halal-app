import re
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def run_ocr(image_file):
    # Convert Werkzeug FileStorage → PIL Image
    image = Image.open(image_file.stream)
    text = pytesseract.image_to_string(image)
    return text    


import re

def parse_ingredients(ocr_text):
    # 1. Lowercase everything
    text = ocr_text.lower()
    
    # 2. Remove 'ingredients:' prefix
    text = re.sub(r"ingredients:", "", text, flags=re.I)
    
    # 3. Remove extra punctuation except alphanumerics and spaces
    text = re.sub(r"[^a-z0-9\s,;]", "", text)
    
    # 4. Split on comma or semicolon
    ingredients = [i.strip() for i in re.split(r"[;,]", text) if i.strip()]
    
    # 5. Deduplicate (optional)
    ingredients = list(dict.fromkeys(ingredients))
    
    return ingredients

