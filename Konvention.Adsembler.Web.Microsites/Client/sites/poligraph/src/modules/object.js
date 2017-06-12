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