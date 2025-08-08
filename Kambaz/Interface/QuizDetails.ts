export default interface QuizDetails{

    quizId :string;
    Details : {
        title: string;
        description : string;
        dates:{
            availableFrom: Date;
            availableUntil : Date;
            dueDate: Date;
        }
    }
    multipleAttempts: boolean;
    numberOfAttempts: Number;
}