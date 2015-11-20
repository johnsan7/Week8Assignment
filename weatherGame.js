

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



app.get('/game', function(req,res){

	var outObj = {};
	if(!req.session.name)
	{
		console.log('getting to robottown');
		res.render('weatherGameStart',outObj);
		return;
	}
	else
	{
		console.log("getting to else");
		res.render('playinggame',outObj);
		
	}
	
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
