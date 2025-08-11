
import type QuizDetails from "./QuizDetails"

import type EditQuestions from "./EditQuestions"
export default interface EditQuiz{
    quizId :string;
    quizDetails: QuizDetails,
    questions: EditQuestions
}