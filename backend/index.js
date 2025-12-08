const express = require("express");
const cors = require("cors"); // Add this line
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const SQL = require("sql-template-strings");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function openDb(dbName) {
    const filename =
        process.env.NODE_ENV === "test"
            ? ":memory:" // In-memory DB for tests
            : dbName; // File DB for development

    const db = await open({
        filename: filename,
        driver: sqlite3.Database,
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status INTEGER,
            due TEXT NOT NULL
        )
    `);

    return db;
}

//test route, hello world
app.route("/").get(function (req, res) {
    return res.status(200).json({
        success: true,
        data: "Hello World",
    });
});

//get all tasks from the database
app.route("/tasks").get(async function (req, res) {
    let db;
    try {
        db = await openDb("./tasks.db");
        let result = await db.all(`SELECT * FROM tasks`);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve tasks",
            error: err,
        });
    } finally {
        db.close();
    }
});

// POST new task to the database
app.route("/tasks").post(async function (req, res) {
    let db;
    try {
        db = await openDb("./tasks.db");
        const { title, description, status, due } = req.body;
        //validate the requests
        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }
        if (!due) {
            return res.status(400).json({
                success: false,
                message: "Due date/ time is required",
            });
        }
        const dueDate = new Date(due);
        const now = new Date();
        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DDTHH:mm",
            });
        }
        if (dueDate <= now) {
            return res.status(400).json({
                success: false,
                message: "Due date/time must be in the future",
            });
        }
        // add new task to database
        let addTask = SQL`INSERT INTO tasks(title,description,status,due) VALUES(${title},${description},${status},${due})`;
        let resultAdd = await db.run(addTask);
        // retrieve the added task with it's new id
        let getAddedTask = SQL`SELECT * FROM tasks WHERE id = ${resultAdd.lastID}`;
        let resultGet = await db.get(getAddedTask);
        return res.status(200).json({
            success: true,
            data: resultGet,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to add new task",
            error: err,
        });
    } finally {
        db.close();
    }
});

module.exports = { app };

if (require.main === module) {
    app.listen(8080, function () {
        console.log(`Server listening on 8080`);
    });
}
