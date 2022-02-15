function ready(cb) {
	if( document.readyState != 'loading' ) {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

function smoothstep(e1, e2, v) {
	var val = (v - e1) / (e2 - e1);
	val = Math.min(Math.max(val, 0.0), 1.0);
	return val * val * (3.0 - 2.0 * val);
}

ready(function(){
	var photoSections = document.querySelectorAll("section.bhm-photo img");
	var photoCovers = document.querySelectorAll(".bhm-photo-cover");
	var footer = document.querySelector(".bhm-footer");
	var header = document.querySelector(".bhm-video");

	var isFooterIntersecting = false;
	var isHeaderIntersecting = false;

	var stickySection = null;
	var activeCover = null;

	var callback = function(entries, _observer) {
		// stickySection = null;
		// activeCover = null;
		for(var i = 0; i < entries.length; i++) {
			if(entries[i].isIntersecting && entries[i].target !== footer && entries[i].target !== header) {
				stickySection = entries[i].target.previousElementSibling;
				activeCover = entries[i].target;
			}

			isFooterIntersecting = (entries[i].isIntersecting && entries[i].target === footer);
			isHeaderIntersecting = (entries[i].isIntersecting && entries[i].target === header);
		}

		if(isHeaderIntersecting) {
			stickySection = null;
			activeCover = null;
		}
	}

	var observer = new IntersectionObserver(callback, {
		root: null,
		rootMargin: "0px",
		threshold: 0
	});

	observer.observe(footer);
	observer.observe(header);
	for(var i = 0; i < photoCovers.length; i++) {
		observer.observe(photoCovers[i]);
	}

	var frame = function() {
		if(header.getBoundingClientRect().y > 0) {
			stickySection = null;
			activeCover = null;
		}
		for(var i = 0; i < photoSections.length; i++) {
			if(photoSections[i] !== stickySection) {
				photoSections[i].style.transform = "translate(0,0)";
				photoSections[i].style.opacity = "1.0";
			}
			if(photoCovers[i] !== activeCover) {
				photoCovers[i].style.opacity = "1.0";
			}
		}
		if(stickySection) {
			stickySection.style.transform = "none";
			var rect = stickySection.getBoundingClientRect();
			var offset = -rect.y;
			if(activeCover) {
				var coverRect = activeCover.getBoundingClientRect();
				if(coverRect.y < 0)
					offset += coverRect.y;
			}
			stickySection.style.transform = "translate(0, " + Math.round(offset) + "px)";

			// var stickyIndex = photoSections.indexOf(stickySection);
			// if(stickyIndex > 0) {
			// 	var previousSection = photoSections[stickyIndex-1];
			// 	var previousRect = previousSection.getBoundingClientRect();
			// 	previousSection.style.transform = "translate(0, " + (Math.round(-(previousRect.y+previousRect.height)) + "px)";
			// }
		}

		if(activeCover) {
			var rect = activeCover.getBoundingClientRect();
			var scrollAmount = Math.sin(rect.y / window.innerHeight);
			var fadeIn = smoothstep(0.6, 0.4, scrollAmount);
			var fadeOut = smoothstep(1.0, 0.8, 1.0 - scrollAmount);
			activeCover.style.opacity = Math.min(fadeOut, fadeIn).toString();
			if(isFooterIntersecting){
				stickySection.style.opacity = "0.0";
			}
			else {
				var opacity = smoothstep(0.4, 1.0, scrollAmount);
				opacity = Math.max(0.4, opacity);
				stickySection.style.opacity = opacity.toString();
			}
		}
	}

	window.addEventListener("scroll", function(){
		this.requestAnimationFrame(frame);
	})
});