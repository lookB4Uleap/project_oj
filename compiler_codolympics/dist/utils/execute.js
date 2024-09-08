"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.executeCode = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generate_code_file_1 = require("./generate-code-file");
const read_output_file_1 = require("./read-output-file");
var Languages;
(function (Languages) {
    Languages["c"] = "c";
    Languages["cpp"] = "cpp";
    Languages["py"] = "py";
})(Languages || (Languages = {}));
const dirOutput = path_1.default.join(__dirname, 'outputs');
if (!fs_1.default.existsSync(dirOutput)) {
    fs_1.default.mkdirSync(dirOutput);
}
const timeout = 5000;
const runCppCode = (filePath) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    const command = `g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`;
    return command;
};
const runCCode = (filePath) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    const command = `gcc ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`;
    return command;
};
const runPythonCode = (filePath) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const command = `python3 ${filePath}`;
    return command;
};
const getOutputPath = (filePath) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}_output.txt`;
    const outputFilePath = path_1.default.join(dirOutput, outputFilename);
    return outputFilePath;
};
const getCommand = (language, filePath) => {
    if (language === Languages.c)
        return runCCode(filePath);
    else if (language === Languages.cpp)
        return runCppCode(filePath);
    else if (language === Languages.py)
        return runPythonCode(filePath);
    return;
};
const executeCode = (language, filePath, inputFilePath) => {
    const command = getCommand(language, filePath);
    const outputFilePath = getOutputPath(filePath);
    let run = `${command}`;
    if (inputFilePath)
        run = `${command} < ${inputFilePath} >> ${outputFilePath}`;
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.exec)(`${run}`, { timeout }, (error, stdout, stderr) => {
            if (stderr)
                reject(stderr);
            if (error)
                reject(error);
            resolve({
                result: stdout,
                outputFilePath
            });
        });
    });
};
exports.executeCode = executeCode;
const execute = (language, code, inputFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = (0, generate_code_file_1.generateFile)(language, code);
        // const inputFilePath = generateInputFile(input);
        // const result = await executeCpp(filePath, input);
        console.log('[Code] ', { language, filePath, inputFilePath });
        const { result, outputFilePath } = yield (0, exports.executeCode)(language, filePath, inputFilePath);
        // console.log('[Run] Output', result);
        const output = (0, read_output_file_1.readOutputFile)(outputFilePath);
        return { success: true, result: output, error: null };
    }
    catch (error) {
        return { success: false, result: null, error };
    }
});
exports.execute = execute;
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
