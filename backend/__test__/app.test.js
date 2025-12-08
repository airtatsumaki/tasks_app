const request = require("supertest");
const { app } = require("../index");

// Date functions
function getFutureDate(daysFromNow = 1) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().slice(0, 16);
}

function getPastDate(daysAgo = 1) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 16);
}

// Test root route for hello world
describe("GET /", function () {
    test("should return Hello World message", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBe("Hello World");
    });
});

// Test post routes
describe("POST /tasks", function () {
    test("should return the posted task, all params valid", async () => {
        const objTask = {
            title: "TEST TASK",
            description: "TO THIS TEST",
            status: 0,
            due: getFutureDate(1),
        };
        const response = await request(app).post("/tasks").send(objTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject(objTask);
    });

    test("should return task as description is optional", async () => {
        const objTask = {
            title: "this has a title",
            description: "",
            status: 0,
            due: getFutureDate(1),
        };
        const response = await request(app).post("/tasks").send(objTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject(objTask);
    });

    test("should return error since title is missing from the task", async () => {
        const objTask = {
            title: "",
            description: "this should fail",
            status: 0,
            due: getFutureDate(1),
        };
        const response = await request(app).post("/tasks").send(objTask);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Title is required");
    });

    test("should return error since due date is empty string", async () => {
        const objTask = {
            title: "this has a title",
            description: "this should fail",
            status: 0,
            due: "",
        };
        const response = await request(app).post("/tasks").send(objTask);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Due date/ time is required");
    });

    test("should return error since due date is missing", async () => {
        const objTask = {
            title: "this has a title",
            description: "this should fail",
            status: 0,
        };
        const response = await request(app).post("/tasks").send(objTask);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Due date/ time is required");
    });
});
