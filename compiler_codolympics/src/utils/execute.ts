import { exec } from 'child_process';
import { error } from 'console';
import fs from 'fs';
import path from "path";
import { stderr, stdout } from 'process';
import {v4 as uuid} from 'uuid';

const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput);
}

export const executeCpp = (filePath: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                if (stderr)
                    reject(stderr);
                resolve(stdout);
            }
        );
    });
}