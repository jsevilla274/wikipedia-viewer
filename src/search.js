var prevInput = "";

var searchExpand = function() {
    $("#wrapper").animate({
        "margin-left": -20
    }, 200, function() {
        $("#handle").animate({
            bottom: 4,
            left: 16
        }, 150, function() {
            $("#search-bar").css("overflow", "hidden")
                .animate({
                    width: 250
                }, 250, function() {
                    $("#leg1, #leg2").animate({
                        top: 16,
                        right: 8
                    }, 150);// end of #leg1 && #leg2.animate
                    $("input").show().focus();
                    $("#close-area").show();
                });// end of #search-bar.animate
            $(".close-legs").show();
            $("#wrapper").animate({
                "margin-left": -129
            }, 250);
        });//end of #handle.animate
    });
    $("img").fadeOut(200);
    $(this).css("cursor", "default")
    $(this).off();
};// eof searchExpand

var searchCompress = function() {
    $("#leg1").animate({
        top: 40,
        right: -16
    }, 200);// end of #leg1.animate
    $("#leg2").animate({
        top: -8,
        right: -16
    }, 200, function() {
        $(".close-legs").hide();
        $("#search-bar").css("overflow", "visible")
            .animate({
                width: 32
            }, 250, function() {
                $("img").fadeIn(200);
                $("#wrapper").animate({
                    "margin-left": -58
                }, 200);
                $("#handle").animate({
                    bottom: -6,
                    left: 26
                }, 150);
                $("#search-bar").on("click", searchExpand).css("cursor", "pointer");
            });//end of #handle.animate
        $("#wrapper").animate({
            "margin-left": -20
        }, 250);
    });// end of #leg2.animate
    $("#close-area").hide();
    $("input").hide().val('');
};

var jsonHandler = function(input) {
    return function(json) {
        var resultWrapper = $("#result-wrapper");
        if (json.query) {
            for (var key in json.query.pages) {
                if (json.query.pages.hasOwnProperty(key)) {
                    resultWrapper.append('<a href="https://en.wikipedia.org/?curid=' + json.query.pages[key].pageid + '" target="_blank"><div class="results"><h3>' + json.query.pages[key].title +'</h3><p>' + json.query.pages[key].extract + '</p></div></a>');
                }
            }
        } else {
            resultWrapper.append('<div id="nullresult">Your search - <strong>' + input + '</strong> - did not match any articles.<br><br>Suggestions:<ul><li>Make sure all words are spelled correctly.</li><li>Try a different search term.</li><li>Try broader terminology.</li><li>Try fewer terms.</li></ul></div>');
        }
        resultWrapper.animate({"margin-top": 125}, 300).fadeIn({duration: 300, queue: false});
    }
};

var searchQuery = function() {
    var currInput = $("input").val();
    if (event) {
        event.preventDefault();
    }
    if (prevInput != currInput && currInput != "") {
        prevInput = currInput;
        $("#result-wrapper").empty().css({"margin-top": 225, display: "none"});
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exlimit=max&exintro=1&explaintext=1&gsrsearch=" + currInput,
            dataType: 'jsonp',
            method: 'POST',
            headers: {'Api-User-Agent': 'WikiViewer v1.0'},
            success: jsonHandler(currInput)
        });
    }
};

var searchAnimate = function(event) {
    event.preventDefault();
    $("h1").animate({"padding-top": 175}, 100).fadeOut({duration: 100, queue: false});//end of h1.animate/fadeout
    $("#wrapper").animate({
        top: 25
    }, 300, function() {
        searchQuery();
        $("form").on("submit", searchQuery);
    }); //end of search-bar.animate
};

$(document).ready(function() {
    $("#search-bar").on("click", searchExpand);
    $("#close-area").on("click", searchCompress);
    $("form").one("submit", searchAnimate);
});// end of doc.ready