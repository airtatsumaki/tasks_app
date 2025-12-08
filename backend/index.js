const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const SQL = require("sql-template-strings");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function openDb(dbName) {
    return open({
        filename: dbName,
        driver: sqlite3.Database,
    });
}

(async function () {
    let db;
    try {
        db = await openDb("./backend/tasks.db");
        // const drop = "DROP TABLE IF EXISTS tasks";
        // let result = await db.exec(drop);
        const query = `CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status INTEGER,
    due TEXT NOT NULL)`;
        result = await db.exec(query);
    } catch (error) {
        console.error(error);
    } finally {
        db.close();
    }
})();

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
        db = await openDb("./backend/tasks.db");
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

// POST new tasks to the database
app.route("/tasks").post(async function (req, res) {
    let db;
    try {
        db = await openDb("./backend/tasks.db");
        const { title, description, status, due } = req.body;
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

async function clearDB() {
    let db;
    try {
        db = await openDb("./backend/tasks.db");
        await db.exec("DELETE FROM tasks");
        const remainingTasks = await db.all("SELECT * FROM tasks");
        return remainingTasks.length === 0;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        db.close();
    }
}

module.exports = { app, clearDB };

if (require.main === module) {
    app.listen(8080, function () {
        console.log(`Server listening on 8080`);
    });
}
