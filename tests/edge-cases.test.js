const request = require("supertest");
const app = require("../src/app");

describe("Edge Cases & Error Handling", () => {
    let token;
    let projectId;

    beforeAll(async () => {
        // Setup a user and a project
        await request(app).post("/api/auth/register").send({
            name: "Edge User",
            email: "edge@example.com",
            password: "Password123!"
        });

        const login = await request(app).post("/api/auth/login").send({
            email: "edge@example.com",
            password: "Password123!"
        });
        token = login.body.data.token;

        const project = await request(app)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Edge Project" });
        projectId = project.body.data.id;
    });

    it("should return 401 Unauthorized if no token is provided", async () => {
        const response = await request(app).get("/api/projects");
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it("should handle invalid UUIDs gracefully without crashing", async () => {
        // Passing a non-UUID string where a projectId is expected
        const response = await request(app)
            .get("/api/projects/not-a-real-uuid/tasks")
            .set("Authorization", `Bearer ${token}`);

        // Prisma will throw an error, but your error middleware should catch it.
        // It should NOT be a 500 (Internal Server Error). 
        // Typically, it returns 400 (Bad Request) or 404 (Not Found).
        expect(response.statusCode).not.toBe(500);
        expect([400, 404]).toContain(response.statusCode);
    });

    it("should gracefully handle invalid pagination query parameters", async () => {
        const response = await request(app)
            .get(`/api/projects/${projectId}/tasks?page=abc&limit=-5`)
            .set("Authorization", `Bearer ${token}`);

        // Your express-validator should reject this with a 400,
        // OR your service should fallback to defaults (200).
        // It should NOT crash the server (500).
        expect(response.statusCode).not.toBe(500);
    });
});