function ready(cb) {
	if( document.readyState != 'loading' ) {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

ready(function(){ 
	document.querySelectorAll('.fm-video-thumbnail').forEach(function(a){ 
		a.addEventListener('mouseover', function(e){ 
			a.querySelector('iframe').contentWindow.postMessage({ method: 'play'}, '*'); 
		});
		a.addEventListener('mouseleave', function(e){
			a.querySelector('iframe').contentWindow.postMessage({ method: 'pause'}, '*'); 
		}); 
	}); 

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