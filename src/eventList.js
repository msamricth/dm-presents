function ready(cb) {
	if( document.readyState != 'loading' ) {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

var setStart = function(e) {
	var video = e.currentTarget;
	var start = parseFloat(video.getAttribute("data-start")); 
	video.currentTime = start; 
	video.pause();
	video.removeEventListener('canplaythrough', setStart); 
}; 

ready(function(){ 
	var thumbnails = document.querySelectorAll('.fm-video-thumbnail');
	for( var i = 0; i < thumbnails.length; i++ ) { 
		var a = thumbnails[i];
		// set thumbnail preview start time
		var video = a.querySelector("video");
		video.addEventListener('canplaythrough', setStart); 
	}; 

	var items = document.querySelectorAll(".fm-event");
	for( var i = 0; i < items.length; i++ ) {
		var a = items[i];
		// play/pause on hover for thumbnails
		a.addEventListener('mouseenter', function(e){ 
			var video = e.target.querySelector("video");
			var res = video.play(); 
		});
		a.addEventListener('mouseleave', function(e){ 
			var video = e.target.querySelector("video");
			video.pause(); 
		}); 

		a.addEventListener('click', function(e) {
			e.preventDefault();
			var item  = e.currentTarget;
			var href = item.dataset.href;
			if(href) {
				window.location = href;
			}
		});
	};


	var eventDetails = document.querySelector(".fm-event-details");
	var nextArrow = document.querySelector(".fm-events-n");
	var prevArrow = document.querySelector(".fm-events-p"); 
	var eventItems = [];

	var handleeventSelectorClick = function(e) {
		var selectedSeason = e.currentTarget.dataset.season;
		if(selectedSeason !== season) {
			setSeason(selectedSeason);
		}
	};

	var eventSelectors = document.querySelectorAll(".fm-events-selector h3")
	for(var i = 0; i < eventSelectors.length; i++) {
		eventSelectors[i].addEventListener("click", handleeventSelectorClick); 
	}

	var eventItemContainer = document.querySelector(".fm-event-hug");
	function setSeason(_season) {
		season = _season;

		// hide old container
		var eventItemContainers = document.querySelectorAll(".fm-event-hug");
		for(var i = 0; i < eventItemContainers.length; i++){
			eventItemContainers[i].style.display = "none";
		}

		eventItemContainer = document.querySelector(".fm-event-hug");
		eventItems = eventItemContainer.querySelectorAll(".fm-event");
		realeventItems = [];
		for(var i = 0; i < eventItems.length; i++) {
			if(eventItems[i].querySelector(".fm-event-thumbnail"))
				realeventItems.push(eventItems[i]);
		}
		eventItems = realeventItems;
		eventCount = eventItems.length;

		// show new container
		eventItemContainer.style.display = "inline-flex";

		var seasonLinks = document.querySelectorAll(".fm-events-selector h3");


		eventIndex = 0;

		handleResize();
	};


	// Scroll to end, disabled for now
	//var eventIndex = eventItems.length - videosShown;
	var eventIndex = 0;
	if(window.innerWidth <= 480)
		eventIndex = 0;

	var eventCount = 0;

	var videosShown = window.innerWidth > 768 ? 3 : window.innerWidth > 390 ? 2 : 1;



	function moveeventCarousel(direction) { 
		var videosShown = window.innerWidth > 768 ? 3 :window.innerWidth > 390 ? 2 : 1;
		if(direction < 0)
			eventIndex = Math.max(0, eventIndex - videosShown); 
		else
			eventIndex = Math.min(eventItems.length - videosShown, eventIndex + videosShown);

		adjusteventCarouselArrows(250);
	};

	prevArrow.addEventListener("click", function(e) {
		e.preventDefault();
		moveeventCarousel(-1);
	});

	nextArrow.addEventListener("click", function(e) {
		e.preventDefault();
		moveeventCarousel(1);
	}); 

	function adjusteventCarouselArrows(delay) { 
		delay = delay | 0;
			var mo = 20 * (eventIndex); // margin offset, to account for the 20px margin in between each item
			if(window.innerWidth < 480)
				var mo = 7 * (eventIndex); // margin offset, to account for the 20px margin in between each item
			if(eventIndex == 0) mo = 0; // ignore if we're at the first item, otherwise the math is confused

			if(window.innerWidth > 1440)
				eventItemContainer.style.left = parseInt(-eventIndex * 390 - mo).toString() + "px";
			else if(window.innerWidth > 768)
				eventItemContainer.style.left = "calc((33.33vw - 46px) * " + (-eventIndex).toString() + " - " + mo + "px)";
			else if(window.innerWidth > 480)
				eventItemContainer.style.left = "calc((50vw - 50px) * " + (-eventIndex).toString() + " - " + mo + "px)";
			else if(window.innerWidth > 390)
				eventItemContainer.style.left = "calc(200px * " + (-eventIndex).toString() + " - " + mo + "px)";
			else
				eventItemContainer.style.left = "calc(285px * " + (-eventIndex).toString() + " - " + mo + "px)";  


			eventItemContainer.style.transition = "left ease-in-out 0.25s";

			setTimeout(function() {
				eventItemContainer.style.transition = "none";
				var videosShown = window.innerWidth > 768 ? 3 :window.innerWidth > 390 ? 2 : 1;
				var rect = eventItems[eventIndex].querySelector(".fm-event-thumbnail").getBoundingClientRect(); 
				var lastIndex = Math.min(eventCount-1, eventIndex+(videosShown-1));
				var endRect = eventItems[lastIndex].querySelector(".fm-event-thumbnail").getBoundingClientRect(); 
				var top = parseInt(rect.top + rect.height / 2.0 - 24).toString() + "px"; 
				var left = parseInt(rect.left - 20).toString() + "px";
				var right = parseInt(endRect.right - 20).toString() + "px";
				nextArrow.style.top = top;
				nextArrow.style.left = right;
				prevArrow.style.top = top; 
				prevArrow.style.left = left;

				prevArrow.style.display = (eventIndex > 0) ? "flex" : "none";
				nextArrow.style.display = (eventIndex < eventCount - videosShown) ? "flex" : "none"; 
			}, delay); 
		

	};

	function handleResize(e) {
		adjusteventCarouselArrows(); 
	}; 

	window.addEventListener('resize', function(e){ handleResize(); });
	window.addEventListener('orientationchange', function(e){ handleResize(); });
	window.addEventListener("scroll", adjusteventCarouselArrows );
    setSeason(1);

	// NOTE: This is for debugging on Hybris. Since when connected over VPN Vimeo won't load videos
	// so you have to disconnect from VPN and then reload all iframes. This is just a handy shortcut. 
	window.addEventListener('keydown', function(e){ 
		if(e.key == 'r') { 
			var iframes = document.querySelectorAll("iframe");
			for( var i = 0; i < iframes.length; i++ ) {
				iframes[i].src = iframes[i].src;
			};
		}
	});
});