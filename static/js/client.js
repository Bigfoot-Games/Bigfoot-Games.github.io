// JavaScript Document

const adtitle = document.getElementById("adtitle");
const adimage1 = document.getElementById("adimage1");
const adimage2 = document.getElementById("adimage2");
const adimage3 = document.getElementById("adimage3");
const adbtnpos = document.getElementById("adbtnpos");
const btnAd = document.getElementById("btnAd");
const closeAd = document.getElementById("closeAd");
const adtimerdisplay = document.getElementById("adtimerdisplay");
const adcontainer = document.getElementById("adcontainer");

//Sound elements
var soundvolume = "playing";
var clicksound = document.getElementById("clicksound");

var adcontent = [{adname: "ou", adtitles: "Order-Up: A family friendly food matching card game", image1: "./static/images/ads/orderup1.jpg", image2: "./static/images/ads/orderup2.jpg", image3: "./static/images/ads/orderup3.jpg", link: "https://bigfootgames.co/products/order-up-burger-edition"}, {adname: "eac", adtitles: "Everyone's a Critic: An inappropriate drawing game.", image1: "./static/images/ads/eac1.jpg", image2: "./static/images/ads/eac2.jpg", image3: "./static/images/ads/eac3.jpg", link: "https://bigfootgames.co/products/everyones-a-critic"}, {adname: "ptd", adtitles: "Pass the Deck: A party starting drinking game.", image1: "./static/images/ads/ptd1.jpg", image2: "./static/images/ads/ptd2.jpg", image3: "./static/images/ads/ptd3.jpg", link: "https://bigfootgames.co/products/pass-the-deck"}]

var adseconds = 4;
var adtimer;
var thisad = '';
var newad = '';
var previousad = '';
var btnlink = 'https://bigfootgames.co/products/order-up-burger-edition';
var lastadtimestamp = sessionStorage.getItem('lastadtimestamp');
var firstad = 'true';

var iframe = document.getElementById("gameframe");
var muted = 'false';

//Display load screen when loading game
window.onload = function() {
	$('#loadingdots').fadeOut(100); 
	setTimeout(function(){ 
		$('#loading').fadeOut(300); 
			setTimeout(function(){ 
				$('#loading').hide();
			}, 450);
	}, 1200);
};


//Mute & unmute Audio when button is clicked
$( "#mute" ).click(function() {
  
	if(muted == 'false'){
		
		$('#mute').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAA9ElEQVR4Ac3PwSr8URTA8TNG6TdR9l4AKWVpo0ZSXsQTUHZ4DgsJDTtj8zdmbHkI/52ysBsrFj42d3FvXc1KOd/Fud36LE782bHlRiPKnNvRKv/S0sd9Ro6EAE+WaqAxzMgxQtj3gnfdEuRkqDGll0CYdYGxxQxkZJRIW0+kWi7xWAOhk5EQ7swLc16xXYJyRukW/gnhAGdVkJGOcIV1YQX/66Ak067tCTP4qIAqWUvgcxIYJBLCKp4ngSYjuzjNQNYhaSIjbT2bVZCRKImogYyk94JxIlWQkbTf8JWT8BMJAR4sG+C2BPVObKRb+rpVMLnfB9+8qYN6JFBv7QAAAABJRU5ErkJggg==');
		
		soundvolume = 'muted';
		document.getElementById('gameframe').contentWindow.postMessage("muted", '*');
		SpeechSynthesisUtterance.volume = 0;
		speechSynthesis.cancel();
		muted = 'true';
		
	} else {
		$('#mute').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAwklEQVQ4y9XTvy5EYRCG8Xc126wTVyGxoReFQii4HiSyjTsR8aegpKDfZOMe6CS2XSqan8JRbBRnlDvl5Hm+TOZ7J1msculAr4aeJgl4MizgJIljr/iw04n/CImBK7xb68B/hUTPNSYdeDvSo5XEsjfsz4N/qu0+JIkTXNQEthLreKkKR4k+vqrCYSt8VoXNxAaea8J9khjhvLLWO02iMcVe9eOW3GBcjUbjFjOrtfCNTDGz/Z94jzten9PO7C7AnX8D9g4xXYFchGoAAAAASUVORK5CYII=');
		
		soundvolume = 'playing';
		document.getElementById('gameframe').contentWindow.postMessage("playing", '*');
		SpeechSynthesisUtterance.volume = 1;
		muted = 'false';
		
	}
	
});

window.addEventListener('message', function(message){
	
	if (message.origin == 'https://giphy-game.herokuapp.com' || message.origin == 'https://e-a-c.herokuapp.com' || message.origin == 'https://flipsee.herokuapp.com') {
	
		if(message.data == 'displayad'){
			var currentTime = (new Date().getTime()) / 1000;

			//Check if this is the first ad since reload
			if(firstad == true){
				createAd();
				adcontainer.style.display = "table"; //Show Ad
				gameframe.style.opacity = 0; //Hide game
				firstad = 'false';
			//Check if an ad has played in the last 5 minutes
			} else if (currentTime - lastadtimestamp >= 300) {
				createAd();
				adcontainer.style.display = "table"; //Show Ad
				gameframe.style.opacity = 0; //Hide game
			} else {
				return;
			}
		} else if (message.data == 'hidead') {
			//Clear open ad
			adcontainer.style.display = "none"; //Hide Ad
			gameframe.style.opacity = 1; //Show game
			adtimerdisplay.style.display = "block"; //Show ad timer
			adtimerdisplay.innerHTML = "5";
			adbtnpos.innerHTML = '';
		} else {
			return;
		}
	}
});
	
//Create an ad
function createAd() {
		
	//Get random ad
	newad = adcontent[Math.floor(Math.random() * adcontent.length)];
	
	//If this ad has been shown, get a new one
	if (newad == previousad){
		createAd();
		return;
	} else {
		thisad = newad;
		previousad = newad;
		sessionStorage.setItem('lastadtimestamp', (new Date().getTime()) / 1000);
		lastadtimestamp = sessionStorage.getItem('lastadtimestamp');
	}
	
	//Set ad contents
	adtitle.innerHTML = thisad.adtitles;
	adimage1.src = thisad.image1;
	adimage2.src = thisad.image2;
	adimage3.src = thisad.image3;
	console.log(thisad.link);
	
	//Set ad link for button
	btnlink = thisad.link;
	
	//Start timer
	adtimer = '';
	adseconds = 4; //Set timer for ad
	if(!adtimer) {
		adtimer = window.setInterval(function() {
		  updateAdCountdown();
		}, 1000);
	}
}

//Count down function
function updateAdCountdown() {
  if(adseconds < 5) {
    adtimerdisplay.innerHTML = adseconds;
  }
  if (adseconds > 0 ) {
         adseconds--;
     } else {
         clearInterval(adtimer);
		 endAdTimer();
		 return;
     }
}

function endAdTimer() {
	adtimerdisplay.style.display = "none"; //Hide Ad timer
	adbtnpos.innerHTML = '<button id="closeAd" class="buttonstart">Continue to Game</button>';
}

//Player selects the ad which opens in a new tab
btnAd.addEventListener("click", e => {
	
		//Play sound if volume is not muted
		if(soundvolume == "playing") {
			clicksound.currentTime = 0;
			clicksound.play();
		}
	
		window.open(
           btnlink, "_blank");
	
})

//Player selects the close ad button
document.addEventListener('click',function(e){
	if(e.target && e.target.id == 'closeAd'){
	
		//Play sound if volume is not muted
		if(soundvolume == "playing") {
			clicksound.currentTime = 0;
			clicksound.play();
		}
	
		//Close ad and open lobby
		adcontainer.style.display = "none"; //Hide Ad
		gameframe.style.opacity = 1; //Show game
		adtimerdisplay.style.display = "block"; //Show ad timer
		adtimerdisplay.innerHTML = "5";
		adbtnpos.innerHTML = '';
	 }
});