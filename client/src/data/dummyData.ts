export interface Match {
  id: number;
  jobTitle: string;
  company: string;
  matchScore: number;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
  requirements: string[];
  isDirectMatch?: boolean;
  employerEmail?: string;
}

export interface DashboardStats {
  jobApplications: number;
  interviews: number;
  profileViews: number;
  recentActivity: {
    id: number;
    type: 'application' | 'interview' | 'profile_view' | 'match';
    title: string;
    description: string;
    timestamp: string;
  }[];
}

export interface Candidate {
  resume_id: number;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  avatar_url: string;
  title: string;
  skills: string[];
  experience_years: number;
  education: string;
  linkedin_url: string;
  preferred_location: string;
  preferred_job_type: string;
  score: number;
  analysis: string;
  scored_at: string;
  match_percentage: string;
}

export const dummyMatches: Match[] = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    matchScore: 95,
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    type: "Full-time",
    postedDate: "2024-03-15",
    description: "We're looking for a Senior Frontend Developer to join our team and help build amazing user experiences.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with modern build tools",
      "Understanding of web accessibility"
    ],
    isDirectMatch: true,
    employerEmail: "hr@techcorp.com"
  },
  {
    id: 2,
    jobTitle: "Full Stack Engineer",
    company: "Innovation Labs",
    matchScore: 88,
    location: "Remote",
    salary: "$100k - $130k",
    type: "Full-time",
    postedDate: "2024-03-14",
    description: "Join our growing team as a Full Stack Engineer and work on exciting projects.",
    requirements: [
      "3+ years of full stack development",
      "Experience with Node.js and React",
      "Database design experience",
      "API development skills"
    ],
    isDirectMatch: false
  },
  {
    id: 3,
    jobTitle: "React Developer",
    company: "Digital Solutions",
    matchScore: 82,
    location: "New York, NY",
    salary: "$90k - $120k",
    type: "Full-time",
    postedDate: "2024-03-13",
    description: "Looking for a React Developer to help build our next-generation web applications.",
    requirements: [
      "2+ years of React experience",
      "JavaScript/TypeScript proficiency",
      "Understanding of state management",
      "Experience with REST APIs"
    ],
    isDirectMatch: true,
    employerEmail: "careers@digitalsolutions.com"
  }
];

export const dummyDashboardStats: DashboardStats = {
  jobApplications: 12,
  interviews: 3,
  profileViews: 45,
  recentActivity: [
    {
      id: 1,
      type: 'application',
      title: 'Application Submitted',
      description: 'Applied for Senior Frontend Developer at TechCorp Solutions',
      timestamp: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Technical interview scheduled with Innovation Labs',
      timestamp: '2024-03-14T15:45:00Z'
    },
    {
      id: 3,
      type: 'match',
      title: 'New Match',
      description: 'Matched with Digital Solutions for React Developer position',
      timestamp: '2024-03-13T09:15:00Z'
    },
    {
      id: 4,
      type: 'profile_view',
      title: 'Profile Viewed',
      description: 'Your profile was viewed by 5 employers',
      timestamp: '2024-03-12T14:20:00Z'
    }
  ]
};

export const dummyCandidates: Candidate[] = [
  {
    resume_id: 1,
    employee_id: 101,
    employee_name: "John Doe",
    employee_email: "john.doe@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
    title: "Senior Software Engineer",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
    experience_years: 5,
    education: "BS Computer Science, Stanford University",
    linkedin_url: "https://linkedin.com/in/johndoe",
    preferred_location: "San Francisco, CA",
    preferred_job_type: "Full-time",
    score: 0.95,
    analysis: "Strong match for senior developer position. Excellent React and Node.js experience.",
    scored_at: "2024-03-15T10:30:00Z",
    match_percentage: "95%"
  },
  {
    resume_id: 2,
    employee_id: 102,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@example.com",
    avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
    title: "Data Scientist",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Analysis"],
    experience_years: 3,
    education: "MS Data Science, MIT",
    linkedin_url: "https://linkedin.com/in/janesmith",
    preferred_location: "New York, NY",
    preferred_job_type: "Full-time",
    score: 0.92,
    analysis: "Excellent match for data science role. Strong ML background.",
    scored_at: "2024-03-15T11:15:00Z",
    match_percentage: "92%"
  },
  {
    resume_id: 3,
    employee_id: 103,
    employee_name: "Michael Johnson",
    employee_email: "michael.johnson@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/3.jpg",
    title: "Product Manager",
    skills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Communication"],
    experience_years: 4,
    education: "MBA, Harvard Business School",
    linkedin_url: "https://linkedin.com/in/michaeljohnson",
    preferred_location: "Seattle, WA",
    preferred_job_type: "Full-time",
    score: 0.88,
    analysis: "Good match for product management role. Strong business background.",
    scored_at: "2024-03-15T12:00:00Z",
    match_percentage: "88%"
  },
  {
    resume_id: 4,
    employee_id: 104,
    employee_name: "Emily Davis",
    employee_email: "emily.davis@example.com",
    avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
    title: "UX Designer",
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping", "Design Systems"],
    experience_years: 3,
    education: "BS Design, Rhode Island School of Design",
    linkedin_url: "https://linkedin.com/in/emilydavis",
    preferred_location: "Austin, TX",
    preferred_job_type: "Full-time",
    score: 0.85,
    analysis: "Strong match for UX design position. Excellent portfolio.",
    scored_at: "2024-03-15T13:30:00Z",
    match_percentage: "85%"
  },
  {
    resume_id: 5,
    employee_id: 105,
    employee_name: "David Wilson",
    employee_email: "david.wilson@example.com",
    avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
    title: "DevOps Engineer",
    skills: ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
    experience_years: 4,
    education: "BS Computer Engineering, Georgia Tech",
    linkedin_url: "https://linkedin.com/in/davidwilson",
    preferred_location: "Remote",
    preferred_job_type: "Full-time",
    score: 0.82,
    analysis: "Good match for DevOps role. Strong infrastructure experience.",
    scored_at: "2024-03-15T14:45:00Z",
    match_percentage: "82%"
  }
];

export const dummySkills = [
  { keyword: "JavaScript", frequency: 42 },
  { keyword: "React", frequency: 38 },
  { keyword: "Python", frequency: 35 },
  { keyword: "Node.js", frequency: 32 },
  { keyword: "AWS", frequency: 28 },
  { keyword: "TypeScript", frequency: 25 },
  { keyword: "Machine Learning", frequency: 22 },
  { keyword: "SQL", frequency: 20 },
  { keyword: "Docker", frequency: 18 },
  { keyword: "Kubernetes", frequency: 15 }
]; 