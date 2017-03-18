// far-reaching programs which depend on many modules.
const ffmpeg = require('./ffmpeg.js')
const layout = require('./layout.js')
const $ = require('jQuery');
const {dialog} = require('electron').remote
// returns the spawned child process.
module.exports = {};

(function(exports) {
  var ffmpeg_proc = null;

  exports.start = function() {
    if(ffmpeg_proc != null) {
      console.log("Stream is still running.");
      return ffmpeg_proc;
    }

    var video = $("#video_device").val(),
        audio = $("#audio_device").val(),
        destination = $("#output_stream").val();

    ffmpeg_proc = ffmpeg.stream(video, audio, destination);

    return ffmpeg_proc;
  }

  exports.stop = function() {
    if(ffmpeg_proc != null) {
      ffmpeg_proc.kill();
      console.log("Killed");

      ffmpeg_proc = null;
    } else {
      console.log("Proc is null");
    }
  }
})(module.exports);


module.exports.getFile = function(container) {
  $(container).val(dialog.showOpenDialog({properties: ['openFile']}));
}
