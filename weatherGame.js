
//This code, var express through app.set('port',3000) is code from lectures and the class. The implementation that I have is the exact same as the lectures
//This program is a game where there are 100 random zip codes from US locations. You have to guess the temperature within 5 degrees without knowing the name
//of the city. You get 3 points for a correct answer and lose 1 point for an incorrect. 

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

//This is the basic code of the game. 

app.get('/', function(req,res,next){

	var outObj = {};

//This gets the name, total, and guess from the request/session and saves it to render it later in webpages
	outObj.name = req.session.name;
	outObj.total = req.session.total;
	outObj.guess = req.query.guess;
	
	//console.log("name, total and guess are ", outObj.name, outObj.total, outObj.guess);

	
	//console.log("getting past page");
//If the session is new (does not have a name) call the game start page to get a name. Code is similar to lecture code
	if(!req.session.name)
	{
		//console.log('getting to robottown');
		res.render('weatherGameStart', outObj);
		return;
	}

//If the user has used their last dollar, render the game over page. This will allow them to restart if they like 
	if(req.session.total < 2)
	{
		//console.log("getting to if session total less than 1");
		res.render('gameOver', outObj);
		return;
	}
	
	//console.log("getting to else statement");

//This calls randomZip function below, that will get a random zip from list of 100 zip codes.
	var randoZip = randomZip();	//This else is what runs the game really We will start off with generating request to get city, and putting our city info into outObj.
									//then seeing temp at rando city If temp is within 5, then we increment total in the session also out object, increment count and render. 
//Makes request to openweather API. Uses random zip code to get information for a random city. 
	request(baseUrl + randoZip + apiKey, function(err,response,body)
	{
		if(!err && (response.statusCode > 199 && response.statusCode < 400))
		{
			var response = JSON.parse(body);
			//console.log("seems like requests are coming through, status code .", response.name);
			var fahrTemp = Math.round((((response.main.temp-273.15)*1.8)+32));				//This converts the Kelvin response from the server to Fahrenheit rounded to nearest whole number
			//This calculates whether guess was within 5 
			var winMargin = Math.abs(req.query.guess - fahrTemp);			
			//console.log("Converted temp is ", fahrTemp);
			//console.log("raw Kelvin is ", response.main.temp);
			
			outObj.cityName = response.name;
			outObj.zipCode = randoZip;
			outObj.temp = fahrTemp;
			//console.log("Gets to important if");
			//console.log("winMargin is ", winMargin);
			
//If player wins, we add 3 to scre, save the winner message, then render it all in the playinggame view. The else is for if they lose, basically the inverse
			if(winMargin < 5)
			{
				var outcomeText = "You were within 5 degrees! You guessed: ";
				
				req.session.total = req.session.total + 3;
				outObj.total = req.session.total;
				outObj.outcomeText = outcomeText;
				res.render('playinggame', outObj);
			}
			else
			{
				var outcomeText = "You were not within 5 degrees, you lose 1 dollar! You guessed: ";
				req.session.total = req.session.total - 1;
				outObj.total = req.session.total;
				outObj.outcomeText = outcomeText;
				res.render('playinggame', outObj);
			}
			

				
			
			
		}
		else
		{
				console.log("getting to else in call to weather api, error occured with request");
				console.log(response.statusCode);
		}
			
	});
		

});

//When player starts a new game, gets submitted as post. This assembles the information correctly, then renders playinggame with the information
app.post('/', function(req,res,next)
{
	var outObj = {};
	//console.log("getting to post");
	if(req.body['name'])
	{
		req.session.name = req.body.name;
		req.session.total = 15;
		//req.session.count = 1;
		//console.log("session infosaved");

	}

	
	outObj.name = req.session.name;
	outObj.total = req.session.total;
	
	res.render('playinggame',outObj);
	
	
});

//If from the game over screen a new game is chosen, session is destroyed and we render the starting page where you enter your name again. 
app.post('/newGame', function(req,res)
 {
	console.log("Session destroyed");
	req.session.destroy();
	res.render('weatherGameStart');

	
});
//These next two are right from the lectures
app.use(function(req,res)
{
	res.status(404);
	res.render('404');
	
});

app.use(function(err,req,res,next){
	res.type('plain/text');
	res.status(500);
	res.render('500');	
});


app.listen(app.get('port'), function(){
	console.log('Started on port 3000');
	
});

//This puts 100 zip codes into a array, then it chooses 1 at random and returns it. 
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
	
	
	
	return zipArr[Math.floor(Math.random() * 100)];
	
};

/*
app.get('/postTest', function(req,res)
{
	res.render(postTest);
	
});

app.post('/postTest', function(req,res)
{
	var randoZip = req.body.zip;
	
	
	
});
*/