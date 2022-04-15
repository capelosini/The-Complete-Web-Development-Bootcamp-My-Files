const express = require("express")
const bp = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")

const app = express()
const port = 80

app.use(bp.urlencoded({extended: true}))
app.set("view engine", "ejs")


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)


app.route("/articles")
.get((req, res) => {
    Article.find((err, articles) => {
        if (err){
            res.send(err)
        } else{
            res.send(articles)
        }
    })
})
.post((req, res) => {
    var title = req.body.title
    var content = req.body.content
    const newArticle = new Article({
        title: title,
        content: content
    })
    newArticle.save((err) => {
        if(err){
            res.send(err)
        } else{
            res.send("Success")
        }
    })
})
.delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if(err){
            res.send(err)
        } else{
            res.send("Success")
        }
    })
})

///////////////////// JUST ONE ARTICLE //////////////////////

app.route("/articles/:articleTitle")
.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle){
            res.send(foundArticle)
        } else{
            res.send("No article found")
        }
    })
})
.put((req, res) => {
    var title = req.body.title
    var content = req.body.content
    Article.update({title: req.params.articleTitle}, {title: title, content: content}, {overwrite: true}, (err) => {
        if(err){
            res.send(err)
        } else{
            res.send("Success")
        }
    })
})
.patch((req, res) => {
    Article.update({title: req.params.articleTitle}, {$set: req.body}, (err) => {
        if(err){
            res.send(err)
        } else{
            res.send("Success")
        }
    })
})
.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if(err){
            res.send(err)
        } else{
            res.send("Success")
        }
    })
})



app.listen(port, () => {
    console.log("Started on " + port)
})