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

export function deleteQuizById(quizId) {
    const { quizzes } = Database;
    Database.quizzes = quizzes.filter((quiz) => quiz.quizId !== quizId);
}


export function updateQuiz(quiz, courseId) {

    let { quizzes } = Database;
    //create a new quiz
    if ( quiz.quizId === null || quiz.quizId === undefined) {
        const newQuiz = {
            courseId: courseId,
            quizId: uuidv4(),
            details: quiz.quizDetails,
            questions: quiz.questions.newQuestions
        }
        Database.quizzes = [...quizzes, newQuiz];
        return newQuiz;
    }

    //updating an existing quiz
    else {
        const existingQuiz = quizzes.find((q)=>(q.quizId === quiz.quizId && q.courseId === courseId));
        quizzes = quizzes.filter((q)=> q.quizId !== quiz.quizId);

        existingQuiz.details = quiz.quizDetails;

        if(quiz.questions.deleteQuestionsIds !== null) {
            existingQuiz.questions = existingQuiz.questions.filter((q) => {
                return !quiz.questions.deleteQuestionsIds.includes(q.questionId);
            });
        }

        if(quiz.questions.updatedQuestions !== null) {
            const questionsMap = new Map();

            for (const question of quiz.questions.updatedQuestions) {
                if (question.questionId) {
                    questionsMap.set(question.questionId, question);
                }
            }

            existingQuiz.questions = existingQuiz.questions.map((q) => questionsMap.has(q.questionId) ? questionsMap.get(q.questionId) : q);
        }


        if(quiz.questions.newQuestions !== null) {
            existingQuiz.questions = [...existingQuiz.questions, ...quiz.questions.newQuestions]
        }

        Database.quizzes = [...quizzes, existingQuiz];
        return existingQuiz;
    }
}