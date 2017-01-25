 /* Magic Mirror
    * Module: MMM-NFLweather
    *
    * By John Wade/ Jim L from http://www.phphelp.com/
    * MIT Licensed.
    */
   
Module.register("MMM-NFLweather", {


       // Module config defaults.
       defaults: {
           key: "",
           updateInterval: 10 * 60 * 1000, // every 10 minutes
           animationSpeed: 1000,
           initialLoadDelay: 10, // 0 seconds delay
           retryDelay: 2500,
       },

       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       getStyles: function() {
           return ["MMM-NFLweather.css"];
       },

       // Define required translations.
       getTranslations: function() {
           // The translations for the defaut modules are defined in the core translation files.
           // Therefor we can just return false. Otherwise we should have returned a dictionairy.
           // If you're trying to build yiur own module including translations, check out the documentation.
           return false;
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);

           // Set locale.
           moment.locale(config.language);

           this.today = "";
           this.games = [];
           this.week = "";
           this.url = "http://www.fantasyfootballnerd.com/service/weather/json/";
           this.scheduleUpdate();

       },


       getDom: function() {
           var d = new Date();
           var fullYear = d.getFullYear();
           var now =  new Date().toISOString().slice(0,10);

           var wrapper = document.createElement("div");
           wrapper.className = "dimmed light small";

           var large = document.createElement("div");
           large.className = "light small";

           // var title = document.createElement("div");
           // title.innerHTML = this.name;
           // large.appendChild(title);

           var wrapper = document.createElement("div");
           var header = document.createElement("header");
           header.innerHTML = "NFL Game Weather";
           wrapper.appendChild(header);

           for (var key in this.games) {
               var gameEl = document.createElement("div"),
                   game = this.games[key];
               gameEl.className = "bright";

               var eDate = moment(game.gameDate).format('MM/DD/YYYY');
               var dome = game.isDome;  
               var weatherIcon = "<img src=" + game.mediumImg + ">";
               
               gameEl.innerHTML = eDate + " @ " + game.gameTimeET + " EST - " + game.tvStation;
               large.appendChild(gameEl);

               var awayLogo = document.createElement("span");
               var awayIcon = document.createElement("img");
               awayIcon.src = this.file("icons/" + game.awayTeam + ".png");
               awayLogo.appendChild(awayIcon);
               large.appendChild(awayLogo);

               var at = document.createElement("span");
               at.innerHTML = "~ AT ~";
               large.appendChild(at);

               var homeLogo = document.createElement("span");
               var homeIcon = document.createElement("img");
               homeIcon.src = this.file("icons/" + game.homeTeam + ".png");
               homeLogo.appendChild(homeIcon);
               large.appendChild(homeLogo);


               var gameTemp = document.createElement("div");
               gameTemp.classList.add("gametemp");
               if (game.high === null){
			   gameTemp.innerHTML = "Game Time Temp: Not Available";
			   large.appendChild(gameTemp);
			   } else {
               gameTemp.innerHTML = "Game Time Temp: " + game.high;
               large.appendChild(gameTemp);
               }
               if (dome === "1"){
			   var stad = document.createElement("div");
			   stad.classList.add("stadium");
			   stad.innerHTML = "Dome: " + game.stadium;
			   large.appendChild(stad);
			   } else {
               var windChill = document.createElement("div");
               windChill.classList.add("stadium");
               windChill.innerHTML = "Wind Chill: " + game.windChill;
               large.appendChild(windChill);
			   } 
                if (game.forecast === null){
			   var gameForecast = document.createElement("div");
               gameForecast.classList.add("forecast");
               gameForecast.innerHTML = "Forecast: N/A";
               large.appendChild(gameForecast);
			   } else {
               var gameForecast = document.createElement("div");
               gameForecast.classList.add("forecast");
               gameForecast.innerHTML = "Forecast: " + game.forecast;
               large.appendChild(gameForecast);
			   }
               
               if (game.winner === "" && eDate === now){
			   var progressWinner = document.createElement("div");
			   progressWinner.classList.add("blink");
               progressWinner.innerHTML = "In Progress";
               large.appendChild(progressWinner);
               } else if (game.winner === "") {
			   var noWinner = document.createElement("div");
               noWinner.innerHTML = "";
               large.appendChild(noWinner);
			   } else {
			   var winLogo = document.createElement("div");
			   var winIcon = document.createElement("img");
               winIcon.src = this.file("icons/" + game.winner + ".png");
               winLogo.appendChild(winIcon);
               gameWinner.innerHTML = "<font color=#fff>Winner</font>";
               large.appendChild(gameWinner);
               large.appendChild(winLogo);
			   }
               
               var spacers = document.createElement("span");
               spacers.innerHTML = "<br>";
               large.appendChild(spacers);
           }

           wrapper.appendChild(large);
           return wrapper;
       },

       processGames: function(data) {
           this.today = data.Today;
           this.games = data.Games;
           this.week = data.Week;

       },

       scheduleUpdate: function() {
           var self = this;

           setInterval(function() {
               self.getGames();
           }, this.config.updateInterval);

           self.getGames(this.config.initialLoadDelay);
       },

       getGames: function() {
           this.sendSocketNotification('GET_GAMES', this.url + this.config.key);
       },

       socketNotificationReceived: function(notification, payload) {
           if (notification === "GAMES_RESULT") {
               this.processGames(payload);
               this.updateDom(self.config.fadeSpeed);
           }
       },

   });
