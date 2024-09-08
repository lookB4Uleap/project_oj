import fs from 'fs';
import path from "path";
import {v4 as uuid} from 'uuid';

type DirType = {
    [key: string]: string;
}

const dirInput = path.join(__dirname, 'inputs');
const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirInput)) {
    fs.mkdirSync(dirInput);
}

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput);
}

const dirObject: DirType = {
    'inputs': dirInput,
    'outputs': dirOutput
}

export const generateFilePath = (dirName: string) => {
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const dir = dirObject[dirName];
    const filePath = path.join(dir, filename);
    return filePath;
}