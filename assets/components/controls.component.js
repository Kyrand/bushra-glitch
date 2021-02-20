AFRAME.registerComponent('play-pause', {
  init: function () {
    var myVideo = document.querySelector('#html-video');

    var videoControls = document.querySelector('#videoControls');
    this.el.addEventListener('click', function () {

      var videoSync = document.querySelector('[video-sync]');
      if (myVideo.paused) {
        // Play
      	// myVideo.play();
        videoSync.setAttribute('video-sync', 'paused', false);
      	videoControls.setAttribute('src', '#pause');
      } else {
        // Pause
      	// myVideo.pause();
        videoSync.setAttribute('video-sync', 'paused', true);
      	videoControls.setAttribute('src', '#play');
      }
    });
  }
});
