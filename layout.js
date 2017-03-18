const $ = require('jQuery');

function show(container) {
  $(".pane-content").each(function(i, e) {
    $(e).hide();
  });

  $(container).show();
}

module.exports = {
  show: show
};
