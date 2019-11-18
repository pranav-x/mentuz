const express = require('express');
const app = express();
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database : 'mem'
	}
});

const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');

app.get('/', (req, res) => {
	knex.from('articles')
		.innerJoin('users', 'users.userid', 'articles.user')
		.then((data) => {
		res.render('articleindex',{data:data});
	});
})

app.get('/show/:id', (req, res) => {
	console.log(req.params.id);
	const condition = {
		aid : req.params.id
	};
	knex.from('articles')
		.innerJoin('users', 'users.userid', 'articles.user')
		.where(condition)
		.then((data) => {
		res.render('articleshow',{data:data});
	})
})

app.get('/add',ensureAuthenticated, (req, res) => {
	res.render('articleadd');
});

app.post('/new', (req, res) => {
	const article = { 
			title: req.body.title,
			body: req.body.body,
			user: req.user[0].userid
		};
	knex('articles')
		.insert(article)
		.then((data) => {
			res.redirect('/article');
	});
});

app.post('/comment/:id/:id2',(req,res)=>{
	const newComment = {
		person: req.params.id2,
		artid: req.params.id,
		comment: req.body.commentBody
		
	}
	//inserting the comment in the database
	//and reloading the page bt redirecting with article id
	knex('artcom')
		.insert(newComment)
		.then((user)=>{
			res.redirect(`/article/show/${req.params.id}`);
		})
	
})

app.post('/comment/:ida/:idu', (req, res) => {
	console.log("Hello");
})

module.exports = app;