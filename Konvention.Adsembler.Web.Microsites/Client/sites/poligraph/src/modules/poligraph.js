var dom = require('dom');
var events = require('events');
var responsive = require('responsive');
var label = require('label');
var interactjs = require('interactjs');
var grid = require('grid');
var moment = require('moment');
var transitions = require('transitions');

var stage;
var scale = 0.60875;

function scaled(number) {
    return number * scale;
}
function color() {
    return '#e62a4d';
}

var Point = function (value) {
    this.value = value;
};

var Plot = function (x, y, data, container, eContainer, clickable) {
    var me = this;
    var r = new createjs.Shape();
    r.graphics.setStrokeStyle(0);
    r.graphics.beginFill("rgba(255, 255, 255, 1.0)");
    r.graphics.rect(x - 13, y - 13, 20, 20);

    var c = new createjs.Shape();
    c.graphics.setStrokeStyle(0);
    c.graphics.beginFill("rgba(255, 255, 255, 1.0)");
    c.graphics.drawCircle(x - 3, y - 3, 4);
    c.hitArea = r;
    c.cursor = "pointer";

    if (clickable) {
        c.addEventListener('mouseover', function (evt) {

            var p = document.getElementById('pulse-container');
            p.style.top = (container.y + c.graphics.command.y - 10) + 'px';
            p.style.left = (container.x + c.graphics.command.x - 10) + 'px';
            p.style.display = 'block';
        });

        c.addEventListener('mouseout', function (evt) {
            var p = document.getElementById('pulse-container');
            p.style.display = 'none';
        });

        c.addEventListener('click', function (evt) {
            createjs.Sound.play('clearthroath');
            $(me.label).trigger('label.show');
        });
    }


    this.element = c;
    this.label = label.create(x - 3, y - 3, data, container, eContainer, clickable);
};

var container;
var container2;
var line;
var line2;
var direction = 0;
var queue = [];

function coord(x, y) {
    return { x: x, y: y };
}

function b1(t) {
    return (t * t * t);
}

function b2(t) {
    return (3 * t * t * (1 - t));
}

function b3(t) {
    return (3 * t * (1 - t) * (1 - t));
}

function b4(t) {
    return ((1 - t) * (1 - t) * (1 - t));
}

function bezier(percent, c1, c2, c3, c4) {
    var x = c1.x * b1(percent) + c2.x * b2(percent) + c3.x * b3(percent) + c4.x * b4(percent);
    var y = c1.y * b1(percent) + c2.y * b2(percent) + c3.y * b3(percent) + c4.y * b4(percent);

    return coord(x, y);
}

function silent() {
    if (smallTimer) {
        clearTimeout(smallTimer);
        smallTimer = null;
    };

    smallTimer = setTimeout(function () {
        point = new Point(small());
        queue.push(point);
        point = new Point(-small());
        queue.push(point);
        point = new Point(small());
        queue.push(point);
        point = new Point(-small());
        queue.push(point);

        smallTimer = null;
    }, 10000);
}

function small() {
    return scaled(Math.random() * 20);
}

function large() {
    return scaled(Math.random() * 260 + 60);
}

function lieDetected(lie) {
    var source = lie.Source;
    var title = lie.Title;
    var link = lie.Link;

    // clear silent fluctuations
    if (smallTimer) {
        clearTimeout(smallTimer);
        smallTimer = null;
    };

    // set nose length - but only in live mode
    lies.push(lie);
    if (isLive) {
        liability = 100 - lies.length;
        if (liability < 0) {
            length = 0;
        }
        document.getElementById('nose').style.right = liability + '%';
    }

    var point;
    point = new Point(small());
    queue.push(point);
    point = new Point(-small());
    queue.push(point);

    point = new Point(large());
    queue.push(point);
    point = new Point(-large());
    queue.push(point);
    point = new Point(large());
    point.label = {
        title: source,
        text: title,
        link: link
    };
    queue.push(point);
    point = new Point(-large());
    queue.push(point);
    point = new Point(large());
    queue.push(point);
    point = new Point(-large());
    queue.push(point);
    point = new Point(large());
    queue.push(point);

    point = new Point(-small());
    queue.push(point);
    point = new Point(small());
    queue.push(point);
    point = new Point(-small());
    queue.push(point);
}

var liability = 0;
var last;
var lasth;
var baseCmd;
var baseCmd2;
var smallTimer;
var lies;
var isLive = true;
var soundFluctation;

function init(response, debug) {
    stage = new createjs.Stage('stage');
    stage.x = -0.5;
    stage.y = -0.5;
    stage.enableMouseOver();
    createjs.Touch.enable(stage);

    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.setFPS(30);

    responsive.init();

    var width = stage.canvas.width;
    var height = stage.canvas.height;


    last = width;
    lasth = height;

    var zcontainer = new createjs.Container();
    stage.addChild(zcontainer);

    container = new createjs.Container();
    container.x = width - scaled(205);
    container.y = height - scaled(506);
    zcontainer.addChild(container);

    var zcontainer2 = new createjs.Container();
    stage.addChild(zcontainer2);

    container2 = new createjs.Container();
    container2.x = width - scaled(205);
    container2.y = height - scaled(506);
    container2.alpha = 0;
    zcontainer.addChild(container2);

    document.getElementById('live-elements').style.left = (width - scaled(205)) + 'px';
    document.getElementById('timeline-elements').style.left = (width - scaled(205)) + 'px';

    if (debug) {
        var zbase = new createjs.Shape();
        zbase.graphics.setStrokeStyle(1);
        zbase.graphics.beginStroke("blue");
        zbase.graphics.moveTo(1, 1);
        zbase.graphics.lineTo(width, height);
        zbase.graphics.endStroke();
        zcontainer2.addChild(zbase);

        var base = new createjs.Shape();
        base.graphics.setStrokeStyle(1);
        base.graphics.beginStroke("pink");
        base.graphics.moveTo(1, -height + scaled(506));
        base.graphics.lineTo(width, scaled(506));
        base.graphics.endStroke();
        container2.addChild(base);
    }

    bitmap = new createjs.Bitmap('images/pin.png');
    bitmap.x = -scaled(52);
    bitmap.y = -scaled(52);
    bitmap.scaleX = scale;
    bitmap.scaleY = scale;
    container.addChild(bitmap);

    // draw baseline
    line = new createjs.Shape();
    line.graphics.setStrokeStyle(1.5);
    line.graphics.beginStroke(color());
    baseCmd = line.graphics.moveTo(-width, 1).command;
    line.graphics.lineTo(1, 1);
    container.addChild(line);

    line2 = new createjs.Shape();
    line2.graphics.setStrokeStyle(1.5);
    line2.graphics.beginStroke(color());
    baseCmd2 = line2.graphics.moveTo(-width, 1).command;
    line2.graphics.lineTo(1, 1);
    container2.addChild(line2);

    

    interactjs('#stage')
        .draggable({
            inertia: {
                resistance: 5,
                minSpeed: 100,
                endSpeed: 5,
            },
            max: Infinity,
            maxPerElement: Infinity
        })
        .on('dragmove', function (event) {
            if (isLive) {
                return;
            }

            var distance = event.dx;
            var x = container2.x + distance;

            if (x > window.innerWidth) {
                x = window.innerWidth;
                distance = 0;
            }
            if (x < -tlMax + window.innerWidth) {
                x = -tlMax + window.innerWidth;
                distance = 0;
            }

            container2.x = x;
            stage.update();
            (function () {
                document.getElementById('timeline-elements').style.left = x + 'px';
            })();
            //if (distance !== 0) {
            //    grid.move(-distance);
            //}

            var counter = 0;
            for (var i = 0; i < tlPlots.length; i++) {
                if (x + tlPlots[i] < window.innerWidth) {
                    counter++;
                }
            }

            liability = 100 - counter;
            if (liability < 0) {
                liability = 0;
            }
            document.getElementById('nose').style.right = liability + '%';
        })




    document.getElementById('viewmode').addEventListener('click', function () {
        var tl2 = new TimelineLite();

        if (isLive) {
            tl2.to(container2, 1.0, { alpha: 1 });
            tl2.to(container, 1.0, { alpha: 0 }, '-=1.0');
            tl2.to(document.getElementById('live-elements'), 1.0, { alpha: 0 }, '-=1.0');
            tl2.to(document.getElementById('timeline-elements'), 1.0, { alpha: 1 }, '-=1.0');
            tl2.to(document.getElementById('drag-helper'), 1.0, { alpha: 1 }, '-=1.0');
            tl2.add(function () {
                isLive = false;
                track();
                //pause();
            });
            document.querySelector('#viewmode .primary .text').innerHTML = 'Week';
            document.querySelector('#viewmode .secondary .text').innerHTML = 'Live';

            events.trigger('poligraph.mode.timeline');
        } else {
            tl2.add(function () {
                //run();
            })
            tl2.to(container, 1.0, { alpha: 1 });
            tl2.to(container2, 1.0, { alpha: 0 }, '-=1.0');
            tl2.to(document.getElementById('timeline-elements'), 1.0, { alpha: 0 }, '-=1.0');
            tl2.to(document.getElementById('live-elements'), 1.0, { alpha: 1 }, '-=1.0');
            tl2.to(document.getElementById('drag-helper'), 1.0, { alpha: 0 }, '-=1.0');
            tl2.add(function () {
                isLive = true;
                track();
            });
            document.querySelector('#viewmode .primary .text').innerHTML = 'Live';
            document.querySelector('#viewmode .secondary .text').innerHTML = 'Week';

            events.trigger('poligraph.mode.live');
        }

    });


    lies = response.Lies;
    liability = 100 - lies.length;
    if (liability < 0) {
        length = 0;
    }
    document.getElementById('nose').style.right = liability + '%';
    buildTimeline(response.Minutes);

    silent();

    events.trigger('poligraph.initialized', container, container2);

    events.on('poligraph.mode.timeline', function (e) {
        var counter = 0;
        for (var i = 0; i < tlPlots.length; i++) {
            if (container2.x + tlPlots[i] < window.innerWidth) {
                counter++;
            }
        }

        liability = 100 - counter;
        if (liability < 0) {
            liability = 0;
        }
        document.getElementById('nose').style.right = liability + '%';
    });

    events.on('poligraph.mode.live', function (e) {
        liability = 100 - lies.length;
        if (liability < 0) {
            length = 0;
        }
        document.getElementById('nose').style.right = liability + '%';
    });
}
var tq = [];
var tlMax = 0;
var tlPlots = [];
function buildTimeline(end) {
    var timelineActions = [];

    function timelinePosition(time) {
        var oneday = 24 * 60;
        var pixelsPerDay = 250;

        var offset = time / oneday;
        return offset * pixelsPerDay;
    }

    function render(action) {
        if (action.lie) {
            var point;
            point = new Point(small());
            tq.push(point);
            point = new Point(-small());
            tq.push(point);

            point = new Point(large());
            tq.push(point);
            point = new Point(-large());
            tq.push(point);
            point = new Point(large());
            point.label = {
                title: action.title,
                text: action.text,
                link: action.link
            };
            tq.push(point);
            point = new Point(-large());
            tq.push(point);
            point = new Point(large());
            tq.push(point);
            point = new Point(-large());
            tq.push(point);
            point = new Point(large());
            tq.push(point);

            point = new Point(-small());
            tq.push(point);
            point = new Point(small());
            tq.push(point);
            point = new Point(-small());
            tq.push(point);

            timelineMove();

            tlMax = line2.graphics.command.x;
        } else {
            if (line2.graphics.command.x < action.lineto) {
                line2.graphics.lineTo(action.lineto, line2.graphics.command.y);

                tlMax = action.lineto;
            }
        }

        timelineActions.splice(0, 1);
        if (timelineActions.length) {
            render(timelineActions[0]);
        }
    }

    for (var i = 0; i < lies.length; i++) {
        var lie = lies[i];
        timelineActions.push({ lineto: timelinePosition(lie.Time) });
        timelineActions.push({ lie: true, title: lie.Source, text: lie.Title, link: lie.Link });
    }
    timelineActions.push({ lineto: timelinePosition(end) });
    render(timelineActions[0]);

    stage.update();
    container2.x = -tlMax + window.innerWidth;
    document.getElementById('timeline-elements').style.left = (-tlMax + window.innerWidth) + 'px';

    var startDate = new Date(2017, 0, 20);
    var dayNames = new Array(7);
    dayNames[0] = 'Fri';
    dayNames[1] = 'Sat';
    dayNames[2] = 'Sun';
    dayNames[3] = 'Mon';
    dayNames[4] = 'Tue';
    dayNames[5] = 'Wed';
    dayNames[6] = 'Thu';
    var totalDays = Math.ceil((100 * 24 * 60) / (60 * 24));
    for (var i = 0; i < totalDays; i++) {
        var day = dom.html('<div class="day-label">' + dayNames[i % 7] + '</div>');
        if (i % 7 === 2) {
            var date = new Date(startDate);
            date.setDate(date.getDate() + i);
            var details = dom.html('<span class="details">' + moment(date).format('MMMM[<br>]Do[&nbsp;]YYYY') + '</div>');
            day.appendChild(details);
        }
        day.style.left = (i * 250) + 'px';
        document.getElementById('timeline-elements').appendChild(day);
    }

    events.on('hub.addLie', function (e, lie) {
        console.log('hub.addLie for timeline');

        var alreadyRunning = timelineActions.length;
        timelineActions.push({ lineto: timelinePosition(lie.Time) });
        timelineActions.push({ lie: true, title: lie.Source, text: lie.Title, link: lie.Link });

        if (!alreadyRunning) {
            render(timelineActions[0]);
        }
    });
}

function timelineMove() {
    var height = stage.canvas.height;
    var x = line2.graphics.command.x + 1;
    var y = line2.graphics.command.y;
    var c = height - scaled(506);

    if (tq.length) {
        point = tq[0];
        progress++;

        if (progress === 1) {
            y = -point.value;

            var bx = 6;
            var by = point.value > 0 ? -12 : 12;

            P1 = coord(x, y);
            P2 = coord(x, y + by);
            P3 = coord(x + bx, y + by);
            P4 = coord(x + bx, y);
        } else {
            var step = 1 - (progress - 1) * 0.1667;
            var curpos = bezier(step, P1, P2, P3, P4)

            x = curpos.x;
            y = curpos.y;

            if (point.label && progress === 3) {
                var c = new Plot(x, y, point.label, container2, document.getElementById('timeline-elements'), true);
                container2.addChild(c.element);
                tlPlots.push(x);
            }

            if (progress === 7) {
                progress = 0;
                tq.splice(0, 1);

                if (!tq.length) {
                    y = 1;
                }
            }
        }
    }
    line2.graphics.lineTo(x, y);
    if (tq.length) {
        timelineMove();
    }
}

var P1;
var P2;
var P3;
var P4;
var point;
var progress = 0;

function move() {
    var height = stage.canvas.height;
    var x = line.graphics.command.x + 1;
    var y = line.graphics.command.y;
    var c = height - scaled(506);

    if (queue.length) {
        if (!soundFluctation && isLive) {
            soundFluctation = createjs.Sound.createInstance('fluctuation');
            soundFluctation.play({ loop: -1 });
        }
        

        point = queue[0];
        progress++;

        if (progress === 1) {
            y = -point.value;

            var bx = 6;
            var by = point.value > 0 ? -12 : 12;

            P1 = coord(x, y);
            P2 = coord(x, y + by);
            P3 = coord(x + bx, y + by);
            P4 = coord(x + bx, y);
        } else {
            var step = 1 - (progress - 1) * 0.1667;
            var curpos = bezier(step, P1, P2, P3, P4)

            x = curpos.x;
            y = curpos.y;

            if (point.label && progress === 3) {
                var c = new Plot(x, y, point.label, container, document.getElementById('live-elements'));
                container.addChild(c.element);
                $(c.label).trigger('label.show');
            }

            if (progress === 7) {
                progress = 0;
                queue.splice(0, 1);

                if (!queue.length) {
                    y = 1;

                    silent();

                }
            }
        }
    } else {
        if (soundFluctation) {
            soundFluctation.stop();
            soundFluctation.destroy();
            soundFluctation = null;
        }
    }
    line.graphics.lineTo(x, y);
    container.x += -1;
    bitmap.x += 1;
    bitmap.y = y - scaled(52);

    (function () {
        var left = parseInt(document.getElementById('live-elements').style.left);
        document.getElementById('live-elements').style.left = (left - 1) + 'px';
    })();
}

function run() {
    createjs.Ticker.addEventListener('tick', move);

}

function pause() {
    createjs.Ticker.removeEventListener('tick', move);
}

function track() {
    if (isLive) {
        ga('send', 'pageview', '/live');
    } else {
        ga('send', 'pageview', '/timeline');
    }
}

events.on('hub.loaded', function (e, response) {
    init(response, false);
});

events.on('hub.addLie', function (e, lie) {
    lieDetected(lie);
});

events.on('responsive.resize', function (e, data) {
    var pin = scaled(205);
    var pinOfsset = scaled(52);

    scale = data.viewport.scale;

    stage.canvas.width = data.viewport.width;
    stage.canvas.height = data.viewport.height;

    if (container) {
        var deltaPin = scaled(205) - pin;
        var deltaPinOffset = scaled(52) - pinOfsset;

        container.x -= (data.delta.width + deltaPin);
        container.y = data.viewport.height - scaled(506);
        baseCmd.x = -data.viewport.width;

        bitmap.x -= deltaPinOffset;
        bitmap.scaleX = scale;
        bitmap.scaleY = scale;

        (function () {
            var left = parseInt(document.getElementById('live-elements').style.left);
            document.getElementById('live-elements').style.left = (left - (data.delta.width + deltaPin)) + 'px';
        })();


        // timeline resize
        container2.x -= data.delta.width;
        container2.y = data.viewport.height - scaled(506);
        baseCmd2.x = -data.viewport.width;

        (function () {
            var left = parseInt(document.getElementById('timeline-elements').style.left);
            document.getElementById('timeline-elements').style.left = (left - data.delta.width) + 'px';
        })();

    }
});

module.exports = {
    //init: init,
    run: run,
    pause: pause,
    track: track
};