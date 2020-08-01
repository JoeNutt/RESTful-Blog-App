const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
//Monggose

mongoose
	.connect('mongodb://localhost:27017/restful_blog_app', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// Blog Schema Config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});
//Model compile
const Blog = mongoose.model('Blog', blogSchema);
// INDEX ROUTE
app.get('/', function(req, res) {
	res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log('ERROR');
		} else {
			res.render('index', { blogs: blogs });
		}
	});
});
// END INDEX

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
	res.render('new');
});
// END NEW

// CREATE
app.post('/blogs', (req, res) => {
	Blog.create(req.body.blog, function(err, newBlog) {
		if (err) {
			res.render('new');
		} else {
			res.redirect('/blogs');
		}
	});
});
// END CREATE
// SHOW
app.get('/blogs/:id', (req, res) => {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('show', { blog: foundBlog });
		}
	});
});
// END SHOW
// EDIT
app.get('/blogs/:id/edit', (req, res) => {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('blogs');
		} else {
			res.render('edit', { blog: foundBlog });
		}
	});
});
// END EDIT
// UPDATE
app.put('/blogs/:id', (req, res) => {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});
// END UPDATE
// PORT

app.listen(3000, () => console.log('listening on http://localhost:3000/')); //
