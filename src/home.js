function ready(cb) {
	if( document.readyState != 'loading' ) {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

ready(function(){ 
	document.querySelectorAll('.fm-video-thumbnail').forEach(function(a){ 

		// set thumbnail preview start time
		var video = a.querySelector("video");
		var start = parseFloat(video.getAttribute("data-start")); 
		var setStart = function(e) {
			video.currentTime = start; 
			video.pause();
			video.removeEventListener('canplaythrough', setStart); 
		}; 
		video.addEventListener('canplaythrough', setStart); 
	}); 

	document.querySelectorAll(".fm-episodes-item").forEach(function(a){ 
		var video = a.querySelector("video");
		// play/pause on hover for thumbnails
		a.addEventListener('mouseover', function(e){ video.play(); });
		a.addEventListener('mouseleave', function(e){ video.pause(); }); 
	});

	// swap for mobile collage looping video
	// TODO: This should be moved to an episodes.js for release2
	var collageVideo = document.querySelector(".fm-hero-video video")
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
	var episodeIndex = episodeItems.length - videosShown;
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
			[nextArrow, prevArrow].forEach((a) => { a.style.display = "none"; }); 
		}
		else {
			var mo = 20 * (episodeIndex); // margin offset, to account for the 20px margin in between each item
			if(episodeIndex == 0) mo = 0; // ignore if we're at the first item, otherwise the math is confused

			if(window.outerWidth > 1440)
				episodeItemContainer.style.left = parseInt(-episodeIndex * 390 - mo).toString() + "px";
			else if(window.outerWidth > 768)
				episodeItemContainer.style.left = `calc((33.33vw - 46px) * ${-episodeIndex} - ${mo}px)`;
			else if(window.outerWidth > 480)
				episodeItemContainer.style.left = `calc((50vw - 50px) * ${-episodeIndex} - ${mo}px)`; 

			episodeItemContainer.style.transition = "left ease-in-out 0.25s";

			setTimeout(() => {
				episodeItemContainer.style.transition = "none";
				var videosShown = window.outerWidth > 768 ? 3 : 2;
				var rect = episodeItems[episodeIndex].querySelector("video").getBoundingClientRect(); 
				var lastIndex = Math.min(episodeCount-1, episodeIndex+(videosShown-1));
				var endRect = episodeItems[lastIndex].querySelector("video").getBoundingClientRect(); 
				var top = parseInt(rect.y + rect.height / 2.0 - 24).toString() + "px"; 
				var left = parseInt(rect.x - 20).toString() + "px";
				var right = parseInt(endRect.right - 20).toString() + "px";
				[nextArrow, prevArrow].forEach((a) => { 
					a.style.top = top;
				}); 

				prevArrow.style.left = left;
				nextArrow.style.left = right;

				prevArrow.style.display = (episodeIndex > 0) ? "flex" : "none";
				nextArrow.style.display = (episodeIndex <= episodeCount - videosShown - episodeIndex) ? "flex" : "none"; 
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
			document.querySelectorAll("iframe").forEach(function(iframe){
				iframe.src = iframe.src;
			});
		}
	});
});