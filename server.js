const express = require("express")
const md5  = require("md5")
const db = require("./database.js")


const app = express()
const port  = process.ENV || 3001

app.use(express.json())


//create new user 

app.post("/api/user/", (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }

    const query  = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)'
    const  params = [data.name, data.email, data.password] 

    db.run(query, params, (err, result) => {
        if (err) {
            res.status(400).json({"message": err.message })
            console.log(err.message)
            return 
        }
        res.json({
            "message": "Success",
            "data": result,
            "id": this.lastID
        })
    })


})


//root endpoinnt 
app.get("/", (req,res) => {
    res.json({ "message": "ok"})
})

// get list of users 
app.get("/api/users", (req,res) => {
    const query = "select * from user"
    const params = []

    db.all(query,params, (err, data) => {
        if (err) {
            res.status(400).json({ "eror" : err.message})
            console.log(err.message)
            return 
        } 
        res.json({
            "message":"success",
            "data": data
        })
    })
})

// get single user
app.get("/api/users/:id", (req,res) => {
    const query =  "select * from user where id = ? "
    const params = [req.params.id]

    db.get(query, params, (err, data) =>{
        if (err) {
            res.status(400).json({ "eror" : err.message})
            console.log(err.message)
            return 
        }
        res.json({
            "message":"success",
            "data": data
        })
    })
})


//update user 
app.put("/api/users/:id", (req,res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5 (req.body.password) : null
    }

    db.run(
        `UPDATE user set 
        name = COALESCE(?,name),
        email = COALESCE(?,password),
        password = COALESCE(?,password)
        WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) =>{
            if (err) {
                res.status(400).json({ "eror" : err.message})
                console.log(err.message)
                return 
            }

            res.json({
                message: "success",
                data: result,
                changes: this.changes
            })
        }
    )

})

//delete user 
app.delete("/api/users/:id", (req,res) => {
    db.run(
        'DELETE FROM user WHERE id = ? ',
        req.params.id,
        (err, result) => {
            if (err) {
                res.status(400).json({ "eror" : err.message})
                console.log(err.message)
                return 
            }

            res.json({
                "message": "deleted successfully",
                changes: this.changes
            })
        }
    )
})


app.listen(port, () => {
    console.log(` === Server running on port ${port} ===`)
})