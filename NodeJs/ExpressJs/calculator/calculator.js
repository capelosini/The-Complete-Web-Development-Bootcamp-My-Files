const express = require("express");
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    var num1 = Number(req.body.num1)
    var num2 = Number(req.body.num2)
    var result = Number(num1 + num2)
    res.send("Result: " + result)
})


app.get("/bmicalculator", (req, res) => {
    res.sendFile(__dirname + "/bmicalculator.html")
})

app.post("/bmicalculator", (req, res) => {
    var weight = Number(req.body.weight);
    var height = Number(req.body.height);
    var result = weight / (height * height);
    res.send("Your BMI is " + result)
})


app.listen(3000, () => { console.log("server on") })