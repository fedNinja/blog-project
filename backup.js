const express = require('express');
//morgan is used to log http layer
const morgan = require('morgan');
//will use body parser 's json method to parse JSON data sent in requests to the app
const bodyParser = require('body-parser');
//importing BlogPosts model, which we will interact with 
const  {BlogPosts} = require('./model');
const jsonParser = bodyParser.json();
const app = express();

//log the http layer
app.use(morgan('common'));
//add some items to the blog post

BlogPosts.create('Fudge-a-Mainia','story about peter hatcher','Judy Blume');
BlogPosts.create('Lean in', 'Women empowerment', 'sheryl sandberg');
BlogPosts.create('winter according to humphry', 'story about a hamster', 'betty g. birney');

app.get('/blog-posts', (req, res) =>{
  res.json(BlogPosts.get());
});
//post data

app.post('/blog-posts', jsonParser, (req, res) => {
  //checking to have title, content and author in request body
  const reqFields = ['title', 'content', 'author'];
  for(let i=0; i< reqFields.length;i++) {
    const field= reqFields[i];
    if(!(field in req.body)) {
      const msg = `Missing \`${field}\` in request body`;
      return res.status(400).send(msg);
    }
  }
  console.log(req.body);
  const item = BlogPosts.create(
    req.body.title, req.body.content, req.body.author, req.body.publishDate||Date.now());   
    res.status(201).json(item);
});


//Updating blog posts items
app.put('/blog-posts/:id', jsonParser, (req, res) => {
  const reqFields = ['title', 'content', 'author'];
  for(let i=0; i<reqFields.length; i++) {
    const field = reqFields[i];
    if(!(field in req.body)) {
      const msg = `Missing \`${field}\` in request body`;
      console.error(msg);
      return res.status(400).send(msg);
    }
  }
  console.log(req.body);
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id:req.params.id,
    title:req.body.title,
    content:req.body.content,
    author:req.body.author,
    publishDate:req.body.publishDate||Date.now()
 });
  res.status(204).json(updatedItem);
});


//delete data
app.delete('/blog-posts/:id', (req, res) => {
  console.log("calling delete");
  BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post list item \`${req.params.ID}\``);
    res.status(204).end();
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`our app is listening on port ${process.env.PORT || 8080}`);

});
module.exports = router;