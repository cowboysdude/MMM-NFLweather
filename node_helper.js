/* Magic Mirror
    * Module: MMM-NFLweather
    *
    * By John Wade/ Jim L from http://www.phphelp.com/
    * MIT Licensed.
    */
  var NodeHelper = require('node_helper');
  var request = require('request');
  
 module.exports = NodeHelper.create({
     start: function () {
     },
 
     getGames: function (url) {
         var self = this;
 
         request({ url: url, method: 'GET' }, function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 var result = JSON.parse(body);
                 self.sendSocketNotification('GAMES_RESULT', result);
             }
         });
 
     },
 
     //Subclass socketNotificationReceived received.
     socketNotificationReceived: function(notification, payload) {
         if (notification === 'GET_GAMES') {
             this.getGames(payload);
         }
     }
 
 });