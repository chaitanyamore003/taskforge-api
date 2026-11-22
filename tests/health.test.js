const request = require("supertest");
const app = require("../src/app");

describe("Health Check API", () => {
    it("should return 200 OK", async () => {
        const response = await request(app).get("/api/health");

        // We expect the status code to be 200
        expect(response.statusCode).toBe(200);

        // Look at your health.routes.js to see what it returns, 
        // and update this expectation if needed.
        expect(response.body.success).toBe(true);
    });
});