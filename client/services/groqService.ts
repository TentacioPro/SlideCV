import { SlideResult } from "../types";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are an expert resume analyzer and presentation designer. Your task is to extract key information from a resume and structure it into a JSON format suitable for a professional slide.

Output JSON Schema:
{
  "candidate_profile": { 
    "full_name": "String", 
    "target_title": "String (e.g. Senior Software Engineer)", 
    "location": "String", 
    "contact_info": { "email": "String", "linkedin": "String", "portfolio": "String" } 
  },
  "slide_content": {
    "professional_summary": "String (Max 2 sentences, punchy and impressive)",
    "core_competencies": ["String", "String", "String" ... max 8 skills],
    "experience_highlights": [ 
      { "company": "String", "role": "String", "duration": "String", "bullet_points": ["String", "String"] } 
      ... max 3 roles
    ],
    "education_short": [ { "degree": "String", "institution": "String", "year": "String" } ... max 2 items ]
  }
}

Rules:
1. Extract the most relevant information.
2. If specific contact info is missing, leave empty string.
3. Keep bullet points concise and result-oriented.
4. Return ONLY valid JSON, no markdown formatting.
`;

export const analyzeResumeWithGroq = async (
  text: string
): Promise<SlideResult> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Using a powerful model for good extraction
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Here is the resume text:\n\n${text}` },
        ],
        temperature: 0.2, // Low temperature for consistent JSON
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
};
