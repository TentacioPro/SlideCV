import fs from 'fs';
import path from 'path';

const source = path.join('e:\\SlideCV\\resumes\\raw_resumes', 'Sunilkumar Resume Nov 2025.pdf');
const dest = path.join('e:\\SlideCV\\public', 'test_resume.pdf');

// Ensure public dir exists (Vite usually has it)
if (!fs.existsSync('e:\\SlideCV\\public')) {
    fs.mkdirSync('e:\\SlideCV\\public');
}

fs.copyFileSync(source, dest);
console.log(`Copied ${source} to ${dest}`);
