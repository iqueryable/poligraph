var dom = require('dom');
var events = require('events');
var object = require('object');
var responsive = require('responsive');


function createElement(label, settings) {
    var radius = settings.radius;
    var diameter = radius * 2;

    var circle = dom.html('<div class="label-circle"></div>');
    circle.style.width = diameter + 'px';
    circle.style.height = diameter + 'px';
    var c = '<svg viewBox="0 0 ' + diameter + ' ' + diameter + '" style="display: block; width: 100%;"><path class="c2" d="M ' + radius + ',' + radius + ' m 0,-' + (radius - 1) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,' + (diameter - 2) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,-' + (diameter - 2) + '" stroke="rgb(0,0,0)" stroke-width="1.5" fill-opacity="0"></path></svg>';
    var t = '<div class="inner"><h2>' + settings.title + '</h2><p>' + settings.text + '</p><u>Link</u></div>';
    circle.innerHTML = c + t;
    if (settings.clickable) {
        radius = responsive.scaled(20);
        diameter = radius * 2;
        var x1 = diameter * 0.32;
        var x2 = diameter * 0.68;
        //var b = dom.html('<div class="close"><span class="b1"></span><span class="b2"></span></div>');
        //var b = dom.html('<div class="close"><svg viewBox="0 0 ' + 24 + ' ' + 24 + '" style="display: block; width: 100%;"><path class="c0" d="M ' + 12 + ',' + 12 + ' m 0,-' + (12 - 1) + ' a ' + (12 - 1) + ',' + (12 - 1) + ' 0 1 1 0,' + (24 - 2) + ' a ' + (12 - 1) + ',' + (12 - 1) + ' 0 1 1 0,-' + (24 - 2) + '" stroke="rgb(0,0,0)" stroke-width="1.5" fill-opacity="0"></path><line class="c0" x1="7.75" y1="7.75" x2="16.25" y2="16.25" /><line class="c0" x1="7.75" y1="16.25" x2="16.25" y2="7.75" /></svg></div>');
        var b = dom.html('<div class="close"><svg viewBox="0 0 ' + diameter + ' ' + diameter + '" style="display: block; width: 100%;"><path class="c0" d="M ' + radius + ',' + radius + ' m 0,-' + (radius - 1) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,' + (diameter - 2) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,-' + (diameter - 2) + '" stroke="rgb(0,0,0)" stroke-width="1.5" fill-opacity="0"></path><line class="c0" x1="' + x1 + '" y1="' + x1 + '" x2="' + x2 + '" y2="' + x2 + '" /><line class="c0" x1="' + x1 + '" y1="' + x2 + '" x2="' + x2 + '" y2="' + x1 + '" /></svg></div>');
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            $(label).trigger('label.close');
        });
        circle.appendChild(b);
    }
    var url = settings.link;
    circle.addEventListener('click', function () {
        window.open(url, '_blank');
    });

    var bl = new createjs.Shape();
    bl.graphics.setStrokeStyle(1.5);
    bl.graphics.beginStroke('rgba(255, 255, 255, 0.5)');
    bl.graphics.moveTo(settings.x, settings.y);

    events.on('responsive.resize', function (e, data) {
        scale = data.viewport.scale;

        var radius = responsive.scaled(128);
        var diameter = radius * 2;

        circle.style.width = diameter + 'px';
        circle.style.height = diameter + 'px';

        var c = '<svg viewBox="0 0 ' + diameter + ' ' + diameter + '" style="display: block; width: 100%;"><path class="c2" d="M ' + radius + ',' + radius + ' m 0,-' + (radius - 1) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,' + (diameter - 2) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,-' + (diameter - 2) + '" stroke="rgb(0,0,0)" stroke-width="1.5" fill-opacity="0"></path></svg>';
        var t = '<div class="inner"><h2>' + settings.title + '</h2><p>' + settings.text + '</p><u>Link</u></div>';
        circle.innerHTML = c + t;
        if (settings.clickable) {
            radius = responsive.scaled(20);
            diameter = radius * 2;
            var x1 = diameter * 0.32;
            var x2 = diameter * 0.68;
            var b = dom.html('<div class="close"><svg viewBox="0 0 ' + diameter + ' ' + diameter + '" style="display: block; width: 100%;"><path class="c0" d="M ' + radius + ',' + radius + ' m 0,-' + (radius - 1) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,' + (diameter - 2) + ' a ' + (radius - 1) + ',' + (radius - 1) + ' 0 1 1 0,-' + (diameter - 2) + '" stroke="rgb(0,0,0)" stroke-width="1.5" fill-opacity="0"></path><line class="c0" x1="' + x1 + '" y1="' + x1 + '" x2="' + x2 + '" y2="' + x2 + '" /><line class="c0" x1="' + x1 + '" y1="' + x2 + '" x2="' + x2 + '" y2="' + x1 + '" /></svg></div>');
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                $(label).trigger('label.close');
            });
            circle.appendChild(b);
        }
        draw(label, label.container);
    });

    return {
        circle: circle,
        line: bl
    };
}

var Label = function (settings) {
    this.x = settings.x;
    this.y = settings.y;
    this.label = settings.data;
    this.eventFn;
    this.container = settings.container;

    var element = createElement(this, {
        x: settings.x,
        y: settings.y,
        radius: responsive.scaled(128),
        title: settings.data.title,
        text: settings.data.text,
        link: settings.data.link,
        clickable: settings.clickable
    });

    this.blPercentage = 0;
    var time = 750;
    var increment = 6000 / time;
    this.increment = 0;

    this.element = element;
    settings.elementContainer.appendChild(element.circle);
    settings.container.addChild(element.line);

    $(this).on('label.close', function () {
        this.increment = -increment;
        if (!this.eventFn && this.blPercentage > 0) {
            this.eventFn = createjs.Ticker.addEventListener('tick', function () {
                draw(me, settings.container);
            });
        }
    });
   
    $(this).on('label.show', function () {
        this.increment = increment;
        if (!this.eventFn && this.blPercentage < 100) {
            this.eventFn = createjs.Ticker.addEventListener('tick', function () {
                draw(me, settings.container);
            });
        }
    });
    var me = this;
}

function draw(label, container) {
    var startX = label.x;
    var startY = label.y;

    var endX = startX - responsive.scaled(85);
    var endY = startY - responsive.scaled(360);

    var radius = responsive.scaled(128);


    var a = startX - endX;
    var b = startY - endY;
    var hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    var length = hypotenuse - radius;
    var percentage = length / hypotenuse;
    var delta = 1 - percentage;
    var deltaA = a * delta;
    var deltaB = b * delta;

    var lengthA = a * percentage;
    var lengthB = b * percentage;

    var blPercentage = label.blPercentage;

    var circle = label.element.circle;
    //circle.style.display = 'block';
    var bl = label.element.line;
    var me = label;

    blPercentage += me.increment;
    if (blPercentage > 100) {
        blPercentage = 100;
        createjs.Ticker.removeEventListener('tick', label.eventFn);
        label.eventFn = null;
    }

    if (blPercentage > 0) {
        circle.style.display = 'block';
    }

    if (blPercentage < 0) {
        blPercentage = 0;
        circle.style.display = 'none';
        createjs.Ticker.removeEventListener('tick', label.eventFn);
        label.eventFn = null;
    }

    var x = startX - lengthA * blPercentage / 100;
    var y = startY - lengthB * blPercentage / 100;

    if (label.blCmd) {
        label.blCmd.command.x = x;
        label.blCmd.command.y = y;
        bl.graphics._stroke.style = 'rgba(255, 255, 255, ' + blPercentage / 200 + ')';
    } else {
        label.blCmd = bl.graphics.lineTo(x, y);
    }
    container.stage.update();

    var dx = x - deltaA;
    var dy = y - deltaB;

    circle.style.top = (container.y + dy - radius) + 'px';
    circle.style.left = (dx - radius) + 'px';
    circle.style.opacity = (blPercentage - 25) / 75;

    me.blPercentage = blPercentage;
}

function create(x, y, data, container, elementContainer, clickable) {
    return new Label({
        x: x,
        y: y,
        data: data,
        container: container,
        clickable: clickable,
        elementContainer: elementContainer
    });
}

module.exports = {
    create: create
};