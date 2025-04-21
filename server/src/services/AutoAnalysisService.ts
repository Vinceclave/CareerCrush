import { ResumeModel, Resume, AIResumeScore } from '../models/Resume';

interface JobCategory {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}

const jobCategories: Record<string, JobCategory> = {
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

export class AutoAnalysisService {
  private static instance: AutoAnalysisService;
  private isRunning: boolean = false;
  private checkInterval: number = 5 * 60 * 1000; // Check every 5 minutes

  private constructor() {}

  static getInstance(): AutoAnalysisService {
    if (!AutoAnalysisService.instance) {
      AutoAnalysisService.instance = new AutoAnalysisService();
    }
    return AutoAnalysisService.instance;
  }

  private generateJobDescription(jobType: string, customRequirements: string[] = []): string {
    const job = jobCategories[jobType];
    if (!job) {
      throw new Error(`Invalid job category: ${jobType}`);
    }

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

  private async analyzeResume(resume: Resume, jobType: string): Promise<void> {
    try {
      console.log(`Processing resume ID: ${resume.id}`);
      
      const jobDescription = this.generateJobDescription(jobType);
      const score: AIResumeScore = await ResumeModel.analyzeResume(resume.id, jobDescription);
      
      console.log(`Analysis completed for resume ${resume.id}:`);
      console.log(`Score: ${(score.score * 100).toFixed(2)}%`);
      console.log(`Analysis: ${score.analysis}`);
    } catch (error) {
      console.error(`Error analyzing resume ${resume.id}:`, error);
    }
  }

  private async checkAndAnalyzeNewResumes(): Promise<void> {
    try {
      // Get all resumes
      const resumes: Resume[] = await ResumeModel.findByEmployeeId(1); // Using a dummy employee ID for testing
      
      if (resumes.length > 0) {
        console.log(`Found ${resumes.length} resumes to process`);
        
        // Process each resume against all job categories
        for (const resume of resumes) {
          for (const jobType of Object.keys(jobCategories)) {
            await this.analyzeResume(resume, jobType);
          }
        }
      }
    } catch (error) {
      console.error('Error in resume processing service:', error);
    }
  }

  // New method to get all candidates without filtering
  async getAllCandidates(): Promise<Resume[]> {
    try {
      return await ResumeModel.findByEmployeeId(1); // Using a dummy employee ID for testing
    } catch (error) {
      console.error('Error fetching all candidates:', error);
      return [];
    }
  }

  // New method to get filtered candidates by score
  async getFilteredCandidates(minScore: number = 0.3): Promise<Resume[]> {
    try {
      const allResumes = await ResumeModel.findByEmployeeId(1); // Using a dummy employee ID for testing
      const filteredResumes: Resume[] = [];
      
      for (const resume of allResumes) {
        const score = await ResumeModel.getResumeScore(resume.id);
        if (score) {
          // Include candidates that meet the minimum score or have relevant keywords
          if (score.score >= minScore || score.analysis.toLowerCase().includes('skill') || 
              score.analysis.toLowerCase().includes('experience')) {
            filteredResumes.push(resume);
          }
        } else {
          // Include candidates without scores to ensure we don't miss any
          filteredResumes.push(resume);
        }
      }
      
      // Sort by score if available
      filteredResumes.sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
      });
      
      return filteredResumes;
    } catch (error) {
      console.error('Error fetching filtered candidates:', error);
      return [];
    }
  }

  start(): void {
    if (this.isRunning) {
      console.log('Auto-analysis service is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting auto-analysis service...');

    // Initial check
    this.checkAndAnalyzeNewResumes();

    // Set up periodic checks
    setInterval(() => {
      this.checkAndAnalyzeNewResumes();
    }, this.checkInterval);
  }

  stop(): void {
    this.isRunning = false;
    console.log('Auto-analysis service stopped');
  }
} 