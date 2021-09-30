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

//Mute & unmute Audio when button is clicked
$( "#muteblue" ).click(function() {
  
	if(muted == 'false'){
		
		$('#muteblue').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDMgNzkuMTY0NTI3LCAyMDIwLzEwLzE1LTE3OjQ4OjMyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA5LTMwVDA5OjQ0OjA2LTA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0zMFQwOTo0NjoyOS0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0zMFQwOTo0NjoyOS0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplOWRmZWE5Ny1lOGI0LWMxNGUtYTYyMC03ZjA5Mzk4NzBmMGUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZTlkZmVhOTctZThiNC1jMTRlLWE2MjAtN2YwOTM5ODcwZjBlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTlkZmVhOTctZThiNC1jMTRlLWE2MjAtN2YwOTM5ODcwZjBlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOWRmZWE5Ny1lOGI0LWMxNGUtYTYyMC03ZjA5Mzk4NzBmMGUiIHN0RXZ0OndoZW49IjIwMjEtMDktMzBUMDk6NDQ6MDYtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4+PUBYAAAAp0lEQVRIie1VQQ7AIAgbi7/wWXvnnuU72GmLM7aAmUuWjJNGoLYgiqouM22dmv0NgFRv8l5qvcSIhb5ly9eaMegVBxUMFtKSSMHaDdIC9GRREIx8KQAKRGb6Iok8ICez1vfGIrHDgAmKHXkHbSJ6qdGH5mb6iVFBG+IJACpX20W05Sofd6EtBog+k+V25pFoBCQEgJK5JmukyJEZNQSAQISBy//pW3YAs7UiLO1nNIUAAAAASUVORK5CYII=');
		
		soundvolume = 'muted';
		document.getElementById('gameframe').contentWindow.postMessage("muted", '*');
		SpeechSynthesisUtterance.volume = 0;
		speechSynthesis.cancel();
		muted = 'true';
		
	} else {
		$('#muteblue').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDMgNzkuMTY0NTI3LCAyMDIwLzEwLzE1LTE3OjQ4OjMyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA5LTI5VDIyOjAxOjQ4LTA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOS0yOVQyMjowOTo1MS0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wOS0yOVQyMjowOTo1MS0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxZjNjNDE3OC1lOTY5LWE4NDAtYmQ4MC02NjYyMjMzNTc1M2EiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyZDZhNzhiNC0zYzNmLWEzNGMtYTQzMy0xZmRkMjM2ODcwNjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiZWRkMTYwZC1hNGViLTAwNGEtOTQ4NC04NDg2MDY3YzZkM2IiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJlZGQxNjBkLWE0ZWItMDA0YS05NDg0LTg0ODYwNjdjNmQzYiIgc3RFdnQ6d2hlbj0iMjAyMS0wOS0yOVQyMjowMTo0OC0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxZjNjNDE3OC1lOTY5LWE4NDAtYmQ4MC02NjYyMjMzNTc1M2EiIHN0RXZ0OndoZW49IjIwMjEtMDktMjlUMjI6MDk6NTEtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5sqMz0AAAAqElEQVRIie1V2w2AIAykhimUrWRMxlLWqF8mYsq1GDEh8f5MuV4fBxIzu56Yumb/QsBfP4jITJzTdp1tQdzXRRaY06bl5RyDVAXfRU60jEhzgxi3CkjkWifNAqhydWmaAErOTp59wfEo2ACqcd+4B7Co8W/yEALQqncXQcsBVM9pHaDqyMn2LDiWESERtUPrDkzvjnSuZcnauyPGiyXnGJ6IQGH6f/oaDrWlIYlS6F3IAAAAAElFTkSuQmCC');
		
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