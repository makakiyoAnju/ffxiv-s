/*	updates the context	*/
function initialize() {
	update();
	setInterval("update()", 500);
}

var bars = [];
function update() {
	if (typeof(ActXiv) == 'undefined') { return; }

	var containerDiv = document.getElementById('spelltimer');
	if (typeof(ActXiv.timerFrames) != 'undefined') {
		ActXiv.timerFrames.forEach(function (timerFrame) {
			if (timerFrame.spellTimers.length > 0 &&
				timerFrame.onlyMasterTicks && 
				!timerFrame.absoluteTiming) {
				var latestSpellTimer;
				timerFrame.spellTimers.forEach(function (spellTimer) {
					if (typeof(latestSpellTimer) == 'undefined') { // 初回
						latestSpellTimer = spellTimer;
					} else if (latestSpellTimer.startTime < spellTimer.startTime) { // 2 回目以降
						latestSpellTimer = spellTimer;
					}
				});
				processActXivTimerEntry(containerDiv, timerFrame, latestSpellTimer);
			}
			else { 
				timerFrame.spellTimers.forEach(function (spellTimer) {
					processActXivTimerEntry(containerDiv, timerFrame, spellTimer);
				});
			}
		});
	}

	var newBars = [];
	for (var i = 0; i < bars.length; i++) {
		if (!bars[i].spellTimer.getIsExpired()) { // 期限切れではない
			bars[i].updateBar(); // バー更新
			newBars.push(bars[i]);
		} else {
			bars[i].removeBarElement(); // バーを親要素から削除
		}
	}
	bars = newBars;

	ActXiv = {};
}

function processActXivTimerEntry(container, _tf, _st) {
	var spellTimer = new SpellTimer(_tf, _st);

	if (spellTimer.getIsExpired()) {
		return;
	};

	var bar = getTimerBarFromList(spellTimer);

	if (typeof (bar) == 'undefined' && _tf.onlyMasterTicks && !_tf.absoluteTiming) {
		for (var i = bars.length - 1; i >= 0; i--) {
			if (bars[i].spellTimer.key == _tf.key) {
				bars[i].removeBarElement();
				bars.splice(i, 1);
			}
		}
	}

	if (typeof(bar) == 'undefined') {
		bar = new TimerBar(spellTimer);

		bar.setBarLabel(function (_st) {
			var nameText = _st.name;
			var remaining = _st.getRemaining();
			var timerText;
			if (remaining <= 0) {
				timerText = "READY";
			} else {
				timerText = _st.getRemaining().toFixed(0) + "s";
			}

			return "<span class='label'><span class='name' style='text-shadow: -1px 0 2px " + getColorCode(bar.spellTimer.color) + ", 0 1px 2px " + getColorCode(bar.spellTimer.color) + ", 1px 0 2px " + getColorCode(bar.spellTimer.color) + ", 0 -1px 2px " + getColorCode(bar.spellTimer.color) + ";'>" + nameText + "</span>: <span class='timer'>" + timerText + "</span></span>";
		});
		bar.useHTMLLabel = true;
		bar.setBarColor('rgba(255, 255, 255, 0.4)');
		//bar.setBarColor(getColorCodeFromNumber(bar.spellTimer.color));
		//bar.setBarHeight(20);
		
		var i;
		var inserted = false;
		for (i = 0; i < bars.length; i++) {
			if (spellTimer.getRemaining() < bars[i].spellTimer.getRemaining()) {
				bars.splice(i, 0, bar);
				inserted = true;
				break;
			}
		}
		if (!inserted) {
			bars.push(bar);
		}

		var nextElement;
		if (bars[i + 1]) {
			nextElement = bars[i + 1].barElement;
		}
		container.insertBefore(bar.barElement, nextElement)
	}
}

function getTimerBarFromList(spellTimer) {
	var uniqueName = TimerBar.createUniqueName(spellTimer);
	for (var i = 0; i < bars.length; i++) {
		if (bars[i].uniqueName == uniqueName) {
			return bars[i];
		}
	}
	return;
}

// SpellTimer
var SpellTimer = (function (tf, st) {
	this.color = tf.color;
	this.expireCount = tf.expireCount;
	this.key = tf.key;
	this.name = tf.name;
	this.startCount = tf.startCount;
	this.tooltip = tf.tooltip;
	this.warningCount = tf.warningCount;
	this.startTime = st.startTime;
});
SpellTimer.prototype = {
	getIsExpired: function () {
		if (this.getRemaining() < this.expireCount) {
			return true;
		} else {
			return false;
		}
	},
	getElapsed: function() {
		return getElapsedSeconds(this.startTime);
	},
	getRemaining: function () {
		return this.startCount - this.getElapsed();
	}
};

// TimerBar
var TimerBar = (function (_spellTimer) {

	this.spellTimer = _spellTimer;

	this.uniqueName = TimerBar.createUniqueName(this.spellTimer);
	this.barElement = this._createProgressBarElement();
	this.labelFunc = (function (_bar) { return ""; });
	this.useHTMLLabel = false;

});

TimerBar.createUniqueName = function (spellTimer) {
	return "TBAR_" + spellTimer.name + "_" + spellTimer.startTime.toString();
}

/*	bars for the timer and displays them in a certain format	*/
TimerBar.prototype = {
	setBarLabel: function (strOrFunc) {
		if (typeof (strOrFunc) == "function") {
			this.labelFunc = strOrFunc;
		} else {
			this.labelFunc = function () { return strOrFunc; };
		}
	},
	setBarColor: function (color) {
		this.barElement.children[0].style.backgroundColor = color;
	},
	setBarHeight: function (height) {
		this.barElement.style.height = height;
	},
	updateBar: function () {
		var text = this.labelFunc(this.spellTimer);
		if (this.useHTMLLabel) {
			this.barElement.children[1].innerHTML = text;
		} else {
			this.barElement.children[1].innerText = text;
		}
	},
	_createProgressBarElement: function () {
		var outerDiv = document.createElement("div");
		outerDiv.className = "progress-outer";
		var barDiv = document.createElement("div");
		barDiv.className = "progress-bar";
		var textDiv = document.createElement("div");
		textDiv.className = "progress-text";

		outerDiv.appendChild(barDiv);
		outerDiv.appendChild(textDiv);

		var percentage = Math.max(0, Math.min(1, this.spellTimer.getRemaining() / this.spellTimer.startCount)) * 100;
		barDiv.style.width = percentage.toFixed(2) + "%";
		
		setTimeout(function(barDiv) {
		  barDiv.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
		}, Math.max(0, (this.spellTimer.getRemaining() - this.spellTimer.warningCount) * 1000), barDiv);

		$(barDiv).animate(
			{ width: "0%" },
			Math.max(0, this.spellTimer.getRemaining() * 1000),
			"linear");

		return outerDiv;
	},
	removeBarElement: function () {
		this.barElement.parentElement.removeChild(this.barElement);
	}
};

/*	gets the duration of the set time and counts down	*/
function getElapsedSeconds(startTime) {
	var jsDate = new Date();
	var offsetMinutes = new Date().getTimezoneOffset();
	var jsTime = jsDate.getTime() - offsetMinutes * 60 * 1000;

	return (jsTime - startTime) / 1000;
}

/*	functions that get color and return in rgba/rgb format	*/
function getColorCodeFromNumber(number) {
	var alpha = ((number >> 24) & 0xFF) / 255.0;
	var red = (number >> 16) & 0xFF;
	var green = (number >> 8) & 0xFF;
	var blue = number & 0xFF;

	return "rgba(" + red + ", " + green + ", " + blue + ", 0.3)";
}

function getColorCode(number) {
	var red = (number >> 16) & 0xFF;
	var green = (number >> 8) & 0xFF;
	var blue = number & 0xFF;

	return "rgb(" + red + ", " + green + ", " + blue + ")";
}