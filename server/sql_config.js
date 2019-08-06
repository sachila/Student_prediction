var mysql = require('mysql');
var exports = module.exports = {};

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_performance"

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected!");
});

function sql_query(query, result) {
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;
        result(rows);
    });
}


exports.sql_query = sql_query;

console.log(exports)