# import os
# from dotenv import load_dotenv
# from huggingface_hub import InferenceClient

# load_dotenv()
# HF_TOKEN = os.getenv("HF_API_TOKEN")


# class ExplanationGenerator:
#     def __init__(self, model_name="mistralai/Mistral-7B-Instruct-v0.2"):
#         """
#         Handles text generation (Halal/Haram explanations) via Hugging Face Inference API.
#         """
#         self.client = InferenceClient(token=HF_TOKEN)
#         self.model_name = model_name

#     def generate(self, ingredient: str, retrieved_docs: list) -> str:
#         context = "\n".join(
#             [f"- {doc['name']} ({doc['status']}), score {doc['score']:.2f}"
#              for doc in retrieved_docs]
#         )

#         prompt = f"""
# Explain whether the ingredient '{ingredient}' is Halal, Haram, or Mushbooh.
# Use this retrieved context:
# {context}

# Answer clearly for a consumer.
#         """

#         response = self.client.text_generation(
#             model=self.model_name, 
#             prompt=prompt, 
#             max_new_tokens=200, 
#             temperature=0.7)
        
#         # The API returns a list of dicts
#         return response[0]["generated_text"].replace(prompt, "").strip()


# class ExplanationGenerator:
#     def __init__(self, model_name="mistralai/Mistral-7B-Instruct-v0.2"):
#         self.client = InferenceClient(token=HF_TOKEN)
#         self.model_name = model_name

#     def generate(self, ingredient: str, retrieved_docs: list) -> str:
#         context = "\n".join(
#             [f"- {doc['name']} ({doc['status']}), score {doc['score']:.2f}"
#              for doc in retrieved_docs]
#         )

#         prompt = f"""
# Explain whether the ingredient '{ingredient}' is Halal, Haram, or Mushbooh.
# Use this retrieved context:
# {context}

# Answer clearly for a consumer.
#         """

#         # Use 'conversational' instead of 'text_generation'
#         response = self.client.conversational(
#             model=self.model_name,
#             inputs=prompt,
#             max_new_tokens=200,
#             temperature=0.7
#         )

#         # API returns list of dicts with 'generated_text'
#         return response[0]["generated_text"].strip()


# class ExplanationGenerator:
#     def __init__(self, model_name="mistralai/Mistral-7B-Instruct-v0.2"):
#         from huggingface_hub import InferenceClient
#         import os
#         from dotenv import load_dotenv

#         load_dotenv()
#         HF_TOKEN = os.getenv("HF_API_TOKEN")
#         self.client = InferenceClient(token=HF_TOKEN)
#         self.model_name = model_name

#     def generate(self, ingredient: str, retrieved_docs: list) -> str:
#         context = "\n".join(
#             [f"- {doc['name']} ({doc['status']}), score {doc['score']:.2f}"
#              for doc in retrieved_docs]
#         )

#         prompt = f"""
# Explain whether the ingredient '{ingredient}' is Halal, Haram, or Mushbooh.
# Use this retrieved context:
# {context}

# Answer clearly for a consumer.
#         """

#         response = self.client.chat(
#             model=self.model_name,
#             inputs=prompt,
#             max_new_tokens=200
#         )

#         return response.generated_text.strip()
    
# import os
# from dotenv import load_dotenv
# from huggingface_hub import InferenceClient

# load_dotenv()
# HF_TOKEN = os.getenv("HF_API_TOKEN")

# class ExplanationGenerator:
#     def __init__(self, model_name="mistralai/Mistral-7B-Instruct-v0.2"):
#         """
#         Handles text generation via Hugging Face Inference API using the correct
#         chat completion method.
#         """
#         self.client = InferenceClient(token=HF_TOKEN)
#         self.model_name = model_name

#     def generate(self, ingredient: str, retrieved_docs: list) -> str:
#         """
#         Generates an explanation for a given ingredient using the provided context.
#         """
#         context = "\n".join(
#             [f"- {doc['name']} ({doc['status']}), score {doc['score']:.2f}"
#              for doc in retrieved_docs]
#         )

#         prompt = f"""
# Explain whether the ingredient '{ingredient}' is Halal, Haram, or Mushbooh.
# Use this retrieved context:
# {context}

# Answer clearly for a consumer.
#         """

#         try:
#             # This is the correct and final method call.
#             # We access the 'chat' property, then call its 'send_message' method.
#             response = self.client.chat.send_message(
#                 model=self.model_name,
#                 messages=[{"role": "user", "content": prompt}]
#             )
            
#             # The response object has the generated text in its 'content' attribute.
#             return response.content.strip()

#         except Exception as e:
#             # Handle potential API or network errors gracefully.
#             print(f"An error occurred during API call: {e}")
#             return "An error occurred while generating the explanation. Please try again later."

from huggingface_hub import InferenceClient

class ExplanationGenerator:
    def __init__(self, model_name="meta-llama/Llama-3.2-3B-Instruct"):
        self.client = InferenceClient()
        self.model_name = model_name

    def generate(self, ingredient, context):
        prompt = f"Explain if the ingredient '{ingredient}' is halal or haram. Context: {context}"

        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": "You are a halal food expert."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300
        )

        return response.choices[0].message["content"]
