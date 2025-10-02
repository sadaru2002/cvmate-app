import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API configuration
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class ResumeOptimizationService {
  private model = genAI.getGenerativeModel({ model: MODEL });

  // Direct API call method for better control
  private async callGeminiAPI(prompt: string) {
    const url = `${GEMINI_BASE}/${MODEL}:generateContent`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error: any) {
      console.error('Direct Gemini API Error:', error);
      throw new Error(`Gemini API call failed: ${error.message || 'Unknown error'}`);
    }
  }

  async analyzeResumeForJob(resumeData: any, jobDescription: string) {
    const prompt = `
    You are an expert resume optimization consultant. Analyze this resume against the job description and provide specific, actionable improvements.

    RESUME DATA:
    Name: ${resumeData.profileInfo.fullName}
    Current Title: ${resumeData.profileInfo.designation}
    Summary: ${resumeData.profileInfo.summary}
    
    Work Experience:
    ${resumeData.workExperiences?.map((exp, i) => `
    ${i + 1}. ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})
       Description: ${exp.description}
    `).join('\n') || 'No work experience provided'}
    
    Skills: ${resumeData.skills?.map(skill => skill.name).join(', ') || 'No skills provided'}
    
    Education: ${resumeData.education?.map(edu => `${edu.degree} from ${edu.institution}`).join(', ') || 'No education provided'}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS INSTRUCTIONS:
    1. Identify key requirements, skills, and keywords from the job description
    2. Compare against current resume content
    3. Suggest specific improvements for each section
    4. Provide exact text recommendations
    5. Highlight missing keywords or skills
    6. Suggest quantifiable achievements where possible

    Respond in JSON format:
    {
      "overallMatch": "percentage (e.g., 75%)",
      "keyFindings": [
        "Brief summary point 1",
        "Brief summary point 2"
      ],
      "improvements": {
        "summary": {
          "current": "current summary text",
          "suggested": "improved summary text",
          "reasoning": "why this change helps"
        },
        "skills": {
          "missing": ["skill1", "skill2"],
          "suggested": ["improved skill descriptions"],
          "reasoning": "why these skills matter"
        },
        "experience": [
          {
            "position": "job title",
            "current": "current description",
            "suggested": "improved description",
            "reasoning": "why this improvement helps"
          }
        ],
        "keywords": {
          "missing": ["keyword1", "keyword2"],
          "suggestions": "how to incorporate these keywords"
        }
      },
      "atsOptimization": {
        "tips": ["ATS tip 1", "ATS tip 2"],
        "formatting": ["formatting suggestion 1"]
      }
    }
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response from Gemini.');
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Re-throw with the original error message for better debugging in the API route
      throw new Error(`Gemini API call failed: ${error.message || 'Unknown error'}`);
    }
  }

  async generateStats(resumeData: any) {
    const prompt = `
    You are an expert resume analyst. Based on the provided resume data, generate a concise ATS score, identify the number of key skills/keywords present, and list the top 5-10 most relevant keywords found.
    
    RESUME DATA:
    Name: ${resumeData.profileInfo.fullName || 'N/A'}
    Current Title: ${resumeData.profileInfo.designation || 'N/A'}
    Summary: ${resumeData.profileInfo.summary || 'N/A'}
    Work Experience: ${resumeData.workExperiences?.map((exp, i) => `${exp.role || ''} at ${exp.company || ''}`).filter(Boolean).join('; ') || 'N/A'}
    Skills: ${resumeData.skills?.map(skill => skill.name).filter(Boolean).join(', ') || 'N/A'}
    Education: ${resumeData.education?.map(edu => `${edu.degree || ''} from ${edu.institution || ''}`).filter(Boolean).join('; ') || 'N/A'}
    Projects: ${resumeData.projects?.map(proj => proj.title).filter(Boolean).join('; ') || 'N/A'}
    Certifications: ${resumeData.certifications?.map(cert => cert.title).filter(Boolean).join('; ') || 'N/A'}
    Languages: ${resumeData.languages?.map(lang => lang.name).filter(Boolean).join(', ') || 'N/A'}
    Interests: ${resumeData.interests?.map(interest => interest.name).filter(Boolean).join(', ') || 'N/A'}

    Provide the output in JSON format:
    {
      "atsScore": "string (e.g., '85%')",
      "keywordsCount": "number (e.g., 15)",
      "keywordsList": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }
    `;

    try {
      const text = await this.callGeminiAPI(prompt);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response for stats from Gemini.');
    } catch (error: any) {
      console.error('Gemini API Error (generateStats):', error);
      throw new Error(`Gemini API call failed for stats: ${error.message || 'Unknown error'}`);
    }
  }
}

export const resumeOptimizer = new ResumeOptimizationService();