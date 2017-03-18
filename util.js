// far-reaching programs which depend on many modules.
const ffmpeg = require('./ffmpeg.js')
const layout = require('./layout.js')
const $ = require('jQuery');
var ffmpeg_proc = null;


function startStream() {
  var video = $("#video_device").val(),
      audio = $("#audio_device").val(),
      destination = $("#output_stream").val();

  ffmpeg_proc = ffmpeg.stream(video, audio, destination);
}

module.exports = {
  startStream: startStream
};
