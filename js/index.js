function initPanels(data) {

    $('#analytics').empty();
    $('#analytics').Meliorator('dashboard-panel', {
        data: data,
        labels: {
            domain:'Domain',
        range: 'Series',
        domainAggregation:  'Aggregation',
        renderAs:  'Render As',
        renderVisuals: 'Evoke Visuals',
        exportVisuals: 'Remember Image'

        }
    });

    $('.widget-button.trigger').prepend($('<i/>', {
        'class': 'fa fa-binoculars'
    }).css({'margin-right':'3px'})).css({
        'padding': '5px',
        'font-size':'large',
        'text-transform': 'uppercase',
    });

    $('.export-button.trigger').prepend($('<i/>', {
        'class': 'fa fa-space-shuttle'
    }).css({'margin-right':'3px'})).css({
        'padding': '5px',
        'font-size':'large',
        'text-transform': 'uppercase',
    });

}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// do everything only after meliorator fully loads
$(document).on('Meliorator-Ready',function() {


    $('#btn-fetch').click(function() {
        var url = $('#data-url').val().trim();
        if (url.length > 0) {

            $('.chart.widget').empty().append($('<p/>', {
                'style': 'color: #ff18c1;font-weight:bold;font-size:large;'
            }).html('Wait as the analytics panel is loaded...'))

            var access_token = $('#access-token').val();
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "POST",
                "data": {
                    access_token: access_token
                }
            }).done(function(response) {
                initPanels(JSON.parse(response));
            }).fail(function(){

                $('.chart.widget').empty().append($('<p/>', {
                    'style': 'color: #ff18c1;font-weight:bold;font-size:large;'
                }).html('SORRY! We failed to load data and the analytics panel via the given parameters. Cross-check them well, and try again.'))


            });
        } else {
            welcome();
        }
    });

    if(window.analyticsParams != undefined){

        if(analyticsParams.app_title != undefined){
            $('.app-title').text(analyticsParams.app_title);
        }

        if(analyticsParams.url != undefined){

            // let's init the data analysis from the data-source in the url
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": analyticsParams.url,
                "method": analyticsParams.method || "POST",
                "data": analyticsParams,
            }

            $('#data-url').val(analyticsParams.url)
                $('#access-token').val(analyticsParams.token || analyticsParams.access_token || analyticsParams.t || "")
                // in this case, the data is obtained via an api, and then we pass the result to 
                // Meliorator
                $.ajax(settings).done(function(response) {
                    initPanels(JSON.parse(response));
                });

        }

    }else { 
        $('.app-title').text("");
        var query = getUrlVars();
        if(query.url != undefined){

            // let's init the data analysis from the data-source in the url
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": query.url,
                "method": query.method || "POST",
                "data": query,
            }

            $('#data-url').val(query.url)
                $('#access-token').val(query.token || query.access_token || query.t || "")
                // in this case, the data is obtained via an api, and then we pass the result to 
                // Meliorator
                $.ajax(settings).done(function(response) {
                    initPanels(JSON.parse(response));
                });


        }else {

            // let's make lorem objects with which to test our lib...
            // we'll use the awesome schematic-ipsum API for this..
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://schematic-ipsum.herokuapp.com/?n=50",
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "data": "{\n  \"type\": \"object\",\n  \"properties\": {\n    \"Name\": { \"type\": \"string\", \"ipsum\": \"name\" },\n    \"Group\": {\n  \"type\": \"string\",\n  \"enum\": [\"Plankton\", \"Islander\", \"Mystic\", \"Veterans\"]\n},\n    \"City\": {\n  \"type\": \"string\",\n  \"enum\": [\"Entebbe\", \"Kampala\", \"Jinja\", \"Masindi\", \"Gulu\", \"Masaka\", \"Mbarara\"]\n},\n    \"Age\": { \"type\": \"integer\" },\n\t  \"Score\": { \"type\": \"number\" },\n\t  \"Rank\": { \"type\": \"integer\" }\n   \n  }\n}"
            }

            // in this case, the data is obtained via an api, and then we pass the result to 
            // Meliorator
            $.ajax(settings).done(function(response) {
                initPanels(JSON.parse(response));
                setTimeout(function(){
                    welcome() }, 2000);
            });

        }

    }
}    );


function welcome(){

    $('.chart.widget').empty().append($('<p/>', {
        'style': 'color: rgba(41, 0, 0, 0.74);font-weight:bold;font-size:large;'
    }).html('WELCOME to the Data Diviner, the most beautiful, free, advanced data hero in the world. <br/><hr/> Initially, we load for you some basic, random sample data from a lorem data service. This is just to help you play around with this analytical tool, then when you know how it works, go find your own data (build a free app at <a href="https://studio.chwezi.tech" target="_blank">The Studio</a>, it gives you a free Data Diviner for the data posted via your app.) <br/> <hr/>Otherwise, please provide proper parameters for fetching the data... A URL and where required, an access token. <br/>Note: the diviner can analyze any data of the form: <br/><br/><i>[{field1:val1, field2:val2,...}, {field1:valn, field2:valn2,...},... ]<i>'))
}
