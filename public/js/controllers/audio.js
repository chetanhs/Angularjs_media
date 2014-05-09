audioApp.controller('AudioCtrl', function ($scope, $timeout) {
	$scope.audios = [
    {url: "public/resources/audio/Bubbly.mp3", name: "Bubbly"},
    {url: "public/resources/audio/Rapture.mp3", name: "Rapture"},
  ];

  $scope.togglePlayState = function (obj, event) {
    event.stopPropagation();
    //find the currently playing audio (if any) and stop playback
    var audioInPlay = _.find($scope.audios, function(a){ return a.inPlay; });
    if(audioInPlay){
      audioInPlay.dom.pause();
      audioInPlay.inPlay = false;
      $(audioInPlay.dom).unbind("timeupdate", handler);
    }

    if(obj.audio != audioInPlay){
      //Play the selected audio
      if(!obj.audio.dom){
        obj.audio.dom = $(event.target).parents(".audio_holder").find("audio")[0];
      }
      obj.audio.dom.play();
      $scope.activeAudio = obj.audio;
      obj.audio.inPlay = true;
      $(obj.audio.dom).bind("timeupdate", handler);
    }

  }

  $scope.getControlText = function () {
    return this.audio && this.audio.inPlay ? "Pause" : "Play";
  }

  var diff, min, sec;

  handler = function(){
    self = this;
    $timeout(function(){
      $scope.activeAudio.playPos = Math.floor(self.currentTime/self.duration * 100) +'%';
      diff = self.duration - self.currentTime;
      min = Math.floor(diff/ 60);
      sec = Math.floor(diff - (min * 60));
      //Generates time in the format of -min:sec. Example, -5:46
      $scope.activeAudio.timeLeft = ((min == 0 && sec == 0) ? "": "-")+min+":"+(sec < 10 ? ('0'+sec) : sec);
    }, 0);
  };

});