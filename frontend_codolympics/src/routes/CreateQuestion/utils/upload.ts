import { api } from "../../../api";
import { TestcaseType, TestcaseUploadUrlsType } from "../types";

const uploadFile = (url: string, file: File) => {
    return api.put(url, file);
};

export const uploadFiles = async(
    testcases: TestcaseType[],
    testcaseUploadUrls: TestcaseUploadUrlsType[]
) => {
    const uploadFilesRequest:Promise<any>[] = [];
    testcaseUploadUrls.map((urls: TestcaseUploadUrlsType, index: number) => {
        const inputFile = testcases[index].inputFile;
        const outputFile = testcases[index].outputFile;
        if (!inputFile || !outputFile) return;
        uploadFilesRequest.push(uploadFile(urls.inputUploadUrl, inputFile));
        uploadFilesRequest.push(uploadFile(urls.outputUploadUrl, outputFile));
    });
    await Promise.all(uploadFilesRequest);
};
