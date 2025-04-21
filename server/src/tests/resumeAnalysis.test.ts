import { analyzeResume } from '../services/resumeAnalysis';

async function testResumeAnalysis() {
    console.log('Starting resume analysis test...');
    
    const resume = "John Doe is a software developer with 5 years of experience in Django, Python, and REST APIs. He has worked on large-scale web applications and has strong knowledge of database design and optimization.";
    const job = "Looking for a senior backend developer with Django experience. Must have strong Python skills and experience with REST APIs. Database optimization experience is a plus.";
    
    console.log('Resume:', resume);
    console.log('Job Description:', job);
    
    const similarity = await analyzeResume(resume, job);
    
    if (similarity !== null) {
        console.log('Test successful!');
        console.log('Similarity score:', similarity);
        console.log('Interpretation:');
        console.log('- Score close to 1.0: Very good match');
        console.log('- Score around 0.5: Moderate match');
        console.log('- Score close to 0.0: Poor match');
    } else {
        console.log('Test failed: Could not get similarity score');
    }
}

// Run the test
testResumeAnalysis(); 