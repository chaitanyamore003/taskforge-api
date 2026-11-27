const request = require("supertest");
const app = require("../src/app");

describe("Task Business Logic & Authorization", () => {
    let ownerToken;
    let memberToken;
    let projectId;
    let taskId;
    let memberId;

    const ownerUser = {
        name: "Logic Owner",
        email: "logicowner@example.com",
        password: "Password123!"
    };

    const memberUser = {
        name: "Logic Member",
        email: "logicmember@example.com",
        password: "Password123!"
    };

    // Setup: Create users, project, member, and one initial task
    beforeAll(async () => {
        // 1. Register & Login Owner
        await request(app).post("/api/auth/register").send(ownerUser);
        const ownerLogin = await request(app).post("/api/auth/login").send({
            email: ownerUser.email, password: ownerUser.password
        });
        ownerToken = ownerLogin.body.data.token;

        // 2. Register & Login Member
        await request(app).post("/api/auth/register").send(memberUser);
        const memberLogin = await request(app).post("/api/auth/login").send({
            email: memberUser.email, password: memberUser.password
        });
        memberToken = memberLogin.body.data.token;
        memberId = memberLogin.body.data.user.id;

        // 3. Create Project
        const projectRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ name: "Logic Project", description: "Testing business logic" });
        projectId = projectRes.body.data.id;

        // 4. Add Member to Project
        await request(app)
            .post(`/api/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ email: memberUser.email });

        // 5. Create an initial Task (status: TODO)
        const taskRes = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Logic Task",
                status: "TODO",
                priority: "MEDIUM",
                assigneeId: memberId
            });
        taskId = taskRes.body.data.id;
    });

    // --- 1. completedAt TRANSITIONS ---

    it("should set completedAt when status changes to DONE", async () => {
        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ status: "DONE" });

        expect(response.statusCode).toBe(200);
        expect(response.body.data.status).toBe("DONE");
        expect(response.body.data.completedAt).not.toBeNull();
    });

    it("should preserve completedAt when updating a DONE task without changing status", async () => {
        const initialCompletedAt = (await request(app)
            .get(`/api/projects/${projectId}/tasks`) // Fetching to get the timestamp
            .set("Authorization", `Bearer ${ownerToken}`))
            .body.data.tasks[0].completedAt;

        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Updated Logic Task Title" });

        expect(response.statusCode).toBe(200);
        expect(response.body.data.title).toBe("Updated Logic Task Title");
        // The timestamp should be exactly the same as before
        expect(response.body.data.completedAt).toBe(initialCompletedAt);
    });

    it("should reset completedAt to null when status changes from DONE to IN_PROGRESS", async () => {
        const response = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ status: "IN_PROGRESS" });

        expect(response.statusCode).toBe(200);
        expect(response.body.data.status).toBe("IN_PROGRESS");
        expect(response.body.data.completedAt).toBeNull();
    });

    // --- 2. FILTERING & PAGINATION ---

    it("should filter tasks by status", async () => {
        // Create a new TODO task so we have one IN_PROGRESS and one TODO
        await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Second Task", status: "TODO" });

        const response = await request(app)
            .get(`/api/projects/${projectId}/tasks?status=TODO`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(response.statusCode).toBe(200);
        // We should only get the TODO task back
        expect(response.body.data.tasks.length).toBe(1);
        expect(response.body.data.tasks[0].title).toBe("Second Task");
    });

    // --- 3. DELETION AUTHORIZATION ---

    it("should prevent a regular member from deleting the task", async () => {
        // The member tries to delete the task created by the owner
        const response = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(response.statusCode).toBe(403); // Forbidden
        expect(response.body.success).toBe(false);
    });

    it("should allow the project owner to delete the task", async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${ownerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
});