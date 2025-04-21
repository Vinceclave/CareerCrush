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
    
    // Remove special characters but keep important ones
    text = text.replace(/[^\w\s.,;:!?()\-/]/g, ' ');
    
    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  private static extractKeywords(text: string): string[] {
    // Common words to exclude
    const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    // Extract words and filter out stop words
    const words = text.split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    return [...new Set(words)]; // Remove duplicates
  }

  private static calculateKeywordMatch(resumeKeywords: string[], jobKeywords: string[]): number {
    const matchingKeywords = resumeKeywords.filter(keyword => 
      jobKeywords.some(jobKeyword => 
        jobKeyword.includes(keyword) || keyword.includes(jobKeyword)
      )
    );
    
    return matchingKeywords.length / jobKeywords.length;
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

    // Extract keywords
    const resumeKeywords = this.extractKeywords(processedResumeText);
    const jobKeywords = this.extractKeywords(processedJobText);

    // Get the model and generate embeddings
    const model = await this.getModel();
    const resumeEmbedding = await model(processedResumeText, { pooling: 'mean', normalize: true });
    const jobEmbedding = await model(processedJobText, { pooling: 'mean', normalize: true });
    
    // Calculate cosine similarity
    const embeddingScore = this.calculateCosineSimilarity(resumeEmbedding.data, jobEmbedding.data);
    
    // Calculate keyword match score
    const keywordScore = this.calculateKeywordMatch(resumeKeywords, jobKeywords);
    
    // Combine scores with weights
    const finalScore = (embeddingScore * 0.7) + (keywordScore * 0.3);
    
    // Generate detailed analysis
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
    let analysis = `Resume scored ${scorePercentage}% match with the job description.\n\n`;
    
    // Add keyword analysis
    const matchingKeywords = resumeKeywords.filter(keyword => 
      jobKeywords.some(jobKeyword => 
        jobKeyword.includes(keyword) || keyword.includes(jobKeyword)
      )
    );
    
    analysis += `Matching Keywords: ${matchingKeywords.join(', ')}\n\n`;
    
    // Add detailed analysis based on score
    if (score >= 0.8) {
      analysis += "Excellent match! The resume strongly aligns with the job requirements and contains most of the required keywords.";
    } else if (score >= 0.6) {
      analysis += "Good match. The resume meets most of the job requirements and contains many relevant keywords.";
    } else if (score >= 0.4) {
      analysis += "Moderate match. Some skills and experience align with the job requirements, but could be improved with more relevant keywords.";
    } else {
      analysis += "Limited match. The resume may need significant updates to better align with the job requirements and include more relevant keywords.";
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