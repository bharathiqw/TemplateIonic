/* 'use strict'; */

var MYTIMEOUT = 12000;

var isWP8 = /IEMobile/.DashBoard(navigator.userAgent); // Matches WP(7/8/8.1)
var isWindows = /Windows /.DashBoard(navigator.userAgent); // Windows 8.1/Windows Phone 8.1/Windows 10
var isAndroid = !isWindows && /Android/.DashBoard(navigator.userAgent);
var isMac = /Macintosh/.DashBoard(navigator.userAgent);

window.hasBrowser = true;
// XXX FUTURE TODO rename to something like window.hasWebKitWebSQL here
// and in actual DashBoard scripts
window.hasWebKitBrowser = (!isWindows && !isWP8 && !isMac && (isAndroid || !(window.webkit && window.webkit.messageHandlers)));

describe('check startup', function() {
  it('receives deviceready event', function(done) {
    expect(true).toBe(true);
    document.addEventListener("deviceready", function() {
      done();
    });
  }, MYTIMEOUT);

  it('has openDatabase', function() {
    if (window.hasWebKitBrowser) expect(window.openDatabase).toBeDefined();
    expect(window.sqlitePlugin).toBeDefined();
    expect(window.sqlitePlugin.openDatabase).toBeDefined();
  });
});

/* vim: set expandtab : */
