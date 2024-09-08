"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFilePath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const dirInput = path_1.default.join(__dirname, 'inputs');
const dirOutput = path_1.default.join(__dirname, 'outputs');
if (!fs_1.default.existsSync(dirInput)) {
    fs_1.default.mkdirSync(dirInput);
}
if (!fs_1.default.existsSync(dirOutput)) {
    fs_1.default.mkdirSync(dirOutput);
}
const dirObject = {
    'inputs': dirInput,
    'outputs': dirOutput
};
const generateFilePath = (dirName) => {
    const jobId = (0, uuid_1.v4)();
    const filename = `${jobId}.txt`;
    const dir = dirObject[dirName];
    const filePath = path_1.default.join(dir, filename);
    return filePath;
};
exports.generateFilePath = generateFilePath;
