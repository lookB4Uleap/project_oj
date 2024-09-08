"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const dirCodes = path_1.default.join(__dirname, 'codes');
if (!fs_1.default.existsSync(dirCodes)) {
    fs_1.default.mkdirSync(dirCodes);
}
const generateFile = (language, code) => {
    const jobId = (0, uuid_1.v4)();
    const filename = `${jobId}.${language}`;
    const filePath = path_1.default.join(dirCodes, filename);
    fs_1.default.writeFileSync(filePath, code);
    return filePath;
};
exports.generateFile = generateFile;
