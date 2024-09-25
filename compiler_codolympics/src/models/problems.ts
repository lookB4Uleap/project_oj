import { model, Schema } from "mongoose";

export type TestCaseInputOutputType = {
    input: string;
    output: string;
}

export type ProblemType = {
    _id?: string;
    problemTitle: string;
    problemDescription: string;
    inputDescription: string;
    outputDescription: string;
    sampleTestCases?: TestCaseInputOutputType[];
    points: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const problemSchema = new Schema<ProblemType>({
    problemTitle: {
        type: String,
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    inputDescription: {
        type: String,
        required: true
    },
    outputDescription: {
        type: String,
        required: true
    },
    sampleTestCases: [{
        input: String,
        output: String
    }],
    points: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'problems'
});

const Problem = model('Problem', problemSchema);

export default Problem;