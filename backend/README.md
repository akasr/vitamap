# VitaMap Backend Chatbot

This document provides instructions for setting up and running the VitaMap backend chatbot service, which powers the AI-based chat functionality in the VitaMap application.

## Overview

The VitaMap backend chatbot is built using:
- FastAPI - A modern, fast web framework for building APIs with Python
- LangChain - A framework for developing applications powered by language models
- Pinecone - Vector database for storing and retrieving embeddings
- OpenAI - For natural language processing capabilities

The system uses a Retrieval Augmented Generation (RAG) pipeline to provide accurate, contextual responses to user queries about medications and health information.

## Prerequisites

- Python 3.9+ installed
- pip (Python package installer)
- Virtual environment tool (recommended: venv or conda)
- OpenAI API key
- Pinecone API key (for vector database)

## Installation

### 1. Clone the Repository (if you haven't already)

```bash
git clone <your-repository-url>
cd vitamap
```

### 2. Set Up a Python Virtual Environment (Recommended)

```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

### 3. Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

This will install all necessary packages including:
- FastAPI and Uvicorn (ASGI server)
- LangChain and related components
- Pinecone client
- OpenAI SDK
- Other utility libraries

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```bash
touch .env
```

Add the following environment variables to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

## Running the Backend

To start the backend server:

```bash
uvicorn main:app --reload
```

This will start the FastAPI application with hot-reload enabled on http://127.0.0.1:8000.

## API Endpoints

### Health Check
- `GET /`: Returns a simple message confirming the API is working

### Chat Endpoint
- `POST /chat`: Accepts a JSON body with an `input` field containing the user's question and returns an AI-generated response

Example request:
```json
{
  "input": "What are the side effects of ibuprofen?"
}
```

Example response:
```json
{
  "answer": "Ibuprofen may cause several side effects, including stomach pain, heartburn, nausea, vomiting, headache, dizziness, and mild rash. More serious side effects can include stomach bleeding, kidney problems, high blood pressure, and allergic reactions. It's important to take ibuprofen as directed and consult with a healthcare professional if you experience any concerning symptoms."
}
```

## RAG Pipeline Architecture

The backend uses a Retrieval Augmented Generation (RAG) pipeline that:

1. Takes user queries about medications or health topics
2. Retrieves relevant information from a knowledge base stored in Pinecone
3. Uses OpenAI's models to generate accurate, contextual responses based on the retrieved information

The pipeline is defined in the `rag_pipeline/chain.py` file.

## Troubleshooting

### Common Issues

1. **Module not found errors**:
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check that you're running the application from within the activated virtual environment

2. **API Key errors**:
   - Verify that your `.env` file exists and contains the correct API keys
   - Make sure the environment variables are being loaded properly

3. **Connection errors with Pinecone**:
   - Check your internet connection
   - Verify your Pinecone API key and environment settings