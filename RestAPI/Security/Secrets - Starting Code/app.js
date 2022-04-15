require("dotenv").config()
const express = require("express")
const bp = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const me = require("mongoose-encryption")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const app = express()
const port = 80

app.use(session({
    secret: "Monkeys and more Monkeys.",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/secretsDB", {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set("useCreateIndex", true)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

// const secret = process.env.SECRET

// userSchema.plugin(me, {secret: secret, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(express.static("public"))
app.use(bp.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()){
        res.render("secrets")
    } else{
        res.redirect("/login")
    }
})

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    var user = new User({
        email: req.body.username,
        password: req.body.password
    })
    req.login(user, (err) => {
        if(err){
            console.log(err)
        } else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })
})

// app.post("/login", (req, res) => {
//     const email = req.body.username
//     const password = req.body.password
//     User.findOne({email: email}, (err, foundUser) => {
//         if(err){
//             console.log(err)
//         } else{
//             bcrypt.compare(password, foundUser.password, (err, ress) => {
//                 if(err){
//                     console.log(err)
//                 } else{
//                     if (ress === true){ //md5(password)
//                         res.render("secrets")
//                     } else{
//                         res.send("email or password are incorrect")
//                     }
//                 }
//             })
//         }
//     })
// })

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
        if(err){
            console.log(err)
            res.redirect("/register")
        } else{
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets")
            })
        }
    })
})

// app.post("/register", (req, res) => {
//     var email = req.body.username
//     var password = req.body.password
//     bcrypt.hash(password, saltRounds, (err, hash) => {
//         if(err){
//             console.log(err)
//         } else{
//             var newUser = new User({
//                 email: email,
//                 password: hash // md5(password)
//             })
//             newUser.save((err) => {
//                 if(err){
//                     res.send(err)
//                 } else{
//                     res.render("secrets")
//                 }
//             })
//         }
//     })
// })

app.listen(port, () => {
    console.log("Started server on port " + port)
})