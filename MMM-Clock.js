/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: Clock
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("MMM-Clock", {
	// Module config defaults.
	defaults: {
		displayType: "digital", // options: digital, analog, both

		timeFormat: config.timeFormat,
		displaySeconds: true,
		showPeriod: true,
		showPeriodUpper: false,
		clockBold: false,
		showDate: true,
		showWeek: false,
		dateFormat: "dddd, LL",

		/* specific to the analog clock */
		analogSize: "200px",
		analogFace: "simple", // options: 'none', 'simple', 'face-###' (where ### is 001 to 012 inclusive)
		analogPlacement: "bottom", // options: 'top', 'bottom', 'left', 'right'
		analogShowDate: "top", // options: false, 'top', or 'bottom'
		secondsColor: "#888888",
		timezone: null,
	},
	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "moment-timezone.js"];
	},
	// Define styles.
	getStyles: function() {
		return ["clock_styles.css"];
	},
	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Schedule update interval.
		var self = this;
		// setInterval(function() {
		// 	self.updateDom();
		// }, 1000);

		// Set locale.
		moment.locale(config.language);

	},
	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		/************************************
		 * Create wrappers for DIGITAL clock
		 */

		var dateWrapper = document.createElement("div");
		var timeWrapper = document.createElement("div");
		var periodWrapper = document.createElement("span");
		var weekWrapper = document.createElement("div")
		// Style Wrappers
		wrapper.className = "wrapper-clock";
		timeWrapper.className = "time bright";
    dateWrapper.className = "date normal";
		weekWrapper.className = "week dimmed medium"

		// Set content of wrappers.
		// The moment().format("h") method has a bug on the Raspberry Pi.
		// So we need to generate the timestring manually.
		// See issue: https://github.com/MichMich/MagicMirror/issues/181
		var timeString;
		var now = moment();
		if (this.config.timezone) {
			now.tz(this.config.timezone);
		}

		var hourSymbol = "HH";
		if (this.config.timeFormat !== 24) {
			hourSymbol = "h";
		}

		if (this.config.clockBold === true) {
			timeString = now.format("[<span class=\"bold\">]" + hourSymbol + "[</span>]:mm");
		} else {
			timeString = now.format("[<span class=\"bold\">]" + hourSymbol + ":mm[</span>]");
		}

		if (this.config.showDate) {
			// 	dateWrapper.innerHTML = now.format(this.config.dateFormat);
			var dayWrapper = document.createElement("span");
			var monthWrapper = document.createElement("span");
			// Style Wrappers
			dayWrapper.className = "day bold";
			monthWrapper.className = "month xsmall";
			// day
			dayWrapper.innerHTML = now.format('D');
			monthWrapper.innerHTML = now.format('MMM').replace(".", "");
			dateWrapper.appendChild(dayWrapper);
			dateWrapper.appendChild(monthWrapper);
		}


		if (this.config.showWeek) {
			weekWrapper.innerHTML = this.translate("WEEK", { weekNumber: now.week() });
		}
		timeWrapper.innerHTML = timeString;
		if (this.config.showPeriodUpper) {
			periodWrapper.innerHTML = now.format("A");
		} else {
			periodWrapper.innerHTML = now.format("a");
		}

		/*******************************************
		 * Combine wrappers, check for .displayType
		 */

		if (this.config.displayType === "digital") {
			// Display only a digital clock
			wrapper.appendChild(timeWrapper);
			wrapper.appendChild(dateWrapper);
			wrapper.appendChild(weekWrapper);
		}

		// Return the wrapper to the dom.
		return wrapper;
	}
});
