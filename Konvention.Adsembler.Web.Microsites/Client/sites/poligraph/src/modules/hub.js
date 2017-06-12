var events = require('events');
var ticker = $.connection.poligraphTickerHub;

function addLie(lie, a, b, c, d) {
    console.log('hub.addLie');
    events.trigger('hub.addLie', lie);
}

function connect() {
    ticker.client.addLie = addLie;
    $.connection.hub.start().done(function() {
        ticker.server.getSetup().done(function (response) {
            events.trigger('hub.loaded', response);
        });
    });
   
}

module.exports = {
    connect: connect
};