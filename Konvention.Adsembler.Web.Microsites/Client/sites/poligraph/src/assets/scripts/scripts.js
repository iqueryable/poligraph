/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);
	var grid = __webpack_require__(2);
	var hub = __webpack_require__(4);
	var poligraph;
	var transitions = __webpack_require__(5);

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

	    __webpack_require__(6);
	    poligraph = __webpack_require__(8);

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
	        __webpack_require__(17);
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var manager = this;

	function on(event, action) {
	    $(manager).on(event, action);
	}

	function off(event, action) {
	    $(manager).off(event, action);
	}

	function trigger() {
	    var event = arguments[0];
	    var data = [].slice.call(arguments);
	    data.splice(0, 1);
	    $(manager).trigger(arguments[0], data);
	}

	module.exports = {
	    on: on,
	    off: off,
	    trigger: trigger
	};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);
	var responsive = __webpack_require__(3);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);

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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var constants = __webpack_require__(7);
	var events = __webpack_require__(1);
	var element = document.getElementById('days');

	events.on('hub.loaded', function(e, response) {
	    var day = Math.ceil(response.Minutes / constants.MINUTES_PER_DAY);
	    element.innerHTML = 'Day ' + day + ' / 100';
	})

	module.exports = null;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	module.exports = {
	    MINUTES_PER_DAY:  24 * 60
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var dom = __webpack_require__(9);
	var events = __webpack_require__(1);
	var responsive = __webpack_require__(3);
	var label = __webpack_require__(10);
	var interactjs = __webpack_require__(12);
	var grid = __webpack_require__(2);
	var moment = __webpack_require__(13);
	var transitions = __webpack_require__(5);

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


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	function html(markup) {
	    var container = document.createElement('div');
	    container.innerHTML = markup;
	    return container.firstChild && container.removeChild(container.firstChild);
	}

	module.exports = {
	    html: html
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var dom = __webpack_require__(9);
	var events = __webpack_require__(1);
	var object = __webpack_require__(11);
	var responsive = __webpack_require__(3);


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


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	function extend(object, extension) {
	    for (var property in extension) {
	        if (extension.hasOwnProperty(property)) {
	            object[property] = extension[property];
	        }
	    }
	}

	module.exports = {
	    extend: extend
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	/**
	 * interact.js v1.2.8
	 *
	 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
	 * Open source under the MIT License.
	 * https://raw.github.com/taye/interact.js/master/LICENSE
	 */
	(function (realWindow) {
	    'use strict';

	    // return early if there's no window to work with (eg. Node.js)
	    if (!realWindow) { return; }

	    var // get wrapped window if using Shadow DOM polyfill
	        window = (function () {
	            // create a TextNode
	            var el = realWindow.document.createTextNode('');

	            // check if it's wrapped by a polyfill
	            if (el.ownerDocument !== realWindow.document
	                && typeof realWindow.wrap === 'function'
	                && realWindow.wrap(el) === el) {
	                // return wrapped window
	                return realWindow.wrap(realWindow);
	            }

	            // no Shadow DOM polyfil or native implementation
	            return realWindow;
	        }()),

	        document           = window.document,
	        DocumentFragment   = window.DocumentFragment   || blank,
	        SVGElement         = window.SVGElement         || blank,
	        SVGSVGElement      = window.SVGSVGElement      || blank,
	        SVGElementInstance = window.SVGElementInstance || blank,
	        HTMLElement        = window.HTMLElement        || window.Element,

	        PointerEvent = (window.PointerEvent || window.MSPointerEvent),
	        pEventTypes,

	        hypot = Math.hypot || function (x, y) { return Math.sqrt(x * x + y * y); },

	        tmpXY = {},     // reduce object creation in getXY()

	        documents       = [],   // all documents being listened to

	        interactables   = [],   // all set interactables
	        interactions    = [],   // all interactions

	        dynamicDrop     = false,

	        // {
	        //      type: {
	        //          selectors: ['selector', ...],
	        //          contexts : [document, ...],
	        //          listeners: [[listener, useCapture], ...]
	        //      }
	        //  }
	        delegatedEvents = {},

	        defaultOptions = {
	            base: {
	                accept        : null,
	                actionChecker : null,
	                styleCursor   : true,
	                preventDefault: 'auto',
	                origin        : { x: 0, y: 0 },
	                deltaSource   : 'page',
	                allowFrom     : null,
	                ignoreFrom    : null,
	                _context      : document,
	                dropChecker   : null
	            },

	            drag: {
	                enabled: false,
	                manualStart: true,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: null,
	                restrict: null,
	                inertia: null,
	                autoScroll: null,

	                axis: 'xy'
	            },

	            drop: {
	                enabled: false,
	                accept: null,
	                overlap: 'pointer'
	            },

	            resize: {
	                enabled: false,
	                manualStart: false,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: null,
	                restrict: null,
	                inertia: null,
	                autoScroll: null,

	                square: false,
	                preserveAspectRatio: false,
	                axis: 'xy',

	                // use default margin
	                margin: NaN,

	                // object with props left, right, top, bottom which are
	                // true/false values to resize when the pointer is over that edge,
	                // CSS selectors to match the handles for each direction
	                // or the Elements for each handle
	                edges: null,

	                // a value of 'none' will limit the resize rect to a minimum of 0x0
	                // 'negate' will alow the rect to have negative width/height
	                // 'reposition' will keep the width/height positive by swapping
	                // the top and bottom edges and/or swapping the left and right edges
	                invert: 'none'
	            },

	            gesture: {
	                manualStart: false,
	                enabled: false,
	                max: Infinity,
	                maxPerElement: 1,

	                restrict: null
	            },

	            perAction: {
	                manualStart: false,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: {
	                    enabled     : false,
	                    endOnly     : false,
	                    range       : Infinity,
	                    targets     : null,
	                    offsets     : null,

	                    relativePoints: null
	                },

	                restrict: {
	                    enabled: false,
	                    endOnly: false
	                },

	                autoScroll: {
	                    enabled     : false,
	                    container   : null,     // the item that is scrolled (Window or HTMLElement)
	                    margin      : 60,
	                    speed       : 300       // the scroll speed in pixels per second
	                },

	                inertia: {
	                    enabled          : false,
	                    resistance       : 10,    // the lambda in exponential decay
	                    minSpeed         : 100,   // target speed must be above this for inertia to start
	                    endSpeed         : 10,    // the speed at which inertia is slow enough to stop
	                    allowResume      : true,  // allow resuming an action in inertia phase
	                    zeroResumeDelta  : true,  // if an action is resumed after launch, set dx/dy to 0
	                    smoothEndDuration: 300    // animate to snap/restrict endOnly if there's no inertia
	                }
	            },

	            _holdDuration: 600
	        },

	        // Things related to autoScroll
	        autoScroll = {
	            interaction: null,
	            i: null,    // the handle returned by window.setInterval
	            x: 0, y: 0, // Direction each pulse is to scroll in

	            // scroll the window by the values in scroll.x/y
	            scroll: function () {
	                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
	                    container = options.container || getWindow(autoScroll.interaction.element),
	                    now = new Date().getTime(),
	                    // change in time in seconds
	                    dtx = (now - autoScroll.prevTimeX) / 1000,
	                    dty = (now - autoScroll.prevTimeY) / 1000,
	                    vx, vy, sx, sy;

	                // displacement
	                if (options.velocity) {
	                  vx = options.velocity.x;
	                  vy = options.velocity.y;
	                }
	                else {
	                  vx = vy = options.speed
	                }
	 
	                sx = vx * dtx;
	                sy = vy * dty;

	                if (sx >= 1 || sy >= 1) {
	                    if (isWindow(container)) {
	                        container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
	                    }
	                    else if (container) {
	                        container.scrollLeft += autoScroll.x * sx;
	                        container.scrollTop  += autoScroll.y * sy;
	                    }

	                    if (sx >=1) autoScroll.prevTimeX = now;
	                    if (sy >= 1) autoScroll.prevTimeY = now;
	                }

	                if (autoScroll.isScrolling) {
	                    cancelFrame(autoScroll.i);
	                    autoScroll.i = reqFrame(autoScroll.scroll);
	                }
	            },

	            isScrolling: false,
	            prevTimeX: 0,
	            prevTimeY: 0,

	            start: function (interaction) {
	                autoScroll.isScrolling = true;
	                cancelFrame(autoScroll.i);

	                autoScroll.interaction = interaction;
	                autoScroll.prevTimeX = new Date().getTime();
	                autoScroll.prevTimeY = new Date().getTime();
	                autoScroll.i = reqFrame(autoScroll.scroll);
	            },

	            stop: function () {
	                autoScroll.isScrolling = false;
	                cancelFrame(autoScroll.i);
	            }
	        },

	        // Does the browser support touch input?
	        supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),

	        // Does the browser support PointerEvents
	        // Avoid PointerEvent bugs introduced in Chrome 55
	        supportsPointerEvent = PointerEvent && !/Chrome/.test(navigator.userAgent),

	        // Less Precision with touch input
	        margin = supportsTouch || supportsPointerEvent? 20: 10,

	        pointerMoveTolerance = 1,

	        // for ignoring browser's simulated mouse events
	        prevTouchTime = 0,

	        // Allow this many interactions to happen simultaneously
	        maxInteractions = Infinity,

	        // Check if is IE9 or older
	        actionCursors = (document.all && !window.atob) ? {
	            drag    : 'move',
	            resizex : 'e-resize',
	            resizey : 's-resize',
	            resizexy: 'se-resize',

	            resizetop        : 'n-resize',
	            resizeleft       : 'w-resize',
	            resizebottom     : 's-resize',
	            resizeright      : 'e-resize',
	            resizetopleft    : 'se-resize',
	            resizebottomright: 'se-resize',
	            resizetopright   : 'ne-resize',
	            resizebottomleft : 'ne-resize',

	            gesture : ''
	        } : {
	            drag    : 'move',
	            resizex : 'ew-resize',
	            resizey : 'ns-resize',
	            resizexy: 'nwse-resize',

	            resizetop        : 'ns-resize',
	            resizeleft       : 'ew-resize',
	            resizebottom     : 'ns-resize',
	            resizeright      : 'ew-resize',
	            resizetopleft    : 'nwse-resize',
	            resizebottomright: 'nwse-resize',
	            resizetopright   : 'nesw-resize',
	            resizebottomleft : 'nesw-resize',

	            gesture : ''
	        },

	        actionIsEnabled = {
	            drag   : true,
	            resize : true,
	            gesture: true
	        },

	        // because Webkit and Opera still use 'mousewheel' event type
	        wheelEvent = 'onmousewheel' in document? 'mousewheel': 'wheel',

	        eventTypes = [
	            'dragstart',
	            'dragmove',
	            'draginertiastart',
	            'dragend',
	            'dragenter',
	            'dragleave',
	            'dropactivate',
	            'dropdeactivate',
	            'dropmove',
	            'drop',
	            'resizestart',
	            'resizemove',
	            'resizeinertiastart',
	            'resizeend',
	            'gesturestart',
	            'gesturemove',
	            'gestureinertiastart',
	            'gestureend',

	            'down',
	            'move',
	            'up',
	            'cancel',
	            'tap',
	            'doubletap',
	            'hold'
	        ],

	        globalEvents = {},

	        // Opera Mobile must be handled differently
	        isOperaMobile = navigator.appName == 'Opera' &&
	            supportsTouch &&
	            navigator.userAgent.match('Presto'),

	        // scrolling doesn't change the result of getClientRects on iOS 7
	        isIOS7 = (/iP(hone|od|ad)/.test(navigator.platform)
	                         && /OS 7[^\d]/.test(navigator.appVersion)),

	        // prefix matchesSelector
	        prefixedMatchesSelector = 'matches' in Element.prototype?
	                'matches': 'webkitMatchesSelector' in Element.prototype?
	                    'webkitMatchesSelector': 'mozMatchesSelector' in Element.prototype?
	                        'mozMatchesSelector': 'oMatchesSelector' in Element.prototype?
	                            'oMatchesSelector': 'msMatchesSelector',

	        // will be polyfill function if browser is IE8
	        ie8MatchesSelector,

	        // native requestAnimationFrame or polyfill
	        reqFrame = realWindow.requestAnimationFrame,
	        cancelFrame = realWindow.cancelAnimationFrame,

	        // Events wrapper
	        events = (function () {
	            var useAttachEvent = ('attachEvent' in window) && !('addEventListener' in window),
	                addEvent       = useAttachEvent?  'attachEvent': 'addEventListener',
	                removeEvent    = useAttachEvent?  'detachEvent': 'removeEventListener',
	                on             = useAttachEvent? 'on': '',

	                elements          = [],
	                targets           = [],
	                attachedListeners = [];

	            function add (element, type, listener, useCapture) {
	                var elementIndex = indexOf(elements, element),
	                    target = targets[elementIndex];

	                if (!target) {
	                    target = {
	                        events: {},
	                        typeCount: 0
	                    };

	                    elementIndex = elements.push(element) - 1;
	                    targets.push(target);

	                    attachedListeners.push((useAttachEvent ? {
	                            supplied: [],
	                            wrapped : [],
	                            useCount: []
	                        } : null));
	                }

	                if (!target.events[type]) {
	                    target.events[type] = [];
	                    target.typeCount++;
	                }

	                if (!contains(target.events[type], listener)) {
	                    var ret;

	                    if (useAttachEvent) {
	                        var listeners = attachedListeners[elementIndex],
	                            listenerIndex = indexOf(listeners.supplied, listener);

	                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
	                            if (!event.immediatePropagationStopped) {
	                                event.target = event.srcElement;
	                                event.currentTarget = element;

	                                event.preventDefault = event.preventDefault || preventDef;
	                                event.stopPropagation = event.stopPropagation || stopProp;
	                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

	                                if (/mouse|click/.test(event.type)) {
	                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
	                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
	                                }

	                                listener(event);
	                            }
	                        };

	                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

	                        if (listenerIndex === -1) {
	                            listeners.supplied.push(listener);
	                            listeners.wrapped.push(wrapped);
	                            listeners.useCount.push(1);
	                        }
	                        else {
	                            listeners.useCount[listenerIndex]++;
	                        }
	                    }
	                    else {
	                        ret = element[addEvent](type, listener, useCapture || false);
	                    }
	                    target.events[type].push(listener);

	                    return ret;
	                }
	            }

	            function remove (element, type, listener, useCapture) {
	                var i,
	                    elementIndex = indexOf(elements, element),
	                    target = targets[elementIndex],
	                    listeners,
	                    listenerIndex,
	                    wrapped = listener;

	                if (!target || !target.events) {
	                    return;
	                }

	                if (useAttachEvent) {
	                    listeners = attachedListeners[elementIndex];
	                    listenerIndex = indexOf(listeners.supplied, listener);
	                    wrapped = listeners.wrapped[listenerIndex];
	                }

	                if (type === 'all') {
	                    for (type in target.events) {
	                        if (target.events.hasOwnProperty(type)) {
	                            remove(element, type, 'all');
	                        }
	                    }
	                    return;
	                }

	                if (target.events[type]) {
	                    var len = target.events[type].length;

	                    if (listener === 'all') {
	                        for (i = 0; i < len; i++) {
	                            remove(element, type, target.events[type][i], Boolean(useCapture));
	                        }
	                        return;
	                    } else {
	                        for (i = 0; i < len; i++) {
	                            if (target.events[type][i] === listener) {
	                                element[removeEvent](on + type, wrapped, useCapture || false);
	                                target.events[type].splice(i, 1);

	                                if (useAttachEvent && listeners) {
	                                    listeners.useCount[listenerIndex]--;
	                                    if (listeners.useCount[listenerIndex] === 0) {
	                                        listeners.supplied.splice(listenerIndex, 1);
	                                        listeners.wrapped.splice(listenerIndex, 1);
	                                        listeners.useCount.splice(listenerIndex, 1);
	                                    }
	                                }

	                                break;
	                            }
	                        }
	                    }

	                    if (target.events[type] && target.events[type].length === 0) {
	                        target.events[type] = null;
	                        target.typeCount--;
	                    }
	                }

	                if (!target.typeCount) {
	                    targets.splice(elementIndex, 1);
	                    elements.splice(elementIndex, 1);
	                    attachedListeners.splice(elementIndex, 1);
	                }
	            }

	            function preventDef () {
	                this.returnValue = false;
	            }

	            function stopProp () {
	                this.cancelBubble = true;
	            }

	            function stopImmProp () {
	                this.cancelBubble = true;
	                this.immediatePropagationStopped = true;
	            }

	            return {
	                add: add,
	                remove: remove,
	                useAttachEvent: useAttachEvent,

	                _elements: elements,
	                _targets: targets,
	                _attachedListeners: attachedListeners
	            };
	        }());

	    function blank () {}

	    function isElement (o) {
	        if (!o || (typeof o !== 'object')) { return false; }

	        var _window = getWindow(o) || window;

	        return (/object|function/.test(typeof _window.Element)
	            ? o instanceof _window.Element //DOM2
	            : o.nodeType === 1 && typeof o.nodeName === "string");
	    }
	    function isWindow (thing) { return thing === window || !!(thing && thing.Window) && (thing instanceof thing.Window); }
	    function isDocFrag (thing) { return !!thing && thing instanceof DocumentFragment; }
	    function isArray (thing) {
	        return isObject(thing)
	                && (typeof thing.length !== undefined)
	                && isFunction(thing.splice);
	    }
	    function isObject   (thing) { return !!thing && (typeof thing === 'object'); }
	    function isFunction (thing) { return typeof thing === 'function'; }
	    function isNumber   (thing) { return typeof thing === 'number'  ; }
	    function isBool     (thing) { return typeof thing === 'boolean' ; }
	    function isString   (thing) { return typeof thing === 'string'  ; }

	    function trySelector (value) {
	        if (!isString(value)) { return false; }

	        // an exception will be raised if it is invalid
	        document.querySelector(value);
	        return true;
	    }

	    function extend (dest, source) {
	        for (var prop in source) {
	            dest[prop] = source[prop];
	        }
	        return dest;
	    }

	    var prefixedPropREs = {
	      webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
	    };

	    function pointerExtend (dest, source) {
	        for (var prop in source) {
	          var deprecated = false;

	          // skip deprecated prefixed properties
	          for (var vendor in prefixedPropREs) {
	            if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
	              deprecated = true;
	              break;
	            }
	          }

	          if (!deprecated) {
	            dest[prop] = source[prop];
	          }
	        }
	        return dest;
	    }

	    function copyCoords (dest, src) {
	        dest.page = dest.page || {};
	        dest.page.x = src.page.x;
	        dest.page.y = src.page.y;

	        dest.client = dest.client || {};
	        dest.client.x = src.client.x;
	        dest.client.y = src.client.y;

	        dest.timeStamp = src.timeStamp;
	    }

	    function setEventXY (targetObj, pointers, interaction) {
	        var pointer = (pointers.length > 1
	                       ? pointerAverage(pointers)
	                       : pointers[0]);

	        getPageXY(pointer, tmpXY, interaction);
	        targetObj.page.x = tmpXY.x;
	        targetObj.page.y = tmpXY.y;

	        getClientXY(pointer, tmpXY, interaction);
	        targetObj.client.x = tmpXY.x;
	        targetObj.client.y = tmpXY.y;

	        targetObj.timeStamp = new Date().getTime();
	    }

	    function setEventDeltas (targetObj, prev, cur) {
	        targetObj.page.x     = cur.page.x      - prev.page.x;
	        targetObj.page.y     = cur.page.y      - prev.page.y;
	        targetObj.client.x   = cur.client.x    - prev.client.x;
	        targetObj.client.y   = cur.client.y    - prev.client.y;
	        targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

	        // set pointer velocity
	        var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
	        targetObj.page.speed   = hypot(targetObj.page.x, targetObj.page.y) / dt;
	        targetObj.page.vx      = targetObj.page.x / dt;
	        targetObj.page.vy      = targetObj.page.y / dt;

	        targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
	        targetObj.client.vx    = targetObj.client.x / dt;
	        targetObj.client.vy    = targetObj.client.y / dt;
	    }

	    function isNativePointer (pointer) {
	        return (pointer instanceof window.Event
	            || (supportsTouch && window.Touch && pointer instanceof window.Touch));
	    }

	    // Get specified X/Y coords for mouse or event.touches[0]
	    function getXY (type, pointer, xy) {
	        xy = xy || {};
	        type = type || 'page';

	        xy.x = pointer[type + 'X'];
	        xy.y = pointer[type + 'Y'];

	        return xy;
	    }

	    function getPageXY (pointer, page) {
	        page = page || {};

	        // Opera Mobile handles the viewport and scrolling oddly
	        if (isOperaMobile && isNativePointer(pointer)) {
	            getXY('screen', pointer, page);

	            page.x += window.scrollX;
	            page.y += window.scrollY;
	        }
	        else {
	            getXY('page', pointer, page);
	        }

	        return page;
	    }

	    function getClientXY (pointer, client) {
	        client = client || {};

	        if (isOperaMobile && isNativePointer(pointer)) {
	            // Opera Mobile handles the viewport and scrolling oddly
	            getXY('screen', pointer, client);
	        }
	        else {
	          getXY('client', pointer, client);
	        }

	        return client;
	    }

	    function getScrollXY (win) {
	        win = win || window;
	        return {
	            x: win.scrollX || win.document.documentElement.scrollLeft,
	            y: win.scrollY || win.document.documentElement.scrollTop
	        };
	    }

	    function getPointerId (pointer) {
	        return isNumber(pointer.pointerId)? pointer.pointerId : pointer.identifier;
	    }

	    function getActualElement (element) {
	        return (element instanceof SVGElementInstance
	            ? element.correspondingUseElement
	            : element);
	    }

	    function getWindow (node) {
	        if (isWindow(node)) {
	            return node;
	        }

	        var rootNode = (node.ownerDocument || node);

	        return rootNode.defaultView || rootNode.parentWindow || window;
	    }

	    function getElementClientRect (element) {
	        var clientRect = (element instanceof SVGElement
	                            ? element.getBoundingClientRect()
	                            : element.getClientRects()[0]);

	        return clientRect && {
	            left  : clientRect.left,
	            right : clientRect.right,
	            top   : clientRect.top,
	            bottom: clientRect.bottom,
	            width : clientRect.width || clientRect.right - clientRect.left,
	            height: clientRect.height || clientRect.bottom - clientRect.top
	        };
	    }

	    function getElementRect (element) {
	        var clientRect = getElementClientRect(element);

	        if (!isIOS7 && clientRect) {
	            var scroll = getScrollXY(getWindow(element));

	            clientRect.left   += scroll.x;
	            clientRect.right  += scroll.x;
	            clientRect.top    += scroll.y;
	            clientRect.bottom += scroll.y;
	        }

	        return clientRect;
	    }

	    function getTouchPair (event) {
	        var touches = [];

	        // array of touches is supplied
	        if (isArray(event)) {
	            touches[0] = event[0];
	            touches[1] = event[1];
	        }
	        // an event
	        else {
	            if (event.type === 'touchend') {
	                if (event.touches.length === 1) {
	                    touches[0] = event.touches[0];
	                    touches[1] = event.changedTouches[0];
	                }
	                else if (event.touches.length === 0) {
	                    touches[0] = event.changedTouches[0];
	                    touches[1] = event.changedTouches[1];
	                }
	            }
	            else {
	                touches[0] = event.touches[0];
	                touches[1] = event.touches[1];
	            }
	        }

	        return touches;
	    }

	    function pointerAverage (pointers) {
	        var average = {
	            pageX  : 0,
	            pageY  : 0,
	            clientX: 0,
	            clientY: 0,
	            screenX: 0,
	            screenY: 0
	        };
	        var prop;

	        for (var i = 0; i < pointers.length; i++) {
	            for (prop in average) {
	                average[prop] += pointers[i][prop];
	            }
	        }
	        for (prop in average) {
	            average[prop] /= pointers.length;
	        }

	        return average;
	    }

	    function touchBBox (event) {
	        if (!event.length && !(event.touches && event.touches.length > 1)) {
	            return;
	        }

	        var touches = getTouchPair(event),
	            minX = Math.min(touches[0].pageX, touches[1].pageX),
	            minY = Math.min(touches[0].pageY, touches[1].pageY),
	            maxX = Math.max(touches[0].pageX, touches[1].pageX),
	            maxY = Math.max(touches[0].pageY, touches[1].pageY);

	        return {
	            x: minX,
	            y: minY,
	            left: minX,
	            top: minY,
	            width: maxX - minX,
	            height: maxY - minY
	        };
	    }

	    function touchDistance (event, deltaSource) {
	        deltaSource = deltaSource || defaultOptions.deltaSource;

	        var sourceX = deltaSource + 'X',
	            sourceY = deltaSource + 'Y',
	            touches = getTouchPair(event);


	        var dx = touches[0][sourceX] - touches[1][sourceX],
	            dy = touches[0][sourceY] - touches[1][sourceY];

	        return hypot(dx, dy);
	    }

	    function touchAngle (event, prevAngle, deltaSource) {
	        deltaSource = deltaSource || defaultOptions.deltaSource;

	        var sourceX = deltaSource + 'X',
	            sourceY = deltaSource + 'Y',
	            touches = getTouchPair(event),
	            dx = touches[0][sourceX] - touches[1][sourceX],
	            dy = touches[0][sourceY] - touches[1][sourceY],
	            angle = 180 * Math.atan(dy / dx) / Math.PI;

	        if (isNumber(prevAngle)) {
	            var dr = angle - prevAngle,
	                drClamped = dr % 360;

	            if (drClamped > 315) {
	                angle -= 360 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped > 135) {
	                angle -= 180 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped < -315) {
	                angle += 360 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped < -135) {
	                angle += 180 + (angle / 360)|0 * 360;
	            }
	        }

	        return  angle;
	    }

	    function getOriginXY (interactable, element) {
	        var origin = interactable
	                ? interactable.options.origin
	                : defaultOptions.origin;

	        if (origin === 'parent') {
	            origin = parentElement(element);
	        }
	        else if (origin === 'self') {
	            origin = interactable.getRect(element);
	        }
	        else if (trySelector(origin)) {
	            origin = closest(element, origin) || { x: 0, y: 0 };
	        }

	        if (isFunction(origin)) {
	            origin = origin(interactable && element);
	        }

	        if (isElement(origin))  {
	            origin = getElementRect(origin);
	        }

	        origin.x = ('x' in origin)? origin.x : origin.left;
	        origin.y = ('y' in origin)? origin.y : origin.top;

	        return origin;
	    }

	    // http://stackoverflow.com/a/5634528/2280888
	    function _getQBezierValue(t, p1, p2, p3) {
	        var iT = 1 - t;
	        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
	    }

	    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
	        return {
	            x:  _getQBezierValue(position, startX, cpX, endX),
	            y:  _getQBezierValue(position, startY, cpY, endY)
	        };
	    }

	    // http://gizma.com/easing/
	    function easeOutQuad (t, b, c, d) {
	        t /= d;
	        return -c * t*(t-2) + b;
	    }

	    function nodeContains (parent, child) {
	        while (child) {
	            if (child === parent) {
	                return true;
	            }

	            child = child.parentNode;
	        }

	        return false;
	    }

	    function closest (child, selector) {
	        var parent = parentElement(child);

	        while (isElement(parent)) {
	            if (matchesSelector(parent, selector)) { return parent; }

	            parent = parentElement(parent);
	        }

	        return null;
	    }

	    function parentElement (node) {
	        var parent = node.parentNode;

	        if (isDocFrag(parent)) {
	            // skip past #shado-root fragments
	            while ((parent = parent.host) && isDocFrag(parent)) {}

	            return parent;
	        }

	        return parent;
	    }

	    function inContext (interactable, element) {
	        return interactable._context === element.ownerDocument
	                || nodeContains(interactable._context, element);
	    }

	    function testIgnore (interactable, interactableElement, element) {
	        var ignoreFrom = interactable.options.ignoreFrom;

	        if (!ignoreFrom || !isElement(element)) { return false; }

	        if (isString(ignoreFrom)) {
	            return matchesUpTo(element, ignoreFrom, interactableElement);
	        }
	        else if (isElement(ignoreFrom)) {
	            return nodeContains(ignoreFrom, element);
	        }

	        return false;
	    }

	    function testAllow (interactable, interactableElement, element) {
	        var allowFrom = interactable.options.allowFrom;

	        if (!allowFrom) { return true; }

	        if (!isElement(element)) { return false; }

	        if (isString(allowFrom)) {
	            return matchesUpTo(element, allowFrom, interactableElement);
	        }
	        else if (isElement(allowFrom)) {
	            return nodeContains(allowFrom, element);
	        }

	        return false;
	    }

	    function checkAxis (axis, interactable) {
	        if (!interactable) { return false; }

	        var thisAxis = interactable.options.drag.axis;

	        return (axis === 'xy' || thisAxis === 'xy' || thisAxis === axis);
	    }

	    function checkSnap (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return options[action].snap && options[action].snap.enabled;
	    }

	    function checkRestrict (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return  options[action].restrict && options[action].restrict.enabled;
	    }

	    function checkAutoScroll (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return  options[action].autoScroll && options[action].autoScroll.enabled;
	    }

	    function withinInteractionLimit (interactable, element, action) {
	        var options = interactable.options,
	            maxActions = options[action.name].max,
	            maxPerElement = options[action.name].maxPerElement,
	            activeInteractions = 0,
	            targetCount = 0,
	            targetElementCount = 0;

	        for (var i = 0, len = interactions.length; i < len; i++) {
	            var interaction = interactions[i],
	                otherAction = interaction.prepared.name,
	                active = interaction.interacting();

	            if (!active) { continue; }

	            activeInteractions++;

	            if (activeInteractions >= maxInteractions) {
	                return false;
	            }

	            if (interaction.target !== interactable) { continue; }

	            targetCount += (otherAction === action.name)|0;

	            if (targetCount >= maxActions) {
	                return false;
	            }

	            if (interaction.element === element) {
	                targetElementCount++;

	                if (otherAction !== action.name || targetElementCount >= maxPerElement) {
	                    return false;
	                }
	            }
	        }

	        return maxInteractions > 0;
	    }

	    // Test for the element that's "above" all other qualifiers
	    function indexOfDeepestElement (elements) {
	        var dropzone,
	            deepestZone = elements[0],
	            index = deepestZone? 0: -1,
	            parent,
	            deepestZoneParents = [],
	            dropzoneParents = [],
	            child,
	            i,
	            n;

	        for (i = 1; i < elements.length; i++) {
	            dropzone = elements[i];

	            // an element might belong to multiple selector dropzones
	            if (!dropzone || dropzone === deepestZone) {
	                continue;
	            }

	            if (!deepestZone) {
	                deepestZone = dropzone;
	                index = i;
	                continue;
	            }

	            // check if the deepest or current are document.documentElement or document.rootElement
	            // - if the current dropzone is, do nothing and continue
	            if (dropzone.parentNode === dropzone.ownerDocument) {
	                continue;
	            }
	            // - if deepest is, update with the current dropzone and continue to next
	            else if (deepestZone.parentNode === dropzone.ownerDocument) {
	                deepestZone = dropzone;
	                index = i;
	                continue;
	            }

	            if (!deepestZoneParents.length) {
	                parent = deepestZone;
	                while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
	                    deepestZoneParents.unshift(parent);
	                    parent = parent.parentNode;
	                }
	            }

	            // if this element is an svg element and the current deepest is
	            // an HTMLElement
	            if (deepestZone instanceof HTMLElement
	                && dropzone instanceof SVGElement
	                && !(dropzone instanceof SVGSVGElement)) {

	                if (dropzone === deepestZone.parentNode) {
	                    continue;
	                }

	                parent = dropzone.ownerSVGElement;
	            }
	            else {
	                parent = dropzone;
	            }

	            dropzoneParents = [];

	            while (parent.parentNode !== parent.ownerDocument) {
	                dropzoneParents.unshift(parent);
	                parent = parent.parentNode;
	            }

	            n = 0;

	            // get (position of last common ancestor) + 1
	            while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
	                n++;
	            }

	            var parents = [
	                dropzoneParents[n - 1],
	                dropzoneParents[n],
	                deepestZoneParents[n]
	            ];

	            child = parents[0].lastChild;

	            while (child) {
	                if (child === parents[1]) {
	                    deepestZone = dropzone;
	                    index = i;
	                    deepestZoneParents = [];

	                    break;
	                }
	                else if (child === parents[2]) {
	                    break;
	                }

	                child = child.previousSibling;
	            }
	        }

	        return index;
	    }

	    function Interaction () {
	        this.target          = null; // current interactable being interacted with
	        this.element         = null; // the target element of the interactable
	        this.dropTarget      = null; // the dropzone a drag target might be dropped into
	        this.dropElement     = null; // the element at the time of checking
	        this.prevDropTarget  = null; // the dropzone that was recently dragged away from
	        this.prevDropElement = null; // the element at the time of checking

	        this.prepared        = {     // action that's ready to be fired on next move event
	            name : null,
	            axis : null,
	            edges: null
	        };

	        this.matches         = [];   // all selectors that are matched by target element
	        this.matchElements   = [];   // corresponding elements

	        this.inertiaStatus = {
	            active       : false,
	            smoothEnd    : false,
	            ending       : false,

	            startEvent: null,
	            upCoords: {},

	            xe: 0, ye: 0,
	            sx: 0, sy: 0,

	            t0: 0,
	            vx0: 0, vys: 0,
	            duration: 0,

	            resumeDx: 0,
	            resumeDy: 0,

	            lambda_v0: 0,
	            one_ve_v0: 0,
	            i  : null
	        };

	        if (isFunction(Function.prototype.bind)) {
	            this.boundInertiaFrame = this.inertiaFrame.bind(this);
	            this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
	        }
	        else {
	            var that = this;

	            this.boundInertiaFrame = function () { return that.inertiaFrame(); };
	            this.boundSmoothEndFrame = function () { return that.smoothEndFrame(); };
	        }

	        this.activeDrops = {
	            dropzones: [],      // the dropzones that are mentioned below
	            elements : [],      // elements of dropzones that accept the target draggable
	            rects    : []       // the rects of the elements mentioned above
	        };

	        // keep track of added pointers
	        this.pointers    = [];
	        this.pointerIds  = [];
	        this.downTargets = [];
	        this.downTimes   = [];
	        this.holdTimers  = [];

	        // Previous native pointer move event coordinates
	        this.prevCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };
	        // current native pointer move event coordinates
	        this.curCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };

	        // Starting InteractEvent pointer coordinates
	        this.startCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };

	        // Change in coordinates and time of the pointer
	        this.pointerDelta = {
	            page     : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	            client   : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	            timeStamp: 0
	        };

	        this.downEvent   = null;    // pointerdown/mousedown/touchstart event
	        this.downPointer = {};

	        this._eventTarget    = null;
	        this._curEventTarget = null;

	        this.prevEvent = null;      // previous action event
	        this.tapTime   = 0;         // time of the most recent tap event
	        this.prevTap   = null;

	        this.startOffset    = { left: 0, right: 0, top: 0, bottom: 0 };
	        this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
	        this.snapOffsets    = [];

	        this.gesture = {
	            start: { x: 0, y: 0 },

	            startDistance: 0,   // distance between two touches of touchStart
	            prevDistance : 0,
	            distance     : 0,

	            scale: 1,           // gesture.distance / gesture.startDistance

	            startAngle: 0,      // angle of line joining two touches
	            prevAngle : 0       // angle of the previous gesture event
	        };

	        this.snapStatus = {
	            x       : 0, y       : 0,
	            dx      : 0, dy      : 0,
	            realX   : 0, realY   : 0,
	            snappedX: 0, snappedY: 0,
	            targets : [],
	            locked  : false,
	            changed : false
	        };

	        this.restrictStatus = {
	            dx         : 0, dy         : 0,
	            restrictedX: 0, restrictedY: 0,
	            snap       : null,
	            restricted : false,
	            changed    : false
	        };

	        this.restrictStatus.snap = this.snapStatus;

	        this.pointerIsDown   = false;
	        this.pointerWasMoved = false;
	        this.gesturing       = false;
	        this.dragging        = false;
	        this.resizing        = false;
	        this.resizeAxes      = 'xy';

	        this.mouse = false;

	        interactions.push(this);
	    }

	    Interaction.prototype = {
	        getPageXY  : function (pointer, xy) { return   getPageXY(pointer, xy, this); },
	        getClientXY: function (pointer, xy) { return getClientXY(pointer, xy, this); },
	        setEventXY : function (target, ptr) { return  setEventXY(target, ptr, this); },

	        pointerOver: function (pointer, event, eventTarget) {
	            if (this.prepared.name || !this.mouse) { return; }

	            var curMatches = [],
	                curMatchElements = [],
	                prevTargetElement = this.element;

	            this.addPointer(pointer);

	            if (this.target
	                && (testIgnore(this.target, this.element, eventTarget)
	                    || !testAllow(this.target, this.element, eventTarget))) {
	                // if the eventTarget should be ignored or shouldn't be allowed
	                // clear the previous target
	                this.target = null;
	                this.element = null;
	                this.matches = [];
	                this.matchElements = [];
	            }

	            var elementInteractable = interactables.get(eventTarget),
	                elementAction = (elementInteractable
	                                 && !testIgnore(elementInteractable, eventTarget, eventTarget)
	                                 && testAllow(elementInteractable, eventTarget, eventTarget)
	                                 && validateAction(
	                                     elementInteractable.getAction(pointer, event, this, eventTarget),
	                                     elementInteractable));

	            if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
	                 elementAction = null;
	            }

	            function pushCurMatches (interactable, selector) {
	                if (interactable
	                    && inContext(interactable, eventTarget)
	                    && !testIgnore(interactable, eventTarget, eventTarget)
	                    && testAllow(interactable, eventTarget, eventTarget)
	                    && matchesSelector(eventTarget, selector)) {

	                    curMatches.push(interactable);
	                    curMatchElements.push(eventTarget);
	                }
	            }

	            if (elementAction) {
	                this.target = elementInteractable;
	                this.element = eventTarget;
	                this.matches = [];
	                this.matchElements = [];
	            }
	            else {
	                interactables.forEachSelector(pushCurMatches);

	                if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
	                    this.matches = curMatches;
	                    this.matchElements = curMatchElements;

	                    this.pointerHover(pointer, event, this.matches, this.matchElements);
	                    events.add(eventTarget,
	                                        supportsPointerEvent? pEventTypes.move : 'mousemove',
	                                        listeners.pointerHover);
	                }
	                else if (this.target) {
	                    if (nodeContains(prevTargetElement, eventTarget)) {
	                        this.pointerHover(pointer, event, this.matches, this.matchElements);
	                        events.add(this.element,
	                                            supportsPointerEvent? pEventTypes.move : 'mousemove',
	                                            listeners.pointerHover);
	                    }
	                    else {
	                        this.target = null;
	                        this.element = null;
	                        this.matches = [];
	                        this.matchElements = [];
	                    }
	                }
	            }
	        },

	        // Check what action would be performed on pointerMove target if a mouse
	        // button were pressed and change the cursor accordingly
	        pointerHover: function (pointer, event, eventTarget, curEventTarget, matches, matchElements) {
	            var target = this.target;

	            if (!this.prepared.name && this.mouse) {

	                var action;

	                // update pointer coords for defaultActionChecker to use
	                this.setEventXY(this.curCoords, [pointer]);

	                if (matches) {
	                    action = this.validateSelector(pointer, event, matches, matchElements);
	                }
	                else if (target) {
	                    action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
	                }

	                if (target && target.options.styleCursor) {
	                    if (action) {
	                        target._doc.documentElement.style.cursor = getActionCursor(action);
	                    }
	                    else {
	                        target._doc.documentElement.style.cursor = '';
	                    }
	                }
	            }
	            else if (this.prepared.name) {
	                this.checkAndPreventDefault(event, target, this.element);
	            }
	        },

	        pointerOut: function (pointer, event, eventTarget) {
	            if (this.prepared.name) { return; }

	            // Remove temporary event listeners for selector Interactables
	            if (!interactables.get(eventTarget)) {
	                events.remove(eventTarget,
	                                       supportsPointerEvent? pEventTypes.move : 'mousemove',
	                                       listeners.pointerHover);
	            }

	            if (this.target && this.target.options.styleCursor && !this.interacting()) {
	                this.target._doc.documentElement.style.cursor = '';
	            }
	        },

	        selectorDown: function (pointer, event, eventTarget, curEventTarget) {
	            var that = this,
	                // copy event to be used in timeout for IE8
	                eventCopy = events.useAttachEvent? extend({}, event) : event,
	                element = eventTarget,
	                pointerIndex = this.addPointer(pointer),
	                action;

	            this.holdTimers[pointerIndex] = setTimeout(function () {
	                that.pointerHold(events.useAttachEvent? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
	            }, defaultOptions._holdDuration);

	            this.pointerIsDown = true;

	            // Check if the down event hits the current inertia target
	            if (this.inertiaStatus.active && this.target.selector) {
	                // climb up the DOM tree from the event target
	                while (isElement(element)) {

	                    // if this element is the current inertia target element
	                    if (element === this.element
	                        // and the prospective action is the same as the ongoing one
	                        && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {

	                        // stop inertia so that the next move will be a normal one
	                        cancelFrame(this.inertiaStatus.i);
	                        this.inertiaStatus.active = false;

	                        this.collectEventTargets(pointer, event, eventTarget, 'down');
	                        return;
	                    }
	                    element = parentElement(element);
	                }
	            }

	            // do nothing if interacting
	            if (this.interacting()) {
	                this.collectEventTargets(pointer, event, eventTarget, 'down');
	                return;
	            }

	            function pushMatches (interactable, selector, context) {
	                var elements = ie8MatchesSelector
	                    ? context.querySelectorAll(selector)
	                    : undefined;

	                if (inContext(interactable, element)
	                    && !testIgnore(interactable, element, eventTarget)
	                    && testAllow(interactable, element, eventTarget)
	                    && matchesSelector(element, selector, elements)) {

	                    that.matches.push(interactable);
	                    that.matchElements.push(element);
	                }
	            }

	            // update pointer coords for defaultActionChecker to use
	            this.setEventXY(this.curCoords, [pointer]);
	            this.downEvent = event;

	            while (isElement(element) && !action) {
	                this.matches = [];
	                this.matchElements = [];

	                interactables.forEachSelector(pushMatches);

	                action = this.validateSelector(pointer, event, this.matches, this.matchElements);
	                element = parentElement(element);
	            }

	            if (action) {
	                this.prepared.name  = action.name;
	                this.prepared.axis  = action.axis;
	                this.prepared.edges = action.edges;

	                this.collectEventTargets(pointer, event, eventTarget, 'down');

	                return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
	            }
	            else {
	                // do these now since pointerDown isn't being called from here
	                this.downTimes[pointerIndex] = new Date().getTime();
	                this.downTargets[pointerIndex] = eventTarget;
	                pointerExtend(this.downPointer, pointer);

	                copyCoords(this.prevCoords, this.curCoords);
	                this.pointerWasMoved = false;
	            }

	            this.collectEventTargets(pointer, event, eventTarget, 'down');
	        },

	        // Determine action to be performed on next pointerMove and add appropriate
	        // style and event Listeners
	        pointerDown: function (pointer, event, eventTarget, curEventTarget, forceAction) {
	            if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
	                this.checkAndPreventDefault(event, this.target, this.element);

	                return;
	            }

	            this.pointerIsDown = true;
	            this.downEvent = event;

	            var pointerIndex = this.addPointer(pointer),
	                action;

	            // If it is the second touch of a multi-touch gesture, keep the
	            // target the same and get a new action if a target was set by the
	            // first touch
	            if (this.pointerIds.length > 1 && this.target._element === this.element) {
	                var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);

	                if (withinInteractionLimit(this.target, this.element, newAction)) {
	                    action = newAction;
	                }

	                this.prepared.name = null;
	            }
	            // Otherwise, set the target if there is no action prepared
	            else if (!this.prepared.name) {
	                var interactable = interactables.get(curEventTarget);

	                if (interactable
	                    && !testIgnore(interactable, curEventTarget, eventTarget)
	                    && testAllow(interactable, curEventTarget, eventTarget)
	                    && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget))
	                    && withinInteractionLimit(interactable, curEventTarget, action)) {
	                    this.target = interactable;
	                    this.element = curEventTarget;
	                }
	            }

	            var target = this.target,
	                options = target && target.options;

	            if (target && (forceAction || !this.prepared.name)) {
	                action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);

	                this.setEventXY(this.startCoords, this.pointers);

	                if (!action) { return; }

	                if (options.styleCursor) {
	                    target._doc.documentElement.style.cursor = getActionCursor(action);
	                }

	                this.resizeAxes = action.name === 'resize'? action.axis : null;

	                if (action === 'gesture' && this.pointerIds.length < 2) {
	                    action = null;
	                }

	                this.prepared.name  = action.name;
	                this.prepared.axis  = action.axis;
	                this.prepared.edges = action.edges;

	                this.snapStatus.snappedX = this.snapStatus.snappedY =
	                    this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

	                this.downTimes[pointerIndex] = new Date().getTime();
	                this.downTargets[pointerIndex] = eventTarget;
	                pointerExtend(this.downPointer, pointer);

	                copyCoords(this.prevCoords, this.startCoords);
	                this.pointerWasMoved = false;

	                this.checkAndPreventDefault(event, target, this.element);
	            }
	            // if inertia is active try to resume action
	            else if (this.inertiaStatus.active
	                && curEventTarget === this.element
	                && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {

	                cancelFrame(this.inertiaStatus.i);
	                this.inertiaStatus.active = false;

	                this.checkAndPreventDefault(event, target, this.element);
	            }
	        },

	        setModifications: function (coords, preEnd) {
	            var target         = this.target,
	                shouldMove     = true,
	                shouldSnap     = checkSnap(target, this.prepared.name)     && (!target.options[this.prepared.name].snap.endOnly     || preEnd),
	                shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

	            if (shouldSnap    ) { this.setSnapping   (coords); } else { this.snapStatus    .locked     = false; }
	            if (shouldRestrict) { this.setRestriction(coords); } else { this.restrictStatus.restricted = false; }

	            if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
	                shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
	            }
	            else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
	                shouldMove = false;
	            }

	            return shouldMove;
	        },

	        setStartOffsets: function (action, interactable, element) {
	            var rect = interactable.getRect(element),
	                origin = getOriginXY(interactable, element),
	                snap = interactable.options[this.prepared.name].snap,
	                restrict = interactable.options[this.prepared.name].restrict,
	                width, height;

	            if (rect) {
	                this.startOffset.left = this.startCoords.page.x - rect.left;
	                this.startOffset.top  = this.startCoords.page.y - rect.top;

	                this.startOffset.right  = rect.right  - this.startCoords.page.x;
	                this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

	                if ('width' in rect) { width = rect.width; }
	                else { width = rect.right - rect.left; }
	                if ('height' in rect) { height = rect.height; }
	                else { height = rect.bottom - rect.top; }
	            }
	            else {
	                this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
	            }

	            this.snapOffsets.splice(0);

	            var snapOffset = snap && snap.offset === 'startCoords'
	                                ? {
	                                    x: this.startCoords.page.x - origin.x,
	                                    y: this.startCoords.page.y - origin.y
	                                }
	                                : snap && snap.offset || { x: 0, y: 0 };

	            if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
	                for (var i = 0; i < snap.relativePoints.length; i++) {
	                    this.snapOffsets.push({
	                        x: this.startOffset.left - (width  * snap.relativePoints[i].x) + snapOffset.x,
	                        y: this.startOffset.top  - (height * snap.relativePoints[i].y) + snapOffset.y
	                    });
	                }
	            }
	            else {
	                this.snapOffsets.push(snapOffset);
	            }

	            if (rect && restrict.elementRect) {
	                this.restrictOffset.left = this.startOffset.left - (width  * restrict.elementRect.left);
	                this.restrictOffset.top  = this.startOffset.top  - (height * restrict.elementRect.top);

	                this.restrictOffset.right  = this.startOffset.right  - (width  * (1 - restrict.elementRect.right));
	                this.restrictOffset.bottom = this.startOffset.bottom - (height * (1 - restrict.elementRect.bottom));
	            }
	            else {
	                this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
	            }
	        },

	        /*\
	         * Interaction.start
	         [ method ]
	         *
	         * Start an action with the given Interactable and Element as tartgets. The
	         * action must be enabled for the target Interactable and an appropriate number
	         * of pointers must be held down – 1 for drag/resize, 2 for gesture.
	         *
	         * Use it with `interactable.<action>able({ manualStart: false })` to always
	         * [start actions manually](https://github.com/taye/interact.js/issues/114)
	         *
	         - action       (object)  The action to be performed - drag, resize, etc.
	         - interactable (Interactable) The Interactable to target
	         - element      (Element) The DOM Element to target
	         = (object) interact
	         **
	         | interact(target)
	         |   .draggable({
	         |     // disable the default drag start by down->move
	         |     manualStart: true
	         |   })
	         |   // start dragging after the user holds the pointer down
	         |   .on('hold', function (event) {
	         |     var interaction = event.interaction;
	         |
	         |     if (!interaction.interacting()) {
	         |       interaction.start({ name: 'drag' },
	         |                         event.interactable,
	         |                         event.currentTarget);
	         |     }
	         | });
	        \*/
	        start: function (action, interactable, element) {
	            if (this.interacting()
	                || !this.pointerIsDown
	                || this.pointerIds.length < (action.name === 'gesture'? 2 : 1)) {
	                return;
	            }

	            // if this interaction had been removed after stopping
	            // add it back
	            if (indexOf(interactions, this) === -1) {
	                interactions.push(this);
	            }

	            // set the startCoords if there was no prepared action
	            if (!this.prepared.name) {
	                this.setEventXY(this.startCoords, this.pointers);
	            }

	            this.prepared.name  = action.name;
	            this.prepared.axis  = action.axis;
	            this.prepared.edges = action.edges;
	            this.target         = interactable;
	            this.element        = element;

	            this.setStartOffsets(action.name, interactable, element);
	            this.setModifications(this.startCoords.page);

	            this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
	        },

	        pointerMove: function (pointer, event, eventTarget, curEventTarget, preEnd) {
	            if (this.inertiaStatus.active) {
	                var pageUp   = this.inertiaStatus.upCoords.page;
	                var clientUp = this.inertiaStatus.upCoords.client;

	                var inertiaPosition = {
	                    pageX  : pageUp.x   + this.inertiaStatus.sx,
	                    pageY  : pageUp.y   + this.inertiaStatus.sy,
	                    clientX: clientUp.x + this.inertiaStatus.sx,
	                    clientY: clientUp.y + this.inertiaStatus.sy
	                };

	                this.setEventXY(this.curCoords, [inertiaPosition]);
	            }
	            else {
	                this.recordPointer(pointer);
	                this.setEventXY(this.curCoords, this.pointers);
	            }

	            var duplicateMove = (this.curCoords.page.x === this.prevCoords.page.x
	                                 && this.curCoords.page.y === this.prevCoords.page.y
	                                 && this.curCoords.client.x === this.prevCoords.client.x
	                                 && this.curCoords.client.y === this.prevCoords.client.y);

	            var dx, dy,
	                pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            // register movement greater than pointerMoveTolerance
	            if (this.pointerIsDown && !this.pointerWasMoved) {
	                dx = this.curCoords.client.x - this.startCoords.client.x;
	                dy = this.curCoords.client.y - this.startCoords.client.y;

	                this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
	            }

	            if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
	                if (this.pointerIsDown) {
	                    clearTimeout(this.holdTimers[pointerIndex]);
	                }

	                this.collectEventTargets(pointer, event, eventTarget, 'move');
	            }

	            if (!this.pointerIsDown) { return; }

	            if (duplicateMove && this.pointerWasMoved && !preEnd) {
	                this.checkAndPreventDefault(event, this.target, this.element);
	                return;
	            }

	            // set pointer coordinate, time changes and speeds
	            setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

	            if (!this.prepared.name) { return; }

	            if (this.pointerWasMoved
	                // ignore movement while inertia is active
	                && (!this.inertiaStatus.active || (pointer instanceof InteractEvent && /inertiastart/.test(pointer.type)))) {

	                // if just starting an action, calculate the pointer speed now
	                if (!this.interacting()) {
	                    setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

	                    // check if a drag is in the correct axis
	                    if (this.prepared.name === 'drag') {
	                        var absX = Math.abs(dx),
	                            absY = Math.abs(dy),
	                            targetAxis = this.target.options.drag.axis,
	                            axis = (absX > absY ? 'x' : absX < absY ? 'y' : 'xy');

	                        // if the movement isn't in the axis of the interactable
	                        if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
	                            // cancel the prepared action
	                            this.prepared.name = null;

	                            // then try to get a drag from another ineractable

	                            var element = eventTarget;

	                            // check element interactables
	                            while (isElement(element)) {
	                                var elementInteractable = interactables.get(element);

	                                if (elementInteractable
	                                    && elementInteractable !== this.target
	                                    && !elementInteractable.options.drag.manualStart
	                                    && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag'
	                                    && checkAxis(axis, elementInteractable)) {

	                                    this.prepared.name = 'drag';
	                                    this.target = elementInteractable;
	                                    this.element = element;
	                                    break;
	                                }

	                                element = parentElement(element);
	                            }

	                            // if there's no drag from element interactables,
	                            // check the selector interactables
	                            if (!this.prepared.name) {
	                                var thisInteraction = this;

	                                var getDraggable = function (interactable, selector, context) {
	                                    var elements = ie8MatchesSelector
	                                        ? context.querySelectorAll(selector)
	                                        : undefined;

	                                    if (interactable === thisInteraction.target) { return; }

	                                    if (inContext(interactable, eventTarget)
	                                        && !interactable.options.drag.manualStart
	                                        && !testIgnore(interactable, element, eventTarget)
	                                        && testAllow(interactable, element, eventTarget)
	                                        && matchesSelector(element, selector, elements)
	                                        && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag'
	                                        && checkAxis(axis, interactable)
	                                        && withinInteractionLimit(interactable, element, 'drag')) {

	                                        return interactable;
	                                    }
	                                };

	                                element = eventTarget;

	                                while (isElement(element)) {
	                                    var selectorInteractable = interactables.forEachSelector(getDraggable);

	                                    if (selectorInteractable) {
	                                        this.prepared.name = 'drag';
	                                        this.target = selectorInteractable;
	                                        this.element = element;
	                                        break;
	                                    }

	                                    element = parentElement(element);
	                                }
	                            }
	                        }
	                    }
	                }

	                var starting = !!this.prepared.name && !this.interacting();

	                if (starting
	                    && (this.target.options[this.prepared.name].manualStart
	                        || !withinInteractionLimit(this.target, this.element, this.prepared))) {
	                    this.stop(event);
	                    return;
	                }

	                if (this.prepared.name && this.target) {
	                    if (starting) {
	                        this.start(this.prepared, this.target, this.element);
	                    }

	                    var shouldMove = this.setModifications(this.curCoords.page, preEnd);

	                    // move if snapping or restriction doesn't prevent it
	                    if (shouldMove || starting) {
	                        this.prevEvent = this[this.prepared.name + 'Move'](event);
	                    }

	                    this.checkAndPreventDefault(event, this.target, this.element);
	                }
	            }

	            copyCoords(this.prevCoords, this.curCoords);

	            if (this.dragging || this.resizing) {
	                this.autoScrollMove(pointer);
	            }
	        },

	        dragStart: function (event) {
	            var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

	            this.dragging = true;
	            this.target.fire(dragEvent);

	            // reset active dropzones
	            this.activeDrops.dropzones = [];
	            this.activeDrops.elements  = [];
	            this.activeDrops.rects     = [];

	            if (!this.dynamicDrop) {
	                this.setActiveDrops(this.element);
	            }

	            var dropEvents = this.getDropEvents(event, dragEvent);

	            if (dropEvents.activate) {
	                this.fireActiveDrops(dropEvents.activate);
	            }

	            return dragEvent;
	        },

	        dragMove: function (event) {
	            var target = this.target,
	                dragEvent  = new InteractEvent(this, event, 'drag', 'move', this.element),
	                draggableElement = this.element,
	                drop = this.getDrop(dragEvent, event, draggableElement);

	            this.dropTarget = drop.dropzone;
	            this.dropElement = drop.element;

	            var dropEvents = this.getDropEvents(event, dragEvent);

	            target.fire(dragEvent);

	            if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
	            if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
	            if (dropEvents.move ) {     this.dropTarget.fire(dropEvents.move ); }

	            this.prevDropTarget  = this.dropTarget;
	            this.prevDropElement = this.dropElement;

	            return dragEvent;
	        },

	        resizeStart: function (event) {
	            var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

	            if (this.prepared.edges) {
	                var startRect = this.target.getRect(this.element);

	                /*
	                 * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
	                 * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
	                 * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
	                 * on the active edges and the edge being interacted with.
	                 */
	                if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
	                    var linkedEdges = extend({}, this.prepared.edges);

	                    linkedEdges.top    = linkedEdges.top    || (linkedEdges.left   && !linkedEdges.bottom);
	                    linkedEdges.left   = linkedEdges.left   || (linkedEdges.top    && !linkedEdges.right );
	                    linkedEdges.bottom = linkedEdges.bottom || (linkedEdges.right  && !linkedEdges.top   );
	                    linkedEdges.right  = linkedEdges.right  || (linkedEdges.bottom && !linkedEdges.left  );

	                    this.prepared._linkedEdges = linkedEdges;
	                }
	                else {
	                    this.prepared._linkedEdges = null;
	                }

	                // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize
	                if (this.target.options.resize.preserveAspectRatio) {
	                    this.resizeStartAspectRatio = startRect.width / startRect.height;
	                }

	                this.resizeRects = {
	                    start     : startRect,
	                    current   : extend({}, startRect),
	                    restricted: extend({}, startRect),
	                    previous  : extend({}, startRect),
	                    delta     : {
	                        left: 0, right : 0, width : 0,
	                        top : 0, bottom: 0, height: 0
	                    }
	                };

	                resizeEvent.rect = this.resizeRects.restricted;
	                resizeEvent.deltaRect = this.resizeRects.delta;
	            }

	            this.target.fire(resizeEvent);

	            this.resizing = true;

	            return resizeEvent;
	        },

	        resizeMove: function (event) {
	            var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

	            var edges = this.prepared.edges,
	                invert = this.target.options.resize.invert,
	                invertible = invert === 'reposition' || invert === 'negate';

	            if (edges) {
	                var dx = resizeEvent.dx,
	                    dy = resizeEvent.dy,

	                    start      = this.resizeRects.start,
	                    current    = this.resizeRects.current,
	                    restricted = this.resizeRects.restricted,
	                    delta      = this.resizeRects.delta,
	                    previous   = extend(this.resizeRects.previous, restricted),

	                    originalEdges = edges;

	                // `resize.preserveAspectRatio` takes precedence over `resize.square`
	                if (this.target.options.resize.preserveAspectRatio) {
	                    var resizeStartAspectRatio = this.resizeStartAspectRatio;

	                    edges = this.prepared._linkedEdges;

	                    if ((originalEdges.left && originalEdges.bottom)
	                        || (originalEdges.right && originalEdges.top)) {
	                        dy = -dx / resizeStartAspectRatio;
	                    }
	                    else if (originalEdges.left || originalEdges.right) { dy = dx / resizeStartAspectRatio; }
	                    else if (originalEdges.top || originalEdges.bottom) { dx = dy * resizeStartAspectRatio; }
	                }
	                else if (this.target.options.resize.square) {
	                    edges = this.prepared._linkedEdges;

	                    if ((originalEdges.left && originalEdges.bottom)
	                        || (originalEdges.right && originalEdges.top)) {
	                        dy = -dx;
	                    }
	                    else if (originalEdges.left || originalEdges.right) { dy = dx; }
	                    else if (originalEdges.top || originalEdges.bottom) { dx = dy; }
	                }

	                // update the 'current' rect without modifications
	                if (edges.top   ) { current.top    += dy; }
	                if (edges.bottom) { current.bottom += dy; }
	                if (edges.left  ) { current.left   += dx; }
	                if (edges.right ) { current.right  += dx; }

	                if (invertible) {
	                    // if invertible, copy the current rect
	                    extend(restricted, current);

	                    if (invert === 'reposition') {
	                        // swap edge values if necessary to keep width/height positive
	                        var swap;

	                        if (restricted.top > restricted.bottom) {
	                            swap = restricted.top;

	                            restricted.top = restricted.bottom;
	                            restricted.bottom = swap;
	                        }
	                        if (restricted.left > restricted.right) {
	                            swap = restricted.left;

	                            restricted.left = restricted.right;
	                            restricted.right = swap;
	                        }
	                    }
	                }
	                else {
	                    // if not invertible, restrict to minimum of 0x0 rect
	                    restricted.top    = Math.min(current.top, start.bottom);
	                    restricted.bottom = Math.max(current.bottom, start.top);
	                    restricted.left   = Math.min(current.left, start.right);
	                    restricted.right  = Math.max(current.right, start.left);
	                }

	                restricted.width  = restricted.right  - restricted.left;
	                restricted.height = restricted.bottom - restricted.top ;

	                for (var edge in restricted) {
	                    delta[edge] = restricted[edge] - previous[edge];
	                }

	                resizeEvent.edges = this.prepared.edges;
	                resizeEvent.rect = restricted;
	                resizeEvent.deltaRect = delta;
	            }

	            this.target.fire(resizeEvent);

	            return resizeEvent;
	        },

	        gestureStart: function (event) {
	            var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

	            gestureEvent.ds = 0;

	            this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
	            this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
	            this.gesture.scale = 1;

	            this.gesturing = true;

	            this.target.fire(gestureEvent);

	            return gestureEvent;
	        },

	        gestureMove: function (event) {
	            if (!this.pointerIds.length) {
	                return this.prevEvent;
	            }

	            var gestureEvent;

	            gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
	            gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

	            this.target.fire(gestureEvent);

	            this.gesture.prevAngle = gestureEvent.angle;
	            this.gesture.prevDistance = gestureEvent.distance;

	            if (gestureEvent.scale !== Infinity &&
	                gestureEvent.scale !== null &&
	                gestureEvent.scale !== undefined  &&
	                !isNaN(gestureEvent.scale)) {

	                this.gesture.scale = gestureEvent.scale;
	            }

	            return gestureEvent;
	        },

	        pointerHold: function (pointer, event, eventTarget) {
	            this.collectEventTargets(pointer, event, eventTarget, 'hold');
	        },

	        pointerUp: function (pointer, event, eventTarget, curEventTarget) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            clearTimeout(this.holdTimers[pointerIndex]);

	            this.collectEventTargets(pointer, event, eventTarget, 'up' );
	            this.collectEventTargets(pointer, event, eventTarget, 'tap');

	            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

	            this.removePointer(pointer);
	        },

	        pointerCancel: function (pointer, event, eventTarget, curEventTarget) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            clearTimeout(this.holdTimers[pointerIndex]);

	            this.collectEventTargets(pointer, event, eventTarget, 'cancel');
	            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

	            this.removePointer(pointer);
	        },

	        // http://www.quirksmode.org/dom/events/click.html
	        // >Events leading to dblclick
	        //
	        // IE8 doesn't fire down event before dblclick.
	        // This workaround tries to fire a tap and doubletap after dblclick
	        ie8Dblclick: function (pointer, event, eventTarget) {
	            if (this.prevTap
	                && event.clientX === this.prevTap.clientX
	                && event.clientY === this.prevTap.clientY
	                && eventTarget   === this.prevTap.target) {

	                this.downTargets[0] = eventTarget;
	                this.downTimes[0] = new Date().getTime();
	                this.collectEventTargets(pointer, event, eventTarget, 'tap');
	            }
	        },

	        // End interact move events and stop auto-scroll unless inertia is enabled
	        pointerEnd: function (pointer, event, eventTarget, curEventTarget) {
	            var endEvent,
	                target = this.target,
	                options = target && target.options,
	                inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
	                inertiaStatus = this.inertiaStatus;

	            if (this.interacting()) {

	                if (inertiaStatus.active && !inertiaStatus.ending) { return; }

	                var pointerSpeed,
	                    now = new Date().getTime(),
	                    inertiaPossible = false,
	                    inertia = false,
	                    smoothEnd = false,
	                    endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
	                    endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
	                    dx = 0,
	                    dy = 0,
	                    startEvent;

	                if (this.dragging) {
	                    if      (options.drag.axis === 'x' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vx); }
	                    else if (options.drag.axis === 'y' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vy); }
	                    else   /*options.drag.axis === 'xy'*/{ pointerSpeed = this.pointerDelta.client.speed; }
	                }
	                else {
	                    pointerSpeed = this.pointerDelta.client.speed;
	                }

	                // check if inertia should be started
	                inertiaPossible = (inertiaOptions && inertiaOptions.enabled
	                                   && this.prepared.name !== 'gesture'
	                                   && event !== inertiaStatus.startEvent);

	                inertia = (inertiaPossible
	                           && (now - this.curCoords.timeStamp) < 50
	                           && pointerSpeed > inertiaOptions.minSpeed
	                           && pointerSpeed > inertiaOptions.endSpeed);

	                if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

	                    var snapRestrict = {};

	                    snapRestrict.snap = snapRestrict.restrict = snapRestrict;

	                    if (endSnap) {
	                        this.setSnapping(this.curCoords.page, snapRestrict);
	                        if (snapRestrict.locked) {
	                            dx += snapRestrict.dx;
	                            dy += snapRestrict.dy;
	                        }
	                    }

	                    if (endRestrict) {
	                        this.setRestriction(this.curCoords.page, snapRestrict);
	                        if (snapRestrict.restricted) {
	                            dx += snapRestrict.dx;
	                            dy += snapRestrict.dy;
	                        }
	                    }

	                    if (dx || dy) {
	                        smoothEnd = true;
	                    }
	                }

	                if (inertia || smoothEnd) {
	                    copyCoords(inertiaStatus.upCoords, this.curCoords);

	                    this.pointers[0] = inertiaStatus.startEvent = startEvent =
	                        new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

	                    inertiaStatus.t0 = now;

	                    target.fire(inertiaStatus.startEvent);

	                    if (inertia) {
	                        inertiaStatus.vx0 = this.pointerDelta.client.vx;
	                        inertiaStatus.vy0 = this.pointerDelta.client.vy;
	                        inertiaStatus.v0 = pointerSpeed;

	                        this.calcInertia(inertiaStatus);

	                        var page = extend({}, this.curCoords.page),
	                            origin = getOriginXY(target, this.element),
	                            statusObject;

	                        page.x = page.x + inertiaStatus.xe - origin.x;
	                        page.y = page.y + inertiaStatus.ye - origin.y;

	                        statusObject = {
	                            useStatusXY: true,
	                            x: page.x,
	                            y: page.y,
	                            dx: 0,
	                            dy: 0,
	                            snap: null
	                        };

	                        statusObject.snap = statusObject;

	                        dx = dy = 0;

	                        if (endSnap) {
	                            var snap = this.setSnapping(this.curCoords.page, statusObject);

	                            if (snap.locked) {
	                                dx += snap.dx;
	                                dy += snap.dy;
	                            }
	                        }

	                        if (endRestrict) {
	                            var restrict = this.setRestriction(this.curCoords.page, statusObject);

	                            if (restrict.restricted) {
	                                dx += restrict.dx;
	                                dy += restrict.dy;
	                            }
	                        }

	                        inertiaStatus.modifiedXe += dx;
	                        inertiaStatus.modifiedYe += dy;

	                        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	                    }
	                    else {
	                        inertiaStatus.smoothEnd = true;
	                        inertiaStatus.xe = dx;
	                        inertiaStatus.ye = dy;

	                        inertiaStatus.sx = inertiaStatus.sy = 0;

	                        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	                    }

	                    inertiaStatus.active = true;
	                    return;
	                }

	                if (endSnap || endRestrict) {
	                    // fire a move event at the snapped coordinates
	                    this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
	                }
	            }

	            if (this.dragging) {
	                endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

	                var draggableElement = this.element,
	                    drop = this.getDrop(endEvent, event, draggableElement);

	                this.dropTarget = drop.dropzone;
	                this.dropElement = drop.element;

	                var dropEvents = this.getDropEvents(event, endEvent);

	                if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
	                if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
	                if (dropEvents.drop ) {     this.dropTarget.fire(dropEvents.drop ); }
	                if (dropEvents.deactivate) {
	                    this.fireActiveDrops(dropEvents.deactivate);
	                }

	                target.fire(endEvent);
	            }
	            else if (this.resizing) {
	                endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
	                target.fire(endEvent);
	            }
	            else if (this.gesturing) {
	                endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
	                target.fire(endEvent);
	            }

	            this.stop(event);
	        },

	        collectDrops: function (element) {
	            var drops = [],
	                elements = [],
	                i;

	            element = element || this.element;

	            // collect all dropzones and their elements which qualify for a drop
	            for (i = 0; i < interactables.length; i++) {
	                if (!interactables[i].options.drop.enabled) { continue; }

	                var current = interactables[i],
	                    accept = current.options.drop.accept;

	                // test the draggable element against the dropzone's accept setting
	                if ((isElement(accept) && accept !== element)
	                    || (isString(accept)
	                        && !matchesSelector(element, accept))) {

	                    continue;
	                }

	                // query for new elements if necessary
	                var dropElements = current.selector? current._context.querySelectorAll(current.selector) : [current._element];

	                for (var j = 0, len = dropElements.length; j < len; j++) {
	                    var currentElement = dropElements[j];

	                    if (currentElement === element) {
	                        continue;
	                    }

	                    drops.push(current);
	                    elements.push(currentElement);
	                }
	            }

	            return {
	                dropzones: drops,
	                elements: elements
	            };
	        },

	        fireActiveDrops: function (event) {
	            var i,
	                current,
	                currentElement,
	                prevElement;

	            // loop through all active dropzones and trigger event
	            for (i = 0; i < this.activeDrops.dropzones.length; i++) {
	                current = this.activeDrops.dropzones[i];
	                currentElement = this.activeDrops.elements [i];

	                // prevent trigger of duplicate events on same element
	                if (currentElement !== prevElement) {
	                    // set current element as event target
	                    event.target = currentElement;
	                    current.fire(event);
	                }
	                prevElement = currentElement;
	            }
	        },

	        // Collect a new set of possible drops and save them in activeDrops.
	        // setActiveDrops should always be called when a drag has just started or a
	        // drag event happens while dynamicDrop is true
	        setActiveDrops: function (dragElement) {
	            // get dropzones and their elements that could receive the draggable
	            var possibleDrops = this.collectDrops(dragElement, true);

	            this.activeDrops.dropzones = possibleDrops.dropzones;
	            this.activeDrops.elements  = possibleDrops.elements;
	            this.activeDrops.rects     = [];

	            for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
	                this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
	            }
	        },

	        getDrop: function (dragEvent, event, dragElement) {
	            var validDrops = [];

	            if (dynamicDrop) {
	                this.setActiveDrops(dragElement);
	            }

	            // collect all dropzones and their elements which qualify for a drop
	            for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
	                var current        = this.activeDrops.dropzones[j],
	                    currentElement = this.activeDrops.elements [j],
	                    rect           = this.activeDrops.rects    [j];

	                validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect)
	                                ? currentElement
	                                : null);
	            }

	            // get the most appropriate dropzone based on DOM depth and order
	            var dropIndex = indexOfDeepestElement(validDrops),
	                dropzone  = this.activeDrops.dropzones[dropIndex] || null,
	                element   = this.activeDrops.elements [dropIndex] || null;

	            return {
	                dropzone: dropzone,
	                element: element
	            };
	        },

	        getDropEvents: function (pointerEvent, dragEvent) {
	            var dropEvents = {
	                enter     : null,
	                leave     : null,
	                activate  : null,
	                deactivate: null,
	                move      : null,
	                drop      : null
	            };

	            if (this.dropElement !== this.prevDropElement) {
	                // if there was a prevDropTarget, create a dragleave event
	                if (this.prevDropTarget) {
	                    dropEvents.leave = {
	                        target       : this.prevDropElement,
	                        dropzone     : this.prevDropTarget,
	                        relatedTarget: dragEvent.target,
	                        draggable    : dragEvent.interactable,
	                        dragEvent    : dragEvent,
	                        interaction  : this,
	                        timeStamp    : dragEvent.timeStamp,
	                        type         : 'dragleave'
	                    };

	                    dragEvent.dragLeave = this.prevDropElement;
	                    dragEvent.prevDropzone = this.prevDropTarget;
	                }
	                // if the dropTarget is not null, create a dragenter event
	                if (this.dropTarget) {
	                    dropEvents.enter = {
	                        target       : this.dropElement,
	                        dropzone     : this.dropTarget,
	                        relatedTarget: dragEvent.target,
	                        draggable    : dragEvent.interactable,
	                        dragEvent    : dragEvent,
	                        interaction  : this,
	                        timeStamp    : dragEvent.timeStamp,
	                        type         : 'dragenter'
	                    };

	                    dragEvent.dragEnter = this.dropElement;
	                    dragEvent.dropzone = this.dropTarget;
	                }
	            }

	            if (dragEvent.type === 'dragend' && this.dropTarget) {
	                dropEvents.drop = {
	                    target       : this.dropElement,
	                    dropzone     : this.dropTarget,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'drop'
	                };

	                dragEvent.dropzone = this.dropTarget;
	            }
	            if (dragEvent.type === 'dragstart') {
	                dropEvents.activate = {
	                    target       : null,
	                    dropzone     : null,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropactivate'
	                };
	            }
	            if (dragEvent.type === 'dragend') {
	                dropEvents.deactivate = {
	                    target       : null,
	                    dropzone     : null,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropdeactivate'
	                };
	            }
	            if (dragEvent.type === 'dragmove' && this.dropTarget) {
	                dropEvents.move = {
	                    target       : this.dropElement,
	                    dropzone     : this.dropTarget,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    dragmove     : dragEvent,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropmove'
	                };
	                dragEvent.dropzone = this.dropTarget;
	            }

	            return dropEvents;
	        },

	        currentAction: function () {
	            return (this.dragging && 'drag') || (this.resizing && 'resize') || (this.gesturing && 'gesture') || null;
	        },

	        interacting: function () {
	            return this.dragging || this.resizing || this.gesturing;
	        },

	        clearTargets: function () {
	            this.target = this.element = null;

	            this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
	        },

	        stop: function (event) {
	            if (this.interacting()) {
	                autoScroll.stop();
	                this.matches = [];
	                this.matchElements = [];

	                var target = this.target;

	                if (target.options.styleCursor) {
	                    target._doc.documentElement.style.cursor = '';
	                }

	                // prevent Default only if were previously interacting
	                if (event && isFunction(event.preventDefault)) {
	                    this.checkAndPreventDefault(event, target, this.element);
	                }

	                if (this.dragging) {
	                    this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
	                }
	            }

	            this.clearTargets();

	            this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
	            this.prepared.name = this.prevEvent = null;
	            this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

	            // remove pointers if their ID isn't in this.pointerIds
	            for (var i = 0; i < this.pointers.length; i++) {
	                if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
	                    this.pointers.splice(i, 1);
	                }
	            }
	        },

	        inertiaFrame: function () {
	            var inertiaStatus = this.inertiaStatus,
	                options = this.target.options[this.prepared.name].inertia,
	                lambda = options.resistance,
	                t = new Date().getTime() / 1000 - inertiaStatus.t0;

	            if (t < inertiaStatus.te) {

	                var progress =  1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

	                if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
	                    inertiaStatus.sx = inertiaStatus.xe * progress;
	                    inertiaStatus.sy = inertiaStatus.ye * progress;
	                }
	                else {
	                    var quadPoint = getQuadraticCurvePoint(
	                            0, 0,
	                            inertiaStatus.xe, inertiaStatus.ye,
	                            inertiaStatus.modifiedXe, inertiaStatus.modifiedYe,
	                            progress);

	                    inertiaStatus.sx = quadPoint.x;
	                    inertiaStatus.sy = quadPoint.y;
	                }

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	            }
	            else {
	                inertiaStatus.ending = true;

	                inertiaStatus.sx = inertiaStatus.modifiedXe;
	                inertiaStatus.sy = inertiaStatus.modifiedYe;

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.active = inertiaStatus.ending = false;
	            }
	        },

	        smoothEndFrame: function () {
	            var inertiaStatus = this.inertiaStatus,
	                t = new Date().getTime() - inertiaStatus.t0,
	                duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

	            if (t < duration) {
	                inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
	                inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	            }
	            else {
	                inertiaStatus.ending = true;

	                inertiaStatus.sx = inertiaStatus.xe;
	                inertiaStatus.sy = inertiaStatus.ye;

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.smoothEnd =
	                  inertiaStatus.active = inertiaStatus.ending = false;
	            }
	        },

	        addPointer: function (pointer) {
	            var id = getPointerId(pointer),
	                index = this.mouse? 0 : indexOf(this.pointerIds, id);

	            if (index === -1) {
	                index = this.pointerIds.length;
	            }

	            this.pointerIds[index] = id;
	            this.pointers[index] = pointer;

	            return index;
	        },

	        removePointer: function (pointer) {
	            var id = getPointerId(pointer),
	                index = this.mouse? 0 : indexOf(this.pointerIds, id);

	            if (index === -1) { return; }

	            this.pointers   .splice(index, 1);
	            this.pointerIds .splice(index, 1);
	            this.downTargets.splice(index, 1);
	            this.downTimes  .splice(index, 1);
	            this.holdTimers .splice(index, 1);
	        },

	        recordPointer: function (pointer) {
	            var index = this.mouse? 0: indexOf(this.pointerIds, getPointerId(pointer));

	            if (index === -1) { return; }

	            this.pointers[index] = pointer;
	        },

	        collectEventTargets: function (pointer, event, eventTarget, eventType) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            // do not fire a tap event if the pointer was moved before being lifted
	            if (eventType === 'tap' && (this.pointerWasMoved
	                // or if the pointerup target is different to the pointerdown target
	                || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
	                return;
	            }

	            var targets = [],
	                elements = [],
	                element = eventTarget;

	            function collectSelectors (interactable, selector, context) {
	                var els = ie8MatchesSelector
	                        ? context.querySelectorAll(selector)
	                        : undefined;

	                if (interactable._iEvents[eventType]
	                    && isElement(element)
	                    && inContext(interactable, element)
	                    && !testIgnore(interactable, element, eventTarget)
	                    && testAllow(interactable, element, eventTarget)
	                    && matchesSelector(element, selector, els)) {

	                    targets.push(interactable);
	                    elements.push(element);
	                }
	            }

	            while (element) {
	                if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
	                    targets.push(interact(element));
	                    elements.push(element);
	                }

	                interactables.forEachSelector(collectSelectors);

	                element = parentElement(element);
	            }

	            // create the tap event even if there are no listeners so that
	            // doubletap can still be created and fired
	            if (targets.length || eventType === 'tap') {
	                this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
	            }
	        },

	        firePointers: function (pointer, event, eventTarget, targets, elements, eventType) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
	                pointerEvent = {},
	                i,
	                // for tap events
	                interval, createNewDoubleTap;

	            // if it's a doubletap then the event properties would have been
	            // copied from the tap event and provided as the pointer argument
	            if (eventType === 'doubletap') {
	                pointerEvent = pointer;
	            }
	            else {
	                pointerExtend(pointerEvent, event);
	                if (event !== pointer) {
	                    pointerExtend(pointerEvent, pointer);
	                }

	                pointerEvent.preventDefault           = preventOriginalDefault;
	                pointerEvent.stopPropagation          = InteractEvent.prototype.stopPropagation;
	                pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
	                pointerEvent.interaction              = this;

	                pointerEvent.timeStamp       = new Date().getTime();
	                pointerEvent.originalEvent   = event;
	                pointerEvent.originalPointer = pointer;
	                pointerEvent.type            = eventType;
	                pointerEvent.pointerId       = getPointerId(pointer);
	                pointerEvent.pointerType     = this.mouse? 'mouse' : !supportsPointerEvent? 'touch'
	                                                    : isString(pointer.pointerType)
	                                                        ? pointer.pointerType
	                                                        : [,,'touch', 'pen', 'mouse'][pointer.pointerType];
	            }

	            if (eventType === 'tap') {
	                pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

	                interval = pointerEvent.timeStamp - this.tapTime;
	                createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap'
	                       && this.prevTap.target === pointerEvent.target
	                       && interval < 500);

	                pointerEvent.double = createNewDoubleTap;

	                this.tapTime = pointerEvent.timeStamp;
	            }

	            for (i = 0; i < targets.length; i++) {
	                pointerEvent.currentTarget = elements[i];
	                pointerEvent.interactable = targets[i];
	                targets[i].fire(pointerEvent);

	                if (pointerEvent.immediatePropagationStopped
	                    ||(pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget)) {
	                    break;
	                }
	            }

	            if (createNewDoubleTap) {
	                var doubleTap = {};

	                extend(doubleTap, pointerEvent);

	                doubleTap.dt   = interval;
	                doubleTap.type = 'doubletap';

	                this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

	                this.prevTap = doubleTap;
	            }
	            else if (eventType === 'tap') {
	                this.prevTap = pointerEvent;
	            }
	        },

	        validateSelector: function (pointer, event, matches, matchElements) {
	            for (var i = 0, len = matches.length; i < len; i++) {
	                var match = matches[i],
	                    matchElement = matchElements[i],
	                    action = validateAction(match.getAction(pointer, event, this, matchElement), match);

	                if (action && withinInteractionLimit(match, matchElement, action)) {
	                    this.target = match;
	                    this.element = matchElement;

	                    return action;
	                }
	            }
	        },

	        setSnapping: function (pageCoords, status) {
	            var snap = this.target.options[this.prepared.name].snap,
	                targets = [],
	                target,
	                page,
	                i;

	            status = status || this.snapStatus;

	            if (status.useStatusXY) {
	                page = { x: status.x, y: status.y };
	            }
	            else {
	                var origin = getOriginXY(this.target, this.element);

	                page = extend({}, pageCoords);

	                page.x -= origin.x;
	                page.y -= origin.y;
	            }

	            status.realX = page.x;
	            status.realY = page.y;

	            page.x = page.x - this.inertiaStatus.resumeDx;
	            page.y = page.y - this.inertiaStatus.resumeDy;

	            var len = snap.targets? snap.targets.length : 0;

	            for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
	                var relative = {
	                    x: page.x - this.snapOffsets[relIndex].x,
	                    y: page.y - this.snapOffsets[relIndex].y
	                };

	                for (i = 0; i < len; i++) {
	                    if (isFunction(snap.targets[i])) {
	                        target = snap.targets[i](relative.x, relative.y, this);
	                    }
	                    else {
	                        target = snap.targets[i];
	                    }

	                    if (!target) { continue; }

	                    targets.push({
	                        x: isNumber(target.x) ? (target.x + this.snapOffsets[relIndex].x) : relative.x,
	                        y: isNumber(target.y) ? (target.y + this.snapOffsets[relIndex].y) : relative.y,

	                        range: isNumber(target.range)? target.range: snap.range
	                    });
	                }
	            }

	            var closest = {
	                    target: null,
	                    inRange: false,
	                    distance: 0,
	                    range: 0,
	                    dx: 0,
	                    dy: 0
	                };

	            for (i = 0, len = targets.length; i < len; i++) {
	                target = targets[i];

	                var range = target.range,
	                    dx = target.x - page.x,
	                    dy = target.y - page.y,
	                    distance = hypot(dx, dy),
	                    inRange = distance <= range;

	                // Infinite targets count as being out of range
	                // compared to non infinite ones that are in range
	                if (range === Infinity && closest.inRange && closest.range !== Infinity) {
	                    inRange = false;
	                }

	                if (!closest.target || (inRange
	                    // is the closest target in range?
	                    ? (closest.inRange && range !== Infinity
	                        // the pointer is relatively deeper in this target
	                        ? distance / range < closest.distance / closest.range
	                        // this target has Infinite range and the closest doesn't
	                        : (range === Infinity && closest.range !== Infinity)
	                            // OR this target is closer that the previous closest
	                            || distance < closest.distance)
	                    // The other is not in range and the pointer is closer to this target
	                    : (!closest.inRange && distance < closest.distance))) {

	                    if (range === Infinity) {
	                        inRange = true;
	                    }

	                    closest.target = target;
	                    closest.distance = distance;
	                    closest.range = range;
	                    closest.inRange = inRange;
	                    closest.dx = dx;
	                    closest.dy = dy;

	                    status.range = range;
	                }
	            }

	            var snapChanged;

	            if (closest.target) {
	                snapChanged = (status.snappedX !== closest.target.x || status.snappedY !== closest.target.y);

	                status.snappedX = closest.target.x;
	                status.snappedY = closest.target.y;
	            }
	            else {
	                snapChanged = true;

	                status.snappedX = NaN;
	                status.snappedY = NaN;
	            }

	            status.dx = closest.dx;
	            status.dy = closest.dy;

	            status.changed = (snapChanged || (closest.inRange && !status.locked));
	            status.locked = closest.inRange;

	            return status;
	        },

	        setRestriction: function (pageCoords, status) {
	            var target = this.target,
	                restrict = target && target.options[this.prepared.name].restrict,
	                restriction = restrict && restrict.restriction,
	                page;

	            if (!restriction) {
	                return status;
	            }

	            status = status || this.restrictStatus;

	            page = status.useStatusXY
	                    ? page = { x: status.x, y: status.y }
	                    : page = extend({}, pageCoords);

	            if (status.snap && status.snap.locked) {
	                page.x += status.snap.dx || 0;
	                page.y += status.snap.dy || 0;
	            }

	            page.x -= this.inertiaStatus.resumeDx;
	            page.y -= this.inertiaStatus.resumeDy;

	            status.dx = 0;
	            status.dy = 0;
	            status.restricted = false;

	            var rect, restrictedX, restrictedY;

	            if (isString(restriction)) {
	                if (restriction === 'parent') {
	                    restriction = parentElement(this.element);
	                }
	                else if (restriction === 'self') {
	                    restriction = target.getRect(this.element);
	                }
	                else {
	                    restriction = closest(this.element, restriction);
	                }

	                if (!restriction) { return status; }
	            }

	            if (isFunction(restriction)) {
	                restriction = restriction(page.x, page.y, this.element);
	            }

	            if (isElement(restriction)) {
	                restriction = getElementRect(restriction);
	            }

	            rect = restriction;

	            if (!restriction) {
	                restrictedX = page.x;
	                restrictedY = page.y;
	            }
	            // object is assumed to have
	            // x, y, width, height or
	            // left, top, right, bottom
	            else if ('x' in restriction && 'y' in restriction) {
	                restrictedX = Math.max(Math.min(rect.x + rect.width  - this.restrictOffset.right , page.x), rect.x + this.restrictOffset.left);
	                restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top );
	            }
	            else {
	                restrictedX = Math.max(Math.min(rect.right  - this.restrictOffset.right , page.x), rect.left + this.restrictOffset.left);
	                restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top  + this.restrictOffset.top );
	            }

	            status.dx = restrictedX - page.x;
	            status.dy = restrictedY - page.y;

	            status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
	            status.restricted = !!(status.dx || status.dy);

	            status.restrictedX = restrictedX;
	            status.restrictedY = restrictedY;

	            return status;
	        },

	        checkAndPreventDefault: function (event, interactable, element) {
	            if (!(interactable = interactable || this.target)) { return; }

	            var options = interactable.options,
	                prevent = options.preventDefault;

	            if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
	                // do not preventDefault on pointerdown if the prepared action is a drag
	                // and dragging can only start from a certain direction - this allows
	                // a touch to pan the viewport if a drag isn't in the right direction
	                if (/down|start/i.test(event.type)
	                    && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

	                    return;
	                }

	                // with manualStart, only preventDefault while interacting
	                if (options[this.prepared.name] && options[this.prepared.name].manualStart
	                    && !this.interacting()) {
	                    return;
	                }

	                event.preventDefault();
	                return;
	            }

	            if (prevent === 'always') {
	                event.preventDefault();
	                return;
	            }
	        },

	        calcInertia: function (status) {
	            var inertiaOptions = this.target.options[this.prepared.name].inertia,
	                lambda = inertiaOptions.resistance,
	                inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

	            status.x0 = this.prevEvent.pageX;
	            status.y0 = this.prevEvent.pageY;
	            status.t0 = status.startEvent.timeStamp / 1000;
	            status.sx = status.sy = 0;

	            status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
	            status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
	            status.te = inertiaDur;

	            status.lambda_v0 = lambda / status.v0;
	            status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
	        },

	        autoScrollMove: function (pointer) {
	            if (!(this.interacting()
	                && checkAutoScroll(this.target, this.prepared.name))) {
	                return;
	            }

	            if (this.inertiaStatus.active) {
	                autoScroll.x = autoScroll.y = 0;
	                return;
	            }

	            var top,
	                right,
	                bottom,
	                left,
	                options = this.target.options[this.prepared.name].autoScroll,
	                container = options.container || getWindow(this.element);

	            if (isWindow(container)) {
	                left   = pointer.clientX < autoScroll.margin;
	                top    = pointer.clientY < autoScroll.margin;
	                right  = pointer.clientX > container.innerWidth  - autoScroll.margin;
	                bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
	            }
	            else {
	                var rect = getElementClientRect(container);

	                left   = pointer.clientX < rect.left   + autoScroll.margin;
	                top    = pointer.clientY < rect.top    + autoScroll.margin;
	                right  = pointer.clientX > rect.right  - autoScroll.margin;
	                bottom = pointer.clientY > rect.bottom - autoScroll.margin;
	            }

	            autoScroll.x = (right ? 1: left? -1: 0);
	            autoScroll.y = (bottom? 1:  top? -1: 0);

	            if (!autoScroll.isScrolling) {
	                // set the autoScroll properties to those of the target
	                autoScroll.margin = options.margin;
	                autoScroll.speed  = options.speed;

	                autoScroll.start(this);
	            }
	        },

	        _updateEventTargets: function (target, currentTarget) {
	            this._eventTarget    = target;
	            this._curEventTarget = currentTarget;
	        }

	    };

	    function getInteractionFromPointer (pointer, eventType, eventTarget) {
	        var i = 0, len = interactions.length,
	            mouseEvent = (/mouse/i.test(pointer.pointerType || eventType)
	                          // MSPointerEvent.MSPOINTER_TYPE_MOUSE
	                          || pointer.pointerType === 4),
	            interaction;

	        var id = getPointerId(pointer);

	        // try to resume inertia with a new pointer
	        if (/down|start/i.test(eventType)) {
	            for (i = 0; i < len; i++) {
	                interaction = interactions[i];

	                var element = eventTarget;

	                if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume
	                    && (interaction.mouse === mouseEvent)) {
	                    while (element) {
	                        // if the element is the interaction element
	                        if (element === interaction.element) {
	                            return interaction;
	                        }
	                        element = parentElement(element);
	                    }
	                }
	            }
	        }

	        // if it's a mouse interaction
	        if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {

	            // find a mouse interaction that's not in inertia phase
	            for (i = 0; i < len; i++) {
	                if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
	                    return interactions[i];
	                }
	            }

	            // find any interaction specifically for mouse.
	            // if the eventType is a mousedown, and inertia is active
	            // ignore the interaction
	            for (i = 0; i < len; i++) {
	                if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
	                    return interaction;
	                }
	            }

	            // create a new interaction for mouse
	            interaction = new Interaction();
	            interaction.mouse = true;

	            return interaction;
	        }

	        // get interaction that has this pointer
	        for (i = 0; i < len; i++) {
	            if (contains(interactions[i].pointerIds, id)) {
	                return interactions[i];
	            }
	        }

	        // at this stage, a pointerUp should not return an interaction
	        if (/up|end|out/i.test(eventType)) {
	            return null;
	        }

	        // get first idle interaction
	        for (i = 0; i < len; i++) {
	            interaction = interactions[i];

	            if ((!interaction.prepared.name || (interaction.target.options.gesture.enabled))
	                && !interaction.interacting()
	                && !(!mouseEvent && interaction.mouse)) {

	                return interaction;
	            }
	        }

	        return new Interaction();
	    }

	    function doOnInteractions (method) {
	        return (function (event) {
	            var interaction,
	                eventTarget = getActualElement(event.path
	                                               ? event.path[0]
	                                               : event.target),
	                curEventTarget = getActualElement(event.currentTarget),
	                i;

	            if (supportsTouch && /touch/.test(event.type)) {
	                prevTouchTime = new Date().getTime();

	                for (i = 0; i < event.changedTouches.length; i++) {
	                    var pointer = event.changedTouches[i];

	                    interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

	                    if (!interaction) { continue; }

	                    interaction._updateEventTargets(eventTarget, curEventTarget);

	                    interaction[method](pointer, event, eventTarget, curEventTarget);
	                }
	            }
	            else {
	                if (!supportsPointerEvent && /mouse/.test(event.type)) {
	                    // ignore mouse events while touch interactions are active
	                    for (i = 0; i < interactions.length; i++) {
	                        if (!interactions[i].mouse && interactions[i].pointerIsDown) {
	                            return;
	                        }
	                    }

	                    // try to ignore mouse events that are simulated by the browser
	                    // after a touch event
	                    if (new Date().getTime() - prevTouchTime < 500) {
	                        return;
	                    }
	                }

	                interaction = getInteractionFromPointer(event, event.type, eventTarget);

	                if (!interaction) { return; }

	                interaction._updateEventTargets(eventTarget, curEventTarget);

	                interaction[method](event, event, eventTarget, curEventTarget);
	            }
	        });
	    }

	    function InteractEvent (interaction, event, action, phase, element, related) {
	        var client,
	            page,
	            target      = interaction.target,
	            snapStatus  = interaction.snapStatus,
	            restrictStatus  = interaction.restrictStatus,
	            pointers    = interaction.pointers,
	            deltaSource = (target && target.options || defaultOptions).deltaSource,
	            sourceX     = deltaSource + 'X',
	            sourceY     = deltaSource + 'Y',
	            options     = target? target.options: defaultOptions,
	            origin      = getOriginXY(target, element),
	            starting    = phase === 'start',
	            ending      = phase === 'end',
	            coords      = starting? interaction.startCoords : interaction.curCoords;

	        element = element || interaction.element;

	        page   = extend({}, coords.page);
	        client = extend({}, coords.client);

	        page.x -= origin.x;
	        page.y -= origin.y;

	        client.x -= origin.x;
	        client.y -= origin.y;

	        var relativePoints = options[action].snap && options[action].snap.relativePoints ;

	        if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
	            this.snap = {
	                range  : snapStatus.range,
	                locked : snapStatus.locked,
	                x      : snapStatus.snappedX,
	                y      : snapStatus.snappedY,
	                realX  : snapStatus.realX,
	                realY  : snapStatus.realY,
	                dx     : snapStatus.dx,
	                dy     : snapStatus.dy
	            };

	            if (snapStatus.locked) {
	                page.x += snapStatus.dx;
	                page.y += snapStatus.dy;
	                client.x += snapStatus.dx;
	                client.y += snapStatus.dy;
	            }
	        }

	        if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
	            page.x += restrictStatus.dx;
	            page.y += restrictStatus.dy;
	            client.x += restrictStatus.dx;
	            client.y += restrictStatus.dy;

	            this.restrict = {
	                dx: restrictStatus.dx,
	                dy: restrictStatus.dy
	            };
	        }

	        this.pageX     = page.x;
	        this.pageY     = page.y;
	        this.clientX   = client.x;
	        this.clientY   = client.y;

	        this.x0        = interaction.startCoords.page.x - origin.x;
	        this.y0        = interaction.startCoords.page.y - origin.y;
	        this.clientX0  = interaction.startCoords.client.x - origin.x;
	        this.clientY0  = interaction.startCoords.client.y - origin.y;
	        this.ctrlKey   = event.ctrlKey;
	        this.altKey    = event.altKey;
	        this.shiftKey  = event.shiftKey;
	        this.metaKey   = event.metaKey;
	        this.button    = event.button;
	        this.buttons   = event.buttons;
	        this.target    = element;
	        this.t0        = interaction.downTimes[0];
	        this.type      = action + (phase || '');

	        this.interaction = interaction;
	        this.interactable = target;

	        var inertiaStatus = interaction.inertiaStatus;

	        if (inertiaStatus.active) {
	            this.detail = 'inertia';
	        }

	        if (related) {
	            this.relatedTarget = related;
	        }

	        // end event dx, dy is difference between start and end points
	        if (ending) {
	            if (deltaSource === 'client') {
	                this.dx = client.x - interaction.startCoords.client.x;
	                this.dy = client.y - interaction.startCoords.client.y;
	            }
	            else {
	                this.dx = page.x - interaction.startCoords.page.x;
	                this.dy = page.y - interaction.startCoords.page.y;
	            }
	        }
	        else if (starting) {
	            this.dx = 0;
	            this.dy = 0;
	        }
	        // copy properties from previousmove if starting inertia
	        else if (phase === 'inertiastart') {
	            this.dx = interaction.prevEvent.dx;
	            this.dy = interaction.prevEvent.dy;
	        }
	        else {
	            if (deltaSource === 'client') {
	                this.dx = client.x - interaction.prevEvent.clientX;
	                this.dy = client.y - interaction.prevEvent.clientY;
	            }
	            else {
	                this.dx = page.x - interaction.prevEvent.pageX;
	                this.dy = page.y - interaction.prevEvent.pageY;
	            }
	        }
	        if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia'
	            && !inertiaStatus.active
	            && options[action].inertia && options[action].inertia.zeroResumeDelta) {

	            inertiaStatus.resumeDx += this.dx;
	            inertiaStatus.resumeDy += this.dy;

	            this.dx = this.dy = 0;
	        }

	        if (action === 'resize' && interaction.resizeAxes) {
	            if (options.resize.square) {
	                if (interaction.resizeAxes === 'y') {
	                    this.dx = this.dy;
	                }
	                else {
	                    this.dy = this.dx;
	                }
	                this.axes = 'xy';
	            }
	            else {
	                this.axes = interaction.resizeAxes;

	                if (interaction.resizeAxes === 'x') {
	                    this.dy = 0;
	                }
	                else if (interaction.resizeAxes === 'y') {
	                    this.dx = 0;
	                }
	            }
	        }
	        else if (action === 'gesture') {
	            this.touches = [pointers[0], pointers[1]];

	            if (starting) {
	                this.distance = touchDistance(pointers, deltaSource);
	                this.box      = touchBBox(pointers);
	                this.scale    = 1;
	                this.ds       = 0;
	                this.angle    = touchAngle(pointers, undefined, deltaSource);
	                this.da       = 0;
	            }
	            else if (ending || event instanceof InteractEvent) {
	                this.distance = interaction.prevEvent.distance;
	                this.box      = interaction.prevEvent.box;
	                this.scale    = interaction.prevEvent.scale;
	                this.ds       = this.scale - 1;
	                this.angle    = interaction.prevEvent.angle;
	                this.da       = this.angle - interaction.gesture.startAngle;
	            }
	            else {
	                this.distance = touchDistance(pointers, deltaSource);
	                this.box      = touchBBox(pointers);
	                this.scale    = this.distance / interaction.gesture.startDistance;
	                this.angle    = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

	                this.ds = this.scale - interaction.gesture.prevScale;
	                this.da = this.angle - interaction.gesture.prevAngle;
	            }
	        }

	        if (starting) {
	            this.timeStamp = interaction.downTimes[0];
	            this.dt        = 0;
	            this.duration  = 0;
	            this.speed     = 0;
	            this.velocityX = 0;
	            this.velocityY = 0;
	        }
	        else if (phase === 'inertiastart') {
	            this.timeStamp = interaction.prevEvent.timeStamp;
	            this.dt        = interaction.prevEvent.dt;
	            this.duration  = interaction.prevEvent.duration;
	            this.speed     = interaction.prevEvent.speed;
	            this.velocityX = interaction.prevEvent.velocityX;
	            this.velocityY = interaction.prevEvent.velocityY;
	        }
	        else {
	            this.timeStamp = new Date().getTime();
	            this.dt        = this.timeStamp - interaction.prevEvent.timeStamp;
	            this.duration  = this.timeStamp - interaction.downTimes[0];

	            if (event instanceof InteractEvent) {
	                var dx = this[sourceX] - interaction.prevEvent[sourceX],
	                    dy = this[sourceY] - interaction.prevEvent[sourceY],
	                    dt = this.dt / 1000;

	                this.speed = hypot(dx, dy) / dt;
	                this.velocityX = dx / dt;
	                this.velocityY = dy / dt;
	            }
	            // if normal move or end event, use previous user event coords
	            else {
	                // speed and velocity in pixels per second
	                this.speed = interaction.pointerDelta[deltaSource].speed;
	                this.velocityX = interaction.pointerDelta[deltaSource].vx;
	                this.velocityY = interaction.pointerDelta[deltaSource].vy;
	            }
	        }

	        if ((ending || phase === 'inertiastart')
	            && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

	            var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
	                overlap = 22.5;

	            if (angle < 0) {
	                angle += 360;
	            }

	            var left = 135 - overlap <= angle && angle < 225 + overlap,
	                up   = 225 - overlap <= angle && angle < 315 + overlap,

	                right = !left && (315 - overlap <= angle || angle <  45 + overlap),
	                down  = !up   &&   45 - overlap <= angle && angle < 135 + overlap;

	            this.swipe = {
	                up   : up,
	                down : down,
	                left : left,
	                right: right,
	                angle: angle,
	                speed: interaction.prevEvent.speed,
	                velocity: {
	                    x: interaction.prevEvent.velocityX,
	                    y: interaction.prevEvent.velocityY
	                }
	            };
	        }
	    }

	    InteractEvent.prototype = {
	        preventDefault: blank,
	        stopImmediatePropagation: function () {
	            this.immediatePropagationStopped = this.propagationStopped = true;
	        },
	        stopPropagation: function () {
	            this.propagationStopped = true;
	        }
	    };

	    function preventOriginalDefault () {
	        this.originalEvent.preventDefault();
	    }

	    function getActionCursor (action) {
	        var cursor = '';

	        if (action.name === 'drag') {
	            cursor =  actionCursors.drag;
	        }
	        if (action.name === 'resize') {
	            if (action.axis) {
	                cursor =  actionCursors[action.name + action.axis];
	            }
	            else if (action.edges) {
	                var cursorKey = 'resize',
	                    edgeNames = ['top', 'bottom', 'left', 'right'];

	                for (var i = 0; i < 4; i++) {
	                    if (action.edges[edgeNames[i]]) {
	                        cursorKey += edgeNames[i];
	                    }
	                }

	                cursor = actionCursors[cursorKey];
	            }
	        }

	        return cursor;
	    }

	    function checkResizeEdge (name, value, page, element, interactableElement, rect, margin) {
	        // false, '', undefined, null
	        if (!value) { return false; }

	        // true value, use pointer coords and element rect
	        if (value === true) {
	            // if dimensions are negative, "switch" edges
	            var width = isNumber(rect.width)? rect.width : rect.right - rect.left,
	                height = isNumber(rect.height)? rect.height : rect.bottom - rect.top;

	            if (width < 0) {
	                if      (name === 'left' ) { name = 'right'; }
	                else if (name === 'right') { name = 'left' ; }
	            }
	            if (height < 0) {
	                if      (name === 'top'   ) { name = 'bottom'; }
	                else if (name === 'bottom') { name = 'top'   ; }
	            }

	            if (name === 'left'  ) { return page.x < ((width  >= 0? rect.left: rect.right ) + margin); }
	            if (name === 'top'   ) { return page.y < ((height >= 0? rect.top : rect.bottom) + margin); }

	            if (name === 'right' ) { return page.x > ((width  >= 0? rect.right : rect.left) - margin); }
	            if (name === 'bottom') { return page.y > ((height >= 0? rect.bottom: rect.top ) - margin); }
	        }

	        // the remaining checks require an element
	        if (!isElement(element)) { return false; }

	        return isElement(value)
	                    // the value is an element to use as a resize handle
	                    ? value === element
	                    // otherwise check if element matches value as selector
	                    : matchesUpTo(element, value, interactableElement);
	    }

	    function defaultActionChecker (pointer, interaction, element) {
	        var rect = this.getRect(element),
	            shouldResize = false,
	            action = null,
	            resizeAxes = null,
	            resizeEdges,
	            page = extend({}, interaction.curCoords.page),
	            options = this.options;

	        if (!rect) { return null; }

	        if (actionIsEnabled.resize && options.resize.enabled) {
	            var resizeOptions = options.resize;

	            resizeEdges = {
	                left: false, right: false, top: false, bottom: false
	            };

	            // if using resize.edges
	            if (isObject(resizeOptions.edges)) {
	                for (var edge in resizeEdges) {
	                    resizeEdges[edge] = checkResizeEdge(edge,
	                                                        resizeOptions.edges[edge],
	                                                        page,
	                                                        interaction._eventTarget,
	                                                        element,
	                                                        rect,
	                                                        resizeOptions.margin || margin);
	                }

	                resizeEdges.left = resizeEdges.left && !resizeEdges.right;
	                resizeEdges.top  = resizeEdges.top  && !resizeEdges.bottom;

	                shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
	            }
	            else {
	                var right  = options.resize.axis !== 'y' && page.x > (rect.right  - margin),
	                    bottom = options.resize.axis !== 'x' && page.y > (rect.bottom - margin);

	                shouldResize = right || bottom;
	                resizeAxes = (right? 'x' : '') + (bottom? 'y' : '');
	            }
	        }

	        action = shouldResize
	            ? 'resize'
	            : actionIsEnabled.drag && options.drag.enabled
	                ? 'drag'
	                : null;

	        if (actionIsEnabled.gesture
	            && interaction.pointerIds.length >=2
	            && !(interaction.dragging || interaction.resizing)) {
	            action = 'gesture';
	        }

	        if (action) {
	            return {
	                name: action,
	                axis: resizeAxes,
	                edges: resizeEdges
	            };
	        }

	        return null;
	    }

	    // Check if action is enabled globally and the current target supports it
	    // If so, return the validated action. Otherwise, return null
	    function validateAction (action, interactable) {
	        if (!isObject(action)) { return null; }

	        var actionName = action.name,
	            options = interactable.options;

	        if ((  (actionName  === 'resize'   && options.resize.enabled )
	            || (actionName      === 'drag'     && options.drag.enabled  )
	            || (actionName      === 'gesture'  && options.gesture.enabled))
	            && actionIsEnabled[actionName]) {

	            if (actionName === 'resize' || actionName === 'resizeyx') {
	                actionName = 'resizexy';
	            }

	            return action;
	        }
	        return null;
	    }

	    var listeners = {},
	        interactionListeners = [
	            'dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove',
	            'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown',
	            'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd',
	            'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'
	        ];

	    for (var i = 0, len = interactionListeners.length; i < len; i++) {
	        var name = interactionListeners[i];

	        listeners[name] = doOnInteractions(name);
	    }

	    // bound to the interactable context when a DOM event
	    // listener is added to a selector interactable
	    function delegateListener (event, useCapture) {
	        var fakeEvent = {},
	            delegated = delegatedEvents[event.type],
	            eventTarget = getActualElement(event.path
	                                           ? event.path[0]
	                                           : event.target),
	            element = eventTarget;

	        useCapture = useCapture? true: false;

	        // duplicate the event so that currentTarget can be changed
	        for (var prop in event) {
	            fakeEvent[prop] = event[prop];
	        }

	        fakeEvent.originalEvent = event;
	        fakeEvent.preventDefault = preventOriginalDefault;

	        // climb up document tree looking for selector matches
	        while (isElement(element)) {
	            for (var i = 0; i < delegated.selectors.length; i++) {
	                var selector = delegated.selectors[i],
	                    context = delegated.contexts[i];

	                if (matchesSelector(element, selector)
	                    && nodeContains(context, eventTarget)
	                    && nodeContains(context, element)) {

	                    var listeners = delegated.listeners[i];

	                    fakeEvent.currentTarget = element;

	                    for (var j = 0; j < listeners.length; j++) {
	                        if (listeners[j][1] === useCapture) {
	                            listeners[j][0](fakeEvent);
	                        }
	                    }
	                }
	            }

	            element = parentElement(element);
	        }
	    }

	    function delegateUseCapture (event) {
	        return delegateListener.call(this, event, true);
	    }

	    interactables.indexOfElement = function indexOfElement (element, context) {
	        context = context || document;

	        for (var i = 0; i < this.length; i++) {
	            var interactable = this[i];

	            if ((interactable.selector === element
	                && (interactable._context === context))
	                || (!interactable.selector && interactable._element === element)) {

	                return i;
	            }
	        }
	        return -1;
	    };

	    interactables.get = function interactableGet (element, options) {
	        return this[this.indexOfElement(element, options && options.context)];
	    };

	    interactables.forEachSelector = function (callback) {
	        for (var i = 0; i < this.length; i++) {
	            var interactable = this[i];

	            if (!interactable.selector) {
	                continue;
	            }

	            var ret = callback(interactable, interactable.selector, interactable._context, i, this);

	            if (ret !== undefined) {
	                return ret;
	            }
	        }
	    };

	    /*\
	     * interact
	     [ method ]
	     *
	     * The methods of this variable can be used to set elements as
	     * interactables and also to change various default settings.
	     *
	     * Calling it as a function and passing an element or a valid CSS selector
	     * string returns an Interactable object which has various methods to
	     * configure it.
	     *
	     - element (Element | string) The HTML or SVG Element to interact with or CSS selector
	     = (object) An @Interactable
	     *
	     > Usage
	     | interact(document.getElementById('draggable')).draggable(true);
	     |
	     | var rectables = interact('rect');
	     | rectables
	     |     .gesturable(true)
	     |     .on('gesturemove', function (event) {
	     |         // something cool...
	     |     })
	     |     .autoScroll(true);
	    \*/
	    function interact (element, options) {
	        return interactables.get(element, options) || new Interactable(element, options);
	    }

	    /*\
	     * Interactable
	     [ property ]
	     **
	     * Object type returned by @interact
	    \*/
	    function Interactable (element, options) {
	        this._element = element;
	        this._iEvents = this._iEvents || {};

	        var _window;

	        if (trySelector(element)) {
	            this.selector = element;

	            var context = options && options.context;

	            _window = context? getWindow(context) : window;

	            if (context && (_window.Node
	                    ? context instanceof _window.Node
	                    : (isElement(context) || context === _window.document))) {

	                this._context = context;
	            }
	        }
	        else {
	            _window = getWindow(element);

	            if (isElement(element, _window)) {

	                if (supportsPointerEvent) {
	                    events.add(this._element, pEventTypes.down, listeners.pointerDown );
	                    events.add(this._element, pEventTypes.move, listeners.pointerHover);
	                }
	                else {
	                    events.add(this._element, 'mousedown' , listeners.pointerDown );
	                    events.add(this._element, 'mousemove' , listeners.pointerHover);
	                    events.add(this._element, 'touchstart', listeners.pointerDown );
	                    events.add(this._element, 'touchmove' , listeners.pointerHover);
	                }
	            }
	        }

	        this._doc = _window.document;

	        if (!contains(documents, this._doc)) {
	            listenToDocument(this._doc);
	        }

	        interactables.push(this);

	        this.set(options);
	    }

	    Interactable.prototype = {
	        setOnEvents: function (action, phases) {
	            if (action === 'drop') {
	                if (isFunction(phases.ondrop)          ) { this.ondrop           = phases.ondrop          ; }
	                if (isFunction(phases.ondropactivate)  ) { this.ondropactivate   = phases.ondropactivate  ; }
	                if (isFunction(phases.ondropdeactivate)) { this.ondropdeactivate = phases.ondropdeactivate; }
	                if (isFunction(phases.ondragenter)     ) { this.ondragenter      = phases.ondragenter     ; }
	                if (isFunction(phases.ondragleave)     ) { this.ondragleave      = phases.ondragleave     ; }
	                if (isFunction(phases.ondropmove)      ) { this.ondropmove       = phases.ondropmove      ; }
	            }
	            else {
	                action = 'on' + action;

	                if (isFunction(phases.onstart)       ) { this[action + 'start'         ] = phases.onstart         ; }
	                if (isFunction(phases.onmove)        ) { this[action + 'move'          ] = phases.onmove          ; }
	                if (isFunction(phases.onend)         ) { this[action + 'end'           ] = phases.onend           ; }
	                if (isFunction(phases.oninertiastart)) { this[action + 'inertiastart'  ] = phases.oninertiastart  ; }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.draggable
	         [ method ]
	         *
	         * Gets or sets whether drag actions can be performed on the
	         * Interactable
	         *
	         = (boolean) Indicates if this can be the target of drag events
	         | var isDraggable = interact('ul li').draggable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
	         = (object) This Interactable
	         | interact(element).draggable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     // the axis in which the first movement must be
	         |     // for the drag sequence to start
	         |     // 'xy' by default - any direction
	         |     axis: 'x' || 'y' || 'xy',
	         |
	         |     // max number of drags that can happen concurrently
	         |     // with elements of this Interactable. Infinity by default
	         |     max: Infinity,
	         |
	         |     // max number of drags that can target the same element+Interactable
	         |     // 1 by default
	         |     maxPerElement: 2
	         | });
	        \*/
	        draggable: function (options) {
	            if (isObject(options)) {
	                this.options.drag.enabled = options.enabled === false? false: true;
	                this.setPerAction('drag', options);
	                this.setOnEvents('drag', options);

	                if (/^x$|^y$|^xy$/.test(options.axis)) {
	                    this.options.drag.axis = options.axis;
	                }
	                else if (options.axis === null) {
	                    delete this.options.drag.axis;
	                }

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.drag.enabled = options;

	                return this;
	            }

	            return this.options.drag;
	        },

	        setPerAction: function (action, options) {
	            // for all the default per-action options
	            for (var option in options) {
	                // if this option exists for this action
	                if (option in defaultOptions[action]) {
	                    // if the option in the options arg is an object value
	                    if (isObject(options[option])) {
	                        // duplicate the object
	                        this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

	                        if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
	                            this.options[action][option].enabled = options[option].enabled === false? false : true;
	                        }
	                    }
	                    else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
	                        this.options[action][option].enabled = options[option];
	                    }
	                    else if (options[option] !== undefined) {
	                        // or if it's not undefined, do a plain assignment
	                        this.options[action][option] = options[option];
	                    }
	                }
	            }
	        },

	        /*\
	         * Interactable.dropzone
	         [ method ]
	         *
	         * Returns or sets whether elements can be dropped onto this
	         * Interactable to trigger drop events
	         *
	         * Dropzones can receive the following events:
	         *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
	         *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
	         *  - `dragmove` when a draggable that has entered the dropzone is moved
	         *  - `drop` when a draggable is dropped into this dropzone
	         *
	         *  Use the `accept` option to allow only elements that match the given CSS selector or element.
	         *
	         *  Use the `overlap` option to set how drops are checked for. The allowed values are:
	         *   - `'pointer'`, the pointer must be over the dropzone (default)
	         *   - `'center'`, the draggable element's center must be over the dropzone
	         *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
	         *       e.g. `0.5` for drop to happen when half of the area of the
	         *       draggable is over the dropzone
	         *
	         - options (boolean | object | null) #optional The new value to be set.
	         | interact('.drop').dropzone({
	         |   accept: '.can-drop' || document.getElementById('single-drop'),
	         |   overlap: 'pointer' || 'center' || zeroToOne
	         | }
	         = (boolean | object) The current setting or this Interactable
	        \*/
	        dropzone: function (options) {
	            if (isObject(options)) {
	                this.options.drop.enabled = options.enabled === false? false: true;
	                this.setOnEvents('drop', options);

	                if (/^(pointer|center)$/.test(options.overlap)) {
	                    this.options.drop.overlap = options.overlap;
	                }
	                else if (isNumber(options.overlap)) {
	                    this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
	                }
	                if ('accept' in options) {
	                  this.options.drop.accept = options.accept;
	                }
	                if ('checker' in options) {
	                  this.options.drop.checker = options.checker;
	                }

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.drop.enabled = options;

	                return this;
	            }

	            return this.options.drop;
	        },

	        dropCheck: function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
	            var dropped = false;

	            // if the dropzone has no rect (eg. display: none)
	            // call the custom dropChecker or just return false
	            if (!(rect = rect || this.getRect(dropElement))) {
	                return (this.options.drop.checker
	                    ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement)
	                    : false);
	            }

	            var dropOverlap = this.options.drop.overlap;

	            if (dropOverlap === 'pointer') {
	                var page = getPageXY(dragEvent),
	                    origin = getOriginXY(draggable, draggableElement),
	                    horizontal,
	                    vertical;

	                page.x += origin.x;
	                page.y += origin.y;

	                horizontal = (page.x > rect.left) && (page.x < rect.right);
	                vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

	                dropped = horizontal && vertical;
	            }

	            var dragRect = draggable.getRect(draggableElement);

	            if (dropOverlap === 'center') {
	                var cx = dragRect.left + dragRect.width  / 2,
	                    cy = dragRect.top  + dragRect.height / 2;

	                dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
	            }

	            if (isNumber(dropOverlap)) {
	                var overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
	                                  * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top ))),
	                    overlapRatio = overlapArea / (dragRect.width * dragRect.height);

	                dropped = overlapRatio >= dropOverlap;
	            }

	            if (this.options.drop.checker) {
	                dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
	            }

	            return dropped;
	        },

	        /*\
	         * Interactable.dropChecker
	         [ method ]
	         *
	         * DEPRECATED. Use interactable.dropzone({ checker: function... }) instead.
	         *
	         * Gets or sets the function used to check if a dragged element is
	         * over this Interactable.
	         *
	         - checker (function) #optional The function that will be called when checking for a drop
	         = (Function | Interactable) The checker function or this Interactable
	         *
	         * The checker function takes the following arguments:
	         *
	         - dragEvent (InteractEvent) The related dragmove or dragend event
	         - event (TouchEvent | PointerEvent | MouseEvent) The user move/up/end Event related to the dragEvent
	         - dropped (boolean) The value from the default drop checker
	         - dropzone (Interactable) The dropzone interactable
	         - dropElement (Element) The dropzone element
	         - draggable (Interactable) The Interactable being dragged
	         - draggableElement (Element) The actual element that's being dragged
	         *
	         > Usage:
	         | interact(target)
	         | .dropChecker(function(dragEvent,         // related dragmove or dragend event
	         |                       event,             // TouchEvent/PointerEvent/MouseEvent
	         |                       dropped,           // bool result of the default checker
	         |                       dropzone,          // dropzone Interactable
	         |                       dropElement,       // dropzone elemnt
	         |                       draggable,         // draggable Interactable
	         |                       draggableElement) {// draggable element
	         |
	         |   return dropped && event.target.hasAttribute('allow-drop');
	         | }
	        \*/
	        dropChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.options.drop.checker = checker;

	                return this;
	            }
	            if (checker === null) {
	                delete this.options.getRect;

	                return this;
	            }

	            return this.options.drop.checker;
	        },

	        /*\
	         * Interactable.accept
	         [ method ]
	         *
	         * Deprecated. add an `accept` property to the options object passed to
	         * @Interactable.dropzone instead.
	         *
	         * Gets or sets the Element or CSS selector match that this
	         * Interactable accepts if it is a dropzone.
	         *
	         - newValue (Element | string | null) #optional
	         * If it is an Element, then only that element can be dropped into this dropzone.
	         * If it is a string, the element being dragged must match it as a selector.
	         * If it is null, the accept options is cleared - it accepts any element.
	         *
	         = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
	        \*/
	        accept: function (newValue) {
	            if (isElement(newValue)) {
	                this.options.drop.accept = newValue;

	                return this;
	            }

	            // test if it is a valid CSS selector
	            if (trySelector(newValue)) {
	                this.options.drop.accept = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.drop.accept;

	                return this;
	            }

	            return this.options.drop.accept;
	        },

	        /*\
	         * Interactable.resizable
	         [ method ]
	         *
	         * Gets or sets whether resize actions can be performed on the
	         * Interactable
	         *
	         = (boolean) Indicates if this can be the target of resize elements
	         | var isResizeable = interact('input[type=text]').resizable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
	         = (object) This Interactable
	         | interact(element).resizable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     edges: {
	         |       top   : true,       // Use pointer coords to check for resize.
	         |       left  : false,      // Disable resizing from left edge.
	         |       bottom: '.resize-s',// Resize if pointer target matches selector
	         |       right : handleEl    // Resize if pointer target is the given Element
	         |     },
	         |
	         |     // Width and height can be adjusted independently. When `true`, width and
	         |     // height are adjusted at a 1:1 ratio.
	         |     square: false,
	         |
	         |     // Width and height can be adjusted independently. When `true`, width and
	         |     // height maintain the aspect ratio they had when resizing started.
	         |     preserveAspectRatio: false,
	         |
	         |     // a value of 'none' will limit the resize rect to a minimum of 0x0
	         |     // 'negate' will allow the rect to have negative width/height
	         |     // 'reposition' will keep the width/height positive by swapping
	         |     // the top and bottom edges and/or swapping the left and right edges
	         |     invert: 'none' || 'negate' || 'reposition'
	         |
	         |     // limit multiple resizes.
	         |     // See the explanation in the @Interactable.draggable example
	         |     max: Infinity,
	         |     maxPerElement: 1,
	         | });
	        \*/
	        resizable: function (options) {
	            if (isObject(options)) {
	                this.options.resize.enabled = options.enabled === false? false: true;
	                this.setPerAction('resize', options);
	                this.setOnEvents('resize', options);

	                if (/^x$|^y$|^xy$/.test(options.axis)) {
	                    this.options.resize.axis = options.axis;
	                }
	                else if (options.axis === null) {
	                    this.options.resize.axis = defaultOptions.resize.axis;
	                }

	                if (isBool(options.preserveAspectRatio)) {
	                    this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
	                }
	                else if (isBool(options.square)) {
	                    this.options.resize.square = options.square;
	                }

	                return this;
	            }
	            if (isBool(options)) {
	                this.options.resize.enabled = options;

	                return this;
	            }
	            return this.options.resize;
	        },

	        /*\
	         * Interactable.squareResize
	         [ method ]
	         *
	         * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
	         *
	         * Gets or sets whether resizing is forced 1:1 aspect
	         *
	         = (boolean) Current setting
	         *
	         * or
	         *
	         - newValue (boolean) #optional
	         = (object) this Interactable
	        \*/
	        squareResize: function (newValue) {
	            if (isBool(newValue)) {
	                this.options.resize.square = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.resize.square;

	                return this;
	            }

	            return this.options.resize.square;
	        },

	        /*\
	         * Interactable.gesturable
	         [ method ]
	         *
	         * Gets or sets whether multitouch gestures can be performed on the
	         * Interactable's element
	         *
	         = (boolean) Indicates if this can be the target of gesture events
	         | var isGestureable = interact(element).gesturable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
	         = (object) this Interactable
	         | interact(element).gesturable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     // limit multiple gestures.
	         |     // See the explanation in @Interactable.draggable example
	         |     max: Infinity,
	         |     maxPerElement: 1,
	         | });
	        \*/
	        gesturable: function (options) {
	            if (isObject(options)) {
	                this.options.gesture.enabled = options.enabled === false? false: true;
	                this.setPerAction('gesture', options);
	                this.setOnEvents('gesture', options);

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.gesture.enabled = options;

	                return this;
	            }

	            return this.options.gesture;
	        },

	        /*\
	         * Interactable.autoScroll
	         [ method ]
	         **
	         * Deprecated. Add an `autoscroll` property to the options object
	         * passed to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets whether dragging and resizing near the edges of the
	         * window/container trigger autoScroll for this Interactable
	         *
	         = (object) Object with autoScroll properties
	         *
	         * or
	         *
	         - options (object | boolean) #optional
	         * options can be:
	         * - an object with margin, distance and interval properties,
	         * - true or false to enable or disable autoScroll or
	         = (Interactable) this Interactable
	        \*/
	        autoScroll: function (options) {
	            if (isObject(options)) {
	                options = extend({ actions: ['drag', 'resize']}, options);
	            }
	            else if (isBool(options)) {
	                options = { actions: ['drag', 'resize'], enabled: options };
	            }

	            return this.setOptions('autoScroll', options);
	        },

	        /*\
	         * Interactable.snap
	         [ method ]
	         **
	         * Deprecated. Add a `snap` property to the options object passed
	         * to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets if and how action coordinates are snapped. By
	         * default, snapping is relative to the pointer coordinates. You can
	         * change this by setting the
	         * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
	         **
	         = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
	         **
	         * or
	         **
	         - options (object | boolean | null) #optional
	         = (Interactable) this Interactable
	         > Usage
	         | interact(document.querySelector('#thing')).snap({
	         |     targets: [
	         |         // snap to this specific point
	         |         {
	         |             x: 100,
	         |             y: 100,
	         |             range: 25
	         |         },
	         |         // give this function the x and y page coords and snap to the object returned
	         |         function (x, y) {
	         |             return {
	         |                 x: x,
	         |                 y: (75 + 50 * Math.sin(x * 0.04)),
	         |                 range: 40
	         |             };
	         |         },
	         |         // create a function that snaps to a grid
	         |         interact.createSnapGrid({
	         |             x: 50,
	         |             y: 50,
	         |             range: 10,              // optional
	         |             offset: { x: 5, y: 10 } // optional
	         |         })
	         |     ],
	         |     // do not snap during normal movement.
	         |     // Instead, trigger only one snapped move event
	         |     // immediately before the end event.
	         |     endOnly: true,
	         |
	         |     relativePoints: [
	         |         { x: 0, y: 0 },  // snap relative to the top left of the element
	         |         { x: 1, y: 1 },  // and also to the bottom right
	         |     ],  
	         |
	         |     // offset the snap target coordinates
	         |     // can be an object with x/y or 'startCoords'
	         |     offset: { x: 50, y: 50 }
	         |   }
	         | });
	        \*/
	        snap: function (options) {
	            var ret = this.setOptions('snap', options);

	            if (ret === this) { return this; }

	            return ret.drag;
	        },

	        setOptions: function (option, options) {
	            var actions = options && isArray(options.actions)
	                    ? options.actions
	                    : ['drag'];

	            var i;

	            if (isObject(options) || isBool(options)) {
	                for (i = 0; i < actions.length; i++) {
	                    var action = /resize/.test(actions[i])? 'resize' : actions[i];

	                    if (!isObject(this.options[action])) { continue; }

	                    var thisOption = this.options[action][option];

	                    if (isObject(options)) {
	                        extend(thisOption, options);
	                        thisOption.enabled = options.enabled === false? false: true;

	                        if (option === 'snap') {
	                            if (thisOption.mode === 'grid') {
	                                thisOption.targets = [
	                                    interact.createSnapGrid(extend({
	                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
	                                    }, thisOption.grid || {}))
	                                ];
	                            }
	                            else if (thisOption.mode === 'anchor') {
	                                thisOption.targets = thisOption.anchors;
	                            }
	                            else if (thisOption.mode === 'path') {
	                                thisOption.targets = thisOption.paths;
	                            }

	                            if ('elementOrigin' in options) {
	                                thisOption.relativePoints = [options.elementOrigin];
	                            }
	                        }
	                    }
	                    else if (isBool(options)) {
	                        thisOption.enabled = options;
	                    }
	                }

	                return this;
	            }

	            var ret = {},
	                allActions = ['drag', 'resize', 'gesture'];

	            for (i = 0; i < allActions.length; i++) {
	                if (option in defaultOptions[allActions[i]]) {
	                    ret[allActions[i]] = this.options[allActions[i]][option];
	                }
	            }

	            return ret;
	        },


	        /*\
	         * Interactable.inertia
	         [ method ]
	         **
	         * Deprecated. Add an `inertia` property to the options object passed
	         * to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets if and how events continue to run after the pointer is released
	         **
	         = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
	         **
	         * or
	         **
	         - options (object | boolean | null) #optional
	         = (Interactable) this Interactable
	         > Usage
	         | // enable and use default settings
	         | interact(element).inertia(true);
	         |
	         | // enable and use custom settings
	         | interact(element).inertia({
	         |     // value greater than 0
	         |     // high values slow the object down more quickly
	         |     resistance     : 16,
	         |
	         |     // the minimum launch speed (pixels per second) that results in inertia start
	         |     minSpeed       : 200,
	         |
	         |     // inertia will stop when the object slows down to this speed
	         |     endSpeed       : 20,
	         |
	         |     // boolean; should actions be resumed when the pointer goes down during inertia
	         |     allowResume    : true,
	         |
	         |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
	         |     zeroResumeDelta: false,
	         |
	         |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
	         |     // the pointer without triggering inertia will animate from the release
	         |     // point to the snaped/restricted point in the given amount of time (ms)
	         |     smoothEndDuration: 300,
	         |
	         |     // an array of action types that can have inertia (no gesture)
	         |     actions        : ['drag', 'resize']
	         | });
	         |
	         | // reset custom settings and use all defaults
	         | interact(element).inertia(null);
	        \*/
	        inertia: function (options) {
	            var ret = this.setOptions('inertia', options);

	            if (ret === this) { return this; }

	            return ret.drag;
	        },

	        getAction: function (pointer, event, interaction, element) {
	            var action = this.defaultActionChecker(pointer, interaction, element);

	            if (this.options.actionChecker) {
	                return this.options.actionChecker(pointer, event, action, this, element, interaction);
	            }

	            return action;
	        },

	        defaultActionChecker: defaultActionChecker,

	        /*\
	         * Interactable.actionChecker
	         [ method ]
	         *
	         * Gets or sets the function used to check action to be performed on
	         * pointerDown
	         *
	         - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
	         = (Function | Interactable) The checker function or this Interactable
	         *
	         | interact('.resize-drag')
	         |   .resizable(true)
	         |   .draggable(true)
	         |   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
	         |
	         |   if (interact.matchesSelector(event.target, '.drag-handle') {
	         |     // force drag with handle target
	         |     action.name = drag;
	         |   }
	         |   else {
	         |     // resize from the top and right edges
	         |     action.name  = 'resize';
	         |     action.edges = { top: true, right: true };
	         |   }
	         |
	         |   return action;
	         | });
	        \*/
	        actionChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.options.actionChecker = checker;

	                return this;
	            }

	            if (checker === null) {
	                delete this.options.actionChecker;

	                return this;
	            }

	            return this.options.actionChecker;
	        },

	        /*\
	         * Interactable.getRect
	         [ method ]
	         *
	         * The default function to get an Interactables bounding rect. Can be
	         * overridden using @Interactable.rectChecker.
	         *
	         - element (Element) #optional The element to measure.
	         = (object) The object's bounding rectangle.
	         o {
	         o     top   : 0,
	         o     left  : 0,
	         o     bottom: 0,
	         o     right : 0,
	         o     width : 0,
	         o     height: 0
	         o }
	        \*/
	        getRect: function rectCheck (element) {
	            element = element || this._element;

	            if (this.selector && !(isElement(element))) {
	                element = this._context.querySelector(this.selector);
	            }

	            return getElementRect(element);
	        },

	        /*\
	         * Interactable.rectChecker
	         [ method ]
	         *
	         * Returns or sets the function used to calculate the interactable's
	         * element's rectangle
	         *
	         - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
	         = (function | object) The checker function or this Interactable
	        \*/
	        rectChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.getRect = checker;

	                return this;
	            }

	            if (checker === null) {
	                delete this.options.getRect;

	                return this;
	            }

	            return this.getRect;
	        },

	        /*\
	         * Interactable.styleCursor
	         [ method ]
	         *
	         * Returns or sets whether the action that would be performed when the
	         * mouse on the element are checked on `mousemove` so that the cursor
	         * may be styled appropriately
	         *
	         - newValue (boolean) #optional
	         = (boolean | Interactable) The current setting or this Interactable
	        \*/
	        styleCursor: function (newValue) {
	            if (isBool(newValue)) {
	                this.options.styleCursor = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.styleCursor;

	                return this;
	            }

	            return this.options.styleCursor;
	        },

	        /*\
	         * Interactable.preventDefault
	         [ method ]
	         *
	         * Returns or sets whether to prevent the browser's default behaviour
	         * in response to pointer events. Can be set to:
	         *  - `'always'` to always prevent
	         *  - `'never'` to never prevent
	         *  - `'auto'` to let interact.js try to determine what would be best
	         *
	         - newValue (string) #optional `true`, `false` or `'auto'`
	         = (string | Interactable) The current setting or this Interactable
	        \*/
	        preventDefault: function (newValue) {
	            if (/^(always|never|auto)$/.test(newValue)) {
	                this.options.preventDefault = newValue;
	                return this;
	            }

	            if (isBool(newValue)) {
	                this.options.preventDefault = newValue? 'always' : 'never';
	                return this;
	            }

	            return this.options.preventDefault;
	        },

	        /*\
	         * Interactable.origin
	         [ method ]
	         *
	         * Gets or sets the origin of the Interactable's element.  The x and y
	         * of the origin will be subtracted from action event coordinates.
	         *
	         - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
	         * OR
	         - origin (Element) #optional An HTML or SVG Element whose rect will be used
	         **
	         = (object) The current origin or this Interactable
	        \*/
	        origin: function (newValue) {
	            if (trySelector(newValue)) {
	                this.options.origin = newValue;
	                return this;
	            }
	            else if (isObject(newValue)) {
	                this.options.origin = newValue;
	                return this;
	            }

	            return this.options.origin;
	        },

	        /*\
	         * Interactable.deltaSource
	         [ method ]
	         *
	         * Returns or sets the mouse coordinate types used to calculate the
	         * movement of the pointer.
	         *
	         - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
	         = (string | object) The current deltaSource or this Interactable
	        \*/
	        deltaSource: function (newValue) {
	            if (newValue === 'page' || newValue === 'client') {
	                this.options.deltaSource = newValue;

	                return this;
	            }

	            return this.options.deltaSource;
	        },

	        /*\
	         * Interactable.restrict
	         [ method ]
	         **
	         * Deprecated. Add a `restrict` property to the options object passed to
	         * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
	         *
	         * Returns or sets the rectangles within which actions on this
	         * interactable (after snap calculations) are restricted. By default,
	         * restricting is relative to the pointer coordinates. You can change
	         * this by setting the
	         * [`elementRect`](https://github.com/taye/interact.js/pull/72).
	         **
	         - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
	         = (object) The current restrictions object or this Interactable
	         **
	         | interact(element).restrict({
	         |     // the rect will be `interact.getElementRect(element.parentNode)`
	         |     drag: element.parentNode,
	         |
	         |     // x and y are relative to the the interactable's origin
	         |     resize: { x: 100, y: 100, width: 200, height: 200 }
	         | })
	         |
	         | interact('.draggable').restrict({
	         |     // the rect will be the selected element's parent
	         |     drag: 'parent',
	         |
	         |     // do not restrict during normal movement.
	         |     // Instead, trigger only one restricted move event
	         |     // immediately before the end event.
	         |     endOnly: true,
	         |
	         |     // https://github.com/taye/interact.js/pull/72#issue-41813493
	         |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	         | });
	        \*/
	        restrict: function (options) {
	            if (!isObject(options)) {
	                return this.setOptions('restrict', options);
	            }

	            var actions = ['drag', 'resize', 'gesture'],
	                ret;

	            for (var i = 0; i < actions.length; i++) {
	                var action = actions[i];

	                if (action in options) {
	                    var perAction = extend({
	                            actions: [action],
	                            restriction: options[action]
	                        }, options);

	                    ret = this.setOptions('restrict', perAction);
	                }
	            }

	            return ret;
	        },

	        /*\
	         * Interactable.context
	         [ method ]
	         *
	         * Gets the selector context Node of the Interactable. The default is `window.document`.
	         *
	         = (Node) The context Node of this Interactable
	         **
	        \*/
	        context: function () {
	            return this._context;
	        },

	        _context: document,

	        /*\
	         * Interactable.ignoreFrom
	         [ method ]
	         *
	         * If the target of the `mousedown`, `pointerdown` or `touchstart`
	         * event or any of it's parents match the given CSS selector or
	         * Element, no drag/resize/gesture is started.
	         *
	         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
	         = (string | Element | object) The current ignoreFrom value or this Interactable
	         **
	         | interact(element, { ignoreFrom: document.getElementById('no-action') });
	         | // or
	         | interact(element).ignoreFrom('input, textarea, a');
	        \*/
	        ignoreFrom: function (newValue) {
	            if (trySelector(newValue)) {            // CSS selector to match event.target
	                this.options.ignoreFrom = newValue;
	                return this;
	            }

	            if (isElement(newValue)) {              // specific element
	                this.options.ignoreFrom = newValue;
	                return this;
	            }

	            return this.options.ignoreFrom;
	        },

	        /*\
	         * Interactable.allowFrom
	         [ method ]
	         *
	         * A drag/resize/gesture is started only If the target of the
	         * `mousedown`, `pointerdown` or `touchstart` event or any of it's
	         * parents match the given CSS selector or Element.
	         *
	         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
	         = (string | Element | object) The current allowFrom value or this Interactable
	         **
	         | interact(element, { allowFrom: document.getElementById('drag-handle') });
	         | // or
	         | interact(element).allowFrom('.handle');
	        \*/
	        allowFrom: function (newValue) {
	            if (trySelector(newValue)) {            // CSS selector to match event.target
	                this.options.allowFrom = newValue;
	                return this;
	            }

	            if (isElement(newValue)) {              // specific element
	                this.options.allowFrom = newValue;
	                return this;
	            }

	            return this.options.allowFrom;
	        },

	        /*\
	         * Interactable.element
	         [ method ]
	         *
	         * If this is not a selector Interactable, it returns the element this
	         * interactable represents
	         *
	         = (Element) HTML / SVG Element
	        \*/
	        element: function () {
	            return this._element;
	        },

	        /*\
	         * Interactable.fire
	         [ method ]
	         *
	         * Calls listeners for the given InteractEvent type bound globally
	         * and directly to this Interactable
	         *
	         - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
	         = (Interactable) this Interactable
	        \*/
	        fire: function (iEvent) {
	            if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
	                return this;
	            }

	            var listeners,
	                i,
	                len,
	                onEvent = 'on' + iEvent.type,
	                funcName = '';

	            // Interactable#on() listeners
	            if (iEvent.type in this._iEvents) {
	                listeners = this._iEvents[iEvent.type];

	                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	                    funcName = listeners[i].name;
	                    listeners[i](iEvent);
	                }
	            }

	            // interactable.onevent listener
	            if (isFunction(this[onEvent])) {
	                funcName = this[onEvent].name;
	                this[onEvent](iEvent);
	            }

	            // interact.on() listeners
	            if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type]))  {

	                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	                    funcName = listeners[i].name;
	                    listeners[i](iEvent);
	                }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.on
	         [ method ]
	         *
	         * Binds a listener for an InteractEvent or DOM event.
	         *
	         - eventType  (string | array | object) The types of events to listen for
	         - listener   (function) The function to be called on the given event(s)
	         - useCapture (boolean) #optional useCapture flag for addEventListener
	         = (object) This Interactable
	        \*/
	        on: function (eventType, listener, useCapture) {
	            var i;

	            if (isString(eventType) && eventType.search(' ') !== -1) {
	                eventType = eventType.trim().split(/ +/);
	            }

	            if (isArray(eventType)) {
	                for (i = 0; i < eventType.length; i++) {
	                    this.on(eventType[i], listener, useCapture);
	                }

	                return this;
	            }

	            if (isObject(eventType)) {
	                for (var prop in eventType) {
	                    this.on(prop, eventType[prop], listener);
	                }

	                return this;
	            }

	            if (eventType === 'wheel') {
	                eventType = wheelEvent;
	            }

	            // convert to boolean
	            useCapture = useCapture? true: false;

	            if (contains(eventTypes, eventType)) {
	                // if this type of event was never bound to this Interactable
	                if (!(eventType in this._iEvents)) {
	                    this._iEvents[eventType] = [listener];
	                }
	                else {
	                    this._iEvents[eventType].push(listener);
	                }
	            }
	            // delegated event for selector
	            else if (this.selector) {
	                if (!delegatedEvents[eventType]) {
	                    delegatedEvents[eventType] = {
	                        selectors: [],
	                        contexts : [],
	                        listeners: []
	                    };

	                    // add delegate listener functions
	                    for (i = 0; i < documents.length; i++) {
	                        events.add(documents[i], eventType, delegateListener);
	                        events.add(documents[i], eventType, delegateUseCapture, true);
	                    }
	                }

	                var delegated = delegatedEvents[eventType],
	                    index;

	                for (index = delegated.selectors.length - 1; index >= 0; index--) {
	                    if (delegated.selectors[index] === this.selector
	                        && delegated.contexts[index] === this._context) {
	                        break;
	                    }
	                }

	                if (index === -1) {
	                    index = delegated.selectors.length;

	                    delegated.selectors.push(this.selector);
	                    delegated.contexts .push(this._context);
	                    delegated.listeners.push([]);
	                }

	                // keep listener and useCapture flag
	                delegated.listeners[index].push([listener, useCapture]);
	            }
	            else {
	                events.add(this._element, eventType, listener, useCapture);
	            }

	            return this;
	        },

	        /*\
	         * Interactable.off
	         [ method ]
	         *
	         * Removes an InteractEvent or DOM event listener
	         *
	         - eventType  (string | array | object) The types of events that were listened for
	         - listener   (function) The listener function to be removed
	         - useCapture (boolean) #optional useCapture flag for removeEventListener
	         = (object) This Interactable
	        \*/
	        off: function (eventType, listener, useCapture) {
	            var i;

	            if (isString(eventType) && eventType.search(' ') !== -1) {
	                eventType = eventType.trim().split(/ +/);
	            }

	            if (isArray(eventType)) {
	                for (i = 0; i < eventType.length; i++) {
	                    this.off(eventType[i], listener, useCapture);
	                }

	                return this;
	            }

	            if (isObject(eventType)) {
	                for (var prop in eventType) {
	                    this.off(prop, eventType[prop], listener);
	                }

	                return this;
	            }

	            var eventList,
	                index = -1;

	            // convert to boolean
	            useCapture = useCapture? true: false;

	            if (eventType === 'wheel') {
	                eventType = wheelEvent;
	            }

	            // if it is an action event type
	            if (contains(eventTypes, eventType)) {
	                eventList = this._iEvents[eventType];

	                if (eventList && (index = indexOf(eventList, listener)) !== -1) {
	                    this._iEvents[eventType].splice(index, 1);
	                }
	            }
	            // delegated event
	            else if (this.selector) {
	                var delegated = delegatedEvents[eventType],
	                    matchFound = false;

	                if (!delegated) { return this; }

	                // count from last index of delegated to 0
	                for (index = delegated.selectors.length - 1; index >= 0; index--) {
	                    // look for matching selector and context Node
	                    if (delegated.selectors[index] === this.selector
	                        && delegated.contexts[index] === this._context) {

	                        var listeners = delegated.listeners[index];

	                        // each item of the listeners array is an array: [function, useCaptureFlag]
	                        for (i = listeners.length - 1; i >= 0; i--) {
	                            var fn = listeners[i][0],
	                                useCap = listeners[i][1];

	                            // check if the listener functions and useCapture flags match
	                            if (fn === listener && useCap === useCapture) {
	                                // remove the listener from the array of listeners
	                                listeners.splice(i, 1);

	                                // if all listeners for this interactable have been removed
	                                // remove the interactable from the delegated arrays
	                                if (!listeners.length) {
	                                    delegated.selectors.splice(index, 1);
	                                    delegated.contexts .splice(index, 1);
	                                    delegated.listeners.splice(index, 1);

	                                    // remove delegate function from context
	                                    events.remove(this._context, eventType, delegateListener);
	                                    events.remove(this._context, eventType, delegateUseCapture, true);

	                                    // remove the arrays if they are empty
	                                    if (!delegated.selectors.length) {
	                                        delegatedEvents[eventType] = null;
	                                    }
	                                }

	                                // only remove one listener
	                                matchFound = true;
	                                break;
	                            }
	                        }

	                        if (matchFound) { break; }
	                    }
	                }
	            }
	            // remove listener from this Interatable's element
	            else {
	                events.remove(this._element, eventType, listener, useCapture);
	            }

	            return this;
	        },

	        /*\
	         * Interactable.set
	         [ method ]
	         *
	         * Reset the options of this Interactable
	         - options (object) The new settings to apply
	         = (object) This Interactable
	        \*/
	        set: function (options) {
	            if (!isObject(options)) {
	                options = {};
	            }

	            this.options = extend({}, defaultOptions.base);

	            var i,
	                actions = ['drag', 'drop', 'resize', 'gesture'],
	                methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
	                perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

	            for (i = 0; i < actions.length; i++) {
	                var action = actions[i];

	                this.options[action] = extend({}, defaultOptions[action]);

	                this.setPerAction(action, perActions);

	                this[methods[i]](options[action]);
	            }

	            var settings = [
	                    'accept', 'actionChecker', 'allowFrom', 'deltaSource',
	                    'dropChecker', 'ignoreFrom', 'origin', 'preventDefault',
	                    'rectChecker', 'styleCursor'
	                ];

	            for (i = 0, len = settings.length; i < len; i++) {
	                var setting = settings[i];

	                this.options[setting] = defaultOptions.base[setting];

	                if (setting in options) {
	                    this[setting](options[setting]);
	                }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.unset
	         [ method ]
	         *
	         * Remove this interactable from the list of interactables and remove
	         * it's drag, drop, resize and gesture capabilities
	         *
	         = (object) @interact
	        \*/
	        unset: function () {
	            events.remove(this._element, 'all');

	            if (!isString(this.selector)) {
	                events.remove(this, 'all');
	                if (this.options.styleCursor) {
	                    this._element.style.cursor = '';
	                }
	            }
	            else {
	                // remove delegated events
	                for (var type in delegatedEvents) {
	                    var delegated = delegatedEvents[type];

	                    for (var i = 0; i < delegated.selectors.length; i++) {
	                        if (delegated.selectors[i] === this.selector
	                            && delegated.contexts[i] === this._context) {

	                            delegated.selectors.splice(i, 1);
	                            delegated.contexts .splice(i, 1);
	                            delegated.listeners.splice(i, 1);

	                            // remove the arrays if they are empty
	                            if (!delegated.selectors.length) {
	                                delegatedEvents[type] = null;
	                            }
	                        }

	                        events.remove(this._context, type, delegateListener);
	                        events.remove(this._context, type, delegateUseCapture, true);

	                        break;
	                    }
	                }
	            }

	            this.dropzone(false);

	            interactables.splice(indexOf(interactables, this), 1);

	            return interact;
	        }
	    };

	    function warnOnce (method, message) {
	        var warned = false;

	        return function () {
	            if (!warned) {
	                window.console.warn(message);
	                warned = true;
	            }

	            return method.apply(this, arguments);
	        };
	    }

	    Interactable.prototype.snap = warnOnce(Interactable.prototype.snap,
	         'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
	    Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict,
	         'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
	    Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia,
	         'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
	    Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll,
	         'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
	    Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize,
	         'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');

	    Interactable.prototype.accept = warnOnce(Interactable.prototype.accept,
	         'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
	    Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker,
	         'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
	    Interactable.prototype.context = warnOnce(Interactable.prototype.context,
	         'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');

	    /*\
	     * interact.isSet
	     [ method ]
	     *
	     * Check if an element has been set
	     - element (Element) The Element being searched for
	     = (boolean) Indicates if the element or CSS selector was previously passed to interact
	    \*/
	    interact.isSet = function(element, options) {
	        return interactables.indexOfElement(element, options && options.context) !== -1;
	    };

	    /*\
	     * interact.on
	     [ method ]
	     *
	     * Adds a global listener for an InteractEvent or adds a DOM event to
	     * `document`
	     *
	     - type       (string | array | object) The types of events to listen for
	     - listener   (function) The function to be called on the given event(s)
	     - useCapture (boolean) #optional useCapture flag for addEventListener
	     = (object) interact
	    \*/
	    interact.on = function (type, listener, useCapture) {
	        if (isString(type) && type.search(' ') !== -1) {
	            type = type.trim().split(/ +/);
	        }

	        if (isArray(type)) {
	            for (var i = 0; i < type.length; i++) {
	                interact.on(type[i], listener, useCapture);
	            }

	            return interact;
	        }

	        if (isObject(type)) {
	            for (var prop in type) {
	                interact.on(prop, type[prop], listener);
	            }

	            return interact;
	        }

	        // if it is an InteractEvent type, add listener to globalEvents
	        if (contains(eventTypes, type)) {
	            // if this type of event was never bound
	            if (!globalEvents[type]) {
	                globalEvents[type] = [listener];
	            }
	            else {
	                globalEvents[type].push(listener);
	            }
	        }
	        // If non InteractEvent type, addEventListener to document
	        else {
	            events.add(document, type, listener, useCapture);
	        }

	        return interact;
	    };

	    /*\
	     * interact.off
	     [ method ]
	     *
	     * Removes a global InteractEvent listener or DOM event from `document`
	     *
	     - type       (string | array | object) The types of events that were listened for
	     - listener   (function) The listener function to be removed
	     - useCapture (boolean) #optional useCapture flag for removeEventListener
	     = (object) interact
	     \*/
	    interact.off = function (type, listener, useCapture) {
	        if (isString(type) && type.search(' ') !== -1) {
	            type = type.trim().split(/ +/);
	        }

	        if (isArray(type)) {
	            for (var i = 0; i < type.length; i++) {
	                interact.off(type[i], listener, useCapture);
	            }

	            return interact;
	        }

	        if (isObject(type)) {
	            for (var prop in type) {
	                interact.off(prop, type[prop], listener);
	            }

	            return interact;
	        }

	        if (!contains(eventTypes, type)) {
	            events.remove(document, type, listener, useCapture);
	        }
	        else {
	            var index;

	            if (type in globalEvents
	                && (index = indexOf(globalEvents[type], listener)) !== -1) {
	                globalEvents[type].splice(index, 1);
	            }
	        }

	        return interact;
	    };

	    /*\
	     * interact.enableDragging
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether dragging is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableDragging = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.drag = newValue;

	            return interact;
	        }
	        return actionIsEnabled.drag;
	    }, 'interact.enableDragging is deprecated and will soon be removed.');

	    /*\
	     * interact.enableResizing
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether resizing is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableResizing = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.resize = newValue;

	            return interact;
	        }
	        return actionIsEnabled.resize;
	    }, 'interact.enableResizing is deprecated and will soon be removed.');

	    /*\
	     * interact.enableGesturing
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether gesturing is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableGesturing = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.gesture = newValue;

	            return interact;
	        }
	        return actionIsEnabled.gesture;
	    }, 'interact.enableGesturing is deprecated and will soon be removed.');

	    interact.eventTypes = eventTypes;

	    /*\
	     * interact.debug
	     [ method ]
	     *
	     * Returns debugging data
	     = (object) An object with properties that outline the current state and expose internal functions and variables
	    \*/
	    interact.debug = function () {
	        var interaction = interactions[0] || new Interaction();

	        return {
	            interactions          : interactions,
	            target                : interaction.target,
	            dragging              : interaction.dragging,
	            resizing              : interaction.resizing,
	            gesturing             : interaction.gesturing,
	            prepared              : interaction.prepared,
	            matches               : interaction.matches,
	            matchElements         : interaction.matchElements,

	            prevCoords            : interaction.prevCoords,
	            startCoords           : interaction.startCoords,

	            pointerIds            : interaction.pointerIds,
	            pointers              : interaction.pointers,
	            addPointer            : listeners.addPointer,
	            removePointer         : listeners.removePointer,
	            recordPointer        : listeners.recordPointer,

	            snap                  : interaction.snapStatus,
	            restrict              : interaction.restrictStatus,
	            inertia               : interaction.inertiaStatus,

	            downTime              : interaction.downTimes[0],
	            downEvent             : interaction.downEvent,
	            downPointer           : interaction.downPointer,
	            prevEvent             : interaction.prevEvent,

	            Interactable          : Interactable,
	            interactables         : interactables,
	            pointerIsDown         : interaction.pointerIsDown,
	            defaultOptions        : defaultOptions,
	            defaultActionChecker  : defaultActionChecker,

	            actionCursors         : actionCursors,
	            dragMove              : listeners.dragMove,
	            resizeMove            : listeners.resizeMove,
	            gestureMove           : listeners.gestureMove,
	            pointerUp             : listeners.pointerUp,
	            pointerDown           : listeners.pointerDown,
	            pointerMove           : listeners.pointerMove,
	            pointerHover          : listeners.pointerHover,

	            eventTypes            : eventTypes,

	            events                : events,
	            globalEvents          : globalEvents,
	            delegatedEvents       : delegatedEvents,

	            prefixedPropREs       : prefixedPropREs
	        };
	    };

	    // expose the functions used to calculate multi-touch properties
	    interact.getPointerAverage = pointerAverage;
	    interact.getTouchBBox     = touchBBox;
	    interact.getTouchDistance = touchDistance;
	    interact.getTouchAngle    = touchAngle;

	    interact.getElementRect         = getElementRect;
	    interact.getElementClientRect   = getElementClientRect;
	    interact.matchesSelector        = matchesSelector;
	    interact.closest                = closest;

	    /*\
	     * interact.margin
	     [ method ]
	     *
	     * Deprecated. Use `interact(target).resizable({ margin: number });` instead.
	     * Returns or sets the margin for autocheck resizing used in
	     * @Interactable.getAction. That is the distance from the bottom and right
	     * edges of an element clicking in which will start resizing
	     *
	     - newValue (number) #optional
	     = (number | interact) The current margin value or interact
	    \*/
	    interact.margin = warnOnce(function (newvalue) {
	        if (isNumber(newvalue)) {
	            margin = newvalue;

	            return interact;
	        }
	        return margin;
	    },
	    'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.') ;

	    /*\
	     * interact.supportsTouch
	     [ method ]
	     *
	     = (boolean) Whether or not the browser supports touch input
	    \*/
	    interact.supportsTouch = function () {
	        return supportsTouch;
	    };

	    /*\
	     * interact.supportsPointerEvent
	     [ method ]
	     *
	     = (boolean) Whether or not the browser supports PointerEvents
	    \*/
	    interact.supportsPointerEvent = function () {
	        return supportsPointerEvent;
	    };

	    /*\
	     * interact.stop
	     [ method ]
	     *
	     * Cancels all interactions (end events are not fired)
	     *
	     - event (Event) An event on which to call preventDefault()
	     = (object) interact
	    \*/
	    interact.stop = function (event) {
	        for (var i = interactions.length - 1; i >= 0; i--) {
	            interactions[i].stop(event);
	        }

	        return interact;
	    };

	    /*\
	     * interact.dynamicDrop
	     [ method ]
	     *
	     * Returns or sets whether the dimensions of dropzone elements are
	     * calculated on every dragmove or only on dragstart for the default
	     * dropChecker
	     *
	     - newValue (boolean) #optional True to check on each move. False to check only before start
	     = (boolean | interact) The current setting or interact
	    \*/
	    interact.dynamicDrop = function (newValue) {
	        if (isBool(newValue)) {
	            //if (dragging && dynamicDrop !== newValue && !newValue) {
	                //calcRects(dropzones);
	            //}

	            dynamicDrop = newValue;

	            return interact;
	        }
	        return dynamicDrop;
	    };

	    /*\
	     * interact.pointerMoveTolerance
	     [ method ]
	     * Returns or sets the distance the pointer must be moved before an action
	     * sequence occurs. This also affects tolerance for tap events.
	     *
	     - newValue (number) #optional The movement from the start position must be greater than this value
	     = (number | Interactable) The current setting or interact
	    \*/
	    interact.pointerMoveTolerance = function (newValue) {
	        if (isNumber(newValue)) {
	            pointerMoveTolerance = newValue;

	            return this;
	        }

	        return pointerMoveTolerance;
	    };

	    /*\
	     * interact.maxInteractions
	     [ method ]
	     **
	     * Returns or sets the maximum number of concurrent interactions allowed.
	     * By default only 1 interaction is allowed at a time (for backwards
	     * compatibility). To allow multiple interactions on the same Interactables
	     * and elements, you need to enable it in the draggable, resizable and
	     * gesturable `'max'` and `'maxPerElement'` options.
	     **
	     - newValue (number) #optional Any number. newValue <= 0 means no interactions.
	    \*/
	    interact.maxInteractions = function (newValue) {
	        if (isNumber(newValue)) {
	            maxInteractions = newValue;

	            return this;
	        }

	        return maxInteractions;
	    };

	    interact.createSnapGrid = function (grid) {
	        return function (x, y) {
	            var offsetX = 0,
	                offsetY = 0;

	            if (isObject(grid.offset)) {
	                offsetX = grid.offset.x;
	                offsetY = grid.offset.y;
	            }

	            var gridx = Math.round((x - offsetX) / grid.x),
	                gridy = Math.round((y - offsetY) / grid.y),

	                newX = gridx * grid.x + offsetX,
	                newY = gridy * grid.y + offsetY;

	            return {
	                x: newX,
	                y: newY,
	                range: grid.range
	            };
	        };
	    };

	    function endAllInteractions (event) {
	        for (var i = 0; i < interactions.length; i++) {
	            interactions[i].pointerEnd(event, event);
	        }
	    }

	    function listenToDocument (doc) {
	        if (contains(documents, doc)) { return; }

	        var win = doc.defaultView || doc.parentWindow;

	        // add delegate event listener
	        for (var eventType in delegatedEvents) {
	            events.add(doc, eventType, delegateListener);
	            events.add(doc, eventType, delegateUseCapture, true);
	        }

	        if (supportsPointerEvent) {
	            if (PointerEvent === win.MSPointerEvent) {
	                pEventTypes = {
	                    up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
	                    out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
	            }
	            else {
	                pEventTypes = {
	                    up: 'pointerup', down: 'pointerdown', over: 'pointerover',
	                    out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
	            }

	            events.add(doc, pEventTypes.down  , listeners.selectorDown );
	            events.add(doc, pEventTypes.move  , listeners.pointerMove  );
	            events.add(doc, pEventTypes.over  , listeners.pointerOver  );
	            events.add(doc, pEventTypes.out   , listeners.pointerOut   );
	            events.add(doc, pEventTypes.up    , listeners.pointerUp    );
	            events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

	            // autoscroll
	            events.add(doc, pEventTypes.move, listeners.autoScrollMove);
	        }
	        else {
	            events.add(doc, 'mousedown', listeners.selectorDown);
	            events.add(doc, 'mousemove', listeners.pointerMove );
	            events.add(doc, 'mouseup'  , listeners.pointerUp   );
	            events.add(doc, 'mouseover', listeners.pointerOver );
	            events.add(doc, 'mouseout' , listeners.pointerOut  );

	            events.add(doc, 'touchstart' , listeners.selectorDown );
	            events.add(doc, 'touchmove'  , listeners.pointerMove  );
	            events.add(doc, 'touchend'   , listeners.pointerUp    );
	            events.add(doc, 'touchcancel', listeners.pointerCancel);

	            // autoscroll
	            events.add(doc, 'mousemove', listeners.autoScrollMove);
	            events.add(doc, 'touchmove', listeners.autoScrollMove);
	        }

	        events.add(win, 'blur', endAllInteractions);

	        try {
	            if (win.frameElement) {
	                var parentDoc = win.frameElement.ownerDocument,
	                    parentWindow = parentDoc.defaultView;

	                events.add(parentDoc   , 'mouseup'      , listeners.pointerEnd);
	                events.add(parentDoc   , 'touchend'     , listeners.pointerEnd);
	                events.add(parentDoc   , 'touchcancel'  , listeners.pointerEnd);
	                events.add(parentDoc   , 'pointerup'    , listeners.pointerEnd);
	                events.add(parentDoc   , 'MSPointerUp'  , listeners.pointerEnd);
	                events.add(parentWindow, 'blur'         , endAllInteractions );
	            }
	        }
	        catch (error) {
	            interact.windowParentError = error;
	        }

	        // prevent native HTML5 drag on interact.js target elements
	        events.add(doc, 'dragstart', function (event) {
	            for (var i = 0; i < interactions.length; i++) {
	                var interaction = interactions[i];

	                if (interaction.element
	                    && (interaction.element === event.target
	                        || nodeContains(interaction.element, event.target))) {

	                    interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
	                    return;
	                }
	            }
	        });

	        if (events.useAttachEvent) {
	            // For IE's lack of Event#preventDefault
	            events.add(doc, 'selectstart', function (event) {
	                var interaction = interactions[0];

	                if (interaction.currentAction()) {
	                    interaction.checkAndPreventDefault(event);
	                }
	            });

	            // For IE's bad dblclick event sequence
	            events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
	        }

	        documents.push(doc);
	    }

	    listenToDocument(document);

	    function indexOf (array, target) {
	        for (var i = 0, len = array.length; i < len; i++) {
	            if (array[i] === target) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    function contains (array, target) {
	        return indexOf(array, target) !== -1;
	    }

	    function matchesSelector (element, selector, nodeList) {
	        if (ie8MatchesSelector) {
	            return ie8MatchesSelector(element, selector, nodeList);
	        }

	        // remove /deep/ from selectors if shadowDOM polyfill is used
	        if (window !== realWindow) {
	            selector = selector.replace(/\/deep\//g, ' ');
	        }

	        return element[prefixedMatchesSelector](selector);
	    }

	    function matchesUpTo (element, selector, limit) {
	        while (isElement(element)) {
	            if (matchesSelector(element, selector)) {
	                return true;
	            }

	            element = parentElement(element);

	            if (element === limit) {
	                return matchesSelector(element, selector);
	            }
	        }

	        return false;
	    }

	    // For IE8's lack of an Element#matchesSelector
	    // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
	    if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
	        ie8MatchesSelector = function (element, selector, elems) {
	            elems = elems || element.parentNode.querySelectorAll(selector);

	            for (var i = 0, len = elems.length; i < len; i++) {
	                if (elems[i] === element) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    // requestAnimationFrame polyfill
	    (function() {
	        var lastTime = 0,
	            vendors = ['ms', 'moz', 'webkit', 'o'];

	        for(var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
	            reqFrame = realWindow[vendors[x]+'RequestAnimationFrame'];
	            cancelFrame = realWindow[vendors[x]+'CancelAnimationFrame'] || realWindow[vendors[x]+'CancelRequestAnimationFrame'];
	        }

	        if (!reqFrame) {
	            reqFrame = function(callback) {
	                var currTime = new Date().getTime(),
	                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	                    id = setTimeout(function() { callback(currTime + timeToCall); },
	                  timeToCall);
	                lastTime = currTime + timeToCall;
	                return id;
	            };
	        }

	        if (!cancelFrame) {
	            cancelFrame = function(id) {
	                clearTimeout(id);
	            };
	        }
	    }());

	    /* global exports: true, module, define */

	    // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
	    if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = interact;
	        }
	        exports.interact = interact;
	    }
	    // AMD
	    else if (typeof define === 'function' && define.amd) {
	        define('interact', function() {
	            return interact;
	        });
	    }
	    else {
	        realWindow.interact = interact;
	    }

	} (typeof window === 'undefined'? undefined : window));



/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*** IMPORTS FROM imports-loader ***/
	var define = false;

	//! moment.js
	//! version : 2.18.1
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com

	;(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    global.moment = factory()
	}(this, (function () { 'use strict';

	var hookCallback;

	function hooks () {
	    return hookCallback.apply(null, arguments);
	}

	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback (callback) {
	    hookCallback = callback;
	}

	function isArray(input) {
	    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	}

	function isObject(input) {
	    // IE8 will treat undefined and null as object if it wasn't for
	    // input != null
	    return input != null && Object.prototype.toString.call(input) === '[object Object]';
	}

	function isObjectEmpty(obj) {
	    var k;
	    for (k in obj) {
	        // even if its not own property I'd still call it non-empty
	        return false;
	    }
	    return true;
	}

	function isUndefined(input) {
	    return input === void 0;
	}

	function isNumber(input) {
	    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
	}

	function isDate(input) {
	    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	}

	function map(arr, fn) {
	    var res = [], i;
	    for (i = 0; i < arr.length; ++i) {
	        res.push(fn(arr[i], i));
	    }
	    return res;
	}

	function hasOwnProp(a, b) {
	    return Object.prototype.hasOwnProperty.call(a, b);
	}

	function extend(a, b) {
	    for (var i in b) {
	        if (hasOwnProp(b, i)) {
	            a[i] = b[i];
	        }
	    }

	    if (hasOwnProp(b, 'toString')) {
	        a.toString = b.toString;
	    }

	    if (hasOwnProp(b, 'valueOf')) {
	        a.valueOf = b.valueOf;
	    }

	    return a;
	}

	function createUTC (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, true).utc();
	}

	function defaultParsingFlags() {
	    // We need to deep clone this object.
	    return {
	        empty           : false,
	        unusedTokens    : [],
	        unusedInput     : [],
	        overflow        : -2,
	        charsLeftOver   : 0,
	        nullInput       : false,
	        invalidMonth    : null,
	        invalidFormat   : false,
	        userInvalidated : false,
	        iso             : false,
	        parsedDateParts : [],
	        meridiem        : null,
	        rfc2822         : false,
	        weekdayMismatch : false
	    };
	}

	function getParsingFlags(m) {
	    if (m._pf == null) {
	        m._pf = defaultParsingFlags();
	    }
	    return m._pf;
	}

	var some;
	if (Array.prototype.some) {
	    some = Array.prototype.some;
	} else {
	    some = function (fun) {
	        var t = Object(this);
	        var len = t.length >>> 0;

	        for (var i = 0; i < len; i++) {
	            if (i in t && fun.call(this, t[i], i, t)) {
	                return true;
	            }
	        }

	        return false;
	    };
	}

	var some$1 = some;

	function isValid(m) {
	    if (m._isValid == null) {
	        var flags = getParsingFlags(m);
	        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
	            return i != null;
	        });
	        var isNowValid = !isNaN(m._d.getTime()) &&
	            flags.overflow < 0 &&
	            !flags.empty &&
	            !flags.invalidMonth &&
	            !flags.invalidWeekday &&
	            !flags.nullInput &&
	            !flags.invalidFormat &&
	            !flags.userInvalidated &&
	            (!flags.meridiem || (flags.meridiem && parsedParts));

	        if (m._strict) {
	            isNowValid = isNowValid &&
	                flags.charsLeftOver === 0 &&
	                flags.unusedTokens.length === 0 &&
	                flags.bigHour === undefined;
	        }

	        if (Object.isFrozen == null || !Object.isFrozen(m)) {
	            m._isValid = isNowValid;
	        }
	        else {
	            return isNowValid;
	        }
	    }
	    return m._isValid;
	}

	function createInvalid (flags) {
	    var m = createUTC(NaN);
	    if (flags != null) {
	        extend(getParsingFlags(m), flags);
	    }
	    else {
	        getParsingFlags(m).userInvalidated = true;
	    }

	    return m;
	}

	// Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties = hooks.momentProperties = [];

	function copyConfig(to, from) {
	    var i, prop, val;

	    if (!isUndefined(from._isAMomentObject)) {
	        to._isAMomentObject = from._isAMomentObject;
	    }
	    if (!isUndefined(from._i)) {
	        to._i = from._i;
	    }
	    if (!isUndefined(from._f)) {
	        to._f = from._f;
	    }
	    if (!isUndefined(from._l)) {
	        to._l = from._l;
	    }
	    if (!isUndefined(from._strict)) {
	        to._strict = from._strict;
	    }
	    if (!isUndefined(from._tzm)) {
	        to._tzm = from._tzm;
	    }
	    if (!isUndefined(from._isUTC)) {
	        to._isUTC = from._isUTC;
	    }
	    if (!isUndefined(from._offset)) {
	        to._offset = from._offset;
	    }
	    if (!isUndefined(from._pf)) {
	        to._pf = getParsingFlags(from);
	    }
	    if (!isUndefined(from._locale)) {
	        to._locale = from._locale;
	    }

	    if (momentProperties.length > 0) {
	        for (i = 0; i < momentProperties.length; i++) {
	            prop = momentProperties[i];
	            val = from[prop];
	            if (!isUndefined(val)) {
	                to[prop] = val;
	            }
	        }
	    }

	    return to;
	}

	var updateInProgress = false;

	// Moment prototype object
	function Moment(config) {
	    copyConfig(this, config);
	    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	    if (!this.isValid()) {
	        this._d = new Date(NaN);
	    }
	    // Prevent infinite loop in case updateOffset creates new moment
	    // objects.
	    if (updateInProgress === false) {
	        updateInProgress = true;
	        hooks.updateOffset(this);
	        updateInProgress = false;
	    }
	}

	function isMoment (obj) {
	    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	}

	function absFloor (number) {
	    if (number < 0) {
	        // -0 -> 0
	        return Math.ceil(number) || 0;
	    } else {
	        return Math.floor(number);
	    }
	}

	function toInt(argumentForCoercion) {
	    var coercedNumber = +argumentForCoercion,
	        value = 0;

	    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	        value = absFloor(coercedNumber);
	    }

	    return value;
	}

	// compare two arrays, return the number of differences
	function compareArrays(array1, array2, dontConvert) {
	    var len = Math.min(array1.length, array2.length),
	        lengthDiff = Math.abs(array1.length - array2.length),
	        diffs = 0,
	        i;
	    for (i = 0; i < len; i++) {
	        if ((dontConvert && array1[i] !== array2[i]) ||
	            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	            diffs++;
	        }
	    }
	    return diffs + lengthDiff;
	}

	function warn(msg) {
	    if (hooks.suppressDeprecationWarnings === false &&
	            (typeof console !==  'undefined') && console.warn) {
	        console.warn('Deprecation warning: ' + msg);
	    }
	}

	function deprecate(msg, fn) {
	    var firstTime = true;

	    return extend(function () {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(null, msg);
	        }
	        if (firstTime) {
	            var args = [];
	            var arg;
	            for (var i = 0; i < arguments.length; i++) {
	                arg = '';
	                if (typeof arguments[i] === 'object') {
	                    arg += '\n[' + i + '] ';
	                    for (var key in arguments[0]) {
	                        arg += key + ': ' + arguments[0][key] + ', ';
	                    }
	                    arg = arg.slice(0, -2); // Remove trailing comma and space
	                } else {
	                    arg = arguments[i];
	                }
	                args.push(arg);
	            }
	            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	            firstTime = false;
	        }
	        return fn.apply(this, arguments);
	    }, fn);
	}

	var deprecations = {};

	function deprecateSimple(name, msg) {
	    if (hooks.deprecationHandler != null) {
	        hooks.deprecationHandler(name, msg);
	    }
	    if (!deprecations[name]) {
	        warn(msg);
	        deprecations[name] = true;
	    }
	}

	hooks.suppressDeprecationWarnings = false;
	hooks.deprecationHandler = null;

	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}

	function set (config) {
	    var prop, i;
	    for (i in config) {
	        prop = config[i];
	        if (isFunction(prop)) {
	            this[i] = prop;
	        } else {
	            this['_' + i] = prop;
	        }
	    }
	    this._config = config;
	    // Lenient ordinal parsing accepts just a number in addition to
	    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
	    // TODO: Remove "ordinalParse" fallback in next major release.
	    this._dayOfMonthOrdinalParseLenient = new RegExp(
	        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
	            '|' + (/\d{1,2}/).source);
	}

	function mergeConfigs(parentConfig, childConfig) {
	    var res = extend({}, parentConfig), prop;
	    for (prop in childConfig) {
	        if (hasOwnProp(childConfig, prop)) {
	            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                res[prop] = {};
	                extend(res[prop], parentConfig[prop]);
	                extend(res[prop], childConfig[prop]);
	            } else if (childConfig[prop] != null) {
	                res[prop] = childConfig[prop];
	            } else {
	                delete res[prop];
	            }
	        }
	    }
	    for (prop in parentConfig) {
	        if (hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])) {
	            // make sure changes to properties don't modify parent config
	            res[prop] = extend({}, res[prop]);
	        }
	    }
	    return res;
	}

	function Locale(config) {
	    if (config != null) {
	        this.set(config);
	    }
	}

	var keys;

	if (Object.keys) {
	    keys = Object.keys;
	} else {
	    keys = function (obj) {
	        var i, res = [];
	        for (i in obj) {
	            if (hasOwnProp(obj, i)) {
	                res.push(i);
	            }
	        }
	        return res;
	    };
	}

	var keys$1 = keys;

	var defaultCalendar = {
	    sameDay : '[Today at] LT',
	    nextDay : '[Tomorrow at] LT',
	    nextWeek : 'dddd [at] LT',
	    lastDay : '[Yesterday at] LT',
	    lastWeek : '[Last] dddd [at] LT',
	    sameElse : 'L'
	};

	function calendar (key, mom, now) {
	    var output = this._calendar[key] || this._calendar['sameElse'];
	    return isFunction(output) ? output.call(mom, now) : output;
	}

	var defaultLongDateFormat = {
	    LTS  : 'h:mm:ss A',
	    LT   : 'h:mm A',
	    L    : 'MM/DD/YYYY',
	    LL   : 'MMMM D, YYYY',
	    LLL  : 'MMMM D, YYYY h:mm A',
	    LLLL : 'dddd, MMMM D, YYYY h:mm A'
	};

	function longDateFormat (key) {
	    var format = this._longDateFormat[key],
	        formatUpper = this._longDateFormat[key.toUpperCase()];

	    if (format || !formatUpper) {
	        return format;
	    }

	    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	        return val.slice(1);
	    });

	    return this._longDateFormat[key];
	}

	var defaultInvalidDate = 'Invalid date';

	function invalidDate () {
	    return this._invalidDate;
	}

	var defaultOrdinal = '%d';
	var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

	function ordinal (number) {
	    return this._ordinal.replace('%d', number);
	}

	var defaultRelativeTime = {
	    future : 'in %s',
	    past   : '%s ago',
	    s  : 'a few seconds',
	    ss : '%d seconds',
	    m  : 'a minute',
	    mm : '%d minutes',
	    h  : 'an hour',
	    hh : '%d hours',
	    d  : 'a day',
	    dd : '%d days',
	    M  : 'a month',
	    MM : '%d months',
	    y  : 'a year',
	    yy : '%d years'
	};

	function relativeTime (number, withoutSuffix, string, isFuture) {
	    var output = this._relativeTime[string];
	    return (isFunction(output)) ?
	        output(number, withoutSuffix, string, isFuture) :
	        output.replace(/%d/i, number);
	}

	function pastFuture (diff, output) {
	    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	}

	var aliases = {};

	function addUnitAlias (unit, shorthand) {
	    var lowerCase = unit.toLowerCase();
	    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}

	function normalizeUnits(units) {
	    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}

	function normalizeObjectUnits(inputObject) {
	    var normalizedInput = {},
	        normalizedProp,
	        prop;

	    for (prop in inputObject) {
	        if (hasOwnProp(inputObject, prop)) {
	            normalizedProp = normalizeUnits(prop);
	            if (normalizedProp) {
	                normalizedInput[normalizedProp] = inputObject[prop];
	            }
	        }
	    }

	    return normalizedInput;
	}

	var priorities = {};

	function addUnitPriority(unit, priority) {
	    priorities[unit] = priority;
	}

	function getPrioritizedUnits(unitsObj) {
	    var units = [];
	    for (var u in unitsObj) {
	        units.push({unit: u, priority: priorities[u]});
	    }
	    units.sort(function (a, b) {
	        return a.priority - b.priority;
	    });
	    return units;
	}

	function makeGetSet (unit, keepTime) {
	    return function (value) {
	        if (value != null) {
	            set$1(this, unit, value);
	            hooks.updateOffset(this, keepTime);
	            return this;
	        } else {
	            return get(this, unit);
	        }
	    };
	}

	function get (mom, unit) {
	    return mom.isValid() ?
	        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	}

	function set$1 (mom, unit, value) {
	    if (mom.isValid()) {
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	    }
	}

	// MOMENTS

	function stringGet (units) {
	    units = normalizeUnits(units);
	    if (isFunction(this[units])) {
	        return this[units]();
	    }
	    return this;
	}


	function stringSet (units, value) {
	    if (typeof units === 'object') {
	        units = normalizeObjectUnits(units);
	        var prioritized = getPrioritizedUnits(units);
	        for (var i = 0; i < prioritized.length; i++) {
	            this[prioritized[i].unit](units[prioritized[i].unit]);
	        }
	    } else {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units](value);
	        }
	    }
	    return this;
	}

	function zeroFill(number, targetLength, forceSign) {
	    var absNumber = '' + Math.abs(number),
	        zerosToFill = targetLength - absNumber.length,
	        sign = number >= 0;
	    return (sign ? (forceSign ? '+' : '') : '-') +
	        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	}

	var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	var formatFunctions = {};

	var formatTokenFunctions = {};

	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken (token, padded, ordinal, callback) {
	    var func = callback;
	    if (typeof callback === 'string') {
	        func = function () {
	            return this[callback]();
	        };
	    }
	    if (token) {
	        formatTokenFunctions[token] = func;
	    }
	    if (padded) {
	        formatTokenFunctions[padded[0]] = function () {
	            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	        };
	    }
	    if (ordinal) {
	        formatTokenFunctions[ordinal] = function () {
	            return this.localeData().ordinal(func.apply(this, arguments), token);
	        };
	    }
	}

	function removeFormattingTokens(input) {
	    if (input.match(/\[[\s\S]/)) {
	        return input.replace(/^\[|\]$/g, '');
	    }
	    return input.replace(/\\/g, '');
	}

	function makeFormatFunction(format) {
	    var array = format.match(formattingTokens), i, length;

	    for (i = 0, length = array.length; i < length; i++) {
	        if (formatTokenFunctions[array[i]]) {
	            array[i] = formatTokenFunctions[array[i]];
	        } else {
	            array[i] = removeFormattingTokens(array[i]);
	        }
	    }

	    return function (mom) {
	        var output = '', i;
	        for (i = 0; i < length; i++) {
	            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
	        }
	        return output;
	    };
	}

	// format date using native date object
	function formatMoment(m, format) {
	    if (!m.isValid()) {
	        return m.localeData().invalidDate();
	    }

	    format = expandFormat(format, m.localeData());
	    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	    return formatFunctions[format](m);
	}

	function expandFormat(format, locale) {
	    var i = 5;

	    function replaceLongDateFormatTokens(input) {
	        return locale.longDateFormat(input) || input;
	    }

	    localFormattingTokens.lastIndex = 0;
	    while (i >= 0 && localFormattingTokens.test(format)) {
	        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	        localFormattingTokens.lastIndex = 0;
	        i -= 1;
	    }

	    return format;
	}

	var match1         = /\d/;            //       0 - 9
	var match2         = /\d\d/;          //      00 - 99
	var match3         = /\d{3}/;         //     000 - 999
	var match4         = /\d{4}/;         //    0000 - 9999
	var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2      = /\d\d?/;         //       0 - 99
	var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	var match1to3      = /\d{1,3}/;       //       0 - 999
	var match1to4      = /\d{1,4}/;       //       0 - 9999
	var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

	var matchUnsigned  = /\d+/;           //       0 - inf
	var matchSigned    = /[+-]?\d+/;      //    -inf - inf

	var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


	var regexes = {};

	function addRegexToken (token, regex, strictRegex) {
	    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	        return (isStrict && strictRegex) ? strictRegex : regex;
	    };
	}

	function getParseRegexForToken (token, config) {
	    if (!hasOwnProp(regexes, token)) {
	        return new RegExp(unescapeFormat(token));
	    }

	    return regexes[token](config._strict, config._locale);
	}

	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s) {
	    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	        return p1 || p2 || p3 || p4;
	    }));
	}

	function regexEscape(s) {
	    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	var tokens = {};

	function addParseToken (token, callback) {
	    var i, func = callback;
	    if (typeof token === 'string') {
	        token = [token];
	    }
	    if (isNumber(callback)) {
	        func = function (input, array) {
	            array[callback] = toInt(input);
	        };
	    }
	    for (i = 0; i < token.length; i++) {
	        tokens[token[i]] = func;
	    }
	}

	function addWeekParseToken (token, callback) {
	    addParseToken(token, function (input, array, config, token) {
	        config._w = config._w || {};
	        callback(input, config._w, config, token);
	    });
	}

	function addTimeToArrayFromToken(token, input, config) {
	    if (input != null && hasOwnProp(tokens, token)) {
	        tokens[token](input, config._a, config, token);
	    }
	}

	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;
	var WEEK = 7;
	var WEEKDAY = 8;

	var indexOf;

	if (Array.prototype.indexOf) {
	    indexOf = Array.prototype.indexOf;
	} else {
	    indexOf = function (o) {
	        // I know
	        var i;
	        for (i = 0; i < this.length; ++i) {
	            if (this[i] === o) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	var indexOf$1 = indexOf;

	function daysInMonth(year, month) {
	    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	}

	// FORMATTING

	addFormatToken('M', ['MM', 2], 'Mo', function () {
	    return this.month() + 1;
	});

	addFormatToken('MMM', 0, 0, function (format) {
	    return this.localeData().monthsShort(this, format);
	});

	addFormatToken('MMMM', 0, 0, function (format) {
	    return this.localeData().months(this, format);
	});

	// ALIASES

	addUnitAlias('month', 'M');

	// PRIORITY

	addUnitPriority('month', 8);

	// PARSING

	addRegexToken('M',    match1to2);
	addRegexToken('MM',   match1to2, match2);
	addRegexToken('MMM',  function (isStrict, locale) {
	    return locale.monthsShortRegex(isStrict);
	});
	addRegexToken('MMMM', function (isStrict, locale) {
	    return locale.monthsRegex(isStrict);
	});

	addParseToken(['M', 'MM'], function (input, array) {
	    array[MONTH] = toInt(input) - 1;
	});

	addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	    var month = config._locale.monthsParse(input, token, config._strict);
	    // if we didn't find a month name, mark the date as invalid.
	    if (month != null) {
	        array[MONTH] = month;
	    } else {
	        getParsingFlags(config).invalidMonth = input;
	    }
	});

	// LOCALES

	var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	function localeMonths (m, format) {
	    if (!m) {
	        return isArray(this._months) ? this._months :
	            this._months['standalone'];
	    }
	    return isArray(this._months) ? this._months[m.month()] :
	        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	}

	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	function localeMonthsShort (m, format) {
	    if (!m) {
	        return isArray(this._monthsShort) ? this._monthsShort :
	            this._monthsShort['standalone'];
	    }
	    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	}

	function handleStrictParse(monthName, format, strict) {
	    var i, ii, mom, llc = monthName.toLocaleLowerCase();
	    if (!this._monthsParse) {
	        // this is not used
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	        for (i = 0; i < 12; ++i) {
	            mom = createUTC([2000, i]);
	            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeMonthsParse (monthName, format, strict) {
	    var i, mom, regex;

	    if (this._monthsParseExact) {
	        return handleStrictParse.call(this, monthName, format, strict);
	    }

	    if (!this._monthsParse) {
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	    }

	    // TODO: add sorting
	    // Sorting makes sure if one month (or abbr) is a prefix of another
	    // see sorting in computeMonthsParse
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        if (strict && !this._longMonthsParse[i]) {
	            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	        }
	        if (!strict && !this._monthsParse[i]) {
	            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (!strict && this._monthsParse[i].test(monthName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function setMonth (mom, value) {
	    var dayOfMonth;

	    if (!mom.isValid()) {
	        // No op
	        return mom;
	    }

	    if (typeof value === 'string') {
	        if (/^\d+$/.test(value)) {
	            value = toInt(value);
	        } else {
	            value = mom.localeData().monthsParse(value);
	            // TODO: Another silent failure?
	            if (!isNumber(value)) {
	                return mom;
	            }
	        }
	    }

	    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	    return mom;
	}

	function getSetMonth (value) {
	    if (value != null) {
	        setMonth(this, value);
	        hooks.updateOffset(this, true);
	        return this;
	    } else {
	        return get(this, 'Month');
	    }
	}

	function getDaysInMonth () {
	    return daysInMonth(this.year(), this.month());
	}

	var defaultMonthsShortRegex = matchWord;
	function monthsShortRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsShortStrictRegex;
	        } else {
	            return this._monthsShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsShortRegex')) {
	            this._monthsShortRegex = defaultMonthsShortRegex;
	        }
	        return this._monthsShortStrictRegex && isStrict ?
	            this._monthsShortStrictRegex : this._monthsShortRegex;
	    }
	}

	var defaultMonthsRegex = matchWord;
	function monthsRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsStrictRegex;
	        } else {
	            return this._monthsRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            this._monthsRegex = defaultMonthsRegex;
	        }
	        return this._monthsStrictRegex && isStrict ?
	            this._monthsStrictRegex : this._monthsRegex;
	    }
	}

	function computeMonthsParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom;
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        shortPieces.push(this.monthsShort(mom, ''));
	        longPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.monthsShort(mom, ''));
	    }
	    // Sorting makes sure if one month (or abbr) is a prefix of another it
	    // will match the longer piece.
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 12; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	    }
	    for (i = 0; i < 24; i++) {
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._monthsShortRegex = this._monthsRegex;
	    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	addFormatToken('Y', 0, 0, function () {
	    var y = this.year();
	    return y <= 9999 ? '' + y : '+' + y;
	});

	addFormatToken(0, ['YY', 2], 0, function () {
	    return this.year() % 100;
	});

	addFormatToken(0, ['YYYY',   4],       0, 'year');
	addFormatToken(0, ['YYYYY',  5],       0, 'year');
	addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	// ALIASES

	addUnitAlias('year', 'y');

	// PRIORITIES

	addUnitPriority('year', 1);

	// PARSING

	addRegexToken('Y',      matchSigned);
	addRegexToken('YY',     match1to2, match2);
	addRegexToken('YYYY',   match1to4, match4);
	addRegexToken('YYYYY',  match1to6, match6);
	addRegexToken('YYYYYY', match1to6, match6);

	addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	addParseToken('YYYY', function (input, array) {
	    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	});
	addParseToken('YY', function (input, array) {
	    array[YEAR] = hooks.parseTwoDigitYear(input);
	});
	addParseToken('Y', function (input, array) {
	    array[YEAR] = parseInt(input, 10);
	});

	// HELPERS

	function daysInYear(year) {
	    return isLeapYear(year) ? 366 : 365;
	}

	function isLeapYear(year) {
	    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	// HOOKS

	hooks.parseTwoDigitYear = function (input) {
	    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	};

	// MOMENTS

	var getSetYear = makeGetSet('FullYear', true);

	function getIsLeapYear () {
	    return isLeapYear(this.year());
	}

	function createDate (y, m, d, h, M, s, ms) {
	    // can't just apply() to create a date:
	    // https://stackoverflow.com/q/181348
	    var date = new Date(y, m, d, h, M, s, ms);

	    // the date constructor remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	        date.setFullYear(y);
	    }
	    return date;
	}

	function createUTCDate (y) {
	    var date = new Date(Date.UTC.apply(null, arguments));

	    // the Date.UTC function remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	        date.setUTCFullYear(y);
	    }
	    return date;
	}

	// start-of-first-week - start-of-year
	function firstWeekOffset(year, dow, doy) {
	    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	        fwd = 7 + dow - doy,
	        // first-week day local weekday -- which local weekday is fwd
	        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	    return -fwdlw + fwd - 1;
	}

	// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	    var localWeekday = (7 + weekday - dow) % 7,
	        weekOffset = firstWeekOffset(year, dow, doy),
	        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	        resYear, resDayOfYear;

	    if (dayOfYear <= 0) {
	        resYear = year - 1;
	        resDayOfYear = daysInYear(resYear) + dayOfYear;
	    } else if (dayOfYear > daysInYear(year)) {
	        resYear = year + 1;
	        resDayOfYear = dayOfYear - daysInYear(year);
	    } else {
	        resYear = year;
	        resDayOfYear = dayOfYear;
	    }

	    return {
	        year: resYear,
	        dayOfYear: resDayOfYear
	    };
	}

	function weekOfYear(mom, dow, doy) {
	    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	        resWeek, resYear;

	    if (week < 1) {
	        resYear = mom.year() - 1;
	        resWeek = week + weeksInYear(resYear, dow, doy);
	    } else if (week > weeksInYear(mom.year(), dow, doy)) {
	        resWeek = week - weeksInYear(mom.year(), dow, doy);
	        resYear = mom.year() + 1;
	    } else {
	        resYear = mom.year();
	        resWeek = week;
	    }

	    return {
	        week: resWeek,
	        year: resYear
	    };
	}

	function weeksInYear(year, dow, doy) {
	    var weekOffset = firstWeekOffset(year, dow, doy),
	        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	}

	// FORMATTING

	addFormatToken('w', ['ww', 2], 'wo', 'week');
	addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	// ALIASES

	addUnitAlias('week', 'w');
	addUnitAlias('isoWeek', 'W');

	// PRIORITIES

	addUnitPriority('week', 5);
	addUnitPriority('isoWeek', 5);

	// PARSING

	addRegexToken('w',  match1to2);
	addRegexToken('ww', match1to2, match2);
	addRegexToken('W',  match1to2);
	addRegexToken('WW', match1to2, match2);

	addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	    week[token.substr(0, 1)] = toInt(input);
	});

	// HELPERS

	// LOCALES

	function localeWeek (mom) {
	    return weekOfYear(mom, this._week.dow, this._week.doy).week;
	}

	var defaultLocaleWeek = {
	    dow : 0, // Sunday is the first day of the week.
	    doy : 6  // The week that contains Jan 1st is the first week of the year.
	};

	function localeFirstDayOfWeek () {
	    return this._week.dow;
	}

	function localeFirstDayOfYear () {
	    return this._week.doy;
	}

	// MOMENTS

	function getSetWeek (input) {
	    var week = this.localeData().week(this);
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	function getSetISOWeek (input) {
	    var week = weekOfYear(this, 1, 4).week;
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	// FORMATTING

	addFormatToken('d', 0, 'do', 'day');

	addFormatToken('dd', 0, 0, function (format) {
	    return this.localeData().weekdaysMin(this, format);
	});

	addFormatToken('ddd', 0, 0, function (format) {
	    return this.localeData().weekdaysShort(this, format);
	});

	addFormatToken('dddd', 0, 0, function (format) {
	    return this.localeData().weekdays(this, format);
	});

	addFormatToken('e', 0, 0, 'weekday');
	addFormatToken('E', 0, 0, 'isoWeekday');

	// ALIASES

	addUnitAlias('day', 'd');
	addUnitAlias('weekday', 'e');
	addUnitAlias('isoWeekday', 'E');

	// PRIORITY
	addUnitPriority('day', 11);
	addUnitPriority('weekday', 11);
	addUnitPriority('isoWeekday', 11);

	// PARSING

	addRegexToken('d',    match1to2);
	addRegexToken('e',    match1to2);
	addRegexToken('E',    match1to2);
	addRegexToken('dd',   function (isStrict, locale) {
	    return locale.weekdaysMinRegex(isStrict);
	});
	addRegexToken('ddd',   function (isStrict, locale) {
	    return locale.weekdaysShortRegex(isStrict);
	});
	addRegexToken('dddd',   function (isStrict, locale) {
	    return locale.weekdaysRegex(isStrict);
	});

	addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	    var weekday = config._locale.weekdaysParse(input, token, config._strict);
	    // if we didn't get a weekday name, mark the date as invalid
	    if (weekday != null) {
	        week.d = weekday;
	    } else {
	        getParsingFlags(config).invalidWeekday = input;
	    }
	});

	addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	    week[token] = toInt(input);
	});

	// HELPERS

	function parseWeekday(input, locale) {
	    if (typeof input !== 'string') {
	        return input;
	    }

	    if (!isNaN(input)) {
	        return parseInt(input, 10);
	    }

	    input = locale.weekdaysParse(input);
	    if (typeof input === 'number') {
	        return input;
	    }

	    return null;
	}

	function parseIsoWeekday(input, locale) {
	    if (typeof input === 'string') {
	        return locale.weekdaysParse(input) % 7 || 7;
	    }
	    return isNaN(input) ? null : input;
	}

	// LOCALES

	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	function localeWeekdays (m, format) {
	    if (!m) {
	        return isArray(this._weekdays) ? this._weekdays :
	            this._weekdays['standalone'];
	    }
	    return isArray(this._weekdays) ? this._weekdays[m.day()] :
	        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	}

	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	function localeWeekdaysShort (m) {
	    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	}

	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	function localeWeekdaysMin (m) {
	    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	}

	function handleStrictParse$1(weekdayName, format, strict) {
	    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._minWeekdaysParse = [];

	        for (i = 0; i < 7; ++i) {
	            mom = createUTC([2000, 1]).day(i);
	            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeWeekdaysParse (weekdayName, format, strict) {
	    var i, mom, regex;

	    if (this._weekdaysParseExact) {
	        return handleStrictParse$1.call(this, weekdayName, format, strict);
	    }

	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._minWeekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._fullWeekdaysParse = [];
	    }

	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already

	        mom = createUTC([2000, 1]).day(i);
	        if (strict && !this._fullWeekdaysParse[i]) {
	            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
	            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
	            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
	        }
	        if (!this._weekdaysParse[i]) {
	            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function getSetDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	    if (input != null) {
	        input = parseWeekday(input, this.localeData());
	        return this.add(input - day, 'd');
	    } else {
	        return day;
	    }
	}

	function getSetLocaleDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	    return input == null ? weekday : this.add(input - weekday, 'd');
	}

	function getSetISODayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }

	    // behaves the same as moment#day except
	    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	    // as a setter, sunday should belong to the previous week.

	    if (input != null) {
	        var weekday = parseIsoWeekday(input, this.localeData());
	        return this.day(this.day() % 7 ? weekday : weekday - 7);
	    } else {
	        return this.day() || 7;
	    }
	}

	var defaultWeekdaysRegex = matchWord;
	function weekdaysRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysStrictRegex;
	        } else {
	            return this._weekdaysRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            this._weekdaysRegex = defaultWeekdaysRegex;
	        }
	        return this._weekdaysStrictRegex && isStrict ?
	            this._weekdaysStrictRegex : this._weekdaysRegex;
	    }
	}

	var defaultWeekdaysShortRegex = matchWord;
	function weekdaysShortRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysShortStrictRegex;
	        } else {
	            return this._weekdaysShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	        }
	        return this._weekdaysShortStrictRegex && isStrict ?
	            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	    }
	}

	var defaultWeekdaysMinRegex = matchWord;
	function weekdaysMinRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysMinStrictRegex;
	        } else {
	            return this._weekdaysMinRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	        }
	        return this._weekdaysMinStrictRegex && isStrict ?
	            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	    }
	}


	function computeWeekdaysParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom, minp, shortp, longp;
	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, 1]).day(i);
	        minp = this.weekdaysMin(mom, '');
	        shortp = this.weekdaysShort(mom, '');
	        longp = this.weekdays(mom, '');
	        minPieces.push(minp);
	        shortPieces.push(shortp);
	        longPieces.push(longp);
	        mixedPieces.push(minp);
	        mixedPieces.push(shortp);
	        mixedPieces.push(longp);
	    }
	    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	    // will match the longer piece.
	    minPieces.sort(cmpLenRev);
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 7; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._weekdaysShortRegex = this._weekdaysRegex;
	    this._weekdaysMinRegex = this._weekdaysRegex;

	    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	function hFormat() {
	    return this.hours() % 12 || 12;
	}

	function kFormat() {
	    return this.hours() || 24;
	}

	addFormatToken('H', ['HH', 2], 0, 'hour');
	addFormatToken('h', ['hh', 2], 0, hFormat);
	addFormatToken('k', ['kk', 2], 0, kFormat);

	addFormatToken('hmm', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	});

	addFormatToken('hmmss', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	addFormatToken('Hmm', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2);
	});

	addFormatToken('Hmmss', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	function meridiem (token, lowercase) {
	    addFormatToken(token, 0, 0, function () {
	        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	    });
	}

	meridiem('a', true);
	meridiem('A', false);

	// ALIASES

	addUnitAlias('hour', 'h');

	// PRIORITY
	addUnitPriority('hour', 13);

	// PARSING

	function matchMeridiem (isStrict, locale) {
	    return locale._meridiemParse;
	}

	addRegexToken('a',  matchMeridiem);
	addRegexToken('A',  matchMeridiem);
	addRegexToken('H',  match1to2);
	addRegexToken('h',  match1to2);
	addRegexToken('k',  match1to2);
	addRegexToken('HH', match1to2, match2);
	addRegexToken('hh', match1to2, match2);
	addRegexToken('kk', match1to2, match2);

	addRegexToken('hmm', match3to4);
	addRegexToken('hmmss', match5to6);
	addRegexToken('Hmm', match3to4);
	addRegexToken('Hmmss', match5to6);

	addParseToken(['H', 'HH'], HOUR);
	addParseToken(['k', 'kk'], function (input, array, config) {
	    var kInput = toInt(input);
	    array[HOUR] = kInput === 24 ? 0 : kInput;
	});
	addParseToken(['a', 'A'], function (input, array, config) {
	    config._isPm = config._locale.isPM(input);
	    config._meridiem = input;
	});
	addParseToken(['h', 'hh'], function (input, array, config) {
	    array[HOUR] = toInt(input);
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('Hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	});
	addParseToken('Hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	});

	// LOCALES

	function localeIsPM (input) {
	    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	    // Using charAt should be more compatible.
	    return ((input + '').toLowerCase().charAt(0) === 'p');
	}

	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem (hours, minutes, isLower) {
	    if (hours > 11) {
	        return isLower ? 'pm' : 'PM';
	    } else {
	        return isLower ? 'am' : 'AM';
	    }
	}


	// MOMENTS

	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet('Hours', true);

	// months
	// week
	// weekdays
	// meridiem
	var baseConfig = {
	    calendar: defaultCalendar,
	    longDateFormat: defaultLongDateFormat,
	    invalidDate: defaultInvalidDate,
	    ordinal: defaultOrdinal,
	    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
	    relativeTime: defaultRelativeTime,

	    months: defaultLocaleMonths,
	    monthsShort: defaultLocaleMonthsShort,

	    week: defaultLocaleWeek,

	    weekdays: defaultLocaleWeekdays,
	    weekdaysMin: defaultLocaleWeekdaysMin,
	    weekdaysShort: defaultLocaleWeekdaysShort,

	    meridiemParse: defaultLocaleMeridiemParse
	};

	// internal storage for locale config files
	var locales = {};
	var localeFamilies = {};
	var globalLocale;

	function normalizeLocale(key) {
	    return key ? key.toLowerCase().replace('_', '-') : key;
	}

	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names) {
	    var i = 0, j, next, locale, split;

	    while (i < names.length) {
	        split = normalizeLocale(names[i]).split('-');
	        j = split.length;
	        next = normalizeLocale(names[i + 1]);
	        next = next ? next.split('-') : null;
	        while (j > 0) {
	            locale = loadLocale(split.slice(0, j).join('-'));
	            if (locale) {
	                return locale;
	            }
	            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                //the next array item is better than a shallower substring of this one
	                break;
	            }
	            j--;
	        }
	        i++;
	    }
	    return null;
	}

	function loadLocale(name) {
	    var oldLocale = null;
	    // TODO: Find a better way to register and load all the locales in Node
	    if (!locales[name] && (typeof module !== 'undefined') &&
	            module && module.exports) {
	        try {
	            oldLocale = globalLocale._abbr;
	            __webpack_require__(15)("./" + name);
	            // because defineLocale currently also sets the global locale, we
	            // want to undo that for lazy loaded locales
	            getSetGlobalLocale(oldLocale);
	        } catch (e) { }
	    }
	    return locales[name];
	}

	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function getSetGlobalLocale (key, values) {
	    var data;
	    if (key) {
	        if (isUndefined(values)) {
	            data = getLocale(key);
	        }
	        else {
	            data = defineLocale(key, values);
	        }

	        if (data) {
	            // moment.duration._locale = moment._locale = data;
	            globalLocale = data;
	        }
	    }

	    return globalLocale._abbr;
	}

	function defineLocale (name, config) {
	    if (config !== null) {
	        var parentConfig = baseConfig;
	        config.abbr = name;
	        if (locales[name] != null) {
	            deprecateSimple('defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                    'an existing locale. moment.defineLocale(localeName, ' +
	                    'config) should only be used for creating a new locale ' +
	                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	            parentConfig = locales[name]._config;
	        } else if (config.parentLocale != null) {
	            if (locales[config.parentLocale] != null) {
	                parentConfig = locales[config.parentLocale]._config;
	            } else {
	                if (!localeFamilies[config.parentLocale]) {
	                    localeFamilies[config.parentLocale] = [];
	                }
	                localeFamilies[config.parentLocale].push({
	                    name: name,
	                    config: config
	                });
	                return null;
	            }
	        }
	        locales[name] = new Locale(mergeConfigs(parentConfig, config));

	        if (localeFamilies[name]) {
	            localeFamilies[name].forEach(function (x) {
	                defineLocale(x.name, x.config);
	            });
	        }

	        // backwards compat for now: also set the locale
	        // make sure we set the locale AFTER all child locales have been
	        // created, so we won't end up with the child locale set.
	        getSetGlobalLocale(name);


	        return locales[name];
	    } else {
	        // useful for testing
	        delete locales[name];
	        return null;
	    }
	}

	function updateLocale(name, config) {
	    if (config != null) {
	        var locale, parentConfig = baseConfig;
	        // MERGE
	        if (locales[name] != null) {
	            parentConfig = locales[name]._config;
	        }
	        config = mergeConfigs(parentConfig, config);
	        locale = new Locale(config);
	        locale.parentLocale = locales[name];
	        locales[name] = locale;

	        // backwards compat for now: also set the locale
	        getSetGlobalLocale(name);
	    } else {
	        // pass null for config to unupdate, useful for tests
	        if (locales[name] != null) {
	            if (locales[name].parentLocale != null) {
	                locales[name] = locales[name].parentLocale;
	            } else if (locales[name] != null) {
	                delete locales[name];
	            }
	        }
	    }
	    return locales[name];
	}

	// returns locale data
	function getLocale (key) {
	    var locale;

	    if (key && key._locale && key._locale._abbr) {
	        key = key._locale._abbr;
	    }

	    if (!key) {
	        return globalLocale;
	    }

	    if (!isArray(key)) {
	        //short-circuit everything else
	        locale = loadLocale(key);
	        if (locale) {
	            return locale;
	        }
	        key = [key];
	    }

	    return chooseLocale(key);
	}

	function listLocales() {
	    return keys$1(locales);
	}

	function checkOverflow (m) {
	    var overflow;
	    var a = m._a;

	    if (a && getParsingFlags(m).overflow === -2) {
	        overflow =
	            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	            -1;

	        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	            overflow = DATE;
	        }
	        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	            overflow = WEEK;
	        }
	        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	            overflow = WEEKDAY;
	        }

	        getParsingFlags(m).overflow = overflow;
	    }

	    return m;
	}

	// iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

	var isoDates = [
	    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	    ['YYYY-DDD', /\d{4}-\d{3}/],
	    ['YYYY-MM', /\d{4}-\d\d/, false],
	    ['YYYYYYMMDD', /[+-]\d{10}/],
	    ['YYYYMMDD', /\d{8}/],
	    // YYYYMM is NOT allowed by the standard
	    ['GGGG[W]WWE', /\d{4}W\d{3}/],
	    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	    ['YYYYDDD', /\d{7}/]
	];

	// iso time formats and regexes
	var isoTimes = [
	    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	    ['HH:mm', /\d\d:\d\d/],
	    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	    ['HHmmss', /\d\d\d\d\d\d/],
	    ['HHmm', /\d\d\d\d/],
	    ['HH', /\d\d/]
	];

	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	// date from iso format
	function configFromISO(config) {
	    var i, l,
	        string = config._i,
	        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	        allowTime, dateFormat, timeFormat, tzFormat;

	    if (match) {
	        getParsingFlags(config).iso = true;

	        for (i = 0, l = isoDates.length; i < l; i++) {
	            if (isoDates[i][1].exec(match[1])) {
	                dateFormat = isoDates[i][0];
	                allowTime = isoDates[i][2] !== false;
	                break;
	            }
	        }
	        if (dateFormat == null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[3]) {
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(match[3])) {
	                    // match[2] should be 'T' or space
	                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                    break;
	                }
	            }
	            if (timeFormat == null) {
	                config._isValid = false;
	                return;
	            }
	        }
	        if (!allowTime && timeFormat != null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[4]) {
	            if (tzRegex.exec(match[4])) {
	                tzFormat = 'Z';
	            } else {
	                config._isValid = false;
	                return;
	            }
	        }
	        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	        configFromStringAndFormat(config);
	    } else {
	        config._isValid = false;
	    }
	}

	// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
	var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

	// date and time from ref 2822 format
	function configFromRFC2822(config) {
	    var string, match, dayFormat,
	        dateFormat, timeFormat, tzFormat;
	    var timezones = {
	        ' GMT': ' +0000',
	        ' EDT': ' -0400',
	        ' EST': ' -0500',
	        ' CDT': ' -0500',
	        ' CST': ' -0600',
	        ' MDT': ' -0600',
	        ' MST': ' -0700',
	        ' PDT': ' -0700',
	        ' PST': ' -0800'
	    };
	    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
	    var timezone, timezoneIndex;

	    string = config._i
	        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
	        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
	        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
	    match = basicRfcRegex.exec(string);

	    if (match) {
	        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
	        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
	        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

	        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
	        if (match[1]) { // day of week given
	            var momentDate = new Date(match[2]);
	            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

	            if (match[1].substr(0,3) !== momentDay) {
	                getParsingFlags(config).weekdayMismatch = true;
	                config._isValid = false;
	                return;
	            }
	        }

	        switch (match[5].length) {
	            case 2: // military
	                if (timezoneIndex === 0) {
	                    timezone = ' +0000';
	                } else {
	                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
	                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
	                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
	                }
	                break;
	            case 4: // Zone
	                timezone = timezones[match[5]];
	                break;
	            default: // UT or +/-9999
	                timezone = timezones[' GMT'];
	        }
	        match[5] = timezone;
	        config._i = match.splice(1).join('');
	        tzFormat = ' ZZ';
	        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
	        configFromStringAndFormat(config);
	        getParsingFlags(config).rfc2822 = true;
	    } else {
	        config._isValid = false;
	    }
	}

	// date from iso format or fallback
	function configFromString(config) {
	    var matched = aspNetJsonRegex.exec(config._i);

	    if (matched !== null) {
	        config._d = new Date(+matched[1]);
	        return;
	    }

	    configFromISO(config);
	    if (config._isValid === false) {
	        delete config._isValid;
	    } else {
	        return;
	    }

	    configFromRFC2822(config);
	    if (config._isValid === false) {
	        delete config._isValid;
	    } else {
	        return;
	    }

	    // Final attempt, use Input Fallback
	    hooks.createFromInputFallback(config);
	}

	hooks.createFromInputFallback = deprecate(
	    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
	    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
	    'discouraged and will be removed in an upcoming major release. Please refer to ' +
	    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	    function (config) {
	        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	    }
	);

	// Pick the first defined of two or three arguments.
	function defaults(a, b, c) {
	    if (a != null) {
	        return a;
	    }
	    if (b != null) {
	        return b;
	    }
	    return c;
	}

	function currentDateArray(config) {
	    // hooks is actually the exported moment object
	    var nowValue = new Date(hooks.now());
	    if (config._useUTC) {
	        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	    }
	    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray (config) {
	    var i, date, input = [], currentDate, yearToUse;

	    if (config._d) {
	        return;
	    }

	    currentDate = currentDateArray(config);

	    //compute day of the year from weeks and weekdays
	    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	        dayOfYearFromWeekInfo(config);
	    }

	    //if the day of the year is set, figure out what it is
	    if (config._dayOfYear != null) {
	        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
	            getParsingFlags(config)._overflowDayOfYear = true;
	        }

	        date = createUTCDate(yearToUse, 0, config._dayOfYear);
	        config._a[MONTH] = date.getUTCMonth();
	        config._a[DATE] = date.getUTCDate();
	    }

	    // Default to current date.
	    // * if no year, month, day of month are given, default to today
	    // * if day of month is given, default month and year
	    // * if month is given, default only year
	    // * if year is given, don't default anything
	    for (i = 0; i < 3 && config._a[i] == null; ++i) {
	        config._a[i] = input[i] = currentDate[i];
	    }

	    // Zero out whatever was not defaulted, including time
	    for (; i < 7; i++) {
	        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	    }

	    // Check for 24:00:00.000
	    if (config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0) {
	        config._nextDay = true;
	        config._a[HOUR] = 0;
	    }

	    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	    // Apply timezone offset from input. The actual utcOffset can be changed
	    // with parseZone.
	    if (config._tzm != null) {
	        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	    }

	    if (config._nextDay) {
	        config._a[HOUR] = 24;
	    }
	}

	function dayOfYearFromWeekInfo(config) {
	    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

	    w = config._w;
	    if (w.GG != null || w.W != null || w.E != null) {
	        dow = 1;
	        doy = 4;

	        // TODO: We need to take the current isoWeekYear, but that depends on
	        // how we interpret now (local, utc, fixed offset). So create
	        // a now version of current config (take local/utc/offset flags, and
	        // create now).
	        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
	        week = defaults(w.W, 1);
	        weekday = defaults(w.E, 1);
	        if (weekday < 1 || weekday > 7) {
	            weekdayOverflow = true;
	        }
	    } else {
	        dow = config._locale._week.dow;
	        doy = config._locale._week.doy;

	        var curWeek = weekOfYear(createLocal(), dow, doy);

	        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	        // Default to current week.
	        week = defaults(w.w, curWeek.week);

	        if (w.d != null) {
	            // weekday -- low day numbers are considered next week
	            weekday = w.d;
	            if (weekday < 0 || weekday > 6) {
	                weekdayOverflow = true;
	            }
	        } else if (w.e != null) {
	            // local weekday -- counting starts from begining of week
	            weekday = w.e + dow;
	            if (w.e < 0 || w.e > 6) {
	                weekdayOverflow = true;
	            }
	        } else {
	            // default to begining of week
	            weekday = dow;
	        }
	    }
	    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	        getParsingFlags(config)._overflowWeeks = true;
	    } else if (weekdayOverflow != null) {
	        getParsingFlags(config)._overflowWeekday = true;
	    } else {
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }
	}

	// constant that refers to the ISO standard
	hooks.ISO_8601 = function () {};

	// constant that refers to the RFC 2822 form
	hooks.RFC_2822 = function () {};

	// date from string and format string
	function configFromStringAndFormat(config) {
	    // TODO: Move this to another part of the creation flow to prevent circular deps
	    if (config._f === hooks.ISO_8601) {
	        configFromISO(config);
	        return;
	    }
	    if (config._f === hooks.RFC_2822) {
	        configFromRFC2822(config);
	        return;
	    }
	    config._a = [];
	    getParsingFlags(config).empty = true;

	    // This array is used to make a Date, either with `new Date` or `Date.UTC`
	    var string = '' + config._i,
	        i, parsedInput, tokens, token, skipped,
	        stringLength = string.length,
	        totalParsedInputLength = 0;

	    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	    for (i = 0; i < tokens.length; i++) {
	        token = tokens[i];
	        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	        // console.log('token', token, 'parsedInput', parsedInput,
	        //         'regex', getParseRegexForToken(token, config));
	        if (parsedInput) {
	            skipped = string.substr(0, string.indexOf(parsedInput));
	            if (skipped.length > 0) {
	                getParsingFlags(config).unusedInput.push(skipped);
	            }
	            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	            totalParsedInputLength += parsedInput.length;
	        }
	        // don't parse if it's not a known token
	        if (formatTokenFunctions[token]) {
	            if (parsedInput) {
	                getParsingFlags(config).empty = false;
	            }
	            else {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	            addTimeToArrayFromToken(token, parsedInput, config);
	        }
	        else if (config._strict && !parsedInput) {
	            getParsingFlags(config).unusedTokens.push(token);
	        }
	    }

	    // add remaining unparsed input length to the string
	    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	    if (string.length > 0) {
	        getParsingFlags(config).unusedInput.push(string);
	    }

	    // clear _12h flag if hour is <= 12
	    if (config._a[HOUR] <= 12 &&
	        getParsingFlags(config).bigHour === true &&
	        config._a[HOUR] > 0) {
	        getParsingFlags(config).bigHour = undefined;
	    }

	    getParsingFlags(config).parsedDateParts = config._a.slice(0);
	    getParsingFlags(config).meridiem = config._meridiem;
	    // handle meridiem
	    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	    configFromArray(config);
	    checkOverflow(config);
	}


	function meridiemFixWrap (locale, hour, meridiem) {
	    var isPm;

	    if (meridiem == null) {
	        // nothing to do
	        return hour;
	    }
	    if (locale.meridiemHour != null) {
	        return locale.meridiemHour(hour, meridiem);
	    } else if (locale.isPM != null) {
	        // Fallback
	        isPm = locale.isPM(meridiem);
	        if (isPm && hour < 12) {
	            hour += 12;
	        }
	        if (!isPm && hour === 12) {
	            hour = 0;
	        }
	        return hour;
	    } else {
	        // this is not supposed to happen
	        return hour;
	    }
	}

	// date from string and array of format strings
	function configFromStringAndArray(config) {
	    var tempConfig,
	        bestMoment,

	        scoreToBeat,
	        i,
	        currentScore;

	    if (config._f.length === 0) {
	        getParsingFlags(config).invalidFormat = true;
	        config._d = new Date(NaN);
	        return;
	    }

	    for (i = 0; i < config._f.length; i++) {
	        currentScore = 0;
	        tempConfig = copyConfig({}, config);
	        if (config._useUTC != null) {
	            tempConfig._useUTC = config._useUTC;
	        }
	        tempConfig._f = config._f[i];
	        configFromStringAndFormat(tempConfig);

	        if (!isValid(tempConfig)) {
	            continue;
	        }

	        // if there is any input that was not parsed add a penalty for that format
	        currentScore += getParsingFlags(tempConfig).charsLeftOver;

	        //or tokens
	        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	        getParsingFlags(tempConfig).score = currentScore;

	        if (scoreToBeat == null || currentScore < scoreToBeat) {
	            scoreToBeat = currentScore;
	            bestMoment = tempConfig;
	        }
	    }

	    extend(config, bestMoment || tempConfig);
	}

	function configFromObject(config) {
	    if (config._d) {
	        return;
	    }

	    var i = normalizeObjectUnits(config._i);
	    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	        return obj && parseInt(obj, 10);
	    });

	    configFromArray(config);
	}

	function createFromConfig (config) {
	    var res = new Moment(checkOverflow(prepareConfig(config)));
	    if (res._nextDay) {
	        // Adding is smart enough around DST
	        res.add(1, 'd');
	        res._nextDay = undefined;
	    }

	    return res;
	}

	function prepareConfig (config) {
	    var input = config._i,
	        format = config._f;

	    config._locale = config._locale || getLocale(config._l);

	    if (input === null || (format === undefined && input === '')) {
	        return createInvalid({nullInput: true});
	    }

	    if (typeof input === 'string') {
	        config._i = input = config._locale.preparse(input);
	    }

	    if (isMoment(input)) {
	        return new Moment(checkOverflow(input));
	    } else if (isDate(input)) {
	        config._d = input;
	    } else if (isArray(format)) {
	        configFromStringAndArray(config);
	    } else if (format) {
	        configFromStringAndFormat(config);
	    }  else {
	        configFromInput(config);
	    }

	    if (!isValid(config)) {
	        config._d = null;
	    }

	    return config;
	}

	function configFromInput(config) {
	    var input = config._i;
	    if (isUndefined(input)) {
	        config._d = new Date(hooks.now());
	    } else if (isDate(input)) {
	        config._d = new Date(input.valueOf());
	    } else if (typeof input === 'string') {
	        configFromString(config);
	    } else if (isArray(input)) {
	        config._a = map(input.slice(0), function (obj) {
	            return parseInt(obj, 10);
	        });
	        configFromArray(config);
	    } else if (isObject(input)) {
	        configFromObject(config);
	    } else if (isNumber(input)) {
	        // from milliseconds
	        config._d = new Date(input);
	    } else {
	        hooks.createFromInputFallback(config);
	    }
	}

	function createLocalOrUTC (input, format, locale, strict, isUTC) {
	    var c = {};

	    if (locale === true || locale === false) {
	        strict = locale;
	        locale = undefined;
	    }

	    if ((isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)) {
	        input = undefined;
	    }
	    // object construction must be done this way.
	    // https://github.com/moment/moment/issues/1423
	    c._isAMomentObject = true;
	    c._useUTC = c._isUTC = isUTC;
	    c._l = locale;
	    c._i = input;
	    c._f = format;
	    c._strict = strict;

	    return createFromConfig(c);
	}

	function createLocal (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, false);
	}

	var prototypeMin = deprecate(
	    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other < this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	var prototypeMax = deprecate(
	    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other > this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn, moments) {
	    var res, i;
	    if (moments.length === 1 && isArray(moments[0])) {
	        moments = moments[0];
	    }
	    if (!moments.length) {
	        return createLocal();
	    }
	    res = moments[0];
	    for (i = 1; i < moments.length; ++i) {
	        if (!moments[i].isValid() || moments[i][fn](res)) {
	            res = moments[i];
	        }
	    }
	    return res;
	}

	// TODO: Use [].sort instead?
	function min () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isBefore', args);
	}

	function max () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isAfter', args);
	}

	var now = function () {
	    return Date.now ? Date.now() : +(new Date());
	};

	var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

	function isDurationValid(m) {
	    for (var key in m) {
	        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
	            return false;
	        }
	    }

	    var unitHasDecimal = false;
	    for (var i = 0; i < ordering.length; ++i) {
	        if (m[ordering[i]]) {
	            if (unitHasDecimal) {
	                return false; // only allow non-integers for smallest unit
	            }
	            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
	                unitHasDecimal = true;
	            }
	        }
	    }

	    return true;
	}

	function isValid$1() {
	    return this._isValid;
	}

	function createInvalid$1() {
	    return createDuration(NaN);
	}

	function Duration (duration) {
	    var normalizedInput = normalizeObjectUnits(duration),
	        years = normalizedInput.year || 0,
	        quarters = normalizedInput.quarter || 0,
	        months = normalizedInput.month || 0,
	        weeks = normalizedInput.week || 0,
	        days = normalizedInput.day || 0,
	        hours = normalizedInput.hour || 0,
	        minutes = normalizedInput.minute || 0,
	        seconds = normalizedInput.second || 0,
	        milliseconds = normalizedInput.millisecond || 0;

	    this._isValid = isDurationValid(normalizedInput);

	    // representation for dateAddRemove
	    this._milliseconds = +milliseconds +
	        seconds * 1e3 + // 1000
	        minutes * 6e4 + // 1000 * 60
	        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	    // Because of dateAddRemove treats 24 hours as different from a
	    // day when working around DST, we need to store them separately
	    this._days = +days +
	        weeks * 7;
	    // It is impossible translate months into days without knowing
	    // which months you are are talking about, so we have to store
	    // it separately.
	    this._months = +months +
	        quarters * 3 +
	        years * 12;

	    this._data = {};

	    this._locale = getLocale();

	    this._bubble();
	}

	function isDuration (obj) {
	    return obj instanceof Duration;
	}

	function absRound (number) {
	    if (number < 0) {
	        return Math.round(-1 * number) * -1;
	    } else {
	        return Math.round(number);
	    }
	}

	// FORMATTING

	function offset (token, separator) {
	    addFormatToken(token, 0, 0, function () {
	        var offset = this.utcOffset();
	        var sign = '+';
	        if (offset < 0) {
	            offset = -offset;
	            sign = '-';
	        }
	        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	    });
	}

	offset('Z', ':');
	offset('ZZ', '');

	// PARSING

	addRegexToken('Z',  matchShortOffset);
	addRegexToken('ZZ', matchShortOffset);
	addParseToken(['Z', 'ZZ'], function (input, array, config) {
	    config._useUTC = true;
	    config._tzm = offsetFromString(matchShortOffset, input);
	});

	// HELPERS

	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;

	function offsetFromString(matcher, string) {
	    var matches = (string || '').match(matcher);

	    if (matches === null) {
	        return null;
	    }

	    var chunk   = matches[matches.length - 1] || [];
	    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	    var minutes = +(parts[1] * 60) + toInt(parts[2]);

	    return minutes === 0 ?
	      0 :
	      parts[0] === '+' ? minutes : -minutes;
	}

	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input, model) {
	    var res, diff;
	    if (model._isUTC) {
	        res = model.clone();
	        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
	        // Use low-level api, because this fn is low-level api.
	        res._d.setTime(res._d.valueOf() + diff);
	        hooks.updateOffset(res, false);
	        return res;
	    } else {
	        return createLocal(input).local();
	    }
	}

	function getDateOffset (m) {
	    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	    // https://github.com/moment/moment/pull/1871
	    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	}

	// HOOKS

	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	hooks.updateOffset = function () {};

	// MOMENTS

	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset (input, keepLocalTime, keepMinutes) {
	    var offset = this._offset || 0,
	        localAdjust;
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    if (input != null) {
	        if (typeof input === 'string') {
	            input = offsetFromString(matchShortOffset, input);
	            if (input === null) {
	                return this;
	            }
	        } else if (Math.abs(input) < 16 && !keepMinutes) {
	            input = input * 60;
	        }
	        if (!this._isUTC && keepLocalTime) {
	            localAdjust = getDateOffset(this);
	        }
	        this._offset = input;
	        this._isUTC = true;
	        if (localAdjust != null) {
	            this.add(localAdjust, 'm');
	        }
	        if (offset !== input) {
	            if (!keepLocalTime || this._changeInProgress) {
	                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
	            } else if (!this._changeInProgress) {
	                this._changeInProgress = true;
	                hooks.updateOffset(this, true);
	                this._changeInProgress = null;
	            }
	        }
	        return this;
	    } else {
	        return this._isUTC ? offset : getDateOffset(this);
	    }
	}

	function getSetZone (input, keepLocalTime) {
	    if (input != null) {
	        if (typeof input !== 'string') {
	            input = -input;
	        }

	        this.utcOffset(input, keepLocalTime);

	        return this;
	    } else {
	        return -this.utcOffset();
	    }
	}

	function setOffsetToUTC (keepLocalTime) {
	    return this.utcOffset(0, keepLocalTime);
	}

	function setOffsetToLocal (keepLocalTime) {
	    if (this._isUTC) {
	        this.utcOffset(0, keepLocalTime);
	        this._isUTC = false;

	        if (keepLocalTime) {
	            this.subtract(getDateOffset(this), 'm');
	        }
	    }
	    return this;
	}

	function setOffsetToParsedOffset () {
	    if (this._tzm != null) {
	        this.utcOffset(this._tzm, false, true);
	    } else if (typeof this._i === 'string') {
	        var tZone = offsetFromString(matchOffset, this._i);
	        if (tZone != null) {
	            this.utcOffset(tZone);
	        }
	        else {
	            this.utcOffset(0, true);
	        }
	    }
	    return this;
	}

	function hasAlignedHourOffset (input) {
	    if (!this.isValid()) {
	        return false;
	    }
	    input = input ? createLocal(input).utcOffset() : 0;

	    return (this.utcOffset() - input) % 60 === 0;
	}

	function isDaylightSavingTime () {
	    return (
	        this.utcOffset() > this.clone().month(0).utcOffset() ||
	        this.utcOffset() > this.clone().month(5).utcOffset()
	    );
	}

	function isDaylightSavingTimeShifted () {
	    if (!isUndefined(this._isDSTShifted)) {
	        return this._isDSTShifted;
	    }

	    var c = {};

	    copyConfig(c, this);
	    c = prepareConfig(c);

	    if (c._a) {
	        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	        this._isDSTShifted = this.isValid() &&
	            compareArrays(c._a, other.toArray()) > 0;
	    } else {
	        this._isDSTShifted = false;
	    }

	    return this._isDSTShifted;
	}

	function isLocal () {
	    return this.isValid() ? !this._isUTC : false;
	}

	function isUtcOffset () {
	    return this.isValid() ? this._isUTC : false;
	}

	function isUtc () {
	    return this.isValid() ? this._isUTC && this._offset === 0 : false;
	}

	// ASP.NET json date format regex
	var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	// and further modified to allow for strings containing both week and day
	var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

	function createDuration (input, key) {
	    var duration = input,
	        // matching against regexp is expensive, do it on demand
	        match = null,
	        sign,
	        ret,
	        diffRes;

	    if (isDuration(input)) {
	        duration = {
	            ms : input._milliseconds,
	            d  : input._days,
	            M  : input._months
	        };
	    } else if (isNumber(input)) {
	        duration = {};
	        if (key) {
	            duration[key] = input;
	        } else {
	            duration.milliseconds = input;
	        }
	    } else if (!!(match = aspNetRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y  : 0,
	            d  : toInt(match[DATE])                         * sign,
	            h  : toInt(match[HOUR])                         * sign,
	            m  : toInt(match[MINUTE])                       * sign,
	            s  : toInt(match[SECOND])                       * sign,
	            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	        };
	    } else if (!!(match = isoRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y : parseIso(match[2], sign),
	            M : parseIso(match[3], sign),
	            w : parseIso(match[4], sign),
	            d : parseIso(match[5], sign),
	            h : parseIso(match[6], sign),
	            m : parseIso(match[7], sign),
	            s : parseIso(match[8], sign)
	        };
	    } else if (duration == null) {// checks for null or undefined
	        duration = {};
	    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

	        duration = {};
	        duration.ms = diffRes.milliseconds;
	        duration.M = diffRes.months;
	    }

	    ret = new Duration(duration);

	    if (isDuration(input) && hasOwnProp(input, '_locale')) {
	        ret._locale = input._locale;
	    }

	    return ret;
	}

	createDuration.fn = Duration.prototype;
	createDuration.invalid = createInvalid$1;

	function parseIso (inp, sign) {
	    // We'd normally use ~~inp for this, but unfortunately it also
	    // converts floats to ints.
	    // inp may be undefined, so careful calling replace on it.
	    var res = inp && parseFloat(inp.replace(',', '.'));
	    // apply sign while we're at it
	    return (isNaN(res) ? 0 : res) * sign;
	}

	function positiveMomentsDifference(base, other) {
	    var res = {milliseconds: 0, months: 0};

	    res.months = other.month() - base.month() +
	        (other.year() - base.year()) * 12;
	    if (base.clone().add(res.months, 'M').isAfter(other)) {
	        --res.months;
	    }

	    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

	    return res;
	}

	function momentsDifference(base, other) {
	    var res;
	    if (!(base.isValid() && other.isValid())) {
	        return {milliseconds: 0, months: 0};
	    }

	    other = cloneWithOffset(other, base);
	    if (base.isBefore(other)) {
	        res = positiveMomentsDifference(base, other);
	    } else {
	        res = positiveMomentsDifference(other, base);
	        res.milliseconds = -res.milliseconds;
	        res.months = -res.months;
	    }

	    return res;
	}

	// TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction, name) {
	    return function (val, period) {
	        var dur, tmp;
	        //invert the arguments, but complain about it
	        if (period !== null && !isNaN(+period)) {
	            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	            tmp = val; val = period; period = tmp;
	        }

	        val = typeof val === 'string' ? +val : val;
	        dur = createDuration(val, period);
	        addSubtract(this, dur, direction);
	        return this;
	    };
	}

	function addSubtract (mom, duration, isAdding, updateOffset) {
	    var milliseconds = duration._milliseconds,
	        days = absRound(duration._days),
	        months = absRound(duration._months);

	    if (!mom.isValid()) {
	        // No op
	        return;
	    }

	    updateOffset = updateOffset == null ? true : updateOffset;

	    if (milliseconds) {
	        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	    }
	    if (days) {
	        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	    }
	    if (months) {
	        setMonth(mom, get(mom, 'Month') + months * isAdding);
	    }
	    if (updateOffset) {
	        hooks.updateOffset(mom, days || months);
	    }
	}

	var add      = createAdder(1, 'add');
	var subtract = createAdder(-1, 'subtract');

	function getCalendarFormat(myMoment, now) {
	    var diff = myMoment.diff(now, 'days', true);
	    return diff < -6 ? 'sameElse' :
	            diff < -1 ? 'lastWeek' :
	            diff < 0 ? 'lastDay' :
	            diff < 1 ? 'sameDay' :
	            diff < 2 ? 'nextDay' :
	            diff < 7 ? 'nextWeek' : 'sameElse';
	}

	function calendar$1 (time, formats) {
	    // We want to compare the start of today, vs this.
	    // Getting start-of-today depends on whether we're local/utc/offset or not.
	    var now = time || createLocal(),
	        sod = cloneWithOffset(now, this).startOf('day'),
	        format = hooks.calendarFormat(this, sod) || 'sameElse';

	    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

	    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
	}

	function clone () {
	    return new Moment(this);
	}

	function isAfter (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() > localInput.valueOf();
	    } else {
	        return localInput.valueOf() < this.clone().startOf(units).valueOf();
	    }
	}

	function isBefore (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() < localInput.valueOf();
	    } else {
	        return this.clone().endOf(units).valueOf() < localInput.valueOf();
	    }
	}

	function isBetween (from, to, units, inclusivity) {
	    inclusivity = inclusivity || '()';
	    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	}

	function isSame (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input),
	        inputMs;
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(units || 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() === localInput.valueOf();
	    } else {
	        inputMs = localInput.valueOf();
	        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	    }
	}

	function isSameOrAfter (input, units) {
	    return this.isSame(input, units) || this.isAfter(input,units);
	}

	function isSameOrBefore (input, units) {
	    return this.isSame(input, units) || this.isBefore(input,units);
	}

	function diff (input, units, asFloat) {
	    var that,
	        zoneDelta,
	        delta, output;

	    if (!this.isValid()) {
	        return NaN;
	    }

	    that = cloneWithOffset(input, this);

	    if (!that.isValid()) {
	        return NaN;
	    }

	    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	    units = normalizeUnits(units);

	    if (units === 'year' || units === 'month' || units === 'quarter') {
	        output = monthDiff(this, that);
	        if (units === 'quarter') {
	            output = output / 3;
	        } else if (units === 'year') {
	            output = output / 12;
	        }
	    } else {
	        delta = this - that;
	        output = units === 'second' ? delta / 1e3 : // 1000
	            units === 'minute' ? delta / 6e4 : // 1000 * 60
	            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	            delta;
	    }
	    return asFloat ? output : absFloor(output);
	}

	function monthDiff (a, b) {
	    // difference in months
	    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	        // b is in (anchor - 1 month, anchor + 1 month)
	        anchor = a.clone().add(wholeMonthDiff, 'months'),
	        anchor2, adjust;

	    if (b - anchor < 0) {
	        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor - anchor2);
	    } else {
	        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor2 - anchor);
	    }

	    //check for negative zero, return zero if negative zero
	    return -(wholeMonthDiff + adjust) || 0;
	}

	hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	function toString () {
	    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	}

	function toISOString() {
	    if (!this.isValid()) {
	        return null;
	    }
	    var m = this.clone().utc();
	    if (m.year() < 0 || m.year() > 9999) {
	        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	    }
	    if (isFunction(Date.prototype.toISOString)) {
	        // native implementation is ~50x faster, use it when we can
	        return this.toDate().toISOString();
	    }
	    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	}

	/**
	 * Return a human readable representation of a moment that can
	 * also be evaluated to get a new moment which is the same
	 *
	 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	 */
	function inspect () {
	    if (!this.isValid()) {
	        return 'moment.invalid(/* ' + this._i + ' */)';
	    }
	    var func = 'moment';
	    var zone = '';
	    if (!this.isLocal()) {
	        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	        zone = 'Z';
	    }
	    var prefix = '[' + func + '("]';
	    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
	    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
	    var suffix = zone + '[")]';

	    return this.format(prefix + year + datetime + suffix);
	}

	function format (inputString) {
	    if (!inputString) {
	        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
	    }
	    var output = formatMoment(this, inputString);
	    return this.localeData().postformat(output);
	}

	function from (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function fromNow (withoutSuffix) {
	    return this.from(createLocal(), withoutSuffix);
	}

	function to (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function toNow (withoutSuffix) {
	    return this.to(createLocal(), withoutSuffix);
	}

	// If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale (key) {
	    var newLocaleData;

	    if (key === undefined) {
	        return this._locale._abbr;
	    } else {
	        newLocaleData = getLocale(key);
	        if (newLocaleData != null) {
	            this._locale = newLocaleData;
	        }
	        return this;
	    }
	}

	var lang = deprecate(
	    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	    function (key) {
	        if (key === undefined) {
	            return this.localeData();
	        } else {
	            return this.locale(key);
	        }
	    }
	);

	function localeData () {
	    return this._locale;
	}

	function startOf (units) {
	    units = normalizeUnits(units);
	    // the following switch intentionally omits break keywords
	    // to utilize falling through the cases.
	    switch (units) {
	        case 'year':
	            this.month(0);
	            /* falls through */
	        case 'quarter':
	        case 'month':
	            this.date(1);
	            /* falls through */
	        case 'week':
	        case 'isoWeek':
	        case 'day':
	        case 'date':
	            this.hours(0);
	            /* falls through */
	        case 'hour':
	            this.minutes(0);
	            /* falls through */
	        case 'minute':
	            this.seconds(0);
	            /* falls through */
	        case 'second':
	            this.milliseconds(0);
	    }

	    // weeks are a special case
	    if (units === 'week') {
	        this.weekday(0);
	    }
	    if (units === 'isoWeek') {
	        this.isoWeekday(1);
	    }

	    // quarters are also special
	    if (units === 'quarter') {
	        this.month(Math.floor(this.month() / 3) * 3);
	    }

	    return this;
	}

	function endOf (units) {
	    units = normalizeUnits(units);
	    if (units === undefined || units === 'millisecond') {
	        return this;
	    }

	    // 'date' is an alias for 'day', so it should be considered as such.
	    if (units === 'date') {
	        units = 'day';
	    }

	    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	}

	function valueOf () {
	    return this._d.valueOf() - ((this._offset || 0) * 60000);
	}

	function unix () {
	    return Math.floor(this.valueOf() / 1000);
	}

	function toDate () {
	    return new Date(this.valueOf());
	}

	function toArray () {
	    var m = this;
	    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}

	function toObject () {
	    var m = this;
	    return {
	        years: m.year(),
	        months: m.month(),
	        date: m.date(),
	        hours: m.hours(),
	        minutes: m.minutes(),
	        seconds: m.seconds(),
	        milliseconds: m.milliseconds()
	    };
	}

	function toJSON () {
	    // new Date(NaN).toJSON() === null
	    return this.isValid() ? this.toISOString() : null;
	}

	function isValid$2 () {
	    return isValid(this);
	}

	function parsingFlags () {
	    return extend({}, getParsingFlags(this));
	}

	function invalidAt () {
	    return getParsingFlags(this).overflow;
	}

	function creationData() {
	    return {
	        input: this._i,
	        format: this._f,
	        locale: this._locale,
	        isUTC: this._isUTC,
	        strict: this._strict
	    };
	}

	// FORMATTING

	addFormatToken(0, ['gg', 2], 0, function () {
	    return this.weekYear() % 100;
	});

	addFormatToken(0, ['GG', 2], 0, function () {
	    return this.isoWeekYear() % 100;
	});

	function addWeekYearFormatToken (token, getter) {
	    addFormatToken(0, [token, token.length], 0, getter);
	}

	addWeekYearFormatToken('gggg',     'weekYear');
	addWeekYearFormatToken('ggggg',    'weekYear');
	addWeekYearFormatToken('GGGG',  'isoWeekYear');
	addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	// ALIASES

	addUnitAlias('weekYear', 'gg');
	addUnitAlias('isoWeekYear', 'GG');

	// PRIORITY

	addUnitPriority('weekYear', 1);
	addUnitPriority('isoWeekYear', 1);


	// PARSING

	addRegexToken('G',      matchSigned);
	addRegexToken('g',      matchSigned);
	addRegexToken('GG',     match1to2, match2);
	addRegexToken('gg',     match1to2, match2);
	addRegexToken('GGGG',   match1to4, match4);
	addRegexToken('gggg',   match1to4, match4);
	addRegexToken('GGGGG',  match1to6, match6);
	addRegexToken('ggggg',  match1to6, match6);

	addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	    week[token.substr(0, 2)] = toInt(input);
	});

	addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	    week[token] = hooks.parseTwoDigitYear(input);
	});

	// MOMENTS

	function getSetWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy);
	}

	function getSetISOWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input, this.isoWeek(), this.isoWeekday(), 1, 4);
	}

	function getISOWeeksInYear () {
	    return weeksInYear(this.year(), 1, 4);
	}

	function getWeeksInYear () {
	    var weekInfo = this.localeData()._week;
	    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	}

	function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	    var weeksTarget;
	    if (input == null) {
	        return weekOfYear(this, dow, doy).year;
	    } else {
	        weeksTarget = weeksInYear(input, dow, doy);
	        if (week > weeksTarget) {
	            week = weeksTarget;
	        }
	        return setWeekAll.call(this, input, week, weekday, dow, doy);
	    }
	}

	function setWeekAll(weekYear, week, weekday, dow, doy) {
	    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	    this.year(date.getUTCFullYear());
	    this.month(date.getUTCMonth());
	    this.date(date.getUTCDate());
	    return this;
	}

	// FORMATTING

	addFormatToken('Q', 0, 'Qo', 'quarter');

	// ALIASES

	addUnitAlias('quarter', 'Q');

	// PRIORITY

	addUnitPriority('quarter', 7);

	// PARSING

	addRegexToken('Q', match1);
	addParseToken('Q', function (input, array) {
	    array[MONTH] = (toInt(input) - 1) * 3;
	});

	// MOMENTS

	function getSetQuarter (input) {
	    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	}

	// FORMATTING

	addFormatToken('D', ['DD', 2], 'Do', 'date');

	// ALIASES

	addUnitAlias('date', 'D');

	// PRIOROITY
	addUnitPriority('date', 9);

	// PARSING

	addRegexToken('D',  match1to2);
	addRegexToken('DD', match1to2, match2);
	addRegexToken('Do', function (isStrict, locale) {
	    // TODO: Remove "ordinalParse" fallback in next major release.
	    return isStrict ?
	      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
	      locale._dayOfMonthOrdinalParseLenient;
	});

	addParseToken(['D', 'DD'], DATE);
	addParseToken('Do', function (input, array) {
	    array[DATE] = toInt(input.match(match1to2)[0], 10);
	});

	// MOMENTS

	var getSetDayOfMonth = makeGetSet('Date', true);

	// FORMATTING

	addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	// ALIASES

	addUnitAlias('dayOfYear', 'DDD');

	// PRIORITY
	addUnitPriority('dayOfYear', 4);

	// PARSING

	addRegexToken('DDD',  match1to3);
	addRegexToken('DDDD', match3);
	addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	    config._dayOfYear = toInt(input);
	});

	// HELPERS

	// MOMENTS

	function getSetDayOfYear (input) {
	    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	}

	// FORMATTING

	addFormatToken('m', ['mm', 2], 0, 'minute');

	// ALIASES

	addUnitAlias('minute', 'm');

	// PRIORITY

	addUnitPriority('minute', 14);

	// PARSING

	addRegexToken('m',  match1to2);
	addRegexToken('mm', match1to2, match2);
	addParseToken(['m', 'mm'], MINUTE);

	// MOMENTS

	var getSetMinute = makeGetSet('Minutes', false);

	// FORMATTING

	addFormatToken('s', ['ss', 2], 0, 'second');

	// ALIASES

	addUnitAlias('second', 's');

	// PRIORITY

	addUnitPriority('second', 15);

	// PARSING

	addRegexToken('s',  match1to2);
	addRegexToken('ss', match1to2, match2);
	addParseToken(['s', 'ss'], SECOND);

	// MOMENTS

	var getSetSecond = makeGetSet('Seconds', false);

	// FORMATTING

	addFormatToken('S', 0, 0, function () {
	    return ~~(this.millisecond() / 100);
	});

	addFormatToken(0, ['SS', 2], 0, function () {
	    return ~~(this.millisecond() / 10);
	});

	addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	addFormatToken(0, ['SSSS', 4], 0, function () {
	    return this.millisecond() * 10;
	});
	addFormatToken(0, ['SSSSS', 5], 0, function () {
	    return this.millisecond() * 100;
	});
	addFormatToken(0, ['SSSSSS', 6], 0, function () {
	    return this.millisecond() * 1000;
	});
	addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	    return this.millisecond() * 10000;
	});
	addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	    return this.millisecond() * 100000;
	});
	addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	    return this.millisecond() * 1000000;
	});


	// ALIASES

	addUnitAlias('millisecond', 'ms');

	// PRIORITY

	addUnitPriority('millisecond', 16);

	// PARSING

	addRegexToken('S',    match1to3, match1);
	addRegexToken('SS',   match1to3, match2);
	addRegexToken('SSS',  match1to3, match3);

	var token;
	for (token = 'SSSS'; token.length <= 9; token += 'S') {
	    addRegexToken(token, matchUnsigned);
	}

	function parseMs(input, array) {
	    array[MILLISECOND] = toInt(('0.' + input) * 1000);
	}

	for (token = 'S'; token.length <= 9; token += 'S') {
	    addParseToken(token, parseMs);
	}
	// MOMENTS

	var getSetMillisecond = makeGetSet('Milliseconds', false);

	// FORMATTING

	addFormatToken('z',  0, 0, 'zoneAbbr');
	addFormatToken('zz', 0, 0, 'zoneName');

	// MOMENTS

	function getZoneAbbr () {
	    return this._isUTC ? 'UTC' : '';
	}

	function getZoneName () {
	    return this._isUTC ? 'Coordinated Universal Time' : '';
	}

	var proto = Moment.prototype;

	proto.add               = add;
	proto.calendar          = calendar$1;
	proto.clone             = clone;
	proto.diff              = diff;
	proto.endOf             = endOf;
	proto.format            = format;
	proto.from              = from;
	proto.fromNow           = fromNow;
	proto.to                = to;
	proto.toNow             = toNow;
	proto.get               = stringGet;
	proto.invalidAt         = invalidAt;
	proto.isAfter           = isAfter;
	proto.isBefore          = isBefore;
	proto.isBetween         = isBetween;
	proto.isSame            = isSame;
	proto.isSameOrAfter     = isSameOrAfter;
	proto.isSameOrBefore    = isSameOrBefore;
	proto.isValid           = isValid$2;
	proto.lang              = lang;
	proto.locale            = locale;
	proto.localeData        = localeData;
	proto.max               = prototypeMax;
	proto.min               = prototypeMin;
	proto.parsingFlags      = parsingFlags;
	proto.set               = stringSet;
	proto.startOf           = startOf;
	proto.subtract          = subtract;
	proto.toArray           = toArray;
	proto.toObject          = toObject;
	proto.toDate            = toDate;
	proto.toISOString       = toISOString;
	proto.inspect           = inspect;
	proto.toJSON            = toJSON;
	proto.toString          = toString;
	proto.unix              = unix;
	proto.valueOf           = valueOf;
	proto.creationData      = creationData;

	// Year
	proto.year       = getSetYear;
	proto.isLeapYear = getIsLeapYear;

	// Week Year
	proto.weekYear    = getSetWeekYear;
	proto.isoWeekYear = getSetISOWeekYear;

	// Quarter
	proto.quarter = proto.quarters = getSetQuarter;

	// Month
	proto.month       = getSetMonth;
	proto.daysInMonth = getDaysInMonth;

	// Week
	proto.week           = proto.weeks        = getSetWeek;
	proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
	proto.weeksInYear    = getWeeksInYear;
	proto.isoWeeksInYear = getISOWeeksInYear;

	// Day
	proto.date       = getSetDayOfMonth;
	proto.day        = proto.days             = getSetDayOfWeek;
	proto.weekday    = getSetLocaleDayOfWeek;
	proto.isoWeekday = getSetISODayOfWeek;
	proto.dayOfYear  = getSetDayOfYear;

	// Hour
	proto.hour = proto.hours = getSetHour;

	// Minute
	proto.minute = proto.minutes = getSetMinute;

	// Second
	proto.second = proto.seconds = getSetSecond;

	// Millisecond
	proto.millisecond = proto.milliseconds = getSetMillisecond;

	// Offset
	proto.utcOffset            = getSetOffset;
	proto.utc                  = setOffsetToUTC;
	proto.local                = setOffsetToLocal;
	proto.parseZone            = setOffsetToParsedOffset;
	proto.hasAlignedHourOffset = hasAlignedHourOffset;
	proto.isDST                = isDaylightSavingTime;
	proto.isLocal              = isLocal;
	proto.isUtcOffset          = isUtcOffset;
	proto.isUtc                = isUtc;
	proto.isUTC                = isUtc;

	// Timezone
	proto.zoneAbbr = getZoneAbbr;
	proto.zoneName = getZoneName;

	// Deprecations
	proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

	function createUnix (input) {
	    return createLocal(input * 1000);
	}

	function createInZone () {
	    return createLocal.apply(null, arguments).parseZone();
	}

	function preParsePostFormat (string) {
	    return string;
	}

	var proto$1 = Locale.prototype;

	proto$1.calendar        = calendar;
	proto$1.longDateFormat  = longDateFormat;
	proto$1.invalidDate     = invalidDate;
	proto$1.ordinal         = ordinal;
	proto$1.preparse        = preParsePostFormat;
	proto$1.postformat      = preParsePostFormat;
	proto$1.relativeTime    = relativeTime;
	proto$1.pastFuture      = pastFuture;
	proto$1.set             = set;

	// Month
	proto$1.months            =        localeMonths;
	proto$1.monthsShort       =        localeMonthsShort;
	proto$1.monthsParse       =        localeMonthsParse;
	proto$1.monthsRegex       = monthsRegex;
	proto$1.monthsShortRegex  = monthsShortRegex;

	// Week
	proto$1.week = localeWeek;
	proto$1.firstDayOfYear = localeFirstDayOfYear;
	proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	// Day of Week
	proto$1.weekdays       =        localeWeekdays;
	proto$1.weekdaysMin    =        localeWeekdaysMin;
	proto$1.weekdaysShort  =        localeWeekdaysShort;
	proto$1.weekdaysParse  =        localeWeekdaysParse;

	proto$1.weekdaysRegex       =        weekdaysRegex;
	proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
	proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

	// Hours
	proto$1.isPM = localeIsPM;
	proto$1.meridiem = localeMeridiem;

	function get$1 (format, index, field, setter) {
	    var locale = getLocale();
	    var utc = createUTC().set(setter, index);
	    return locale[field](utc, format);
	}

	function listMonthsImpl (format, index, field) {
	    if (isNumber(format)) {
	        index = format;
	        format = undefined;
	    }

	    format = format || '';

	    if (index != null) {
	        return get$1(format, index, field, 'month');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 12; i++) {
	        out[i] = get$1(format, i, field, 'month');
	    }
	    return out;
	}

	// ()
	// (5)
	// (fmt, 5)
	// (fmt)
	// (true)
	// (true, 5)
	// (true, fmt, 5)
	// (true, fmt)
	function listWeekdaysImpl (localeSorted, format, index, field) {
	    if (typeof localeSorted === 'boolean') {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    } else {
	        format = localeSorted;
	        index = format;
	        localeSorted = false;

	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    }

	    var locale = getLocale(),
	        shift = localeSorted ? locale._week.dow : 0;

	    if (index != null) {
	        return get$1(format, (index + shift) % 7, field, 'day');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 7; i++) {
	        out[i] = get$1(format, (i + shift) % 7, field, 'day');
	    }
	    return out;
	}

	function listMonths (format, index) {
	    return listMonthsImpl(format, index, 'months');
	}

	function listMonthsShort (format, index) {
	    return listMonthsImpl(format, index, 'monthsShort');
	}

	function listWeekdays (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	}

	function listWeekdaysShort (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	}

	function listWeekdaysMin (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	}

	getSetGlobalLocale('en', {
	    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (toInt(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});

	// Side effect imports
	hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
	hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

	var mathAbs = Math.abs;

	function abs () {
	    var data           = this._data;

	    this._milliseconds = mathAbs(this._milliseconds);
	    this._days         = mathAbs(this._days);
	    this._months       = mathAbs(this._months);

	    data.milliseconds  = mathAbs(data.milliseconds);
	    data.seconds       = mathAbs(data.seconds);
	    data.minutes       = mathAbs(data.minutes);
	    data.hours         = mathAbs(data.hours);
	    data.months        = mathAbs(data.months);
	    data.years         = mathAbs(data.years);

	    return this;
	}

	function addSubtract$1 (duration, input, value, direction) {
	    var other = createDuration(input, value);

	    duration._milliseconds += direction * other._milliseconds;
	    duration._days         += direction * other._days;
	    duration._months       += direction * other._months;

	    return duration._bubble();
	}

	// supports only 2.0-style add(1, 's') or add(duration)
	function add$1 (input, value) {
	    return addSubtract$1(this, input, value, 1);
	}

	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function subtract$1 (input, value) {
	    return addSubtract$1(this, input, value, -1);
	}

	function absCeil (number) {
	    if (number < 0) {
	        return Math.floor(number);
	    } else {
	        return Math.ceil(number);
	    }
	}

	function bubble () {
	    var milliseconds = this._milliseconds;
	    var days         = this._days;
	    var months       = this._months;
	    var data         = this._data;
	    var seconds, minutes, hours, years, monthsFromDays;

	    // if we have a mix of positive and negative values, bubble down first
	    // check: https://github.com/moment/moment/issues/2166
	    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	            (milliseconds <= 0 && days <= 0 && months <= 0))) {
	        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	        days = 0;
	        months = 0;
	    }

	    // The following code bubbles up values, see the tests for
	    // examples of what that means.
	    data.milliseconds = milliseconds % 1000;

	    seconds           = absFloor(milliseconds / 1000);
	    data.seconds      = seconds % 60;

	    minutes           = absFloor(seconds / 60);
	    data.minutes      = minutes % 60;

	    hours             = absFloor(minutes / 60);
	    data.hours        = hours % 24;

	    days += absFloor(hours / 24);

	    // convert days to months
	    monthsFromDays = absFloor(daysToMonths(days));
	    months += monthsFromDays;
	    days -= absCeil(monthsToDays(monthsFromDays));

	    // 12 months -> 1 year
	    years = absFloor(months / 12);
	    months %= 12;

	    data.days   = days;
	    data.months = months;
	    data.years  = years;

	    return this;
	}

	function daysToMonths (days) {
	    // 400 years have 146097 days (taking into account leap year rules)
	    // 400 years have 12 months === 4800
	    return days * 4800 / 146097;
	}

	function monthsToDays (months) {
	    // the reverse of daysToMonths
	    return months * 146097 / 4800;
	}

	function as (units) {
	    if (!this.isValid()) {
	        return NaN;
	    }
	    var days;
	    var months;
	    var milliseconds = this._milliseconds;

	    units = normalizeUnits(units);

	    if (units === 'month' || units === 'year') {
	        days   = this._days   + milliseconds / 864e5;
	        months = this._months + daysToMonths(days);
	        return units === 'month' ? months : months / 12;
	    } else {
	        // handle milliseconds separately because of floating point math errors (issue #1867)
	        days = this._days + Math.round(monthsToDays(this._months));
	        switch (units) {
	            case 'week'   : return days / 7     + milliseconds / 6048e5;
	            case 'day'    : return days         + milliseconds / 864e5;
	            case 'hour'   : return days * 24    + milliseconds / 36e5;
	            case 'minute' : return days * 1440  + milliseconds / 6e4;
	            case 'second' : return days * 86400 + milliseconds / 1000;
	            // Math.floor prevents floating point math errors here
	            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	            default: throw new Error('Unknown unit ' + units);
	        }
	    }
	}

	// TODO: Use this.as('ms')?
	function valueOf$1 () {
	    if (!this.isValid()) {
	        return NaN;
	    }
	    return (
	        this._milliseconds +
	        this._days * 864e5 +
	        (this._months % 12) * 2592e6 +
	        toInt(this._months / 12) * 31536e6
	    );
	}

	function makeAs (alias) {
	    return function () {
	        return this.as(alias);
	    };
	}

	var asMilliseconds = makeAs('ms');
	var asSeconds      = makeAs('s');
	var asMinutes      = makeAs('m');
	var asHours        = makeAs('h');
	var asDays         = makeAs('d');
	var asWeeks        = makeAs('w');
	var asMonths       = makeAs('M');
	var asYears        = makeAs('y');

	function get$2 (units) {
	    units = normalizeUnits(units);
	    return this.isValid() ? this[units + 's']() : NaN;
	}

	function makeGetter(name) {
	    return function () {
	        return this.isValid() ? this._data[name] : NaN;
	    };
	}

	var milliseconds = makeGetter('milliseconds');
	var seconds      = makeGetter('seconds');
	var minutes      = makeGetter('minutes');
	var hours        = makeGetter('hours');
	var days         = makeGetter('days');
	var months       = makeGetter('months');
	var years        = makeGetter('years');

	function weeks () {
	    return absFloor(this.days() / 7);
	}

	var round = Math.round;
	var thresholds = {
	    ss: 44,         // a few seconds to seconds
	    s : 45,         // seconds to minute
	    m : 45,         // minutes to hour
	    h : 22,         // hours to day
	    d : 26,         // days to month
	    M : 11          // months to year
	};

	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	}

	function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
	    var duration = createDuration(posNegDuration).abs();
	    var seconds  = round(duration.as('s'));
	    var minutes  = round(duration.as('m'));
	    var hours    = round(duration.as('h'));
	    var days     = round(duration.as('d'));
	    var months   = round(duration.as('M'));
	    var years    = round(duration.as('y'));

	    var a = seconds <= thresholds.ss && ['s', seconds]  ||
	            seconds < thresholds.s   && ['ss', seconds] ||
	            minutes <= 1             && ['m']           ||
	            minutes < thresholds.m   && ['mm', minutes] ||
	            hours   <= 1             && ['h']           ||
	            hours   < thresholds.h   && ['hh', hours]   ||
	            days    <= 1             && ['d']           ||
	            days    < thresholds.d   && ['dd', days]    ||
	            months  <= 1             && ['M']           ||
	            months  < thresholds.M   && ['MM', months]  ||
	            years   <= 1             && ['y']           || ['yy', years];

	    a[2] = withoutSuffix;
	    a[3] = +posNegDuration > 0;
	    a[4] = locale;
	    return substituteTimeAgo.apply(null, a);
	}

	// This function allows you to set the rounding function for relative time strings
	function getSetRelativeTimeRounding (roundingFunction) {
	    if (roundingFunction === undefined) {
	        return round;
	    }
	    if (typeof(roundingFunction) === 'function') {
	        round = roundingFunction;
	        return true;
	    }
	    return false;
	}

	// This function allows you to set a threshold for relative time strings
	function getSetRelativeTimeThreshold (threshold, limit) {
	    if (thresholds[threshold] === undefined) {
	        return false;
	    }
	    if (limit === undefined) {
	        return thresholds[threshold];
	    }
	    thresholds[threshold] = limit;
	    if (threshold === 's') {
	        thresholds.ss = limit - 1;
	    }
	    return true;
	}

	function humanize (withSuffix) {
	    if (!this.isValid()) {
	        return this.localeData().invalidDate();
	    }

	    var locale = this.localeData();
	    var output = relativeTime$1(this, !withSuffix, locale);

	    if (withSuffix) {
	        output = locale.pastFuture(+this, output);
	    }

	    return locale.postformat(output);
	}

	var abs$1 = Math.abs;

	function toISOString$1() {
	    // for ISO strings we do not use the normal bubbling rules:
	    //  * milliseconds bubble up until they become hours
	    //  * days do not bubble at all
	    //  * months bubble up until they become years
	    // This is because there is no context-free conversion between hours and days
	    // (think of clock changes)
	    // and also not between days and months (28-31 days per month)
	    if (!this.isValid()) {
	        return this.localeData().invalidDate();
	    }

	    var seconds = abs$1(this._milliseconds) / 1000;
	    var days         = abs$1(this._days);
	    var months       = abs$1(this._months);
	    var minutes, hours, years;

	    // 3600 seconds -> 60 minutes -> 1 hour
	    minutes           = absFloor(seconds / 60);
	    hours             = absFloor(minutes / 60);
	    seconds %= 60;
	    minutes %= 60;

	    // 12 months -> 1 year
	    years  = absFloor(months / 12);
	    months %= 12;


	    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	    var Y = years;
	    var M = months;
	    var D = days;
	    var h = hours;
	    var m = minutes;
	    var s = seconds;
	    var total = this.asSeconds();

	    if (!total) {
	        // this is the same as C#'s (Noda) and python (isodate)...
	        // but not other JS (goog.date)
	        return 'P0D';
	    }

	    return (total < 0 ? '-' : '') +
	        'P' +
	        (Y ? Y + 'Y' : '') +
	        (M ? M + 'M' : '') +
	        (D ? D + 'D' : '') +
	        ((h || m || s) ? 'T' : '') +
	        (h ? h + 'H' : '') +
	        (m ? m + 'M' : '') +
	        (s ? s + 'S' : '');
	}

	var proto$2 = Duration.prototype;

	proto$2.isValid        = isValid$1;
	proto$2.abs            = abs;
	proto$2.add            = add$1;
	proto$2.subtract       = subtract$1;
	proto$2.as             = as;
	proto$2.asMilliseconds = asMilliseconds;
	proto$2.asSeconds      = asSeconds;
	proto$2.asMinutes      = asMinutes;
	proto$2.asHours        = asHours;
	proto$2.asDays         = asDays;
	proto$2.asWeeks        = asWeeks;
	proto$2.asMonths       = asMonths;
	proto$2.asYears        = asYears;
	proto$2.valueOf        = valueOf$1;
	proto$2._bubble        = bubble;
	proto$2.get            = get$2;
	proto$2.milliseconds   = milliseconds;
	proto$2.seconds        = seconds;
	proto$2.minutes        = minutes;
	proto$2.hours          = hours;
	proto$2.days           = days;
	proto$2.weeks          = weeks;
	proto$2.months         = months;
	proto$2.years          = years;
	proto$2.humanize       = humanize;
	proto$2.toISOString    = toISOString$1;
	proto$2.toString       = toISOString$1;
	proto$2.toJSON         = toISOString$1;
	proto$2.locale         = locale;
	proto$2.localeData     = localeData;

	// Deprecations
	proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
	proto$2.lang = lang;

	// Side effect imports

	// FORMATTING

	addFormatToken('X', 0, 0, 'unix');
	addFormatToken('x', 0, 0, 'valueOf');

	// PARSING

	addRegexToken('x', matchSigned);
	addRegexToken('X', matchTimestamp);
	addParseToken('X', function (input, array, config) {
	    config._d = new Date(parseFloat(input, 10) * 1000);
	});
	addParseToken('x', function (input, array, config) {
	    config._d = new Date(toInt(input));
	});

	// Side effect imports


	hooks.version = '2.18.1';

	setHookCallback(createLocal);

	hooks.fn                    = proto;
	hooks.min                   = min;
	hooks.max                   = max;
	hooks.now                   = now;
	hooks.utc                   = createUTC;
	hooks.unix                  = createUnix;
	hooks.months                = listMonths;
	hooks.isDate                = isDate;
	hooks.locale                = getSetGlobalLocale;
	hooks.invalid               = createInvalid;
	hooks.duration              = createDuration;
	hooks.isMoment              = isMoment;
	hooks.weekdays              = listWeekdays;
	hooks.parseZone             = createInZone;
	hooks.localeData            = getLocale;
	hooks.isDuration            = isDuration;
	hooks.monthsShort           = listMonthsShort;
	hooks.weekdaysMin           = listWeekdaysMin;
	hooks.defineLocale          = defineLocale;
	hooks.updateLocale          = updateLocale;
	hooks.locales               = listLocales;
	hooks.weekdaysShort         = listWeekdaysShort;
	hooks.normalizeUnits        = normalizeUnits;
	hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	hooks.calendarFormat        = getCalendarFormat;
	hooks.prototype             = proto;

	return hooks;

	})));


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./en-gb": 16
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 15;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	//! moment.js locale configuration
	//! locale : English (United Kingdom) [en-gb]
	//! author : Chris Gedrim : https://github.com/chrisgedrim

	;(function (global, factory) {
	    true ? factory(__webpack_require__(13)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enGb = moment.defineLocale('en-gb', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enGb;

	})));



/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	var events = __webpack_require__(1);

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


/***/ })
/******/ ]);