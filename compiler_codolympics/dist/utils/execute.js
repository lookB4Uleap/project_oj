"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePython = exports.executeC = exports.executeCpp = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dirOutput = path_1.default.join(__dirname, 'outputs');
if (!fs_1.default.existsSync(dirOutput)) {
    fs_1.default.mkdirSync(dirOutput);
}
const executeCpp = (filePath, inputs) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        var _a;
        const child = (0, child_process_1.exec)(`g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
            if (stderr)
                reject(stderr);
            if (error)
                reject(error);
            resolve(stdout);
        });
        if (inputs)
            (_a = child.stdin) === null || _a === void 0 ? void 0 : _a.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
};
exports.executeCpp = executeCpp;
const executeC = (filePath, inputs) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        var _a;
        const child = (0, child_process_1.exec)(`gcc ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
            if (stderr)
                reject(stderr);
            if (error)
                reject(error);
            resolve(stdout);
        });
        if (inputs)
            (_a = child.stdin) === null || _a === void 0 ? void 0 : _a.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
};
exports.executeC = executeC;
const executePython = (filePath, inputs) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        var _a;
        const child = (0, child_process_1.exec)(`python3 ${filePath}`, (error, stdout, stderr) => {
            if (stderr)
                reject(stderr);
            if (error)
                reject(error);
            resolve(stdout);
        });
        if (inputs)
            (_a = child.stdin) === null || _a === void 0 ? void 0 : _a.write(inputs + "\n");
        child.on('close', () => console.log('[Child] Process ended'));
    });
};
exports.executePython = executePython;
