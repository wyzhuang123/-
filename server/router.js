
const { json } = require('express');
const express = require('express')

const router = express.Router();
// const {saveArticle,FindArticle,AllArticle} = require('../server/db/article/index')
const {Article,Comment,User, ArticleComment} = require('./db/server')

// Article
router.post('/saveArticle',function(req,res) {
    const {data} = req.query;
    let article = JSON.parse(data);
    article.time = Date.now();
    new Article(article).save((error, result) => {
      if(error) {
        console.log(error);
      } else {
        console.log('success');
      }
    })
    res.status(200).send('succeed in saving new Articles')
})

router.get('/getArticles',function(req, res) {
    let obj = req;
    let data = FindArticle(obj);
    res.send(data) 
})

router.get('/ALLArticles',function(req, res) {
    Article.find((error, result) => {
      if(error) {
        console.log(error);
      } else {
        res.status(200).send(result)
      }
    })
})

router.get('/findArticlesByType/:Type',function(req, res) {
    Article.find({Type: req.params.Type},function(error, result) {
        if(error) {
          console.log(error);
        } else {
          res.status(200).send(result)
        }
    })
})

router.get('/getArticleContent/:id',function(req, res) {
  
  Article.findOne({_id: req.params.id}, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        res.status(200).send(result)
      }
  })
})



// User

router.get('/userLogin',function(req, res) {
  const {data} = req.query;
  let user = JSON.parse(data);
  console.log(user);
  User.findOne({
    name: user.name,
    password: user.password
  },function(error, result) {
      if(error) {
        console.log(error);
      } 
      res.status(200).send(result);
  })
})

router.get('/hasUser',function(req, res) {
  const {data} = req.query;
  let user = JSON.parse(data); //拿到注册页面的名字
  console.log(user);
  User.findOne({
    name: user.name
  },function(error, result) {
    if(error) {
      console.log(error);
    } else if( !result) {
      res.status(200).send('0');
    } else {
      res.status(200).send('1');
    }
  })
})


router.post('/insertUser',function(req, res) {
  const {data} = req.query;
  let user = JSON.parse(data);
  console.log(user);
  new User(user).save(function(error, result) {
        if(error) {
          console.log(error);
        } else {
          res.status(200).send(result);
        }
  })
})






router.post('/saveComment',function(req,res) {
  const {data}  = req.query;
  console.log(data);
  let comment = JSON.parse(data);
  // console.log(comment);
  let obj = {
    name: comment.name,
    Content: comment.Content,
    time: Date.now()
  }
  new Comment(obj).save()
  res.status(200).send('succeed in saving new Comment')

})

router.get('/AllComments',function(req,res) {
  Comment.find((error,result) => {
    if(error){
        res.status(500).send('服务器错误！')
    }
    else{
      res.status(200).send(result)
    }
  }
  )
})


// article-comment


// 添加评论
router.post('/saveArticleComment',function(req, res){
      const {data}  = req.query;
      // console.log(data);
      let articlecomment = JSON.parse(data);
      console.log(articlecomment);
    Article.findOne({
      _id: articlecomment.articleId
    },function(error,result) {
          if(error) {
            console.log(error);
          } else {
             let comment = result.comments;
             console.log(comment);
          //    comment.push()
          new ArticleComment({
                 article_id: articlecomment.articleId,
                 Content: articlecomment.comment,
                user: {
                  user_id: articlecomment.user_id,
                  name: articlecomment.name,
                  avatar: articlecomment.avatar
                },
                  time: Date.now()
              }).save(function(error,result) {
                  if(error) {
                    console.log(error);
                  } else {
                    console.log('保存进入articleComment表成功！');
                  }
              })
          }
    })
})


// 所有文章评论

router.get('/getArticleComment/:articleId',function(req, res) {
  ArticleComment.find({articleId: req.params.articleId}, function(error, result) {
    if(error) {
      console.log(error);
    } else {
      console.log(123);
        res.status(200).send(result);
    }
})
})





module.exports = router
