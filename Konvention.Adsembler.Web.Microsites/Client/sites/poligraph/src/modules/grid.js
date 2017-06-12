var events = require('events');
var responsive = require('responsive');

var grid = document.getElementById('grid');
var size = 143;
var x = 0;



function move(distance) {
    distance = distance || 1

    x += 1;
    if (x % size === 0) {
        x = 0;
    }
    //grid.style.backgroundPositionX = x + 'px';
    grid.style.transform = 'translateX(' + x + 'px)';
}

function start() {
    createjs.Ticker.addEventListener('tick', move);
}

function stop() {
    createjs.Ticker.removeEventListener('tick', move);
}

events.on('responsive.resize', function (e, data) {
    if (data.viewport.height < 376) {
        size = 57;
    } else if (data.viewport.height < 769) {
        size = 116;
    } else {
        size = 143;
    }
});
responsive.init();

module.exports = {
    start: start,
    stop: stop,
    move: move
}