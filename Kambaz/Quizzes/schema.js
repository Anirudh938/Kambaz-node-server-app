import mongoose from "mongoose";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        ref: "CourseModel",
        required: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    details: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: "",
            required:false
        },
        dates: {
            availableFrom: {
                type: String,
                required: true
            },
            availableUntil: {
                type: String,
                required: true
            },
            dueDate: {
                type: String,
                required: true
            }
        },
        quizType: {
            type: String,
            required: true,
            default: "Graded Quiz"
        },
        assignmentGroup : {
            type: String,
            required: true,
            default: "ASSIGNMENTS"
        },
        options: {
           shuffleAnswers: {
               type: Boolean,
               required: false,
               default: false
           },
            noOfAttempts: {
               type: Number,
               required: false,
               default: 1
            },
            timeLimit: {
               type: Number,
                required: false,
                default: 20
            },
            questionLocked: {
                type: Boolean,
                required: false,
                default: false
            },
            showAnswers: {
               type: String,
                required: false,
                default: null
            },
             accessCode:    { type: String,  required: false, default: ""    } ,
               oneQuestionAtATime: {
                    type: Boolean,
                    required: false,
                    default: false
                },
            webCamRequired: {
                    type: Boolean,
                    required: false,
                    default: false
                }
        },
        assign: {
            type: String,
            required: false,
        }
    },
    questions: [{
        questionId: {
            type: String,
            required: true
        },
        questionTitle: {
            type: String,
            required: true
        },
        questionDescription: {
            type: String,
            required: true
        },
        questionType: {
            type: String,
            required: true,
            enum: ['multi-select', 'true-false', 'fill-in-blank']
        },
        possibleAnswers: [{
            type: String,
            required: true
        }],
        correctAnswers: [{
            type: String,
            required: true
        }],
        points: {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, {
    collection: 'quizzes'
});

export default schema;





