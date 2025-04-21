# Resume Analysis Server

This is a FastAPI server that uses sentence-transformers to analyze resume similarity with job descriptions.

## Setup

1. Install Python 3.8 or higher
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

1. Make sure you're in the server directory
2. Activate the virtual environment (if not already activated)
3. Run the server:
   ```bash
   uvicorn src.app:app --reload --port 8000
   ```

The server will be available at http://localhost:8000

## API Endpoints

### POST /analyze
Analyzes the similarity between a resume and a job description.

Request body:
```json
{
  "text": "Your resume text here",
  "job": "Job description text here"
}
```

Response:
```json
{
  "similarity": 0.8425
}
```

## Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 