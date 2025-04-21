from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from fastapi.middleware.cors import CORSMiddleware

# Init
app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

# Allow CORS if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeData(BaseModel):
    text: str
    job: str = "Looking for a backend engineer with Django experience"

@app.post("/analyze")
async def analyze_resume(data: ResumeData):
    resume_embedding = model.encode(data.text, convert_to_tensor=True)
    job_embedding = model.encode(data.job, convert_to_tensor=True)
    score = util.cos_sim(job_embedding, resume_embedding).item()
    return {"similarity": round(score, 4)}
