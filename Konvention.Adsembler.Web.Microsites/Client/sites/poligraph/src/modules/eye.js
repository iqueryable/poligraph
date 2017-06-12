var events = require('events');

var max = 14;
var delta;
var eye = document.querySelector('#trump .eye');
var rect = eye.getBoundingClientRect()
var element = {
    x: rect.left,
    y: rect.top,
    w: eye.offsetWidth,
    h: eye.offsetHeight,
};

events.on('responsive.resize', function (e, data) {
    rect = eye.getBoundingClientRect()
    element = {
        x: rect.left,
        y: rect.top,
        w: eye.offsetWidth,
        h: eye.offsetHeight,
    };
});

$(window).mousemove(function (e) {
    var center = {
        x: element.w / 2,
        y: element.h / 2,
    };
    var mouse = {
        x: e.pageX,
        y: e.pageY,
    };
    var offset = {
        x: mouse.x - element.x - center.x,
        y: mouse.y - element.y - center.y,
    };
    var treshold = element.w * max / 100;
    var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    if (distance < treshold) {
        offset = {
            x: offset.x - treshold,
            y: offset.y * 0.75,
        }
    } else {
        var cap = treshold / distance;
        offset = {
            x: offset.x * cap - treshold,
            y: offset.y * cap * 0.75,
        }
    }
    eye.style.transform = 'translateX(' + offset.x + 'px) translateY(' + offset.y + 'px)';
});

module.exports = {};