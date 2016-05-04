var strobeWhite = true;
var strobeInterval = null;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var isDoubleTouch = false;
var isSingleTouch = true;
var strobeTime = 500;
var mColors = ["#fff", "#FF69B4", "#ff0", "#f00", "#f0f", "#800080", "#8B4513", "#0ff", "#006400", "#0f0", "#008b8b", "#00f"];
var mFlashColor = 0;
var mFlashColorValue = "#fff";
var isStrobeFlash = false;

window.onload = function () {
	setFlashSettings();
		
	var countAppStart = localStorage.getItem("countAppStart");
	if (countAppStart != null) {
		if (countAppStart < 5) {
			countAppStart++;
			localStorage.setItem("countAppStart", countAppStart);
		}
	} else {
		localStorage.setItem("countAppStart", 1);
	}
	
	var strobeIntervalTime = localStorage.getItem("strobeIntervalTime");
	if (strobeIntervalTime != null) {
		strobeTime = +strobeIntervalTime;
	}
	else {
		localStorage.setItem("strobeIntervalTime", strobeTime);
	}
	
	var mFlashColor = localStorage.getItem("flashColorIndex");
	if (mFlashColor == null) {
		localStorage.setItem("flashColorIndex", 0);
		localStorage.setItem("flashColorValue", "#fff");
		mFlashColor = 0;
		mFlashColorValue = "#fff";
	}
	else {
		mFlashColorValue = localStorage.getItem("flashColorValue");
	}
	
	setColorMainPage();
	
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back") {
        	restoreSettings();
        	closeApp();
        }
    });
    
    document.addEventListener('visibilitychange', function() {
    	if (document.hidden) {
    		restoreSettings();
    		closeApp();
    	}
    });

    var mainPage = document.getElementById('main');
    mainPage.addEventListener("touchstart", function(ev){
    	var l = ev.touches.length;
    	if (l > 1) {
    		isDoubleTouch = true;
    		isSingleTouch = false;
    	}
    	else {
    		isSingleTouch = true;
    		startX = ev.touches[0].pageX;
    		startY = ev.touches[0].pageY;
    		endX = startX;
    		endY = startY;
    	}
		ev.preventDefault();
    }); 

    mainPage.addEventListener("touchmove", function(ev){
    	endX = ev.touches[0].pageX;
    	endY = ev.touches[0].pageY;
		ev.preventDefault();
    }); 
    
    mainPage.addEventListener("touchend", checkTouchEvent); 
    
    var timeoutTime = 10000 - (countAppStart * 200);
	setTimeout(function () {
		box0 = document.querySelector('#textbox0');
		box0.innerHTML = "";
		box1 = document.querySelector('#textbox1');
		box1.innerHTML = "";
		box2 = document.querySelector('#textbox2');
		box2.innerHTML = "";
		box3 = document.querySelector('#textbox3');
		box3.innerHTML = "";
		box4 = document.querySelector('#textbox4');
		box4.innerHTML = "";
	}, timeoutTime);
};

function restoreSettings() {
	if (strobeInterval != null) {
		clearInterval(strobeInterval);
	}
	
	tizen.power.release("SCREEN");
	tizen.power.restoreScreenBrightness();
}

function closeApp() {
	localStorage.setItem("strobeIntervalTime", strobeTime);
	localStorage.setItem("flashColorIndex", mFlashColor);
	localStorage.setItem("flashColorValue", mFlashColorValue);

	tizen.application.getCurrentApplication().exit();
}

function setFlashSettings() {
	tizen.power.request("SCREEN", "SCREEN_NORMAL");
	tizen.power.setScreenBrightness(1);
	
	setColorMainPage();
}

function setColorMainPage() {
	var mainPage = document.getElementById("main");
	mainPage.style.backgroundColor = mFlashColorValue;
}


function strobeFlash() {
	var mainPage = document.getElementById("main");
	if (strobeWhite) {
		mainPage.style.backgroundColor = "#000";
	}
	else {
		mainPage.style.backgroundColor = mFlashColorValue;
	}
	strobeWhite = !strobeWhite;
}

function checkTouchEvent(ev){
	var swipeLeft = isSingleTouch && (startX > (endX + 100));
	var swipeRight = isSingleTouch && (endX > (startX + 100));
	
	if (isDoubleTouch) {
		isDoubleTouch = false;
		if (isStrobeFlash) {
			if (strobeInterval != null) {
				clearInterval(strobeInterval);
			}
			setColorMainPage();
		}
		else {
			strobeInterval = setInterval(strobeFlash, strobeTime);
		}
		isStrobeFlash = !isStrobeFlash;
	} 
	else {
		if (swipeLeft) {
			if (isStrobeFlash) {
				clearInterval(strobeInterval);
				if (strobeTime >= 200) {
					strobeTime = strobeTime - 50;
				}
				else if (strobeTime >= 20) {
					strobeTime = strobeTime - 10;
				}
				strobeInterval = setInterval(strobeFlash, strobeTime);
			} else {
				if (mFlashColor > 0) {
					mFlashColor = mFlashColor - 1;
				}
				else {
					mFlashColor = mColors.length - 1;
				}
				mFlashColorValue = mColors[mFlashColor];
				setColorMainPage();
			}
		} else if (swipeRight) {
			if (isStrobeFlash) {
				clearInterval(strobeInterval);
				if (strobeTime < 200) {
					strobeTime = strobeTime + 10;
				}
				else {
					strobeTime = strobeTime + 50;
				}
				strobeInterval = setInterval(strobeFlash, strobeTime);
			} 
			else {
				if (mFlashColor == (mColors.length-1)) {
					mFlashColor = 0;
				}
				else {
					mFlashColor = 1 + mFlashColor;
				}
				mFlashColorValue = mColors[mFlashColor];
				setColorMainPage();				
			}
		} else {
		}
	}
	
	ev.preventDefault();
}
