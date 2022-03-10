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
	var photoSections = document.querySelectorAll("section.bhm-photo");
	var photoCovers = document.querySelectorAll(".bhm-photo-cover");
	var photoFades = document.querySelectorAll(".bhm-photo-fade")
	var photoImages = document.querySelectorAll(".bhm-photo-image")
	var footer = document.querySelector(".bhm-last-footer");
	var header = document.querySelector(".bhm-video");
	var noroll = document.querySelector(".bhm-noroll");

	// Play vimeo video when pressing the play button
	var videoPlaceholders = document.querySelectorAll("img.bhm-video-placeholder");
	for(var i = 0; i < videoPlaceholders.length; i++) {
		videoPlaceholders[i].addEventListener("click", function(e) {
			e.preventDefault();
			e.target.style.display = "none";
			e.target.previousElementSibling.style.display = "none";
			e.target.nextElementSibling.style.display = "block";
			e.target.nextElementSibling.querySelector("iframe").contentWindow.postMessage({method:"play"}, "*"); 
		})
	}

	var isFooterIntersecting = false;
	var isHeaderIntersecting = false;
	var isNorollIntersecting = false;

	var previousScrollY = 0;
	var scrollDelta = 0;

	for(var i = 0; i < photoSections.length; i++) {
		// photoSections[i].style.backgroundImage = "url(" + photoSections[i].dataset.src + ")";
		photoImages[i].src = photoSections[i].dataset.src;
	}

	var frame = function() {
		scrollDelta = window.scrollY - previousScrollY;
		previousScrollY = window.scrollY;

		var footerY = footer.getBoundingClientRect().y;
		var norollY = noroll.getBoundingClientRect().y + noroll.clientHeight;
		var headerY = header.getBoundingClientRect().y;
		isNorollIntersecting = (norollY < window.innerHeight);
		isHeaderIntersecting = (headerY > 0);
		isFooterIntersecting = (footerY < window.innerHeight);

		for(var i = 0; i < photoSections.length; i++) {
			var rect = photoCovers[i].getBoundingClientRect();
			// photoImages[i].style.left = Math.round(-window.innerWidth / 8.0) + "px";
			if(rect.y <= 0 && rect.bottom > window.innerHeight)  {
				photoImages[i].style.position = "fixed";
				photoImages[i].style.top = "0";

				// If iOS wasn't late to the party with background-attachment:fixed then this would work
				// Alas, we are doing things the weird way
				// photoSections[i].style["background-attachment"] = "fixed";

			}
			else {
				var imageY = photoImages[i].getBoundingClientRect().y;
				photoImages[i].style.position = "absolute";
				// This weirdness is because of getting scroll info is messed up.
				// If we're scrolling up we want '<', but if we're scrolling down we want '<='
				// Without this there is a single frame flicker
				if((scrollDelta < 0 && imageY < 0) || (scrollDelta > 0 && imageY <= 0))
					photoImages[i].style.top = "50%";
				else 
					photoImages[i].style.top = "0";

				// If iOS wasn't late to the party with background-attachment:fixed then this would work
				// photoSections[i].style["background-attachment"] = "scroll";

			}

			// photoCovers[i].innerText = window.scrollY;


			if(rect.y <= window.innerHeight && rect.bottom > 0) {
				var scrollAmount = (-rect.y / window.innerHeight) * 2.0 - 1.0;
				var fadeIn = smoothstep(0.1, 0.3, scrollAmount);
				var fadeOut = fadeIn;//smoothstep(1.1, 1.0, scrollAmount); // leaving this in on the off chance we want to re-implement
				// photoCovers[i].innerText = fadeIn.toString() + " :: " + fadeOut.toString() + " -- " + scrollAmount.toString();
				photoCovers[i].style.opacity = Math.min(fadeOut, fadeIn).toString();
				if(isHeaderIntersecting) {
					photoImages[i].style.opacity ="1.0";
				}
				else if(isFooterIntersecting){
					photoImages[i].style.opacity ="0.4";
				}
				else if(isNorollIntersecting){
					photoImages[i].style.opacity ="1.0";
				}
				else {
					var opacity = smoothstep(0.4, -1.0, scrollAmount);
					opacity = Math.max(0.4, opacity);
					photoImages[i].style.opacity = opacity.toString();
				}
			}
			else {
				photoImages[i].style.opacity = "1.0";
			}
		}
	}

	window.addEventListener("scroll", function(){
		this.requestAnimationFrame(frame);
	})
});