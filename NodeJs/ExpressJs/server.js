const express = require("express");
const app = express();

port=2000

app.get("/", (request, response) => {
    response.send("404 error")
})

app.get("/about", (request, response) => {
    response.send("Hello my name is Clóvis, a programmer")
})

app.listen(port, () => { console.log("Server started in port " + port) });