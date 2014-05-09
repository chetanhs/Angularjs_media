audioApp.directive('ngControls', function ($timeout) {
  return {
    restrict: 'E',
    link: function (scope, elm, attrs) {

      scope.getControlText = function () {
        return scope.audio && scope.audio.inPlay ? "Pause" : "Play";
      }

      var diff, min, sec;
      scope.handler = function(){
        self = this;
        $timeout(function(){
          scope.audio.playPos = Math.floor(self.currentTime/self.duration * 100) +'%';
          diff = self.duration - self.currentTime;
          min = Math.floor(diff/ 60);
          sec = Math.floor(diff - (min * 60));
          //Generates time in the format of -min:sec. Example, -5:46
          scope.audio.timeLeft = ((min == 0 && sec == 0) ? "": "-")+min+":"+(sec < 10 ? ('0'+sec) : sec);
        }, 0);
      };

      scope.togglePlayState = function (obj, event) {
        event.stopPropagation();

        //find the currently playing audio (if any) and stop playback
        var audioInPlay = _.find(scope.audios, function(a){ return a.inPlay; });
        if(audioInPlay){
          audioInPlay.dom.pause();
          audioInPlay.inPlay = false;
          $(audioInPlay.dom).unbind("timeupdate", scope.handler);
        }

        //Play the selected audio
        if(obj.audio != audioInPlay){
          if(!obj.audio.dom){
            obj.audio.dom = $(event.target).parents(".audio_holder").find("audio")[0];
          }
          obj.audio.dom.play();
          obj.audio.inPlay = true;
          $(obj.audio.dom).bind("timeupdate", scope.handler);
        }

      }
    },
    templateUrl: 'public/views/controls.html'
  }
})