// far-reaching programs which depend on many modules.
const ffmpeg = require('./ffmpeg.js')
const layout = require('./layout.js')
const $ = require('jQuery');
const {dialog} = require('electron').remote
// returns the spawned child process.
module.exports = {};

(function(exports) {
  exports.proc = null;

  exports.start = function() {
    if(exports.proc != null) {
      console.log("Stream is still running.");
      return exports.proc;
    }

    var video = $("#video_device").val(),
        audio = $("#audio_device").val(),
        destination = $("#output_stream").val();

    exports.proc = ffmpeg.stream(video, audio, destination, function() {
      exports.proc = null;
    });

    return exports.proc;
  }

  exports.stop = function() {
    if(exports.proc != null) {
      exports.proc.kill();
      console.log("Killed");

      exports.proc = null;
    }
    console.log("Proc is null");
  }
})(module.exports);


module.exports.getFile = function(container) {
  $(container).val(dialog.showOpenDialog({properties: ['openFile']}));
}
