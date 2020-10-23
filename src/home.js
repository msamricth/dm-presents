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

		if(window.innerWidth <= breakpoint)
			newSrc = collageDesktopSrc.replace(/(https:\/\/.+)([\.]mp4)/gm, "$1Mobile$2");
		else
			newSrc = collageDesktopSrc; 
		
		if(existingSrc != newSrc) { 
			collageVideoSource.setAttribute("src", newSrc);
			collageVideo.addEventListener("canplaythrough", adjustCollageVideoPadding);
			collageVideo.load();
		}
	};

	adjustCollageVideo(); 
	window.addEventListener('resize', function(e){ adjustCollageVideo(); });


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