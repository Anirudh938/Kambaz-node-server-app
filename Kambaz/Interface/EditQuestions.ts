
import type Question from "./Question"

export default interface EditQuestions{
    quizId: String,
    deleteQuestionsIds:String[],
    updateQuestions : Question[],
    newQuestions : Question[]
}