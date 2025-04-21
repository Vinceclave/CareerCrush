import pool from '../config/database';
import { pipeline } from '@xenova/transformers';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

export interface Resume {
  id: number;
  employee_id: number;
  file_url: string;
  upload_timestamp: Date;
}

export interface AIResumeScore {
  resume_id: number;
  score: number;
  analysis: string;
  scored_at: Date;
}

export class ResumeModel {
  private static model: any = null;

  private static async getModel() {
    if (!this.model) {
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.model;
  }

  static async create(resumeData: Omit<Resume, 'id' | 'upload_timestamp'>): Promise<Resume> {
    const [result] = await pool.execute(
      'INSERT INTO resumes (employee_id, file_url) VALUES (?, ?)',
      [resumeData.employee_id, resumeData.file_url]
    );
    
    const newResume = await this.findById((result as any).insertId);
    if (!newResume) {
      throw new Error('Failed to create resume');
    }

    // Automatically analyze the resume with a default job description
    const defaultJobDescription = `
      We are looking for a skilled professional with relevant experience.
      The ideal candidate should have:
      - Strong technical skills
      - Good communication abilities
      - Problem-solving capabilities
      - Team collaboration experience
      - Adaptability and learning mindset
    `;

    try {
      await this.analyzeResume(newResume.id, defaultJobDescription);
    } catch (error) {
      console.error('Error in automatic resume analysis:', error);
      // Don't throw the error - we still want to return the resume even if analysis fails
    }

    return newResume;
  }

  static async findById(id: number): Promise<Resume | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resumes WHERE id = ?',
      [id]
    );
    return (rows as Resume[])[0] || null;
  }

  static async findByEmployeeId(employeeId: number): Promise<Resume[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM resumes WHERE employee_id = ?',
      [employeeId]
    );
    return rows as Resume[];
  }

  private static async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      // Clean the file path by removing any duplicate uploads directories
      const cleanPath = filePath.replace(/^\/?uploads\//, '').replace(/^\/?resumes\//, '');
      
      // Get the absolute path to the uploads directory
      const uploadsDir = path.join(__dirname, '../../..', 'client', 'uploads', 'resumes');
      const absolutePath = path.join(uploadsDir, cleanPath);
      
      console.log('Looking for PDF at:', absolutePath);
      
      // Check if file exists
      try {
        await fs.access(absolutePath);
      } catch (error) {
        console.error('File not found at:', absolutePath);
        throw new Error(`PDF file not found at ${absolutePath}`);
      }
      
      const dataBuffer = await fs.readFile(absolutePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private static preprocessText(text: string): string {
    // Convert to lowercase
    text = text.toLowerCase();
    
    // Fix spacing issues in the text
    text = text.replace(/,/g, ' '); // Replace commas with spaces
    text = text.replace(/\s+/g, ' '); // Replace multiple spaces with single space
    
    // Remove special characters but keep important ones
    text = text.replace(/[^\w\s.,;:!?()\-/]/g, ' ');
    
    // Add spaces between words that are stuck together
    text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Remove extra whitespace
    text = text.trim();
    
    return text;
  }

  private static extractKeywords(text: string): string[] {
    // Common words to exclude
    const stopWords = new Set([
      'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might',
      'must', 'can', 'could'
    ]);
    
    // Extract words and filter out stop words
    const words = text.split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Add common variations of words
    const variations = words.flatMap(word => {
      const variants = [word];
      if (word.endsWith('ing')) {
        variants.push(word.slice(0, -3));
      }
      if (word.endsWith('ed')) {
        variants.push(word.slice(0, -2));
      }
      if (word.endsWith('s')) {
        variants.push(word.slice(0, -1));
      }
      return variants;
    });
    
    return [...new Set(variations)]; // Remove duplicates
  }

  private static calculateKeywordMatch(resumeKeywords: string[], jobKeywords: string[]): number {
    // Weight different types of keywords differently
    const skillWeight = 1.0;
    const experienceWeight = 1.2;
    const educationWeight = 0.8;
    
    // Categorize keywords
    const skillKeywords = jobKeywords.filter(k => 
      k.toLowerCase().includes('skill') || 
      k.toLowerCase().includes('ability') ||
      k.toLowerCase().includes('proficient') ||
      k.toLowerCase().includes('expertise')
    );
    
    const experienceKeywords = jobKeywords.filter(k => 
      k.toLowerCase().includes('experience') || 
      k.toLowerCase().includes('years') ||
      k.toLowerCase().includes('worked') ||
      k.toLowerCase().includes('developed')
    );
    
    const educationKeywords = jobKeywords.filter(k => 
      k.toLowerCase().includes('education') || 
      k.toLowerCase().includes('degree') ||
      k.toLowerCase().includes('certification') ||
      k.toLowerCase().includes('training')
    );
    
    // Calculate matches for each category with partial matching
    const skillMatches = resumeKeywords.filter(keyword => 
      skillKeywords.some(jobKeyword => 
        jobKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(jobKeyword.toLowerCase()) ||
        this.calculateStringSimilarity(keyword, jobKeyword) > 0.7
      )
    ).length;
    
    const experienceMatches = resumeKeywords.filter(keyword => 
      experienceKeywords.some(jobKeyword => 
        jobKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(jobKeyword.toLowerCase()) ||
        this.calculateStringSimilarity(keyword, jobKeyword) > 0.7
      )
    ).length;
    
    const educationMatches = resumeKeywords.filter(keyword => 
      educationKeywords.some(jobKeyword => 
        jobKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(jobKeyword.toLowerCase()) ||
        this.calculateStringSimilarity(keyword, jobKeyword) > 0.7
      )
    ).length;
    
    // Calculate weighted scores with a minimum threshold
    const totalKeywords = Math.max(1, jobKeywords.length);
    const weightedScore = (
      (skillMatches * skillWeight) +
      (experienceMatches * experienceWeight) +
      (educationMatches * educationWeight)
    ) / (totalKeywords * (skillWeight + experienceWeight + educationWeight) / 3);
    
    // Ensure a minimum score for candidates with relevant keywords
    return Math.max(0.3, weightedScore);
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    return (longerLength - this.editDistance(longer, shorter)) / longerLength;
  }

  private static editDistance(s1: string, s2: string): number {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  static async analyzeResume(resumeId: number, jobDescription: string): Promise<AIResumeScore> {
    const resume = await this.findById(resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }

    // Extract and preprocess text
    const resumeText = await this.extractTextFromPDF(resume.file_url);
    const processedResumeText = this.preprocessText(resumeText);
    const processedJobText = this.preprocessText(jobDescription);

    // Extract keywords with improved extraction
    const resumeKeywords = this.extractKeywords(processedResumeText);
    const jobKeywords = this.extractKeywords(processedJobText);

    // Get the model and generate embeddings
    const model = await this.getModel();
    const resumeEmbedding = await model(processedResumeText, { pooling: 'mean', normalize: true });
    const jobEmbedding = await model(processedJobText, { pooling: 'mean', normalize: true });
    
    // Calculate cosine similarity with minimum threshold
    const embeddingScore = Math.max(0.3, this.calculateCosineSimilarity(resumeEmbedding.data, jobEmbedding.data));
    
    // Calculate keyword match score with improved matching
    const keywordScore = this.calculateKeywordMatch(resumeKeywords, jobKeywords);
    
    // Combine scores with adjusted weights
    const finalScore = (embeddingScore * 0.6) + (keywordScore * 0.4);
    
    // Generate analysis
    const analysis = this.generateAnalysis(finalScore, resumeText, jobDescription, resumeKeywords, jobKeywords);

    // Delete any existing score for this resume
    await pool.execute('DELETE FROM ai_resume_scores WHERE resume_id = ?', [resumeId]);

    // Save the new score to the database
    await pool.execute(
      'INSERT INTO ai_resume_scores (resume_id, score, analysis, scored_at) VALUES (?, ?, ?, ?)',
      [resumeId, finalScore, analysis, new Date()]
    );

    return {
      resume_id: resumeId,
      score: finalScore,
      analysis,
      scored_at: new Date()
    };
  }

  private static calculateCosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private static generateAnalysis(
    score: number, 
    resumeText: string, 
    jobDescription: string,
    resumeKeywords: string[],
    jobKeywords: string[]
  ): string {
    const scorePercentage = (score * 100).toFixed(2);
    let analysis = `Candidate Profile:\n\n`;
    
    // Extract basic information
    const nameMatch = resumeText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    const emailMatch = resumeText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = resumeText.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    
    if (nameMatch) analysis += `Name: ${nameMatch[0]}\n`;
    if (emailMatch) analysis += `Email: ${emailMatch[0]}\n`;
    if (phoneMatch) analysis += `Phone: ${phoneMatch[0]}\n`;
    
    // Add skills and experience summary
    analysis += `\nSkills and Experience:\n`;
    const skills = resumeKeywords.filter(k => 
      k.toLowerCase().includes('skill') || 
      k.toLowerCase().includes('experience') ||
      k.toLowerCase().includes('technology')
    );
    
    if (skills.length > 0) {
      analysis += skills.slice(0, 5).join(', ') + '\n';
    }
    
    // Add matching score and analysis
    analysis += `\nMatch Score: ${scorePercentage}%\n`;
    if (score >= 0.8) {
      analysis += "Excellent match with job requirements.";
    } else if (score >= 0.6) {
      analysis += "Good match with job requirements.";
    } else if (score >= 0.4) {
      analysis += "Moderate match with job requirements.";
    } else {
      analysis += "Basic match with job requirements.";
    }
    
    return analysis;
  }

  static async getResumeScore(resumeId: number): Promise<AIResumeScore | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ai_resume_scores WHERE resume_id = ?',
      [resumeId]
    );
    return (rows as AIResumeScore[])[0] || null;
  }

  static async delete(id: number): Promise<void> {
    await pool.execute(
      'DELETE FROM resumes WHERE id = ?',
      [id]
    );
  }

  static async findUnanalyzedResumes(): Promise<Resume[]> {
    const [rows] = await pool.execute(`
      SELECT r.* FROM resumes r
      LEFT JOIN ai_resume_scores ars ON r.id = ars.resume_id
      WHERE ars.resume_id IS NULL
    `);
    return rows as Resume[];
  }
}

export class AIResumeScoreModel {
  static async create(score: AIResumeScore): Promise<void> {
    await pool.execute(
      'INSERT INTO ai_resume_scores (resume_id, score, analysis) VALUES (?, ?, ?)',
      [score.resume_id, score.score, score.analysis]
    );
  }

  static async findByResumeId(resumeId: number): Promise<AIResumeScore | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ai_resume_scores WHERE resume_id = ?',
      [resumeId]
    );
    return (rows as AIResumeScore[])[0] || null;
  }

  static async update(resumeId: number, score: Partial<AIResumeScore>): Promise<void> {
    const fields = Object.keys(score).map(key => `${key} = ?`).join(', ');
    const values = Object.values(score);
    values.push(resumeId);

    await pool.execute(
      `UPDATE ai_resume_scores SET ${fields} WHERE resume_id = ?`,
      values
    );
  }

  static async delete(resumeId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM ai_resume_scores WHERE resume_id = ?',
      [resumeId]
    );
  }
} 