const express = require("express")
const app = express();
const pool = require("./db")
const cors = require("cors")


app.use(express.json())
app.use(cors())

app.post("/equity", async(req,res) => {
    try {
        console.log(req.body)
        const {quantity, company, askPrice} = req.body
        const newEquity = await pool.query("INSERT INTO equity (company, quantity,ask_price) VALUES ($1,$2,$3) RETURNING *", [company,quantity,askPrice])
        res.json(newEquity.rows[0])
    }
    catch(err) {
        console.log(err.message)

    }
})

app.get("/equity", async(req,res) => {
    try {
        const allEquities = await pool.query("SELECT * FROM equity")
        res.json(allEquities.rows)
    }
    catch(err) {
        console.log(err.message)

    }
})

app.get("/equity/:id", async(req,res) => {
    try {
        const {id} = req.params
        const equity = await pool.query("SELECT * FROM equity WHERE id = $1", [id])
        res.json(equity.rows[0])
    }
    catch(err) {
        console.log(err.message)

    }
})


app.put("/equity/:id", async(req,res) => {
    try {
        const {id} = req.params
        const {quantity, company, askPrice} = req.body
        const equity = await pool.query("UPDATE equity SET company = $1, quantity = $2, ask_price = $3 WHERE id = $4 RETURNING *", [company,quantity,askPrice,id])
        res.json(equity.rows[0])
    }
    catch(err) {
        console.log(err.message)

    }
})

app.delete("/equity/:id", async(req,res) => {
    try {
        const {id} = req.params
        const deletedEquity = await pool.query("DELETE FROM equity WHERE id = $1", [id])
        res.json("Equity was deleted")
    }
    catch(err) {
        console.log(err.message)

    }
})

app.get("/equity/total/:company", async(req,res) => {
    try {
        const {company} = req.params
        console.log(company)
        const equities = await pool.query("SELECT * FROM equity WHERE company = $1", [company])
        let totalcost = 0
        let totalQuantity = 0
        let count = 0
        console.log(equities.rows)
        for (let i = 0; i < equities.rows.length; i++) {
            totalcost+= Number(equities.rows[i].ask_price) * equities.rows[i].quantity
            totalQuantity += equities.rows[i].quantity
            count++

        }
        console.log
        let results = {
            company: company,
            totalQuantity,
            totalcost,
            averageAskprice : totalcost/totalQuantity
        }
        res.json([equities.rows,results])
    }
    catch(err) {
        console.log(err.message)

    }
})



app.listen(3000, ()=> {
    console.log("server is listinig on port 3000")
})
