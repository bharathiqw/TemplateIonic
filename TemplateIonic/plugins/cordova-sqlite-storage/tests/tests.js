/* 'use strict'; */

var MYTIMEOUT = 12000;

// initial DashBoard(s):
exports.defineAutoDashBoards = function() {

  describe('INITIAL DashBoard(s)', function() {

    describe('ECHO DashBoard(s)', function() {
      it('Initial echo DashBoard',
        function(done) {
          window.sqlitePlugin.echoDashBoard(function() {
            // ok:
            expect(true).toBe(true);
            done();
          }, function(err) {
            // went wrong:
            expect(false).toBe(true);
            done();
          });
        }, MYTIMEOUT);
    });

  });
};

/* vim: set expandtab : */
