const express = require("express")
const app = express()
const bp = require("body-parser")
const https = require("https")
const port = 80

app.use(bp.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    console.log("get request on " + req.url)
    res.sendFile(__dirname + "/index.html")
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/style.css")
})

app.post("/", (req, res) => {
    var token = req.body.token
    var message = req.body.message
    var chatid = req.body.chatId
    console.table([token, message, chatid])

    var nonce = Math.floor(Math.random() * 9999999999999 + 100000000000)
    nonce="85006"+nonce
    console.log(nonce)

    var payload = {content: message, nonce: Number(nonce), tts: false}
    payload = JSON.stringify(payload)

    var options={
        method: "post",
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "pt-BR",
            "authorization": token,
            "content-length": "60",
            "content-type": "application/json",
            "cookie": "__dcfduid=53da0fb284fe2f342dc565c2faa7e59a; rebrand_bucket=d45075ce70ae9a3eb5a3e1d7a6e3d8d1; locale=pt-BR",
            "origin": "https://discord.com",
            "referer": "https://discord.com/channels/@me/745771729724637236",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9002 Chrome/83.0.4103.122 Electron/9.3.5 Safari/537.36",
            "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDAyIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDIiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLUdCIiwiY2xpZW50X2J1aWxkX251bWJlciI6ODY2MzQsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9"
        },
        timeout: 10000
    }
    var url = "https://discord.com/api/v9/channels/" + chatid + "/messages"
    var request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(data.toString())
        })
    })
    request.write(payload)
    request.end()
    res.redirect("/")
})



app.listen(port, () => {
    console.log("Started on " + port)
})