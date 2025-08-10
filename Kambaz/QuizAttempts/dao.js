import {v4 as uuidv4} from "uuid";
import model from "./model.js";

export async function getAttemptDetails(quizId, userId) {
    const attemptDetails = await model.findOne({quiz: quizId, user: userId}).populate("quiz");
    if(attemptDetails === null || attemptDetails === undefined) {
        return null;
    }
    let score = 0;
    if(attemptDetails.quiz && attemptDetails.quiz.questions) {
        attemptDetails.quiz.questions.forEach(question => {
            const userAnswer = attemptDetails.answers.get(question.questionId);

            if (userAnswer && userAnswer === question.correctAnswers) {
                score += question.points
            }
        });
    }


    return {
        ... attemptDetails,
        score: score
    };
}

export async function newAttempt (quizId, userId, answers) {
    const attemptDetails = await model.findOne({quiz: quizId, user: userId});

    // new Attempt
    if(attemptDetails === null || attemptDetails === undefined) {
        const newAttempt = {
            _id: uuidv4(),
            noOfAttempts: 1,
            attemptDate: new Date(),
            quiz: quizId,
            user: userId,
            answers: answers
        }
        return model.create(newAttempt);
    }
    else {
        attemptDetails.noOfAttempts = attemptDetails.noOfAttempts + 1;
        attemptDetails.attemptDate = new Date();
        attemptDetails.asnwers = answers;
        return model.updateOne({ _id: attemptDetails._id }, attemptDetails);
    }
}