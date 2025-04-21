import { ResumeModel, Resume, AIResumeScore } from '../models/Resume';

interface JobDescription {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}

const jobCategories: Record<string, JobDescription> = {
  'technical': {
    title: 'Technical Roles',
    description: 'We are seeking candidates for various technical positions.',
    requirements: [
      'Relevant technical education or certifications',
      'Experience with industry-standard tools and technologies',
      'Problem-solving and analytical abilities',
      'Understanding of technical documentation',
      'Ability to work in a team environment',
      'Continuous learning mindset'
    ],
    skills: [
      'Technical proficiency',
      'Problem-solving',
      'Team collaboration',
      'Communication',
      'Adaptability',
      'Attention to detail'
    ]
  },
  'business': {
    title: 'Business Roles',
    description: 'We are looking for professionals for various business positions.',
    requirements: [
      'Business-related education or experience',
      'Understanding of business processes',
      'Analytical and strategic thinking',
      'Project management skills',
      'Communication and presentation abilities',
      'Team leadership experience'
    ],
    skills: [
      'Strategic thinking',
      'Communication',
      'Leadership',
      'Project management',
      'Analytical skills',
      'Problem-solving'
    ]
  },
  'creative': {
    title: 'Creative Roles',
    description: 'We are seeking creative professionals for various positions.',
    requirements: [
      'Creative education or portfolio',
      'Experience with creative tools and software',
      'Strong visual and conceptual skills',
      'Understanding of design principles',
      'Ability to work under deadlines',
      'Collaboration and feedback incorporation'
    ],
    skills: [
      'Creativity',
      'Visual communication',
      'Technical proficiency',
      'Time management',
      'Collaboration',
      'Adaptability'
    ]
  },
  'administrative': {
    title: 'Administrative Roles',
    description: 'We are looking for administrative professionals.',
    requirements: [
      'Organizational and time management skills',
      'Proficiency in office software',
      'Communication and interpersonal abilities',
      'Attention to detail',
      'Ability to handle multiple tasks',
      'Problem-solving skills'
    ],
    skills: [
      'Organization',
      'Communication',
      'Time management',
      'Problem-solving',
      'Technical proficiency',
      'Teamwork'
    ]
  }
};

function generateJobDescription(jobType: string, customRequirements: string[] = []): string {
  const job = jobCategories[jobType];
  if (!job) {
    throw new Error(`Invalid job category: ${jobType}`);
  }

  // Combine standard requirements with custom ones
  const allRequirements = [...job.requirements];
  if (customRequirements.length > 0) {
    allRequirements.push(...customRequirements);
  }

  return `
${job.description}
The ideal candidate should have:

${allRequirements.map(req => `- ${req}`).join('\n')}

Key Skills:
${job.skills.map(skill => `- ${skill}`).join('\n')}
`;
}

async function analyzeAllResumes(jobType: string = 'technical', customRequirements: string[] = []) {
  try {
    // Get all resumes from the database
    const resumes: Resume[] = await ResumeModel.findByEmployeeId(1); // Using a dummy employee ID for testing
    
    console.log(`Found ${resumes.length} resumes to analyze for ${jobCategories[jobType].title} positions`);
    
    for (const resume of resumes) {
      console.log(`\nAnalyzing resume ID: ${resume.id}`);
      console.log(`File: ${resume.file_url}`);
      
      try {
        // Generate job description for the specified job category
        const jobDescription = generateJobDescription(jobType, customRequirements);
        
        // Analyze the resume against the job description
        const score: AIResumeScore = await ResumeModel.analyzeResume(resume.id, jobDescription);
        
        console.log(`Score: ${(score.score * 100).toFixed(2)}%`);
        console.log(`Analysis: ${score.analysis}`);
        console.log(`Scored at: ${score.scored_at}`);
      } catch (error) {
        console.error(`Error analyzing resume ${resume.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error analyzing resumes:', error);
  }
}

// Get job type from command line argument or use default
const jobType = process.argv[2] || 'technical';
// Get custom requirements from command line arguments
const customRequirements = process.argv.slice(3);
analyzeAllResumes(jobType, customRequirements); 