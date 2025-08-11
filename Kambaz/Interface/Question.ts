export default interface Question{
        questionId?:String,
        questionTitle:String,
        questionDescription:String,
        questionType:String,
        possibleAnswers: String[],
        correctAnswers:String,
        points: number
}