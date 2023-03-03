var settings = {
    "url": "https://www.eventbriteapi.com/v3/organizations/233619576249/events/?expand=organizer,venue&status=live,started",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "Bearer DXYHHESOBVEWZOGTRZBF"    },
    };
    var venue_col;
    var has_events = 0;
    $.ajax(settings).done(function (response) {
    var data = response.events;
    var len = data.length;
    //console.log(data);
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
            var mdate = month + ' ' + day + ', ' + time;
            var ebTitle = data[i].name.text;
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
            var eImage = "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F352792589%2F233619576249%2F1%2Foriginal.20220912-182657?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C640%2C320&s=1413b1b9d22715a61f9d3ee1963cd33d";
          }
          if (ebTitle.indexOf('Performances by:') > -1)
          {
            has_events = 1;
            var tr_str = "<div class='eb-event'>" +
            "<div class='event-image'><a href='"+url+"' target='_blank'><img src='" + eImage + "' /></a></div>" +
            "<div class='event-details'><div class='event-content'><h3 role='heading' aria-level='2'>" + city + ": " + venueName +"</h3>" +
            "<span class='mobile-date'>"+ mdate +"</span>"+
            "<p class='desc'>" + description + "</p>" +
            "<p>" + address + " &bull; "+ title +"</p>" +
            "<a class='event-cta' href='"+url+"' target='_blank'>RSVP</a></div>"+
            "<div class='event-meta text-center'>" + edate + "</div>" +
            "</div></div><hr />";
          } else {
            var tr_str = '';
          }
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
        if(has_events == 0 ){
          $('#upcoming_events').hide();
        }
        $( '#more_events' ).on( 'click', function(event) {
            $(".eb-hidden").each(function () {
               $(this).addClass("eb-shown");
            });
            $(this).addClass('eb-hidden');
            event.preventDefault();
        });
    });
