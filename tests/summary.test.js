const request = require("supertest");
const app = require("../src/app");

describe("Project Summary API", () => {
    let ownerToken;
    let outsiderToken;
    let projectId;

    const ownerUser = {
        name: "Summary Owner",
        email: "summaryowner@example.com",
        password: "Password123!"
    };

    const outsiderUser = {
        name: "Summary Outsider",
        email: "summaryoutsider@example.com",
        password: "Password123!"
    };

    beforeAll(async () => {
        // 1. Register & Login Owner
        await request(app).post("/api/auth/register").send(ownerUser);
        const ownerLogin = await request(app).post("/api/auth/login").send({
            email: ownerUser.email, password: ownerUser.password
        });
        ownerToken = ownerLogin.body.data.token;

        // 2. Register & Login Outsider (Not part of the project)
        await request(app).post("/api/auth/register").send(outsiderUser);
        const outsiderLogin = await request(app).post("/api/auth/login").send({
            email: outsiderUser.email, password: outsiderUser.password
        });
        outsiderToken = outsiderLogin.body.data.token;

        // 3. Create Project
        const projectRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ name: "Summary Project" });
        projectId = projectRes.body.data.id;

        // 4. Create Tasks with different statuses and priorities
        // Task 1: TODO, HIGH
        await request(app).post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Task 1", status: "TODO", priority: "HIGH" });

        // Task 2: DONE, LOW
        await request(app).post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Task 2", status: "DONE", priority: "LOW" });

        // Task 3: DONE, HIGH
        await request(app).post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Task 3", status: "DONE", priority: "HIGH" });
    });

    it("should return correct task counts for the project", async () => {
        const response = await request(app)
            .get(`/api/projects/${projectId}/summary`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        const summary = response.body.data;

        // Total tasks
        expect(summary.totalTasks).toBe(3);

        // Status counts
        expect(summary.statusCounts.TODO).toBe(1);
        expect(summary.statusCounts.DONE).toBe(2);
        expect(summary.statusCounts.IN_PROGRESS).toBe(0); // Should default to 0

        // Priority counts
        expect(summary.priorityCounts.HIGH).toBe(2);
        expect(summary.priorityCounts.LOW).toBe(1);
        expect(summary.priorityCounts.MEDIUM).toBe(0);
    });

    it("should deny access to a non-member (outsider)", async () => {
        const response = await request(app)
            .get(`/api/projects/${projectId}/summary`)
            .set("Authorization", `Bearer ${outsiderToken}`);

        // Should be 403 Forbidden or 404 Not Found depending on your service logic
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
});