import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from "path";

const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput);
}

export const executeCpp = (filePath: string, inputs?: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        const child = exec(
            `g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
                if (stderr)
                    reject(stderr);
                if (error)
                    reject(error);
                resolve(stdout);
            }
        );

        if (inputs)
            child.stdin?.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
}

export const executeC = (filePath: string, inputs?: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        const child = exec(
            `gcc ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
                if (stderr)
                    reject(stderr);
                if (error)
                    reject(error);
                resolve(stdout);
            }
        );

        if (inputs)
            child.stdin?.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
}

export const executePython = (filePath: string, inputs?: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        const child = exec(
            `python3 ${filePath}`, (error, stdout, stderr) => {
                if (stderr)
                    reject(stderr);
                if (error)
                    reject(error);
                resolve(stdout);
            }
        );

        if (inputs)
            child.stdin?.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
}