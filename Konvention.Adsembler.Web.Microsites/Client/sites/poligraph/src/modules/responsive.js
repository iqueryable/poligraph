var events = require('events');

var height = 1560;
var scale = 1;
var last = {
    width: 0,
    height: 0
}

function resize() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    scale = vh / height;

    var data = {
        viewport: {
            width: vw,
            height: vh,
            scale: scale
        },
        delta: {
            width: last.width - vw,
            height: last.height - vh
        }
    }

    last.width = vw;
    last.height = vh;

    //$(window).trigger('responsive.resize', data);
    events.trigger('responsive.resize', data);
}

//function register(method) {
//    $(window).on('responsive.resize', function (e, data) {
//        method(data);
//    });
//}

function scaled(number) {
    return number * scale;
}

function init() {
    resize();

    // setup events
    $(window).on('resize', function () {
        resize();
    });
}

module.exports = {
    init: init,
    //register: register,
    scaled: scaled,
    getScale: function () {
        return scale;
    }
};