chrome.app.runtime.onLaunched.addListener(function() {
  var callback = function (win) {
    win.maximize();
  };

  chrome.app.window.create('app.html', {
    id: 'thinreports-editor',
    state: 'maximized',
    outerBounds: {
      minWidth: 800,
      minHeight: 600
    }
  }, callback);
});
