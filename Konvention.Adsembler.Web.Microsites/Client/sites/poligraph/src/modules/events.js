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