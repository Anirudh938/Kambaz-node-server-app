import {v4 as uuidv4} from "uuid";
import model from "./model.js";

export async function getQuizzesByCourse(courseId) {
    const quizzes = await model.find({courseId: courseId});
    return quizzes
        .map((quiz) => ({
            quizId: quiz._id,
            title: quiz.details.title,
            dates: quiz.details.dates,
            points: quiz.questions.reduce((total, question) => total + question.points, 0),
            noOfQuestions: quiz.questions.length
        }));
}

export async function getQuizById(quizId, role) {
    const quiz = await model.findOne({_id: quizId});
    if (!quiz) {
        return null;
    }
    let points = 0;
    const questionsWithConditionalAnswers = quiz.questions.map((question) => {
        points += question.points
        return {
            questionId: question.questionId,
            questionTitle: question.questionTitle,
            questionDescription: question.questionDescription,
            questionType: question.questionType,
            possibleAnswers: question.possibleAnswers,
            points: question.points,
            correctAnswers: role === "FACULTY" ? question.correctAnswers : null
        };
    });

    return {
        courseId: quiz.courseId,
        quizId: quiz._id,
        points: points,
        details: quiz.details,
        questions: questionsWithConditionalAnswers
    };
}

export function deleteQuizById(quizId) {
    return model.deleteOne({ _id: quizId });
}


export async function updateQuiz(quiz, courseId) {

    if ( quiz.quizId === null || quiz.quizId === undefined) {
        const newQuiz = {
            courseId: courseId,
            _id: uuidv4(),
            details: quiz.quizDetails,
            questions: quiz.questions.newQuestions
        }
        model.create(newQuiz)
        return newQuiz;
    }

    //updating an existing quiz
    else {
        const existingQuiz = await model.findOne({_id: quiz.quizId})

        existingQuiz.details = quiz.quizDetails;

        if(quiz.questions.deleteQuestionsIds !== []) {
            existingQuiz.questions = existingQuiz.questions.filter((q) => {
                return !quiz.questions.deleteQuestionsIds.includes(q.questionId);
            });
        }

        if(quiz.questions.updatedQuestions !== []) {
            const questionsMap = new Map();

            for (const question of quiz.questions.updatedQuestions) {
                if (question.questionId) {
                    questionsMap.set(question.questionId, question);
                }
            }

            existingQuiz.questions = existingQuiz.questions.map((q) => questionsMap.has(q.questionId) ? questionsMap.get(q.questionId) : q);
        }


        if(quiz.questions.newQuestions !== []) {
            existingQuiz.questions = [...existingQuiz.questions, ...quiz.questions.newQuestions]
        }

        return model.updateOne({ _id: quiz.quizId }, existingQuiz);
    }
}