import {v4 as uuidv4} from "uuid";
import model from "./model.js";
import quizModel from "../Quizzes/model.js";
export async function getAttemptDetails(quizId, userId) {
  const doc = await model
    .findOne({ quiz: quizId, user: userId })
    .populate("quiz");

  if (!doc) return null;

  let score = 0;
  const qs = (doc.quiz && doc.quiz.questions) ? doc.quiz.questions : [];

  const showAnswersDate = doc.quiz?.details?.options?.showAnswers
      ? new Date(doc.quiz.details.options.showAnswers)
      : null;

  const now = new Date();

    const shouldShowAnswers = !showAnswersDate || now > showAnswersDate;

  for (const q of qs) {
    const ua = doc.answers instanceof Map
      ? doc.answers.get(q.questionId)
      : (doc.answers?.[q.questionId] ?? null);
    if (ua ) {
        const correctAnswersSet = new Set(Array.isArray(q.correctAnswers) ? q.correctAnswers : [q.correctAnswers]);
        const userAnswerSet = new Set(Array.isArray(ua) ? ua : [ua]);
        if(q.questionType === 'fill-in-blank') {
            const isSubset = [...userAnswerSet].every(answer => correctAnswersSet.has(answer));
            if (isSubset) {
                score += q.points;
            }
        }
        else {

            if (userAnswerSet.size === correctAnswersSet.size) {
                const difference = new Set([...userAnswerSet].filter(x => !correctAnswersSet.has(x)));
                if (difference.size === 0) {
                    score += q.points;
                }
            }
        }
    }

    if(!shouldShowAnswers){
        q.correctAnswers = null;
    }
  }

  let answersObj = {};
  if (doc.answers instanceof Map) {
    answersObj = {};
    for (const [k, v] of doc.answers.entries()) {
      answersObj[k] = v;
    }
  } else if (doc.answers && typeof doc.answers === "object") {
    answersObj = doc.answers;
  }

  const raw = doc.toObject();   
  raw.answers = answersObj;    
  raw.score = score;
  return raw;
}

export async function newAttempt (quizId, userId, answers) {
    const attemptDetails = await model.findOne({quiz: quizId, user: userId});
    if(attemptDetails === null || attemptDetails === undefined) {
        const newAttempt = {
            _id: uuidv4(),
            noOfAttempts: 1,
            attemptDate: new Date(),
            quiz: quizId,
            user: userId,
            answers: answers
        }
        await model.create(newAttempt);
    }
    else {
        attemptDetails.noOfAttempts = attemptDetails.noOfAttempts + 1;
        attemptDetails.attemptDate = new Date();
        attemptDetails.answers = answers;
        await model.updateOne({ _id: attemptDetails._id }, attemptDetails);
    }
    const quiz = await quizModel.findOne({_id: quizId});
    let score = 0;
    let points = 0
    const answersMap = new Map(Object.entries(answers));
    quiz.questions.forEach( question => {
        const userAnswer = answersMap.get(question.questionId);
        const correctAnswers = question.correctAnswers;
        const correctAnswersSet = new Set(Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]);
        const userAnswerSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
        if(question.questionType === 'fill-in-blank') {
            const isSubset = [...userAnswerSet].every(answer => correctAnswersSet.has(answer));
            if (isSubset) {
                score += question.points;
            }
        }
        else {

            if (userAnswerSet.size === correctAnswersSet.size) {
                const difference = new Set([...userAnswerSet].filter(x => !correctAnswersSet.has(x)));
                if (difference.size === 0) {
                    score += question.points;
                }
            }
        }

        points += question.points;
    })
    return { score: score, points: points}
}