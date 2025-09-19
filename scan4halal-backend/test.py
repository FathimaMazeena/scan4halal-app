from huggingface_hub import HfApi
from dotenv import load_dotenv
import os

load_dotenv()

api = HfApi()
token = os.getenv("HF_API_TOKEN")   # ✅ read from .env
usage = api.whoami(token=token)
print(usage)