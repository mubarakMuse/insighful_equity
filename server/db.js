const Pool = require("pg").Pool;


const pool = new Pool({
    user:"postgres",
    database: "insightful_equity", 
    host: "localhost",
    port: 5432
})

module.exports = pool;
