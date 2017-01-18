const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const{DATABASE_URL, PORT} = require('./config');
const postModel = require('./postModels');

const app = express();
app.use(bodyParser.json());


//const blogsRouter = require('./blogsRouter');
//get all documents
app.get('/posts', (request, response) =>{
	postModel.find(function(error, result){
			if(error){
				return response.status(500).json({"msg":"server error"});
			}
			response.json(result.map(function(element){
				return element.apiRepr();
			}));
	});	
	});

 //get one document based on our criteria
 app.get('/posts/:id', (request, response) =>{
 	//console.log("I am inside get one");
 	//postModel.findOne({_id:request.params.id},function(error,result){
 	postModel.findById(request.params.id, function(error,result){
 		console.log(request.params.id);
 		if(error){
				return response.status(400).json({"msg":"does not find Id"});
			}
 			response.json(result);
 	});
 });

 //post data
 app.post('/posts',(request,response) => {
 	const reqFields= ['title', 'content','author'];
 	reqFields.forEach(field => {
 		if(Object.keys(request.body).indexOf(field) === -1) {
 			return response.status(400).json({"msg":`must specify value for ${field}`});
 		}		
 	});
 	const item = postModel.create({ 
 		title:request.body.title, content:request.body.content, author:request.body.author }, 
 		function (err, result) { if (err) return console.error(err); });
	response.status(201).json(item);
 });

 //update data
 app.put('/posts/:id', (request, response) => {
 	if(!(request.params.id && request.body.id && request.params.id == request.body.id)) {
 		return response.status(400).json({"msg":"request path id and request body id should match"});
 }
 	const updatedValues = {};
 	const fieldsToBeUpdated = ['title', 'content', 'author'];
 	fieldsToBeUpdated.forEach(field => {
 		if(field in request.body){
 			updatedValues[field] = request.body[field];
 		}
 	});
 	console.log("updated values are*******",updatedValues);
 	postModel.findByIdAndUpdate(request.params.id, {$set:updatedValues},function(error, result){
 		if(error){
 			return response.status(500).json({"msg":"internal server error"});
 		}
 		response.status(204).end();
 	});

 });

//delete data based on id
app.delete('/posts/:id',(request,response) => {
	console.log(request.params.id);
	postModel.findByIdAndRemove(request.params.id, function(error,result){
		if(error){
			return response.status(400).json({"msg":"does not find Id"});
		}
		response.status(204).json({});
	});
});

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

// when requests come into `/blog-posts` 
//  we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
//app.use('/blog-posts', blogsRouter);
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};
