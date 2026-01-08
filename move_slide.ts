import fs from 'fs';
import path from 'path';
import os from 'os';

// Find the latest downloaded PNG file in the user's Downloads folder
// This is a heuristic since we can't control browser download path easily in headless
const downloadsDir = path.join(os.homedir(), 'Downloads');
const targetDir = 'e:\\SlideCV\\resumes\\slide_cv';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Find files starting with "Sunilkumar" (from resume name) and ending in .png
const files = fs.readdirSync(downloadsDir)
    .filter(f => f.includes('Sunilkumar') && f.endsWith('.png'))
    .map(f => ({ name: f, time: fs.statSync(path.join(downloadsDir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

if (files.length > 0) {
    const latestFile = files[0].name;
    const sourcePath = path.join(downloadsDir, latestFile);
    const destPath = path.join(targetDir, latestFile);
    
    fs.copyFileSync(sourcePath, destPath);
    // Optional: delete from downloads? Keeping it safe.
    console.log(`Moved ${latestFile} to ${targetDir}`);
} else {
    console.log("No matching downloaded file found.");
}
