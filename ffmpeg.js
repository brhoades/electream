const exec = require('child_process').exec;
const $ = require('jQuery');
const os = require('os');

function displayDevices(video_cont, audio_cont) {
  listFFMPEGDevices(function(video, audio) {
    var vlist = $(video_cont);
    var alist = $(audio_cont);

    video.forEach(function(e) {
      vlist.append("<option value=\"" + e + "\">" + e + "</option>");
    });

    audio.forEach(function(e) {
      alist.append("<option value=\"" + e + "\">" + e + "</option>");
    });
  });
}

// cb takes (array of video device names, array of audio device names)
function listFFMPEGDevices(cb) {
  listDevices(function(output) {
    var deviceregex = /\[([0-9]+)\]\s(.*)/g;
    var match = deviceregex.exec(output);
    var lastNumber = -1;
    var video = [];
    var audio = [];

    while(match != null) {
      // ffmpeg provides numbers which reset on audio devices. Once we see an old number,
      // we're doing audio.
      if(lastNumber <= match[1] && audio.length == 0) {
        video.push(match[2]);
        lastNumber = match[1];
      } else {
        audio.push(match[2]);
      }

      match = deviceregex.exec(output);
    }

    cb(video, audio);
  });
}

// cb takes output
function listDevices(cb) {
  var plat = os.platform();

  if(plat == "darwin") {
    exec("ffmpeg -v info -f avfoundation -list_devices true -i \"\"", function(error, output, code) {
      cb(error);
    });
  } else if(plat == "win32") {
    exec("ffmpeg -list_devices true -f dshow -i dummy", function(error, output, code) {
      cb(error);
    });
  }
}

module.exports = {
  displayDevices: displayDevices
};
