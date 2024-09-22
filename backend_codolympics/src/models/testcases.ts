import { model, Schema } from "mongoose";

export type TestcaseType = {
    _id?: string;
    problemId: string;
    type: "sample" | "hidden" | "visible";
    points: number;
    input: string;
    output: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const testcaseSchema = new Schema<TestcaseType>({
    problemId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: "visible"
    },
    points: Number,
    input: String,
    output: String
}, {
    timestamps: true,
    collection: 'testcases'
});

const Testcase = model('Testcase', testcaseSchema);
export default Testcase;