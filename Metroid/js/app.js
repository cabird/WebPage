
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
    BibtexGetter.prototype.GetPaperLinks = function () {
        this.pubs = new Object();
        var pubs = this.pubs;
        $.getJSON("https://api.github.com/repos/cabird/cv/contents/pubs", function (data) {
            for (var i = 0; i < data.length; i++) {
                pubs[data[i].name] = data[i]._links.html + "?raw=true";
            }
        });
    };

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

            $(".show_bibtex_link").click(function (event) {
                var icon = $(this).children(".ui-icon");
                $(event.target).siblings(".bibtex").slideToggle(function () {
                    if ($(this).is(":hidden")) {
                        icon.removeClass().addClass("ui-icon").addClass("ui-icon-carat-1-s").addClass("ui-icon-inline");
                    } else {
                        icon.removeClass().addClass("ui-icon").addClass("ui-icon-carat-1-n").addClass("ui-icon-inline");
                    }
                });
            });

            $(".show_abstract_link").click(function (event) {
                var icon = $(this).children(".ui-icon");
                $(event.target).siblings(".abstract").slideToggle(function () {
                    if ($(this).is(":hidden")) {
                        icon.removeClass().addClass("ui-icon").addClass("icon ui-icon-carat-1-s");
                    } else {
                        icon.removeClass().addClass("ui-icon").addClass("icon ui-icon-carat-1-n");
                    }
                });
            });
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

var DoBibtex = function () {
    var bibtexGetter = new BibtexGetter(document.getElementById('bibtex-content'));
    bibtexGetter.load();
    bibtexGetter.GetPaperLinks();
};

