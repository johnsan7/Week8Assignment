

var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

var request = require('request');

var apiKey = '&APPID=b7654c8bb48353daff52709b5b9c3475';
var baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='

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
	outObj.name = req.session.name;
	outObj.total = req.session.total;
	outObj.guess = req.query.guess;
	
	console.log("name, total and guess are ", outObj.name, outObj.total, outObj.guess);
	//req.session.firstRun = true;
	
	console.log("getting past page");
	//if(req.session.count)
	//{
	//	console.log("getting to bet");
	//	req.session.firstRun = false;
	//	res.render('playinggame',outObj);	
	//}
	
	console.log("getting to else statement");
	var randoZip = randomZip();	//This else is what runs the game really We will start off with generating request to get city, and putting our city info into outObj.
									//then seeing temp at rando city If temp is within 5, then we increment total in the session also out object, increment count and render. 
	request(baseUrl + randoZip + apiKey, function(err,response,body)
	{
		if(!err && (response.statusCode > 199 && response.statusCode < 400))
		{
			var response = JSON.parse(body);
			console.log("seems like requests are coming through, status code .", response.name);

			//var main = JSON.parse(body.main);
			//console.log(main.temp);
			
			
		}
		else
		{
				console.log("getting to else in call to weather api");
				console.log(response.statusCode);
		}
			
	});
		

});


app.post('/', function(req,res,next)
{
	var outObj = {};
	console.log("getting to post");
	if(req.body['name'])
	{
		req.session.name = req.body.name;
		req.session.total = 15;
		//req.session.count = 1;
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

function randomZip()
{
	var zipArr = 	['55016',  '22601', '02920', '19380', '33414', '17331', '04240',  '01801', '11729',  '32703',
					'43040',   '21771', '16601',  '51106',  '21146',  '34698',  '27330', '06512',   '02453',  '15301',    
					'46201',   '36067',   '30223',   '46383', '11572',   '34990',   '60137',   '60099',  '33442',   '48089',   
					'08701',  '07753',  '01841',  '32068',   '14701', '52501', '49417',  '53511',  '33054',    '94043', 
					'08094',  '02127',   '38017',   '98144', '13021',   '30052',  '21014', '02136',  '48124',  '11746',
					'07083',  '27587',  '30126',  '97402', '30075',  '17109',   '30019',   '61821', '60181',   '33702', '19460',   
					'91784',  '28104',  '33056',   '43119',  '30534',   '08807',   '07601',  '55372',   '35803',  '23503',    
					'01040',   '32162',  '55311',  '06606',    '47802',  '33139',   '46077',   '06851',    '08234',   '11420',  
					'60142',   '23451', '29708',   '06492',   '44646', '52402',    '02026',   '54952',   '03038',   '26554',   '07065',   
					'23228',  '01821',  '60056',    '07410',  '98503', '15317',  '23185', '31404'];
	
	
	
	//console.log(zipArr.length);
	return zipArr[Math.floor(Math.random() * 100)];
	
};