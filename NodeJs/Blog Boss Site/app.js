const express = require("express")
const app = express()
const bp = require("body-parser")
const mongoose = require("mongoose")
var Schema = mongoose.Schema
const port = 80
var daystexts = {day1: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut", day2: "imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue."}

app.set("view-engine", "ejs")
app.use(express.static("public"))
app.use(bp.urlencoded({extended: true}))

// Config Db
mongoose.connect("mongodb://localhost/blog-boss", {useUnifiedTopology: true, useNewUrlParser: true})
var db = mongoose.connection
db.on("error", () => {
    console.log("i cant connect to the DB")
})
db.on("connected", () => {
    console.log("ready")
})
console.log("setting up DB")
var itemSchema = new Schema({
    dayname: String,
    content: String
})
var Item = mongoose.model("Item", itemSchema)
console.log("updating site by DB")
Item.find({}, (err, items) => {
    if(err){
        console.log(err)
    } else{
        items.forEach((item) => {
            daystexts[item.dayname] = item.content
        })
    }
})


app.get("/", (req, res) => {
    res.render("index.ejs", {day1: daystexts.day1.substring(0, 70), day2: daystexts.day2.substring(0, 70), daystexts: daystexts})
})

app.get("/newitem", (req, res) => {
    res.render("newitem.ejs", {})
})

app.post("/newitem", (req, res) => {
    var name = req.body.name
    var content = req.body.content
    daystexts[name] = content
    var route = Object.keys(daystexts)
    route = route[route.length - 1].replaceAll(" ", "")
    console.log(route)
    var newItem = new Item({
        dayname: name,
        content: content
    })
    newItem.save()
    app.get("/" + route, (req, res) => {
        res.render("newpages.ejs", {name: name, content: content})
    })
    res.redirect("/")
})

setTimeout(() => {for(var i = 0; i < Object.values(daystexts).length; i++){
    var route = Object.keys(daystexts)[i].replaceAll(" ", "")
    console.log(route)
    app.get("/" + route, (req, res) => {
        res.render("newpages.ejs", {name: route, content: daystexts[route]})
    })
}}, 1000)

app.listen(port, () => {
    console.log("Started on " + port)
})