"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOutputFile = void 0;
const fs_1 = require("fs");
const readOutputFile = (outputFilePath) => {
    const output = (0, fs_1.readFileSync)(outputFilePath, 'utf8');
    // console.log('[Output] ', output);
    return output;
};
exports.readOutputFile = readOutputFile;
