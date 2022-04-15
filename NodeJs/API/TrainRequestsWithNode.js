const https = require("https")

const url="https://www.google.com"

const options = {
    method: "get"
}

var request = https.request(url, options, (response) => {
    response.on("data", (data) => {
        data = data.toString()
        console.log(data)
    })
})

request.end()