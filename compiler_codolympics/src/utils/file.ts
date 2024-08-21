import fs from 'fs';
import path from "path";
import {v4 as uuid} from 'uuid';

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes);
}

export const generateFile = (language: string, code: string) => {
    const jobId = uuid();
    const filename = `${jobId}.${language}`;
    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, code);
    return filePath;
}