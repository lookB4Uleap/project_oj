import { api } from "../../../api";
import { TestcaseType, TestcaseUploadUrlsType,  } from "../types";


const requestUploadUrl = (authToken: string) => {
    console.log(authToken);
    const request = api.get('/api/v1/testcases/upload', {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
    return request;
}

const getUploadUrl = (_: TestcaseType, authToken: string) => {
    const inputUploadUrl = requestUploadUrl(authToken);
    const outputUploadUrl = requestUploadUrl(authToken);
    return Promise.all([inputUploadUrl, outputUploadUrl]);
}

export const getUploadUrls = async (testcases: TestcaseType[], authToken: string): Promise<TestcaseUploadUrlsType[]> => {
    const uploadUrls = testcases.map(testcase => getUploadUrl(testcase, authToken)); 
    const testcaseUploadUrlsPromise = await Promise.all(uploadUrls);
    const testcaseUploadUrls = await Promise.all(testcaseUploadUrlsPromise.map(async (urls, index) => {
        const [inputUploadResponse, outputUploadResponse] = await Promise.all(urls);
        const inputUploadUrl: string = inputUploadResponse.data.url;
        const outputUploadUrl: string = outputUploadResponse.data.url;
        const type = testcases[index].type ?? "visible";
        return {inputUploadUrl, outputUploadUrl, type};
    }));
    return testcaseUploadUrls;
}