// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
  
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var yt_player = [],
  playButton = [];

// 2. This function enables you to use the API on your page
var iframeCount = $('iframe.youtube');
iframeCount.each(function(index) {
  $(this).siblings('.play-btn').attr('id', 'ytposter-' + index);
  $(this).attr('id', 'ytplayer-' + index);
});
var episodePlaceholderTeaser = document.querySelector(".fm-episode-header-video");
var videos = episodePlaceholderTeaser.querySelectorAll(".fm-hero-video");
var playButton = episodePlaceholderTeaser.querySelector(".fm-big-play-button");
var placeholder = document.querySelector(".fm-hero-video.preview");
var vimeoVideo = document.querySelector(".fm-hero-video.vimeo");
var youtubeVideo = document.querySelector(".fm-hero-video.youtube");
var iframe = document.querySelector("iframe.youtube"); 
window.onYouTubeIframeAPIReady = function() {
    $('iframe.youtube').each(function(index, value) {
      yt_player[index] = new YT.Player(value.id, {
        events: {
          'onReady': onPlayerReady(index, value),
          'onStateChange': YTStateChange 
          
        }
      });
      function onPlayerReady(index, value) {
        if(episodePlaceholderTeaser !== null) {
            episodePlaceholderTeaser.addEventListener("click", function(e) { 
                youtubeVideo.style.display = "block";
                placeholder.style.display = "none";
                playButton.style.display = "none";
    
                        yt_player[index].mute();
                        setTimeout(
                            function() {
                                yt_player[index].unMute();
                        }, 800);
                    yt_player[index].playVideo();
                    if (/Android|iPhone/i.test(navigator.userAgent)) {fullScreen();}
                });
            }
        }
        function fullScreen() {

          var e = document.getElementById('ytplayer-0');
          if (e.requestFullscreen) {
              e.requestFullscreen();
          } else if (e.webkitRequestFullscreen) {
              e.webkitRequestFullscreen();
          } else if (e.mozRequestFullScreen) {
              e.mozRequestFullScreen();
          } else if (e.msRequestFullscreen) {
              e.msRequestFullscreen();
          }
      }
      
      function YTStateChange(event) {
        if (/Android|iPhone/i.test(navigator.userAgent)) {
          switch(event.data) {
              case -1:
                  //fullScreen();
              break;
              case 1:
                fullScreen();
              break;
              case 2:
                document.exitFullscreen();
              break;
              default:
              break;
          }
          
          // This checks if the current device is in fact mobile
        }
      }
    });
  } 
    
const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));

window.addEventListener('click', ev => {
  const elm = ev.target;
  if (triggers.includes(elm)) {
    const selector = elm.getAttribute('data-target');
    collapse(selector, 'toggle');
    elm.style.display = "none";
  }
}, false);


const fnmap = {
  'toggle': 'toggle',
  'show': 'add',
  'hide': 'remove' };

const collapse = (selector, cmd) => {
  const targets = Array.from(document.querySelectorAll(selector));
  targets.forEach(target => {
    target.classList[fnmap[cmd]]('show');
  });
};