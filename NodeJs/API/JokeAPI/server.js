const express = require("express")
const bp = require("body-parser")
const app = express()
const https = require("https")
const port = 3000

app.use(bp.urlencoded({extended: true}))

app.get("/", (req, res) => {
    var url = "https://v2.jokeapi.dev/joke/Programming?type=single"
    https.get(url, (response) => { 
        response.on("data", (data) => {
            var data = JSON.parse(data)
            res.send("<h1>" + data.joke + "</h1> <h2>Nice, want more ? Refresh the page</h2>")
        }) 
    })
})




app.listen(port, () => {
    console.log("Server started in " + port)
})