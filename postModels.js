var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var blogSchema = new Schema({
  title:  String,
  author: {
    firstName: String,
    lastName: String
  },
  content: String,
  created: { type: Date, default: Date.now }  
});

blogSchema.virtual('authorFullName').get(function() {
	return this.author.firstName + ' ' + this.author.lastName;
});

blogSchema.methods.apiRepr = function() {
  return {
  	id:this._id,
  	title:this.title,
  	author:this.authorFullName,
  	content:this.content,
  	created:this.created
  }
};

var Blog = mongoose.model('posts', blogSchema);
module.exports = Blog;
