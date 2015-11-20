

var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(session({  
	secret: 'SuperSecretPassword',
	saveUninitialized: true,
	resave: true
}));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());




app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//This will control the game. If session is null it sends to the game start page, that page does a post. 

app.get('/', function(req,res,next){

	var outObj = {};
	if(!req.session.name)
	{
		console.log('getting to robottown');
		res.render('weatherGameStart',outObj);
		return;
	}
	
	console.log("getting past page");
	if(outObj.total > 0)
	{
		console.log("getting to bet");
		res.render('playinggame',outObj);	
	}
	
});


app.post('/', function(req,res,next)
{
	var outObj = {};
	console.log("getting to post");
	if(req.body['name'])
	{
		req.session.name = req.body.name;
		req.session.total = 15;
		console.log("session infosaved");

	}
	//else(!req.session.name)
	//{
	//	console.log('Problem, back to start');
	//	res.render('weatherGameStart',outObj);
	//	//return;
	//}
	
	outObj.name = req.session.name;
	outObj.total = req.session.total;
	
	res.render('playinggame',outObj);
	
	
});
app.use(function(req,res)
{
	res.status(404);
	res.render('404');
	
});

app.use(function(err,req,res,next){
	//console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');	
});


app.listen(app.get('port'), function(){
	console.log('Started on port 3000');
	
});
