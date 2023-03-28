const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

/////////////// CONNECTING MongoDB ///////////////

mongoose.connect("mongodb://127.0.0.1/wikiDB")
const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema)


/////////////// REQUEST TARGETING ALL ARTICLES ///////////////

app.route("/articles")
.get((req, res) => {
  Article.find({})
  .then((foundArticles) => {
    console.log('Found articles:', foundArticles);
    res.send(foundArticles)
  })
})

.post((req, res) => {
  const newArtice = new Article({
    title: req.body.title,
    content: req.body.content
  })
  newArtice.save()
  .then((savedArticle) => {
    console.log('Article saved:', savedArticle);
    //Send the response back to the client here
    res.send('Article saved successfully!');
  })
  .catch((error) => {
    console.error('Error saving article:', error);
    // handle the error case here
    res.send('Error saving article!');
  });
})

.delete((req, res) => {
  Article.deleteMany({title: "Harsh"})
  .then((deletedArticle) => {
    console.log('Article deleted:', deletedArticle);
    //Send the response back to the client here
    res.send('Article deleted successfully!');
  })
  .catch((error) => {
    console.error('Error deleting article:', error);
    // handle the error case here
    res.send('Error deleting article!');
  })
})

/////////////// REQUEST TARGETING SPECIFIC ARTICLE ////////////////

app.route("/articles/:articleTitle")
.get((req, res) => {
  Article.findOne({title: req.params.articleTitle})
  .then((foundArticle) => {
    if(foundArticle === null) {
      res.send("Invalid URL")
    }
    console.log('Found aticle:', foundArticle);
    res.send(foundArticle)
  })
})

.put((req, res) => {
  req.body.title
  req.body.content
  Article.updateOne(
    {title: req.params.articleTitle}, 
    {title: req.body.title, content: req.body.content},
  )
  .then((updatedArticle) => {
    console.log('Updated article:', updatedArticle);
    res.send("Updated Sucessfully")
    Article.findOne({title: req.body.title})
    .then((updatedData) => {
      console.log(updatedData);
    })
  })
})

.patch((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}
  )
  .then((patchedArticle) => {
    res.send("Article patched sucessfully")
    console.log(patchedArticle);
  })
})

.delete((req, res) => {
  Article.deleteOne({title: req.params.articleTitle})
  .then((deleteMsg) => {
    console.log(deleteMsg);
    res.send("Sucessfully Deleted")
  })
  .catch((error) => {
    console.error('Error deleting article:', error);
    // handle the error case here
    res.send('Error deleting article!');
  })
})


app.listen(3000, () => {
  console.log("Server started at port 3000");
})

