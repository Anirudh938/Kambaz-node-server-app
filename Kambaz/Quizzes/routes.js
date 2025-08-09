import * as quizzesDao from "./dao.js";
import {changeQuizStatus} from "./dao.js";
export default function QuizzesRoutes(app) {
    app.get("/api/quizzes/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await quizzesDao.getQuizzesByCourse(courseId);
        res.send(quizzes);
    });
    app.get("/api/quiz/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const role = req.session["currentUser"]?.role;
        const quiz = await quizzesDao.getQuizById(quizId, role);
        res.send(quiz);
    });
    app.delete("/api/quiz/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const status = await quizzesDao.deleteQuizById(quizId);
        res.send(status);
    });

    app.put("/api/updateQuiz/:courseId", async (req, res) => {
        const { courseId } = req.params
        const quiz = req.body;
        const updatedQuiz = quizzesDao.updateQuiz(quiz, courseId);
        res.send(updatedQuiz);
    })
    app.put("/api/updateStatus", async (req,res) => {
        const details = req.body;
        await quizzesDao.changeQuizStatus(details.quizId, details.status);
    })
}