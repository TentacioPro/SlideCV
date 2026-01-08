# SlideCV - AI-Powered Resume to Slide Converter

SlideCV is a modern web application that transforms standard resumes (PDF/DOCX) into professional, infographic-style presentation slides using AI.

![SlideCV Preview](./slidecv-preview.png)

## 🚀 Features

- **AI Analysis**: Uses Groq (Llama 3.3) to intelligently extract and summarize key profile data.
- **Smart Layouts**: Automatically formats content into a clean, presentation-ready slide.
- **History & Persistence**: Saves generated slides locally for easy retrieval.
- **Interactive Preview**: View, review, and download your slides.
- **Modern UI**: Built with React, TailwindCSS, and Framer Motion for a smooth experience.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, Multer
- **AI Engine**: Groq API (Llama-3.3-70b-versatile)
- **Storage**: Local JSON-based persistent storage

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Groq API Key

### 1. Clone the Repository

```bash
git clone https://github.com/TentacioPro/SlideCV.git
cd SlideCV
```

### 2. Configure Environment

Create a `.env` file in the root directory (or use `.env.example` as a template):

```env
# Server (.env)
GROQ_API_KEY=your_groq_api_key_here

# Client (.env in client root, if needed, though strictly server uses the key)
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Install Dependencies

**Client:**

```bash
cd client
npm install
```

**Server:**

```bash
cd ../server
npm install
```

### 4. Run the Application

You need to run both the client and server terminals.

**Terminal 1 (Server):**

```bash
cd server
npm run dev
```

_Server runs on http://localhost:5000_

**Terminal 2 (Client):**

```bash
cd client
npm run dev
```

_Client runs on http://localhost:5173_

## 📁 Project Structure

```
SlideCV/
├── client/                 # React Frontend
│   ├── src/components/     # UI Components (SlidePreview, History, etc.)
│   └── ...
├── server/                 # Express Backend
│   ├── custom_modules/     # Internal logic
│   └── server.ts           # Main entry point & API routes
├── resumes/
│   └── slide_cv/          # Storage for generated slide JSONs
└── ...
```

## 📝 License

MIT License - Crafted by Abishek
