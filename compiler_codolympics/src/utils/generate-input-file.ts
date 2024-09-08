import fs from 'fs';
import path from "path";
import {v4 as uuid} from 'uuid';

const dirInput = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInput)) {
    fs.mkdirSync(dirInput);
}

export const generateFilePath = () => {
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const filePath = path.join(dirInput, filename);
    return filePath;
}

export const generateInputFile = (input?: string) => {
    if (!input) 
        return;
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const filePath = path.join(dirInput, filename);
    fs.writeFileSync(filePath, input);
    return filePath;
}