import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from "path";
import { stdin } from 'process';
import { generateFile } from './generate-code-file';
import { generateInputFile } from './generate-input-file';
import { readOutputFile } from './read-output-file';

type OutputType = {
    result: string,
    outputFilePath: string
}

enum Languages {
    c = 'c',
    cpp = 'cpp',
    py = 'py'
}

const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput);
}

const timeout = 5000;

const runCppCode = (filePath: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    const command = `g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`;
    return command;
}

const runCCode = (filePath: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(dirOutput, outputFilename);
    const command = `gcc ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`;
    return command;
}

const runPythonCode = (filePath: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const command = `python3 ${filePath}`;
    return command;
}

const getOutputPath = (filePath: string) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}_output.txt`
    const outputFilePath = path.join(dirOutput, outputFilename);
    return outputFilePath;
}

const getCommand = (language: string, filePath: string) => {
    if (language === Languages.c)
        return runCCode(filePath);
    else if (language === Languages.cpp)
        return runCppCode(filePath);
    else if (language === Languages.py)
        return runPythonCode(filePath);
    return;
} 

export const executeCode = (language: string, filePath: string, inputFilePath?: string) : Promise<OutputType> => {
    const command = getCommand(language, filePath);
    const outputFilePath = getOutputPath(filePath);
    let run = `${command}`;

    if (inputFilePath)
        run = `${command} < ${inputFilePath} >> ${outputFilePath}`

    return new Promise((resolve, reject) => {
        const child = exec(
            `${run}`, { timeout }, (error, stdout, stderr) => {
                if (stderr)
                    reject(stderr);
                if (error)
                    reject(error);
                resolve({
                    result: stdout,
                    outputFilePath
                });
            }
        );
    });
}

export const execute = async (language: string, code: string, inputFilePath?: string) => {
    try {
        const filePath = generateFile(language, code);
        // const inputFilePath = generateInputFile(input);
        // const result = await executeCpp(filePath, input);
        console.log('[Code] ', {language, filePath, inputFilePath});
        const {result, outputFilePath} = await executeCode(language, filePath, inputFilePath);
        // console.log('[Run] Output', result);
        const output = readOutputFile(outputFilePath);
        return { success: true, result: output, error: null };
    }
    catch (error: any) {
        return { success: false, result: null, error };
    }
}

// export const executeCode = (language: string, filePath: string, inputs?: string) => {
//     const command = getCommand(language, filePath);
//     return new Promise((resolve, reject) => {
//         const child = exec(
//             `${command}`, { timeout }, (error, stdout, stderr) => {
//                 if (stderr)
//                     reject(stderr);
//                 if (error)
//                     reject(error);
//                 resolve(stdout);
//             }
//         );

//         if (inputs)
//             child.stdin?.write(inputs + "\n");
//         child.on('close', () => console.log('[Child] Process ended'));
//     });
// }