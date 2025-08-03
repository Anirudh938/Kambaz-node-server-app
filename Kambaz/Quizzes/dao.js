import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

export function createQuiz(quiz) {
    const newQuiz = { ...quiz, quizId: uuidv4() }
    Database.quizzes = [...Database.quizzes, newQuiz]
    return newQuiz
}

export function getQuizzesByCourse(courseId) {
    const { quizzes } = Database;
    return quizzes
        .filter((quiz) => quiz.courseId === courseId)
        .map((quiz) => ({
            quizId: quiz.quizId,
            title: quiz.details.title,
            dates: quiz.details.dates,
            points: quiz.questions.reduce((total, question) => total + question.points, 0),
            noOfQuestions: quiz.questions.length
        }));
}

export function getQuizById(quizId, role) {
    const { quizzes } = Database;
    const quiz = quizzes.find((quiz) => quiz.quizId === quizId);

    if (!quiz) {
        return null;
    }
    const questionsWithConditionalAnswers = quiz.questions.map((question) => {
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
        quizId: quiz.quizId,
        details: quiz.details,
        questions: questionsWithConditionalAnswers
    };
}