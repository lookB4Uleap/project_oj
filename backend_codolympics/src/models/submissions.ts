import { model, Schema } from "mongoose";

export type SubmissionType = {
    problemId: string;
    userId: string;
    points: number;
    verdict: "Passed" | "Failed";
    tests: number;
    passed: number;
    code?: string;
    lang?: string;
}

const submissionSchema = new Schema<SubmissionType>({
    problemId: {
        type: String,
        required: true 
    },
    userId: {
        type: String,
        required: true
    },
    points: Number,
    tests: Number,
    passed: Number,
    verdict: String,
    code: String,
    lang: String
}, {
    timestamps: true,
    collection: 'submissions'
});

submissionSchema.index({problemId: 1, userId: 1}, {unique: true});

const Submission = model('Submission', submissionSchema);
export default Submission;
