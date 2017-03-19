const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const $ = require('jQuery');
const os = require('os');


function displayDevices(video_cont, audio_cont, cb=null) {
  listFFMPEGDevices(function(devices) {
    var vlist = $(video_cont);
    var alist = $(audio_cont);
    alist.html("");
    vlist.html("");

    devices.forEach(function(e) {
      let value = "<option value=\"" + e + "\">" + e + "</option>";
      alist.append(value);
      vlist.append(value);
    });

    if(cb) { cb(); }
  });
}

// cb takes (array of device names)
function listFFMPEGDevices(cb) {
  listDevices(function(output) {
    var deviceregexmac = /\[([0-9]+)\]\s(.+)/g;
    var deviceregexwin = /()"([A-Za-z0-9\- \(\)]+)"/g;
    var deviceregex = null;
    var lastNumber = -1;
    var devices = [];

    var plat = os.platform();
    console.log(plat);

    if(plat == "darwin") {
      deviceregex = deviceregexmac;
    } else if(plat == "win32") {
      deviceregex = deviceregexwin;
    }

    var match = deviceregex.exec(output);
    while(match != null) {
      devices.push(match[2]);

      match = deviceregex.exec(output);
    }

    cb(devices);
  });
}

// cb takes output
function listDevices(cb) {
  var plat = os.platform();
  var ffmpeg_path = $("#ffmpeg_path").val();
  console.log(`${ffmpeg_path}`);

  if(plat == "darwin") {
    exec("ffmpeg -v info -f avfoundation -list_devices true -i \"\"", function(error, output, code) {
      cb(error);
    });
  } else if(plat == "win32") {
    let ffmpeg = $("#ffmpeg_path").val();
    console.log(`FFMPEG PATH: ${ffmpeg}`);

    exec(`${ffmpeg} -list_devices true -f dshow -i dummy`, function(error, output, code) {
      $("#pane_log_content").append(`ffmpeg probe stdout: <pre>${output}</pre><br>`);
      $("#pane_log_content").append(`ffmpeg probe stderr: <pre>${error}</pre><br>`);
      cb(error);
    });
  }
}

// returns ffmpeg
function stream(video_device, audio_device, destination) {
  // TODO platform / custom ffmpeg
  var ffmpeg = null;
  var plat = os.platform();

  if(plat == "darwin") {
    ffmpeg = spawn("ffmpeg", [
      "-f", "avfoundation",
      "-framerate", "30", // ???????
      "-i", video_device,
      // "-vcodec", "libx264",
      // "-tune", "nolatency",
      "-f", "flv", destination
    ]);
  } else if(plat == "win32") {
    ffmpeg = $("#ffmpeg_path").val();
    console.log(`FFMPEG PATH: ${ffmpeg}`);
  }

  ffmpeg.stdout.on('data', function(data) {
    $("#pane_log_content").append(`${data}<br />`);
  });

  ffmpeg.stderr.on('data', function(data) {
    let msg = `ERROR: ${data}`;

    $("#pane_log_content").append(`${msg}<br />`);
  });

  ffmpeg.on('close', function(code) {
    let msg = `ffmpeg exited with code '${code}'`;

    $("#pane_log_content").append(`${msg}<br />`);
  });

  return ffmpeg;
}

module.exports = {
  displayDevices: displayDevices,
  stream: stream
};
