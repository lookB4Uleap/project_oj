"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInputFile = exports.generateFilePath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const dirInput = path_1.default.join(__dirname, 'inputs');
if (!fs_1.default.existsSync(dirInput)) {
    fs_1.default.mkdirSync(dirInput);
}
const generateFilePath = () => {
    const jobId = (0, uuid_1.v4)();
    const filename = `${jobId}.txt`;
    const filePath = path_1.default.join(dirInput, filename);
    return filePath;
};
exports.generateFilePath = generateFilePath;
const generateInputFile = (input) => {
    if (!input)
        return;
    const jobId = (0, uuid_1.v4)();
    const filename = `${jobId}.txt`;
    const filePath = path_1.default.join(dirInput, filename);
    fs_1.default.writeFileSync(filePath, input);
    return filePath;
};
exports.generateInputFile = generateInputFile;
