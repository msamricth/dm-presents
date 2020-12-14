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

	var items = document.querySelectorAll(".fm-episodes-item");
	for( var i = 0; i < items.length; i++ ) {
		var a = items[i];
		// play/pause on hover for thumbnails
		a.addEventListener('mouseenter', function(e){ 
			var video = e.target.querySelector("video");
			var res = video.play(); 
			console.log(res);
		});
		a.addEventListener('mouseleave', function(e){ 
			var video = e.target.querySelector("video");
			video.pause(); 
		}); 
	};

	// swap for mobile collage looping video
	// TODO: This should be moved to an episodes.js for release2
	var collageVideo = document.querySelector(".fm-hero-video:not(.preview) video");
	var collageContainer = collageVideo.parentElement;
	var collageVideoSource = collageVideo.querySelector("source");
	var collageBreakpoint = collageVideoSource.getAttribute("data-breakpoint");
	var collageDesktopSrc = collageVideoSource.getAttribute("src");

	var adjustCollageVideoPadding = function() {
		var aspect = (collageVideo.videoHeight / collageVideo.videoWidth) * 100.0;
		collageContainer.style.paddingBottom = aspect.toString() + "%"; 
		collageVideo.removeEventListener("canplaythrough", adjustCollageVideoPadding);
	};

	var adjustCollageVideo = function() { 
		var breakpoint = parseInt(collageBreakpoint);
		var existingSrc = collageVideoSource.getAttribute("src");
		var newSrc;

		if(window.outerWidth <= breakpoint)
			newSrc = collageDesktopSrc.replace(/(https:\/\/.+)([\.]mp4)/gm, "$1Mobile$2");
		else
			newSrc = collageDesktopSrc; 
		
		if(existingSrc != newSrc) { 
			collageVideoSource.setAttribute("src", newSrc);
			collageVideo.addEventListener("canplaythrough", adjustCollageVideoPadding);
			collageVideo.load();
		}
	};

	var episodeItems = document.querySelectorAll(".fm-episodes-item");
	var episodeItemContainer = document.querySelector(".fm-episodes-item-container");
	var nextArrow = document.querySelector(".fm-episodes-next");
	var prevArrow = document.querySelector(".fm-episodes-prev"); 

	var videosShown = window.outerWidth > 768 ? 3 : 2;

	// Scroll to end, disabled for now
	//var episodeIndex = episodeItems.length - videosShown;
	var episodeIndex = 0;
	if(window.outerWidth <= 480)
		episodeIndex = 0;

	var episodeCount = episodeItems.length;

	var moveEpisodeCarousel = function(direction) { 
		var videosShown = window.outerWidth > 768 ? 3 : 2;
		if(direction < 0)
			episodeIndex = Math.max(0, episodeIndex - videosShown); 
		else
			episodeIndex = Math.min(episodeCount - videosShown, episodeIndex + videosShown);

		adjustEpisodeCarouselArrows(250);
	};

	prevArrow.addEventListener("click", function(e) {
		e.preventDefault();
		moveEpisodeCarousel(-1);
	});

	nextArrow.addEventListener("click", function(e) {
		e.preventDefault();
		moveEpisodeCarousel(1);
	}); 

	var adjustEpisodeCarouselArrows = function(delay) { 
		delay = delay | 0;
		if( window.outerWidth <= 480 ) {
			nextArrow.style.display = "none";
			prevArrow.style.display = "none";
			episodeItemContainer.style.left = "0"; 
		}
		else {
			var mo = 20 * (episodeIndex); // margin offset, to account for the 20px margin in between each item
			if(episodeIndex == 0) mo = 0; // ignore if we're at the first item, otherwise the math is confused

			if(window.outerWidth > 1440)
				episodeItemContainer.style.left = parseInt(-episodeIndex * 390 - mo).toString() + "px";
			else if(window.outerWidth > 768)
				episodeItemContainer.style.left = "calc((33.33vw - 46px) * " + (-episodeIndex).toString() + " - " + mo + "px)";
			else if(window.outerWidth > 480)
				episodeItemContainer.style.left = "calc((50vw - 50px) * " + (-episodeIndex).toString() + " - " + mo + "px)"; 

			episodeItemContainer.style.transition = "left ease-in-out 0.25s";

			setTimeout(function() {
				episodeItemContainer.style.transition = "none";
				var videosShown = window.outerWidth > 768 ? 3 : 2;
				var rect = episodeItems[episodeIndex].querySelector("video").getBoundingClientRect(); 
				var lastIndex = Math.min(episodeCount-1, episodeIndex+(videosShown-1));
				var endRect = episodeItems[lastIndex].querySelector("video").getBoundingClientRect(); 
				var top = parseInt(rect.top + rect.height / 2.0 - 24).toString() + "px"; 
				var left = parseInt(rect.left - 20).toString() + "px";
				var right = parseInt(endRect.right - 20).toString() + "px";
				nextArrow.style.top = top;
				nextArrow.style.left = right;
				prevArrow.style.top = top; 
				prevArrow.style.left = left;

				prevArrow.style.display = (episodeIndex > 0) ? "flex" : "none";
				nextArrow.style.display = (episodeIndex - 1 <= episodeCount - videosShown - episodeIndex) ? "flex" : "none"; 
			}, delay); 
		}

	};

	var handleResize = function(e) {
		if( collageVideo !== null ) 
			adjustCollageVideo();
		
		adjustEpisodeCarouselArrows(); 
	}; 

	handleResize();
	window.addEventListener('resize', function(e){ handleResize(); });
	window.addEventListener('orientationchange', function(e){ handleResize(); });
	window.addEventListener("scroll", adjustEpisodeCarouselArrows );

	var episodePlaceholderTeaser = document.querySelector(".fm-episode-header-video");
	if(episodePlaceholderTeaser !== null) {
		episodePlaceholderTeaser.addEventListener("click", function(e) { 
			var videos = episodePlaceholderTeaser.querySelectorAll(".fm-hero-video");
			var playButton = episodePlaceholderTeaser.querySelector(".fm-big-play-button");
			var placeholder = document.querySelector(".fm-hero-video.preview");
			var vimeoVideo = document.querySelector(".fm-hero-video.vimeo");
			var iframe = vimeoVideo.querySelector("iframe"); 

			vimeoVideo.style.display = "block";
			placeholder.style.display = "none";
			playButton.style.display = "none";
			iframe.contentWindow.postMessage({method:"play"}, "*"); 
		});
	} 

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