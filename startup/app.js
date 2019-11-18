var express = require("express");
var cors = require('cors');
var FTPS = require('ftps');
var ftps = new FTPS({
  host: 'www.mentuz.com',
  username: 'admin_ashish',
  password: 'ztxGD7ywjz',
  protocol: 'sftp',
});

const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database : 'mem'
	}
});
// knex.select('*').table('users')
// 		.then(data => console.log(data));

var bodyParser = require('body-parser');  
var methodOverride = require('method-override');
var flash = require("connect-flash");
//const cookieParser = require('cookie-parser');
//const session = require('express-session');
const cookieSession = require('cookie-session');
const passport = require('passport');
const key = require('./config/key');
require('./config/passport')(passport);
const auth = require('./routes/auth');
const article = require('./routes/articles');
const app = express();

app.use(cors());
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views')); // This line.
 // This line.



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(cookieSession({
	maxAge:24*60*60*1000,
	keys:[key.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
  res.locals.userr = req.user || null;
	
  next();
});
const {ensureAuthenticated,ensureGuest} = require('./helpers/auth');
app.get('/',(req,res)=>{
	console.log(req.user);
	res.render('index');
})
app.get('/profile/:userid',(req,res)=>{
	const id = req.params.userid;
	console.log(id);
	// res.send("Hello");
	knex.from('users')
		.innerJoin('QnA', 'users.userid', 'QnA.user')
		.where({
		userid: id
		})
		.then(data => {
				knex.from('users')
				.innerJoin('articles', 'users.userid', 'articles.user')
				.where({
					userid: id
				})
				.then(article => {
					//Data contains the questions asked, articles conatin the article
					console.log(data, article);
				})
	});
})

app.get('/pdf2',(req,res)=>{
	res.render("pdf2");
})

app.get('/pdf/:tag',(req,res)=>{
	res.render("sem",{tag:req.params.tag});
})

app.get('/getintouch',(req,res)=>{
	res.render("getintouch");
})

// app.use(cookieParser());
// app.use(session({
// 	secret:'secret',
// 	resave:false,
// 	saveUninitialized:false
// }));
app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});
app.post('/contactus',(req,res)=>{
	console.log(req.body);
	// const {Name, Mail, }
	//   const newData = { 
	// 		Name: ,
	// 		email: profile.emails[0].value,
	// 		picture: profile.photos[0].value,
	// 	  	id: profile.id
			
	// 	};
	knex('contactus')
				.insert(req.body.contact)
				.then((user)=>{console.log})
	res.redirect("/getintouch");
});
app.get('/QnA',(req,res)=>{
	  knex.from('QnA').innerJoin('users', 'users.userid', 'QnA.user')
		.then((data)=> {
		
				// console.log(data);
				res.render('QnaIndex',{data:data});
			
		});
	
});
app.get('/QnA/add',ensureAuthenticated,(req,res)=>{
	res.render('QnaAdd');
});
app.post('/QnA',(req,res)=>{
	console.log(req.body);
	const newQn = { 
			title: req.body.title,
			body: req.body.body,
			user: req.user[0].userid
			
		};
	knex('QnA')
				.insert(newQn)
				.then((user)=>{console.log("yooo" + user);
							   //console.log();
							   res.redirect('/QnA');
					 })
	
});
app.get('/QnA/show/:id',(req,res)=>{
	  knex.from('QnA').innerJoin('users', 'users.userid', 'QnA.user').where({
  		qnid: req.params.id
		})
		.then((data1)=> {
		  console.log('show route');
		   knex.from('comment').innerJoin('users', 'users.userid', 'comment.person').where({
  		qnid: req.params.id
		})
		.then(comms1 =>{ console.log(comms1);
			 res.render('QnAshow',{comms:comms1,data:data1});
		  console.log(data1);
			
		});
		
	  })});
app.post('/QnA/comment/:id/:id2',(req,res)=>{
	const newComment = {
		person: req.params.id2,
		qnid: req.params.id,
		comment: req.body.commentBody
		
	}
	
	knex('comment')
				.insert(newComment)
				.then((user)=>{console.log("yooo" + user);
							   //console.log();
							   res.redirect(`/QnA/show/${req.params.id}`);
					 })
	
})
app.get('/testi',(req, res)=>{
	res.render("testimonial");
})
app.get('/about',(req, res)=>{
	res.send("about");
})

app.get('/index', function (req,res) {
res.sendFile('index.html', { root: '/mysql-host' });
})

app.post('/about',(req, res)=>{
	console.log("hey");
	res.send("about");
})
app.get('/details',(req, res)=>{
	res.render("personal");
})


app.use('/article', article);

app.use('/auth',auth);

app.listen(process.env.PORT || 49157,() => {
    console.log("startup");
});