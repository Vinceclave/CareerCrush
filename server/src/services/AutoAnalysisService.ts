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
      console.log(`Analyzing resume ID: ${resume.id} for ${jobCategories[jobType].title}`);
      
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
      // Get all resumes that haven't been analyzed yet
      const resumes: Resume[] = await ResumeModel.findUnanalyzedResumes();
      
      if (resumes.length > 0) {
        console.log(`Found ${resumes.length} new resumes to analyze`);
        
        // Analyze each resume against all job categories
        for (const resume of resumes) {
          for (const jobType of Object.keys(jobCategories)) {
            await this.analyzeResume(resume, jobType);
          }
        }
      }
    } catch (error) {
      console.error('Error in auto-analysis service:', error);
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