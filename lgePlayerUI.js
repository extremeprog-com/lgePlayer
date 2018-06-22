/**
 * Responsibilities:
 * - draw Ui
 * - handling clicks and keys
 * - effects
 * - calculating button sizes
 * - fullscreen mode
 */

var lgePlayerUi = {
  Events: {
    Click: {
      Play: new Core.EventPoint(),
      Pause: new Core.EventPoint(),
      Stop: new Core.EventPoint(),
      Rewind: new Core.EventPoint(),
      FullScreen: new Core.EventPoint(),
      Options: new Core.EventPoint(),
      Next: new Core.EventPoint(),
      Back: new Core.EventPoint()
    },
    Go: {
      FullScreen: new Core.EventPoint(),
      NonFullScreen: new Core.EventPoint()
    },
    Change: {
      Position: new Core.EventPoint(),
      Buffering: new Core.EventPoint()
    }
  },
  playerContainer: null,
  fullScreenMode: false,
  createVideoTag: function() {
    var request = CatchRequest(lgePlayer.Requests.DrawPlayer);
    $(this.playerContainer).html(request.mediaObject || '<video width=100% height=100% id="_video_player" class="video"></video>');
    request.setVideoTag(document.getElementById("_video_player"));
  },
  goFullScreen: function() {
    CatchEvent(lgePlayerUi.Events.Click.FullScreen);
    console.log('lgePlayerUi.Events.Click.FullScreen:goFullScreen', this.fullScreenMode);
    if(!this.fullScreenMode) {
      $(this.playerContainer).addClass('fullscreen_container').removeClass('nonfullscreen_container');
      setTimeout(function(){ lgePlayerUi.fullScreenMode = true; }, 0);
      new lgePlayerUi.Events.Go.FullScreen();
    }
  },
  leaveFullScreen: function() {
    CatchEvent(lgePlayerUi.Events.Click.FullScreen, lgePlayerUi.Events.Click.Back, Keys.Back);
    console.log('lgePlayerUi.Events.Click.FullScreen:leaveFullScreen', this.fullScreenMode);
    if(this.fullScreenMode) {
      $(this.playerContainer).addClass('nonfullscreen_container').removeClass('fullscreen_container');
      setTimeout(function(){ lgePlayerUi.fullScreenMode = false; }, 0);
      new lgePlayerUi.Events.Go.NonFullScreen();
    }
  },
  addPlayingClass: function() {
    CatchEvent(lgePlayer.Events.Start, lgePlayer.Events.BufferingStart, lgePlayer.Events.Resume);
    $(this.playerContainer).addClass('playing');
  },
  removePlayingClass: function() {
    CatchEvent(lgePlayer.Events.Pause, lgePlayer.Events.End, lgePlayer.Events.UserStop);
    $(this.playerContainer).removeClass('playing');
  },
  updateProgressBall: function() {
    var event = CatchEvent(lgePlayer.Events.Progress, lgePlayer.Events.End, lgePlayer.Events.UserStop);
    $('#progressBall').css('left', (-3.5 + (87.5 + 3.5)*(event.percent || 0)) + '%');
  },
  showOptions: function() {
    CatchEvent(lgePlayerUi.Events.Click.Options);
    if (window.NetCastLaunchQMENU) {
      window.NetCastLaunchQMENU();
    }
  },
  _hideControlsTimeout: null,
  showHideControls: function() {
    CatchEvent(Ui.FocusChanged);
    if($('.select', this.playerContainer).length) {
      $('[data-navblock="player"]').css('opacity', '');
      if(this._hideControlsTimeout) {
        clearTimeout(this._hideControlsTimeout);
      }
      this._hideControlsTimeout = setTimeout(function() {
        $('[data-navblock="player"]').css('opacity', '0');
      }, 4000);
    }
  },
  restoreFocusOnPlayHide: function() {
    CatchEvent(lgePlayer.Events.Start, lgePlayer.Events.Resume);
    if($('.select', this.playerContainer).length) {
      Ui.moveFocus('player', 'player-pause');
    }
  },
  restoreFocusOnPauseHide: function() {
    CatchEvent(lgePlayer.Events.End, lgePlayer.Events.UserStop, lgePlayer.Events.Pause);
    if($('.select', this.playerContainer).length) {
      Ui.moveFocus('player', 'player-play');
    }
  },
  restoreFocusOnLeaveFullScreen: function() {
    CatchEvent(lgePlayerUi.Events.Go.NonFullScreen);
    if($('.select', this.playerContainer).length) {
      Ui.moveFocus('player', 'player-fullscreen');
    }
  },
  showBuffering: function() {
    var event = CatchEvent(lgePlayer.Events.BufferingProgress);
    $("#progressBuffer").addClass("progress progressBuffer");
    $("#progressBuffer").css("width", event * 100 + '%');
  },
  drawButtons: function() {
    CatchEvent(lgePlayer.Requests.DrawPlayer);
    console.log('buttons');
    $(this.playerContainer).append(
      '<div class="playerBottom" data-navblock="player">' +
      '    <div class="playerButtonLayout">' +
      '        <div class="progressBarLayout">' +
      '            <div class="progressBar">' +
      '                <div id="progressBg" class="progress progressBg"></div>' +
      '                <div id="progressBuffer" class="progress progressBuffer" ></div>' +
      '                <div id="progressBarStatus" class="progress progressBarStatus"></div>' +
      '                <div id="progressBarClick" class="progress progressBarClick"></div>' +
      '                <div class="runningTime"> <span id="remainingTime"></span> <span id="totalTime" ></span> </div>' +
      '            </div>' +
      '            <div class="runningMovieInfo">' +
      '                <div class="runningMovieName"> </div>' +
      '            </div>' +
      '       </div>' +
      '       <div id="lgImg_control">' +
      '            <div id="stop" class="ctrlButtonNormal left" data-focus_element="player-stop" data-ui_action="new lgePlayerUi.Events.Click.Stop()">' +
      '                <div class="bottomControlBtn" align="center" >' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_stop_n.png" alt="stopImg" class="stopBtn"/>' +
      '                </div>' +
      '            </div>' +
      '            <div id="play" class="ctrlButtonNormal" data-focus_element="player-play" data-ui_action="new lgePlayerUi.Events.Click.Play()">' +
      '                <div id="playBtn" class="bottomControlBtn" align="center" >' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_play_n.png" alt="playImg"  class="playBtn" align="center" />' +
      '                </div>' +
      '            </div>' +
      '            <div id="pause" class="ctrlButtonNormal" data-focus_element="player-pause" data-ui_action="new lgePlayerUi.Events.Click.Pause()">' +
      '                <div id="playBtn" class="bottomControlBtn" align="center" >' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_pause_n.png" alt="playImg"  class="playBtn" align="center" />' +
      '                </div>' +
      '            </div>' +
      '            <div id="next" class="ctrlButtonNormal" data-focus_element="player-next" data-ui_action="new lgePlayerUi.Events.Click.Next()">' +
      '                <div class="bottomControlBtn" align="center">' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_next_n.png" alt="forwardImg" class="forwardBtn"/>' +
      '                </div>' +
      '            </div>' +
      '            <div id="switchToFullScreenMode" class="ctrlButtonNormal" data-focus_element="player-fullscreen" data-ui_action="new lgePlayerUi.Events.Click.FullScreen()">' +
      '                <div class="bottomControlBtn" align="center">' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_chapter_n.png" alt="screenImg" class="switchToFullScreenModeBtn"/>' +
      '                </div>' +
      '            </div>' +
      '            <div id="option" class="ctrlButtonNormal" data-focus_element="player-option" data-ui_action="new lgePlayerUi.Events.Click.Options()">' +
      '                <div class="bottomControlBtn" align="center">' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_option_n.png" alt="optionImg" class="optionBtn"/>' +
      '                </div>' +
      '            </div>' +
      '            <div id="backbtn" class="ctrlButtonNormal" data-focus_element="player-back" data-ui_action="new lgePlayerUi.Events.Click.Back()">' +
      '                <div class="bottomControlBtn" align="center">' +
      '                    <img src="/lg/lge/ui/images/player_btn_icon/movie_btn_icon_back_n.png" alt="optionImg" class="backBtn"/>' +
      '                </div>' +
      '            </div>' +
      '        </div>' +
      '    </div>' +
      '    <div id="ballCoverage"><div id="progressBall" class="progressBallInitial" > </div></div>' +
      '</div>'
    );
    this.matchButtonSizes();
  },
  matchButtonSizes: function() {
    CatchEvent(lgePlayerUi.Events.Go.FullScreen, lgePlayerUi.Events.Go.NonFullScreen);
    var controlBtnleft = $(this.playerContainer).width();
    $(".playerBottom").css({
      "position": "absolute",
      width: $(this.playerContainer).width() * .99,
      height: $(this.playerContainer).height() * .27,
      top: $(this.playerContainer).height() - $(".playerBottom").height(),
      "border": "none",
      "margin": "auto",
      "display": "block"
    });
    $(".playerBottom").css({
      top: $(this.playerContainer).height() - $(".playerBottom").height(),
      left: ($(this.playerContainer).width() - $(".playerBottom").width()) / 2
    });
    $(".playerButtonLayout").css({
      width: $(this.playerContainer).width() * .975,
      "border": "none",
      "margin": "auto",
      "text-align": "center",
      "display": "block"
    });
    $(".progressBarLayout").css({
      "position": "absolute",
      left: controlBtnleft * .015,
      "border": "none",
      "margin": "auto",
      "padding": "0px",
      "text-align": "center",
      "display": "block"
    });
    $(".progressBar").css({
      "position": "absolute",
      left: controlBtnleft * .015,
      width: $(".progressBarLayout").width(),
      height: $(".progressBarLayout").height() * .63,
      "border": "none",
      "margin": "auto",
      "padding": "0px",
      "text-align": "center",
      "display": "block"
    });
    $(".progress").css({
      "position": "absolute",
      height: $(".progressBar").height() * .10,
      top: ($(".progress").parent().height()) * .85,
      "border": "none",
      "margin": "auto",
      "padding": "0px",
      "text-align": "center",
      "display": "block"
    });
    $(".progressBarClick").css({
      width: $(".progressBg").width(),
      height: "35%",
      top: ($(".progress").parent().height()) * .65,
    });
    $(".runningMovieInfo").css({
      "position": "absolute",
      left: controlBtnleft * .015,
      width: $(".progressBarLayout").width(),
      height: $(".progressBarLayout").height() * .37,
      top: $(".progressBar").height(),
      "border": "none",
      "margin": "auto",
      "padding": "0px",
      "text-align": "center",
      "display": "block"
    });
    $(".runningMovieName").css({
      "font-size": ($(".runningMovieName").height()) * .95 + "px"
    });
    $(".runningTime").css({
      "height": $(".progressBar").height() / 2,
      "margin-top": $(".progressBar").height() / 2,
      "margin-left": $(".progressBar").height() - 10,
      "margin-right": "3%",
      "float": "right",
      "text-align": "right",
      "display": "block",
      "white-space": "nowrap",
      "position": "relative",
      "right": "-0.5%"
    });
    $(".runningTime").css({
      "font-size": ($(".runningTime").height()) * .90 + "px"
    });
    $("#lgImg_control").css({
      "position": "absolute",
      top: ($("#lgImg_control").parent().height()) * .575,
      left: controlBtnleft * .0130,
      "border": "none",
      "margin": "0px",
      "padding": "0px",
      "text-align": "center",
      "display": "block"
    });
    if (($(this.playerContainer).width() == 1280) && ($(this.playerContainer).height == 720)) {
      $("#switchToFullScreenMode").css("display", "none");
      $("#option").css("display", "block");
      $("#lgImg_control").children().each(function (i) {
      });
    }
  },
  displayVideoDuration: function() {
    CatchEvent(lgePlayer.Events.Progress, lgePlayer.Events.Stop);
    var video = document.getElementById('_video_player');
    if (video.duration > 0) {
      $("#remainingTime").text(getTimeFromMS(video.currentTime || video.playPosition/1000));
      $("#totalTime").text(" / " + getTimeFromMS(video.duration || video.playTime/1000));
    } else {
      $("#remainingTime, #totalTime").text("");
    }
    function getTimeFromMS(msec) {
      if(isNaN(msec)) {
        msec = 0;
      }
      var time = Math.round(msec);
      var hours = Math.floor(time / 3600);
      var mins = Math.floor((time % 3600) / 60);
      var secs = Math.floor((time % 3600) % 60);
      if (hours < 10)
        hours = "0" + hours;
      if (mins < 10)
        mins = "0" + mins;
      if (secs < 10)
        secs = "0" + secs;
      return hours + ":" + mins + ":" + secs;
    }
  },
  play: function() {
    Core.CatchEvent(Keys.Play);
    lgePlayer.play();
    Ui.moveFocus('player', 'player-pause')
  },
  pause: function() {
    Core.CatchEvent(Keys.Pause);
    lgePlayer.pause();
    Ui.moveFocus('player', 'player-play')
  },
  stop: function() {
    Core.CatchEvent(Keys.Stop);
    lgePlayer.stop();
    Ui.moveFocus('player', 'player-stop')
  }
};