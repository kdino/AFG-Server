//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://kidong:kizzong1@afg-db-qsh3u.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // allows to use local MongoDB 

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);


//////////////////// Request targeting All Articles ////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article");
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted data");
      }
    });
  });

//////////////////// Request targeting specific Articles ////////////////
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.find({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (err) {
        res.send("No articles matched!");
      } else {
        res.send(foundArticle);
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      }, // mongoDB는 바꿀 parameter를 다 채우면 overwrite True가 되나 mongoose에서는 false로 남아있기에 수동으로 바꿔줌.
      function(err) {
        if (err) {
          res.send("No articles matched!");
        } else {
          res.send("Successfully updated data!");
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.update({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (err) {
        res.send("No articles matched!");
      } else {
        res.send("Successfully updated data!");
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (err) {
        res.send("No articles matched!");
      } else {
        res.send("Successfully deleted data!");
      }
    })
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});