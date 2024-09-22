import { api } from "../../../api";
import { TestcaseUploadUrlsType } from "../types";

const createTestcase = (testcaseUrl: TestcaseUploadUrlsType, problemId: string, authToken: string) => {
    return api.post('api/v1/testcases', {
        problemId,
        type: testcaseUrl.type,
        input: testcaseUrl.inputUploadUrl,
        output: testcaseUrl.outputUploadUrl
    }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
}

export const createTestcases = async (testcaseUploadUrls: TestcaseUploadUrlsType[], problemId: string, authToken: string) => {
    const testcaseCreationRequests = testcaseUploadUrls.map(testcaseUploadUrl => createTestcase(testcaseUploadUrl, problemId, authToken));
    await Promise.all(testcaseCreationRequests);
}