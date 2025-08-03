import * as quizzesDao from "./dao.js";
export default function QuizzesRoutes(app) {
    app.get("/api/quizzes/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const quizzes = quizzesDao.getQuizzesByCourse(courseId);
        res.send(quizzes);
    });
    app.put("/api/quiz", async (req,res) => {
        const { quiz } = req.body;
        const newQuiz = quizzesDao.createQuiz(quiz);
        res.send(newQuiz);
    })
    app.get("/api/quiz/:quizId", async (req, res) => {
        const { quizId } = req.quizId;
        const role = req.session["currentUser"]?.role;
        const quiz = quizzesDao.getQuizById(quizId, role);
        res.send(quiz);
    });

}