import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app){
    app.delete("/api/enrollments/unEnroll", async (req, res) => {
        const details = req.body;
        console.log("details: ",details);
        const status = enrollmentsDao.unEnrollUserInCourse(details.userId, details.courseId);
        res.send(status);
    })
    app.put("/api/enrollments/enroll", async (req, res) => {
        const details = req.body;
        const status = enrollmentsDao.enrollUserInCourse(details.userId, details.courseId);
        res.send(status);
    })
}