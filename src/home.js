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

	var items = document.querySelectorAll(".fm-episode");
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

	// swap for mobile collage looping video
	// TODO: This should be moved to an episodes.js for release2
	var collageVideo = document.querySelector(".fm-hero-video:not(.preview) video");
	if(collageVideo) {
		var collageContainer = collageVideo.parentElement;
		var collageVideoSource = collageVideo.querySelector("source");
		var collageBreakpoint = collageVideoSource.getAttribute("data-breakpoint");
		var collageDesktopSrc = collageVideoSource.getAttribute("src");
	}

	var adjustCollageVideoPadding = function() {
		if(collageVideo){
			var aspect = (collageVideo.videoHeight / collageVideo.videoWidth) * 100.0;
			collageContainer.style.paddingBottom = aspect.toString() + "%"; 
			collageVideo.removeEventListener("canplaythrough", adjustCollageVideoPadding);
		}
	};

	var adjustCollageVideo = function() { 
		if(collageVideo) {
			var breakpoint = parseInt(collageBreakpoint);
			var existingSrc = collageVideoSource.getAttribute("src");
			var newSrc;

			if(window.innerWidth <= breakpoint)
				newSrc = collageDesktopSrc.replace(/(https:\/\/.+)([\.]mp4)/gm, "$1Mobile$2");
			else
				newSrc = collageDesktopSrc; 
			
			if(existingSrc != newSrc) { 
				collageVideoSource.setAttribute("src", newSrc);
				collageVideo.addEventListener("canplaythrough", adjustCollageVideoPadding);
				collageVideo.load();
			}
			else {
				adjustCollageVideoPadding();
				collageVideo.addEventListener("canplaythrough", adjustCollageVideoPadding);
			}
		}
	};

	var episodeDetails = document.querySelector(".fm-episode-details");
	var nextArrow = document.querySelector(".fm-episodes-n");
	var prevArrow = document.querySelector(".fm-episodes-p"); 
	var episodeItems = [];

	var handleEpisodeSelectorClick = function(e) {
		var selectedSeason = e.currentTarget.dataset.season;
		if(selectedSeason !== season) {
			setSeason(selectedSeason);
		}
	};

	var episodeSelectors = document.querySelectorAll(".fm-episodes-selector h2")
	for(var i = 0; i < episodeSelectors.length; i++) {
		episodeSelectors[i].addEventListener("click", handleEpisodeSelectorClick); 
	}

	var episodeItemContainer = null;
	function setSeason(_season) {
		season = _season;

		// hide old container
		var episodeItemContainers = document.querySelectorAll(".fm-episodes-hug");
		for(var i = 0; i < episodeItemContainers.length; i++){
			episodeItemContainers[i].style.display = "none";
		}

		episodeItemContainer = document.querySelector(".fm-episodes-hug[data-season='" + season + "']");
		episodeItems = episodeItemContainer.querySelectorAll(".fm-episode");
		realEpisodeItems = [];
		for(var i = 0; i < episodeItems.length; i++) {
			if(episodeItems[i].querySelector("video"))
				realEpisodeItems.push(episodeItems[i]);
		}
		episodeItems = realEpisodeItems;
		episodeCount = episodeItems.length;

		// show new container
		episodeItemContainer.style.display = "inline-flex";

		var seasonLinks = document.querySelectorAll(".fm-episodes-selector h2");
		for(var i = 0; i < seasonLinks.length; i++) {
			var linkSeason = seasonLinks[i].dataset.season;
			if(linkSeason === season) 
				seasonLinks[i].classList.add("active");
			else 
				seasonLinks[i].classList.remove("active");
		}

		episodeIndex = 0;

		handleResize();
	};


	// Attempt to get the season for this page
	var season = "2";
	if(episodeDetails && episodeDetails.dataset.season) {
		season = episodeDetails.dataset.season;
	}

	// Scroll to end, disabled for now
	//var episodeIndex = episodeItems.length - videosShown;
	var episodeIndex = 0;
	if(window.innerWidth <= 480)
		episodeIndex = 0;

	var episodeCount = 0;

	var videosShown = window.innerWidth > 768 ? 3 : 2;



	function moveEpisodeCarousel(direction) { 
		var videosShown = window.innerWidth > 768 ? 3 : 2;
		if(direction < 0)
			episodeIndex = Math.max(0, episodeIndex - videosShown); 
		else
			episodeIndex = Math.min(episodeItems.length - videosShown, episodeIndex + videosShown);

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

	function adjustEpisodeCarouselArrows(delay) { 
		delay = delay | 0;
			var mo = 20 * (episodeIndex); // margin offset, to account for the 20px margin in between each item
			if(episodeIndex == 0) mo = 0; // ignore if we're at the first item, otherwise the math is confused

			if(window.innerWidth > 1440)
				episodeItemContainer.style.left = parseInt(-episodeIndex * 390 - mo).toString() + "px";
			else if(window.innerWidth > 768)
				episodeItemContainer.style.left = "calc((33.33vw - 46px) * " + (-episodeIndex).toString() + " - " + mo + "px)";
			else
				episodeItemContainer.style.left = "calc((50vw - 50px) * " + (-episodeIndex).toString() + " - " + mo + "px)"; 

			episodeItemContainer.style.transition = "left ease-in-out 0.25s";

			setTimeout(function() {
				episodeItemContainer.style.transition = "none";
				var videosShown = window.innerWidth > 768 ? 3 : 2;
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
				nextArrow.style.display = (episodeIndex < episodeCount - videosShown) ? "flex" : "none"; 
			}, delay); 
		

	};

	function handleResize(e) {
		if( collageVideo !== null ) 
			adjustCollageVideo();
		
		adjustEpisodeCarouselArrows(); 
	}; 

	window.addEventListener('resize', function(e){ handleResize(); });
	window.addEventListener('orientationchange', function(e){ handleResize(); });
	window.addEventListener("scroll", adjustEpisodeCarouselArrows );
	
	setSeason(season);

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