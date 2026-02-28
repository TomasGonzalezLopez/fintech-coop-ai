import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERSIST_DIRECTORY = os.path.join(BASE_DIR, 'api', 'faiss_index')

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = FAISS.load_local(
    PERSIST_DIRECTORY,
    embeddings,
    allow_dangerous_deserialization=True
)

results = db.similarity_search(
    "¿Cuál es el objetivo principal del documento?",
    k=3
)

for i, r in enumerate(results, 1):
    print(f"\n--- Resultado {i} ---")
    print(r.page_content[:500])