const request = require("supertest");
const app = require("../src/app");

describe("Authentication API", () => {
    // We define a mock user to use across these tests
    const testUser = {
        name: "Test User",
        email: "testuser@example.com",
        password: "Password123!" // Make sure this matches your validator rules (e.g., min 6 chars)
    };

    // 1. Test Registration
    it("should register a new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        // Check HTTP status (201 Created is standard for registration)
        expect(response.statusCode).toBe(201);

        // Check the success flag
        expect(response.body.success).toBe(true);

        // Ensure the password hash is NOT returned in the response
        expect(response.body.data.passwordHash).toBeUndefined();
        expect(response.body.data.email).toBe(testUser.email);
    });

    // 2. Test Duplicate Registration
    it("should fail to register a user with an existing email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(testUser);

        // Your API correctly returns 409 Conflict for duplicates
        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
    });

    // 3. Test Successful Login
    it("should log in the user and return a JWT token", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        // Crucial: The API should return a token. 
        // (Check your auth.controller.js to see if it's named 'token' or 'accessToken')
        expect(response.body.data.token).toBeDefined();
        expect(typeof response.body.data.token).toBe("string");
    });

    // 4. Test Invalid Login
    it("should fail to log in with an incorrect password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: "WrongPassword123!"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });
});