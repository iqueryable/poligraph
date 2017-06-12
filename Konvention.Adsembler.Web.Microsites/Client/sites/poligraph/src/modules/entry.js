var events = require('events');
var grid = require('grid');
var hub = require('hub');
var poligraph;
var transitions = require('transitions');

var html = document.querySelector('html');
var begin = document.getElementById('begin');
var logo = document.getElementById('logo');
var silhouette = document.getElementById('silhouette');
var background = document.getElementById('background');
var stage;
var timelines = {};

var queue = new createjs.LoadQueue();
createjs.Sound.alternateExtensions = ["mp3"];
queue.installPlugin(createjs.Sound);
queue.on('complete', loaded, this);
queue.loadManifest([
     { id: 'body', src: '../images/body.jpg' },
     { id: 'silhouette', src: '../images/silhouette.png' },
     { id: 'grid', src: '../images/grid.png' },
     { id: 'background', src: '../images/background.jpg' },
     { id: 'eye', src: '../images/eye.png' },
     { id: 'nose', src: '../images/nose.png' },
     { id: 'face', src: '../images/face.png' },
     { id: 'flatline', src: '../sounds/flatline.wav' },
     { id: 'clearthroath', src: '../sounds/clearthroath.wav' },
     { id: 'fluctuation', src: '../sounds/udslag.wav' },
]);


function loaded() {
    var flatline = createjs.Sound.play('flatline');
    flatline.loop = -1;

    require('days');
    poligraph = require('poligraph');

    hub.connect();
}

events.on('hub.loaded', function (e, response) {
    console.log(response);

    $('html').addClass('loaded');
    grid.start();
    setTimeout(function () {
        transitions.loaded();
    }, 500);
});

(function () {
    var circles = document.querySelectorAll('.button-circle');
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var stroke = circle.querySelector('.c2');
        var gawd = circle.querySelector('svg');

        (function () {
            var tl = new TimelineLite({ paused: true });
            tl.to(stroke, 1.0, { 'stroke-dashoffset': 0, ease: Power4.easeIn });
            tl.to(gawd, 1.0, { rotation: '+=135', ease: Power4.easeIn }, '-=1.0');
            tl.to(stroke, 1.0, { 'stroke-dashoffset': -295, ease: Power4.easeIn });
            tl.to(gawd, 1.0, { rotation: '+=225', ease: Power4.easeIn }, '-=1.0');

            circle.addEventListener('mouseover', function () {
                tl.seek(0);
                TweenLite.to(tl, 0.5, { progress: 0.5 })
            });

            circle.addEventListener('mouseout', function () {
                TweenLite.to(tl, 0.5, { progress: 1.0 })
            });
        })(circle, stroke);
    }


})();

(function () {
    var viewmode = document.getElementById('viewmode');
    var primary = document.querySelector('#viewmode .primary');
    var secondary = document.querySelector('#viewmode .secondary');


    var tl = new TimelineLite({ paused: true });
    tl.to(primary, 1.0, { autoAlpha: 0 });
    tl.to(secondary, 1.0, { autoAlpha: 1 }, '-=1.0');

    tl.to(primary, 1.0, { autoAlpha: 1 });
    tl.to(secondary, 1.0, { autoAlpha: 0 }, '-=1.0');

    viewmode.addEventListener('mouseover', function () {
        tl.seek(0);
        TweenLite.to(tl, 0.5, { progress: 0.5 });
    });

    viewmode.addEventListener('mouseout', function () {
        TweenLite.to(tl, 0.5, { progress: 1.0 });
    });

    //viewmode.addEventListener('click', function () {
    //    TweenLite.to(tl, 1.0, { progress: 1.0 });
    //});
})();

function enter() {
    begin.removeEventListener('click', enter);
    transitions.enter();
}

function exit() {
    logo.removeEventListener('click', exit);
    transitions.exit();
}

transitions.init({
    onEntered: function () {
        logo.addEventListener('click', exit);
        require('eye');
        poligraph.run();
        poligraph.track();
    },
    onExited: function () {
        begin.addEventListener('click', enter);
        poligraph.pause();
        ga('send', 'pageview');
    }
});
begin.addEventListener('click', enter);