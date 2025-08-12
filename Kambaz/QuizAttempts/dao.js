import {v4 as uuidv4} from "uuid";
import model from "./model.js";
export async function getAttemptDetails(quizId, userId) {
  const doc = await model
    .findOne({ quiz: quizId, user: userId })
    .populate("quiz");

  if (!doc) return null;

  let score = 0;
  const qs = (doc.quiz && doc.quiz.questions) ? doc.quiz.questions : [];
  for (const q of qs) {
    const ua = doc.answers instanceof Map
      ? doc.answers.get(q.questionId)
      : (doc.answers?.[q.questionId] ?? null);
    if (ua && ua === q.correctAnswers) score += q.points;
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
        attemptDetails.answers = answers;
        return model.updateOne({ _id: attemptDetails._id }, attemptDetails);
    }
}