import * as quizAttemptsDao from "./dao.js";

export default function QuizAttemptRoutes(app) {
    app.get("/api/attemptDetails/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const currentUser = req.session["currentUser"];
        const role = req.session["currentUser"]?.role;
        const details = await quizAttemptsDao.getAttemptDetails(quizId, currentUser._id, role);
        res.send(details);
    });

    app.put("/api/newAttempt/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const answers = req.body;
        const currentUser = req.session["currentUser"];
        const details = await quizAttemptsDao.newAttempt(quizId, currentUser._id, answers);
        res.send(details);
    })
}