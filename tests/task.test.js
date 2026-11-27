const request = require("supertest");
const app = require("../src/app");

describe("Task API", () => {
    let ownerToken;
    let projectId;

    // We will store these IDs to use later for authorization tests
    let projectOwnerId;
    let memberId;

    const ownerUser = {
        name: "Task Owner",
        email: "taskowner@example.com",
        password: "Password123!"
    };

    const memberUser = {
        name: "Task Member",
        email: "taskmember@example.com",
        password: "Password123!"
    };

    // 1. SETUP: Create users, login, create a project, and add the member
    beforeAll(async () => {
        // Register Owner & Member
        await request(app).post("/api/auth/register").send(ownerUser);
        await request(app).post("/api/auth/register").send(memberUser);

        // Login Owner
        const ownerLogin = await request(app).post("/api/auth/login").send({
            email: ownerUser.email,
            password: ownerUser.password
        });
        ownerToken = ownerLogin.body.data.token;
        projectOwnerId = ownerLogin.body.data.user.id; // Assuming your login returns the user object

        // Login Member to get their ID
        const memberLogin = await request(app).post("/api/auth/login").send({
            email: memberUser.email,
            password: memberUser.password
        });
        memberId = memberLogin.body.data.user.id;

        // Create Project
        const projectRes = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                name: "Task Test Project",
                description: "Project to test tasks."
            });
        projectId = projectRes.body.data.id;

        // Add Member to Project
        await request(app)
            .post(`/api/projects/${projectId}/members`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                email: memberUser.email // Check your project.controller.js to see if it takes email or userId!
            });
    });

    // 2. Test Create Task
    it("should create a task successfully", async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Write Automated Tests",
                description: "Use Jest and Supertest to test the API.",
                status: "TODO",
                priority: "HIGH",
                assigneeId: memberId // Assigning to the member
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Write Automated Tests");
        expect(response.body.data.assigneeId).toBe(memberId);
    });

    // 3. Test Invalid Task Validation
    it("should fail to create a task with invalid status", async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Invalid Task",
                status: "NOT_A_REAL_STATUS", // Invalid
                priority: "HIGH"
            });

        // Expect a 400 validation error
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
});