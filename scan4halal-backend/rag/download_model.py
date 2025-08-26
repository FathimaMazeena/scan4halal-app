from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "mistralai/Mistral-7B-Instruct-v0.2"

print("Downloading tokenizer...")
AutoTokenizer.from_pretrained(model_name)
print("Tokenizer downloaded.")

print("Downloading model...")
AutoModelForCausalLM.from_pretrained(model_name)
print("Model downloaded.")
