/**
 * Responsibilities:
 * - managing <video> tag
 * - exposing simple, but full CORE API for managing of playback and parameters
 * - should not contain UI code
 */

var lgePlayer = {
  Events: {
    Initialization: new Core.EventPoint(),
    BufferingStart: new Core.EventPoint(),
    BufferingProgress: new Core.EventPoint(),
    BufferingEnd: new Core.EventPoint(),
    Start: new Core.EventPoint(),
    Pause: new Core.EventPoint(),
    Resume: new Core.EventPoint(),
    Progress: new Core.EventPoint(),
    ChangePosition: new Core.EventPoint(),
    End: new Core.EventPoint(),
    UserStop: new Core.EventPoint(),
    NothingToPlay: new Core.EventPoint()
  },
  Requests: {
    DrawPlayer: new Core.RequestPoint()
  },
  
  tag_video: null,
  init: function(src, autoplay) {
    new lgePlayer.Requests.DrawPlayer({
      setVideoTag: function(tag_video) {
        lgePlayer.tag_video = tag_video;
        lgePlayer.tag_video.src = src;
        
        if(autoplay) {
          lgePlayer.play();
        } else {
          if(lgePlayer.tag_video.nodeName != 'VIDEO') {
            lgePlayer.tag_video.autoStart = false;
          }
        }
        
        new lgePlayer.Events.Initialization();
      }
    });
  },
  _netCastPlayState: 0,
  _netCastHelperInterval: null,
  initEvents: function() {
    Core.CatchEvent(lgePlayer.Events.Initialization);
    console.log(lgePlayer.tag_video.nodeName);
    if(lgePlayer.tag_video.nodeName == 'VIDEO') {
      lgePlayer.tag_video.addEventListener('ended', function() {new lgePlayer.Events.End});
      lgePlayer.tag_video.addEventListener('timeupdate', function() {new lgePlayer.Events.Progress({percent: lgePlayer.tag_video.currentTime / lgePlayer.tag_video.duration});});
      lgePlayer.tag_video.addEventListener('progress', function() { console.log('buffering'); if(lgePlayer.tag_video.buffered.length) { new lgePlayer.Events.BufferingProgress({percent: lgePlayer.tag_video.buffered.end(0) / lgePlayer.tag_video.duration}); } });
    } else {
      lgePlayer.tag_video.onPlayStateChange = function() {
        clearInterval(this._netCastHelperInterval);
        switch(lgePlayer.tag_video.playState) {
          case 1: this._netCastHelperInterval = setInterval(function() { new lgePlayer.Events.Progress({percent: lgePlayer.tag_video.playPosition / lgePlayer.tag_video.playTime}); }, 250); break;
        }
        lgePlayer._netCastPlayState = lgePlayer.tag_video.playState;
      };
    }
  },
  play: function() {
    CatchEvent(lgePlayerUi.Events.Click.Play);
    if((lgePlayer.tag_video.nodeName == 'VIDEO' && lgePlayer.tag_video.src != 'about:blank') || (lgePlayer.tag_video.nodeName != 'VIDEO' && lgePlayer.tag_video.playState !== 0)) {
      (function catchStartPlay(){
        if(lgePlayer.tag_video.nodeName == 'VIDEO' && lgePlayer.tag_video.readyState == 4 || lgePlayer.tag_video.playState < 3) {
          console.log('try to play');
          if(lgePlayer.tag_video.nodeName == 'VIDEO') {
            if(lgePlayer.tag_video.paused) {
              lgePlayer.tag_video.play();
              new lgePlayer.Events.Start();
            } else {
              lgePlayer.tag_video.play();
              new lgePlayer.Events.Resume();
            }
          } else {
            lgePlayer.tag_video.play();
            new lgePlayer.Events.Start();
          }
        } else {
          console.log('readyState: ', lgePlayer.tag_video.readyState, 'huaaa');
          console.log(lgePlayer.tag_video.readyState);
          setTimeout(catchStartPlay, 200);
        }
      })();
    } else {
      new lgePlayer.Events.NothingToPlay;
    }
  },
  pause: function() {
    CatchEvent(lgePlayerUi.Events.Click.Pause);
    lgePlayer.tag_video.pause();
    new lgePlayer.Events.Pause();
  },
  stop: function() {
    CatchEvent(lgePlayerUi.Events.Click.Stop, Keys.Next, lgePlayerUi.Events.Click.Next);
    if(lgePlayer.tag_video.nodeName == 'VIDEO') {
      lgePlayer.tag_video.src = "about:blank";
    } else {
      lgePlayer.tag_video.stop();
    }
    new lgePlayer.Events.UserStop();
  },
  setPosition: function() {
    var event = CatchEvent(lgePlayerUi.Events.Change.Position);
    lgePlayer.tag_video.currentTime = lgePlayer.tag_video.duration * event.percent;
    new lgePlayer.Events.ChangePosition();
  }
};