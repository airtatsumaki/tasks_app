const request = require("supertest");
const { app, clearDB } = require("../index"); // ✓ Destructure!

// Clear database before EACH test (for isolation)
beforeEach(async function () {
  await clearDB();
});

// Test root route for hello world
describe("GET /", function () {
  test("should return Hello World message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toBe("Hello World");
  });
});

// Add post multiple tasks and check they are all stored in the database
describe("GET /tasks", function () {
  test("should return 3 created tasks", async () => {
    const allTasks = [
      { title: "Task 1", description: "First", status: 0, due: "123" },
      { title: "Task 2", description: "Second", status: 1, due: "456" },
      { title: "Task 3", description: "Third", status: 0, due: "789" },
    ];
    for (const task of allTasks) {
      await request(app).post("/tasks").send(task);
    }
    const response = await request(app).get("/tasks");
    expect(response.statusCode).toBe(200);
    allTasks.forEach(function (task) {
      const found = response.body.data.find(function (t) {
        return t.title === task.title;
      });
      expect(found).toMatchObject(task);
    });
  });
});

describe("POST /tasks", function () {
  test("should return the posted task", async () => {
    const objTask = {
      title: "TEST TASK",
      description: "TO THIS TEST",
      status: 0,
      due: "1234",
    };
    const response = await request(app).post("/tasks").send(objTask);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject(objTask);
  });
});
