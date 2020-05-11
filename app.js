//jshint esversion:6

const s3Api = require("./s3Api");

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
//const s3bucket = AWS.S3({ params: { Bucket: "afgbucket" } });

const mongodbID = "kidong";
const mongodbPW = "kizzong1";
const DBnameToconnect = "test";

mongoose.connect(
  "mongodb+srv://" +
    mongodbID +
    ":" +
    mongodbPW +
    "@afg-db-qsh3u.mongodb.net/" +
    DBnameToconnect +
    "?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
); // allows to use local MongoDB

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//////////////////// Request targeting All Articles ////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article");
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted data");
      }
    });
  });

//////////////////// Request targeting specific Articles ////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.find(
      {
        title: req.params.articleTitle,
      },
      function (err, foundArticle) {
        if (err) {
          res.send("No articles matched!");
        } else {
          res.send(foundArticle);
        }
      }
    );
  })

  .put(function (req, res) {
    Article.update(
      {
        title: req.params.articleTitle,
      },
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        overwrite: true,
      }, // mongoDB는 바꿀 parameter를 다 채우면 overwrite True가 되나 mongoose에서는 false로 남아있기에 수동으로 바꿔줌.
      function (err) {
        if (err) {
          res.send("No articles matched!");
        } else {
          res.send("Successfully updated data!");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update(
      {
        title: req.params.articleTitle,
      },
      {
        $set: req.body,
      },
      function (err) {
        if (err) {
          res.send("No articles matched!");
        } else {
          res.send("Successfully updated data!");
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne(
      {
        title: req.params.articleTitle,
      },
      function (err) {
        if (err) {
          res.send("No articles matched!");
        } else {
          res.send("Successfully deleted data!");
        }
      }
    );
  });

app.route("/api/pictures")
  .post(s3Api.upload.single('myfile'), function(req, res){
    //s3API.upload(req.file.);
  });

app.listen(5000, function () {
  console.log("Server started on port 3000");
});
