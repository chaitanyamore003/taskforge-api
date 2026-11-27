# AI Usage

## Overview
I used ChatGPT as a coding assistant, mentor, and code reviewer during the development of TaskForge. I did not rely on it to blindly generate the entire project. Instead, I used it to learn, debug, and implement features step-by-step.

## Areas of Assistance
*   **Architecture Design:** Discussed best practices for a layered MVC + Service architecture.
*   **Database Schema:** Reviewed the Prisma schema and relations (User, Project, Task, ProjectMember).
*   **Business Logic:** Assisted in writing the `completedAt` transition logic (e.g., setting to null when moving from DONE to IN_PROGRESS).
*   **Automated Testing:** Guided the setup of Jest and Supertest, including database cleanup strategies and writing test cases for authorization and filtering.
*   **Code Review:** Used AI to catch edge cases (e.g., ensuring pagination values are converted from strings to integers using `Number()` to prevent Prisma errors).

## Manual Work & Testing
*   I manually wrote and verified the controllers, services, and routes.
*   I manually tested all endpoints using Postman to ensure the API behaves correctly.
*   I reviewed all AI-generated code to ensure it follows the project's conventions and security requirements.

## Independent Decisions
*   Chose to return `404 Not Found` instead of `403 Forbidden` for unauthorized project access to prevent resource enumeration attacks.
*   Structured the error handling middleware to ensure Prisma errors do not expose stack traces to the client.