"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
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
    verdict: String
}, {
    timestamps: true,
    collection: 'submissions'
});
submissionSchema.index({ problemId: 1, userId: 1 }, { unique: true });
const Submission = (0, mongoose_1.model)('Submission', submissionSchema);
exports.default = Submission;
