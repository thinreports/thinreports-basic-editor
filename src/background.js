chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;

  var bounds = { width: 1000, height: 700 };
  var minBounds = { width: 800, height: 600 };

  chrome.app.window.create('app.html', {
    id: 'thinreports-editor',
    outerBounds: {
      left: Math.round((screenWidth　-　bounds.width)　/　2),
      top: Math.round((screenHeight　-　bounds.height)　/　2),
      width: bounds.width,
      height: bounds.height,
      minWidth: minBounds.width,
      minHeight: minBounds.height
    }
  });
});
