const express = require('express')
const app = express()
const port = 3000
const sql_config = require('./sql_config')


app.get('/', (req, res) => {

    var q = "INSERT INTO test (test) VALUES ('11')";
    // console.log(sql_config)
    // sql_config.sql_query(q, function (result) {
    //     console.log("1 record inserted");
    // });
    res.end();

})
// app.post('/saveStudent', (req, res) => {
//     return res.send('Received a GET HTTP method');
// });


app.get('/getStudents', (req, res) => {
    var q = 'SELECT * FROM `students`';
    sql_config.sql_query(q, function (result) {
        return res.send(result);
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})