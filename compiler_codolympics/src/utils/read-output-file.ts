import { readFileSync } from "fs"

export const readOutputFile = (outputFilePath: string) => {
    const output = readFileSync(outputFilePath,  'utf8');
    // console.log('[Output] ', output);
    return output;
}