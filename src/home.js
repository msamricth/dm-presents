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
			console.log("hi");
			a.querySelector('iframe').contentWindow.postMessage({ method: 'play'}, '*'); 
		});
		a.addEventListener('mouseleave', function(e){
			a.querySelector('iframe').contentWindow.postMessage({ method: 'pause'}, '*'); 
		}); 
	}); 
});