"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const problemSchema = new mongoose_1.Schema({
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
const Problem = (0, mongoose_1.model)('Problem', problemSchema);
exports.default = Problem;
