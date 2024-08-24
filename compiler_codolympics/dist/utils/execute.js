"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCpp = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dirOutput = path_1.default.join(__dirname, 'outputs');
if (!fs_1.default.existsSync(dirOutput)) {
    fs_1.default.mkdirSync(dirOutput);
}
const executeCpp = (filePath) => {
    const jobId = path_1.default.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path_1.default.join(dirOutput, outputFilename);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ./${outputFilename}`, (error, stdout, stderr) => {
            if (error)
                reject(error);
            if (stderr)
                reject(stderr);
            resolve(stdout);
        });
    });
};
exports.executeCpp = executeCpp;
