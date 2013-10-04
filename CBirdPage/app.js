Handlebars.registerHelper('authorHelper', function (authors) {
    var authorArray = authors.split(/\s*and\s*/);
    var lastAuthor = authorArray.pop();
    return authorArray.join(", ") + " and " + lastAuthor;
});

var BibtexGetter = (function () {
    function BibtexGetter(element) {
        this.element = element;
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
    }
    BibtexGetter.prototype.load = function () {
        var span = this.span;
        var element = this.element;

        $.getJSON("https://api.github.com/repos/cabird/cv/contents/bird.bib", function (data) {
            var bibtex = $.base64.decode(data["content"], false);
            var bibtexParser = new BibtexParser();
            bibtexParser.setInput(bibtex);
            bibtexParser.bibtex();
            var entries = bibtexParser.getEntries();

            var source = $("#bibtex-entry-template").html();
            var template = Handlebars.compile(source);

            for (var key in entries) {
                var entry = entries[key];
                entry.BIBTEX = formatBibtex(entry);
                entry.VENUE = entry.BOOKTITLE || entry.JOURNAL;
                var a = document.createElement("div");
                a.innerHTML = template(entry);
                element.appendChild(a);
            }
        });
    };
    return BibtexGetter;
})();

var formatBibtex = function (entry) {
    var fields = ["AUTHOR", "TITLE", "BOOKTITLE", "YEAR", "PUBLISHER", "JOURNAL"];
    var bibtex = entry.TYPE.toLowerCase() + "{" + entry.KEY.toLowerCase();

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (field in entry) {
            bibtex = bibtex + ",\n    " + field.toLowerCase() + " = {" + entry[field] + "}";
        }
    }
    bibtex += "\n}";
    return bibtex;
};

window.onload = function () {
    //$("#tabs").tabs();
    var bibtexGetter = new BibtexGetter(document.getElementById('bibtex-content'));
    bibtexGetter.load();
};
//# sourceMappingURL=app.js.map
