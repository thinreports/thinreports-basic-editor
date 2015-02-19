chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app.html', {
    id: 'thinreports-editor',
    outerBounds: {
      left: 0,
      top: 0,
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 600
    }
  });
});
