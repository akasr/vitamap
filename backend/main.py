# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_pipeline.chain import get_rag_response
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    input: str


@app.get("/")
def read_root():
    return {"message": "API is working!"}

@app.post("/chat")
async def chat(query: Query):
    response = get_rag_response(query.input)
    return {"answer": response}
