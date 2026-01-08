import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

// --- Groq Service Logic (Embedded for Monorepo Simplicity) ---
const GROQ_API_KEY = process.env.GROQ_API_KEY; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are an expert resume analyzer and presentation designer. Your task is to extract key information from a resume and structure it into a JSON format suitable for a professional slide.

Output JSON Schema:
{
  "candidate_profile": { 
    "full_name": "String", 
    "target_title": "String", 
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
Rules: Return ONLY valid JSON.
`;

const analyzeResumeWithGroq = async (text: string): Promise<any> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Here is the resume text:\n\n${text}` }
                ],
                temperature: 0.2,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Groq API Error");
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};

// --- Server Setup ---
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// File Upload Config
const upload = multer({ dest: 'uploads/' });

// Ensure directories
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// --- Routes ---

// 1. Analyze Resume Endpoint
app.post('/api/analyze', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
             return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        let text = "";

        // Parse File
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else {
            // Text files
            text = fs.readFileSync(filePath, 'utf-8');
        }

        // Cleanup temp file
        fs.unlinkSync(filePath);

        if (!text || text.length < 50) {
            return res.status(400).json({ error: "Could not extract sufficient text." });
        }

        // Analyze
        const result = await analyzeResumeWithGroq(text);
        
        // Log to docs (simple in-memory log for now or console)
        console.log(`[Analyzed] ${req.file.originalname} - Success`);

        // Save Slide
        const slideRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            fileName: req.file.originalname,
            data: result
        };
        saveSlide(slideRecord);

        res.json(result);

    } catch (error: any) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// 2. Logging/Docs Endpoint
// Stores logs in a simple JSON file
const LOG_FILE = path.join(__dirname, 'app_logs.json');
const logAction = (action: string, details: any) => {
    const logs = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8')) : [];
    logs.push({ timestamp: new Date(), action, details });
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
};

app.post('/api/log', (req, res) => {
    const { action, details } = req.body;
    logAction(action, details);
    res.json({ success: true });
});

// Update path to point to 'resumes/slide_cv' which is at the root level relative to server
const SLIDES_DIR = path.resolve(__dirname, '../resumes/slide_cv');
if (!fs.existsSync(SLIDES_DIR)) {
    // Attempt to create if it doesn't exist, though user said it does
    fs.mkdirSync(SLIDES_DIR, { recursive: true });
}
const SLIDES_FILE = path.join(SLIDES_DIR, 'slides_db.json');

const getSavedSlides = () => {
    if (!fs.existsSync(SLIDES_FILE)) return [];
    return JSON.parse(fs.readFileSync(SLIDES_FILE, 'utf-8'));
};

const saveSlide = (slideData: any) => {
    const slides = getSavedSlides();
    slides.unshift(slideData); // Add to beginning
    fs.writeFileSync(SLIDES_FILE, JSON.stringify(slides, null, 2));
};

app.get('/api/slides', (req, res) => {
    res.json(getSavedSlides());
});

app.get('/api/docs', (req, res) => {
    const logs = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8')) : [];
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
