from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

import os

# Load env vars
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=api_key)

docsearch = PineconeVectorStore.from_existing_index(
    index_name="medicalbot",
    embedding=embeddings,
    namespace="medical-ns"
)
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the answer concise."
    "\n\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

llm = OpenAI(temperature=0.4, max_tokens=500)
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

def get_rag_response(user_input: str) -> str:
    result = rag_chain.invoke({"input": user_input})
    return result["answer"]

# backend/rag_pipeline/_init_.py
# Empty init to make this a package