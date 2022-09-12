var settings = {
    "url": "https://www.eventbriteapi.com/v3/organizations/233619576249/events/?expand=organizer,venue&status=live,started",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "Bearer DXYHHESOBVEWZOGTRZBF"    },
    };
    var venue_col;
    $.ajax(settings).done(function (response) {
    var data = response.events;
    var len = data.length;
        for(var i=0; i<len; i++){
            var id = data[i].id;
            var name = data[i].name.text;
            var start = data[i].start.local;
            var d = new Date(start);
            var month = d.toLocaleString('default', { month: 'long' });
            var day = d.toLocaleString('default', {day: '2-digit'});
            var time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            var edate =  '<h1>' + day + '</h1>' +
            '<h3>' +month + '</h3>' + 
            '<span>' + time + '</span>';

            var description = data[i].description.html;
            var url = data[i].url;
            var venue_id = data[i].venue_id;
            var chckImage = data[i].logo;
            if (chckImage) {
              var eImage = data[i].logo.original.url;
            }
            var address = data[i].venue.address.address_1;
              var address2 = data[i].venue.address.address_2;
              var city = data[i].venue.address.city;
              var state = data[i].venue.address.region;
              var zip = data[i].venue.address.postal_code;
              var country = data[i].venue.address.country;
              var capacity = data[i].capacity;
              var vID = data[i].venue.id;
              var venueName = data[i].venue.name;
              var venue_col = address + ", " + address2 + " " + city + " " + state + ", " + zip + " " + country;
              var title = city + ', ' + state;
          if (eImage == null){
            var eImage = "assets/missing.png";
          }
          var tr_str = "<div class='eb-event'>" +
          "<div class='event-image'><a href='"+url+"' target='_blank'><img src='" + eImage + "' /></a></div>" +
          "<div class='event-details'><div class='event-content'><h3 role='heading' aria-level='2'>" + city + ": " + venueName +"</h3>" +
          "<p>" + description + "</p>" +
          "<p>" + address + " &bull; "+ title +"</p>" +
          "<a class='event-cta' href='"+url+"' target='_blank'>RSVP to event ></a></div>"+
          "<div class='event-meta text-center'>" + edate + "</div>" +
          "</div></div><hr />";
          if(i < 6){
            var container = tr_str;
          } else {
            var container = "<div class='eb-hidden eb-pagination' id='eb-"+i+"'>"+tr_str+"</div>";
          }
            $("#upcoming_events").append(container);
        }
        if(len > 6){
            var loadCTA = '<a href="#" id="more_events" class="fm-hero-play">Load more events</a>';
            $("#upcoming_events").append(loadCTA);
        }
        $( '#more_events' ).on( 'click', function(event) {
            $(".eb-hidden").each(function () {
               $(this).addClass("eb-shown");
            });
            $(this).addClass('eb-hidden');
            event.preventDefault();
        });
    });
