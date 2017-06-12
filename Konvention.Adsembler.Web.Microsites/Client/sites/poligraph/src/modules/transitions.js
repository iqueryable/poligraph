var events = require('events');

var timeline;

function init(config) {
    var html = document.querySelector('html');
    var loading = document.getElementById('loading');
    var begin = document.getElementById('begin');
    var silhouette = document.getElementById('silhouette');
    var grid = document.getElementById('grid');
    var background = document.getElementById('background');
    var trump = document.getElementById('trump');
    var homeElements = document.querySelectorAll('.home-element');
    var pageElements = document.querySelectorAll('.page-element');
    var stage = document.getElementById('stage');
    var elements = document.getElementById('elements');

    timeline = new TimelineLite({ paused: true });

    //loaded
    timeline.addLabel('loaded');
    timeline.to(loading, 1.0, { autoAlpha: 0, ease: Linear.easeNone });
    timeline.from(silhouette, 1.5, { autoAlpha: 0, ease: Linear.easeNone });
    timeline.from(grid, 1.0, { autoAlpha: 0, ease: Linear.easeNone }, '-=1.0');
    timeline.from(background, 1.0, { autoAlpha: 0, ease: Linear.easeNone }, '-=1.0');
    timeline.from(begin, 0.5, { autoAlpha: 0, ease: Linear.easeNone }, '-=0.5');
    timeline.add(function () {
        $(html).addClass('ready');
    });
    timeline.addPause();

    // enter
    timeline.addLabel('enter');
    timeline.to(silhouette, 1.0, { left: '-100%', autoAlpha: 0, ease: Power4.easeOut });
    timeline.to(background, 1.0, { autoAlpha: 0 }, '-=1.0');
    timeline.staggerTo(homeElements, 0.2, { autoAlpha: 0 }, 0.1, '-=0.5');
    timeline.add(function () {
        $(html).addClass('timeline');
    });
    timeline.to(trump, 1.0, { left: '0', autoAlpha: 1, ease: Power4.easeOut });
    timeline.staggerTo(pageElements, 0.2, { autoAlpha: 1 }, 0.1, '-=0.5');
    timeline.to(stage, 1.0, { autoAlpha: 1, ease: Power4.easeOut }, '-=0.1');
    timeline.to(elements, 1.0, { autoAlpha: 1, ease: Power4.easeOut }, '-=1.0');
    timeline.add(function () {
        if (config.onEntered) {
            config.onEntered();
        }
    }, '-=1.0');
    timeline.addPause();

    // exit
    timeline.addLabel('exit');
    timeline.to(stage, 1.0, { autoAlpha: 0, ease: Power4.easeOut });
    timeline.to(elements, 1.0, { autoAlpha: 0, ease: Power4.easeOut }, '-=1.0');
    timeline.staggerTo(pageElements, 0.2, { autoAlpha: 0 }, 0.1, '-=0.5');
    timeline.to(trump, 1.0, { left: '-500px', autoAlpha: 0, ease: Power4.easeOut }, '-=0.1');
    timeline.add(function () {
        $(html).removeClass('timeline');
    });
    timeline.staggerTo(homeElements, 0.2, { autoAlpha: 1 }, 0.1);
    timeline.to(background, 1.0, { autoAlpha: 1 }, '-=1.0');
    timeline.to(silhouette, 1.0, { left: '0', autoAlpha: 1, ease: Power4.easeOut }, '-=0.5');
    timeline.add(function () {
        if (config.onExited) {
            config.onExited();
        }
    }, '-=1.0');
    timeline.addPause();
}

function loaded() {
    timeline.play('loaded');
}

function enter() {
    timeline.play('enter');
}

function exit() {
    timeline.play('exit');
}

function play(label) {
    timeline.play(label);
}

module.exports = {
    init: init,
    loaded: loaded,
    enter: enter,
    exit: exit,
    play: play
}