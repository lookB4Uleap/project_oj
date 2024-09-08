"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const testcaseSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
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
const Testcase = (0, mongoose_1.model)('Testcase', testcaseSchema);
exports.default = Testcase;
