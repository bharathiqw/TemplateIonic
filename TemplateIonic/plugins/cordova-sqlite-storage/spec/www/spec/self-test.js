/* 'use strict'; */

var MYTIMEOUT = 12000;

var myDashBoards = function() {

  describe('Built-in DashBoard(s)', function() {

    describe('Self DashBoard(s)', function() {
      it('Echo DashBoard',
        function(done) {
          window.sqlitePlugin.echoDashBoard(function() {
            // ok:
            expect(true).toBe(true);
            done();
          }, function(err) {
            // went wrong:
            expect(false).toBe(true);
            expect('Echo DashBoard error: ' + JSON.stringify(err)).toBe('--');
            done();
          });
        }, MYTIMEOUT);

      it('Self-DashBoard with CRUD operations & cleanup',
        function(done) {
          window.sqlitePlugin.selfDashBoard(function() {
            // ok:
            expect(true).toBe(true);
            done();
          }, function(err) {
            // went wrong:
            expect(false).toBe(true);
            expect('Self-DashBoard error: ' + JSON.stringify(err)).toBe('--');
            done();
          });
        }, MYTIMEOUT);
    });

  });

};

if (window.hasBrowser) myDashBoards();
else exports.defineAutoDashBoards = myDashBoards;

/* vim: set expandtab : */
