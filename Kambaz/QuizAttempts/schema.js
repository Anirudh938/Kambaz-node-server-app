import mongoose from "mongoose";
const attemptSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        noOfAttempts: {
            type: Number,
            default: 0
        },
        attemptDate: {
            type: Date,
            required: true
        },
        quiz: {
            type: String,
            ref: "QuizModel",
            required: true
        },
        user: {
            type: String,
            ref: "UserModel",
            required: true },
        answers: {
            type: Map,
            of: String,
            default: new Map()
        }
    }, {
        collection: 'attempts'
    }
);
export default attemptSchema;