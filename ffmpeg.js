const exec = require('child_process').exec;
var $ = require('jQuery');


function displayVideoDevices(container) {
  listVideoDevices(function(video) {
    console.log(video);
    var list = $(container);

    video.forEach(function(e) {
      list.append("<option value=\"" + e + "\">" + e + "</option>");
    });
  });
}

// cb takes array of video device names
function listVideoDevices(cb) {
  listDevices(function(output) {
    var deviceregex = /\[([0-9]+)\]\s(.*)/g;
    var match = deviceregex.exec(output);
    var lastNumber = -1;
    var video = [];

    console.log(output);
    while(match != null) {
      console.log(match);
      // ffmpeg provides numbers which reset on audio devices. Once we see an old number,
      // exit.
      if(lastNumber <= match[1]) {
        video.push(match[2]);
        lastNumber = match[1];
      } else {
        break;
      }

      match = deviceregex.exec(output);
    }

    cb(video);
  });
}

// cb takes output
function listDevices(cb) {
  // TODO: Win/Lin
  // OS X
  exec("ffmpeg -v info -f avfoundation -list_devices true -i \"\"", function(error, output, code) {
    cb(error);
  });
}

module.exports = {
  displayVideoDevices: displayVideoDevices
};
