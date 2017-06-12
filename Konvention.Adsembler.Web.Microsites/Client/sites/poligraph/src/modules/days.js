var constants = require('constants');
var events = require('events');
var element = document.getElementById('days');

events.on('hub.loaded', function(e, response) {
    var day = Math.ceil(response.Minutes / constants.MINUTES_PER_DAY);
    element.innerHTML = 'Day ' + day + ' / 100';
})

module.exports = null;