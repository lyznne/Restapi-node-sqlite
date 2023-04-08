const sqlite3 = require('sqlite3').verbose()
const md5 = require("md5")


const db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
        console.log(err.message)
        throw err
    } else {
        console.log("== connected to the sqlite database ")
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
        )`, (err) => {
            if  (err) {
                // table already created
            } else {
                // creating some rows 
                const insert = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)'
                db.run(insert, ["admin", "admin@server.com", md5("admin12345")])
                db.run(insert, ["user", "user@server.com", md5("user12345")])
            }
        })
    }
})

module.exports = db