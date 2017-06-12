function html(markup) {
    var container = document.createElement('div');
    container.innerHTML = markup;
    return container.firstChild && container.removeChild(container.firstChild);
}

module.exports = {
    html: html
};