import axios from 'axios';

interface ResumeAnalysisResponse {
    similarity: number;
}

export async function analyzeResume(resumeText: string, jobDescription: string): Promise<number | null> {
    try {
        const response = await axios.post<ResumeAnalysisResponse>('http://localhost:8000/analyze', {
            text: resumeText,
            job: jobDescription
        });

        console.log("Similarity score:", response.data.similarity);
        return response.data.similarity;

    } catch (error: any) {
        if (error?.response) {
            console.error("Error calling SBERT API:", error.response.data);
        } else if (error?.request) {
            console.error("No response received:", error.message);
        } else {
            console.error("Error setting up request:", error.message);
        }
        return null;
    }
}

// Example usage
// const resume = "John Doe is a software developer with experience in Django and REST APIs.";
// const job = "Hiring backend developer experienced in Django.";
// analyzeResume(resume, job); 