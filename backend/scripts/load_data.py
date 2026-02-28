import os
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES_PATH = os.path.join(BASE_DIR, '..', 'knowledge_base')
FAISS_INDEX = os.path.join(BASE_DIR, 'api', 'faiss_index')

def run_ingestion():
    print(f"Iniciando indexación desde -> {FILES_PATH}")

    embeddings = HuggingFaceEmbeddings(
        model_name="paraphrase-multilingual-MiniLM-L12-v2"
    )

    loader = DirectoryLoader(
        FILES_PATH,
        glob="**/*.pdf",
        loader_cls=PyPDFLoader,
        recursive=True
    )
    documents = loader.load()

    if not documents:
        return "No se encontraron documentos."

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=250
    )
    texts = text_splitter.split_documents(documents)

    vector_db = FAISS.from_documents(texts, embeddings)
    vector_db.save_local(FAISS_INDEX)

    return f" Éxito: {len(texts)} fragmentos guardados en {FAISS_INDEX}"

if __name__ == "__main__":
    print(run_ingestion())