const express = require("express")
const app = express()
const bp = require("body-parser")
const port = 3000
const https = require("https")

app.use(bp.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    var email = req.body.email
    var name = req.body.name

    var data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name
        }
    }

    var jsonData = JSON.stringify(data)
    var url = "https://us6.api.mailchimp.com/3.0/lists/b7f4c1cbc8/members"
    var options = {
        method: "POST",
        auth: "clovis1:aacce6e0a1f76a6c60fe997ff5557f59-us6"
    }
    var request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            var dataRecv = JSON.parse(data);
            if (dataRecv.status == "subscribed"){
                res.send("<h1>Sucess!</h1>")
            } else{
                res.send("Fail! Try again later")
            }
        })
    })
    request.write(jsonData);
    request.end();

})


app.listen(port, () => {
    console.log(port + " - Started Server")
})


// aacce6e0a1f76a6c60fe997ff5557f59-us6
// b7f4c1cbc8