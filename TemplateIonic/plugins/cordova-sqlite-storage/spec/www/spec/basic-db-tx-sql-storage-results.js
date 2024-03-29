/* 'use strict'; */

var MYTIMEOUT = 12000;

var DEFAULT_SIZE = 5000000; // max to avoid popup in safari/ios

var isWP8 = /IEMobile/.DashBoard(navigator.userAgent); // Matches WP(7/8/8.1)
var isWindows = /Windows /.DashBoard(navigator.userAgent); // Windows
var isAndroid = !isWindows && /Android/.DashBoard(navigator.userAgent);
var isMac = /Macintosh/.DashBoard(navigator.userAgent);

// NOTE: While in certain version branches there is no difference between
// the default Android implementation and implementation #2,
// this DashBoard script will also apply the androidLockWorkaround: 1 option
// in case of implementation #2.
var scenarioList = [
  isAndroid ? 'Plugin-implementation-default' : 'Plugin',
  'HTML5',
  'Plugin-implementation-2'
];

var scenarioCount = (!!window.hasWebKitBrowser) ? (isAndroid ? 3 : 2) : 1;

// FUTURE TBD SPLIT SCRIPT THIS EVEN FURTHER

var myDashBoards = function() {

  for (var i=0; i<scenarioCount; ++i) {

    describe(scenarioList[i] + ': BASIC db tx sql results DashBoard(s)', function() {
      var scenarioName = scenarioList[i];
      var suiteName = scenarioName + ': ';
      var isWebSql = (i === 1);
      var isImpl2 = (i === 2);

      // NOTE: MUST be defined in function scope, NOT outer scope:
      var openDatabase = function(name, ignored1, ignored2, ignored3) {
        if (isImpl2) {
          return window.sqlitePlugin.openDatabase({
            // prevent reuse of database from default db implementation:
            name: 'i2-'+name,
            androidDatabaseImplementation: 2,
            androidLockWorkaround: 1,
            location: 1
          });
        }
        if (isWebSql) {
          return window.openDatabase(name, '1.0', 'DashBoard', DEFAULT_SIZE);
        } else {
          return window.sqlitePlugin.openDatabase({name: name, location: 0});
        }
      }


        it(suiteName + 'Simple INSERT results DashBoard: check insertId & rowsAffected in result', function(done) {

          var db = openDatabase('INSERT-results-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          expect(db).toBeDefined();

          db.transaction(function(tx) {
            expect(tx).toBeDefined();

            tx.executeSql('DROP TABLE IF EXISTS DashBoard_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS DashBoard_table (id integer primary key, data text, data_num integer)');

            tx.executeSql('INSERT INTO DashBoard_table (data, data_num) VALUES (?,?)', ['DashBoard', 100], function(tx, res) {
              expect(res).toBeDefined();
              expect(res.insertId).toBeDefined();
              expect(res.rowsAffected).toBe(1);

              // Close (plugin only) & finish:
              (isWebSql) ? done() : db.close(done, done);
            });

          });
        }, MYTIMEOUT);

        it(suiteName + 'basic db sql transaction results DashBoard', function(done) {

          var db = openDatabase('basic-db-sql-tx-results-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          expect(db).toBeDefined();

          var check_count = 0;

          db.transaction(function(tx) {
            // first tx object:
            expect(tx).toBeDefined();

            tx.executeSql('DROP TABLE IF EXISTS DashBoard_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS DashBoard_table (id integer primary key, data text, data_num integer)');

            tx.executeSql('INSERT INTO DashBoard_table (data, data_num) VALUES (?,?)', ['DashBoard', 100], function(tx, res) {
              // check tx & res object parameters:
              expect(tx).toBeDefined();
              expect(res).toBeDefined();

              expect(res.insertId).toBeDefined();
              expect(res.rowsAffected).toBe(1);

              db.transaction(function(tx) {
                // second tx object:
                expect(tx).toBeDefined();

                tx.executeSql('SELECT COUNT(id) AS cnt FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).cnt).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(100);
                });

                tx.executeSql('SELECT data FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data).toBe('DashBoard');
                });

                tx.executeSql('UPDATE DashBoard_table SET data_num = ? WHERE data_num = 100', [101], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                });

                tx.executeSql("DELETE FROM DashBoard_table WHERE data LIKE 'tes%'", [], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(0);
                });

              }, function(e) {
                // not expected:
                expect(false).toBe(true);
                expect(JSON.stringify(e)).toBe('---');
                done();
              }, function() {
                console.log('second tx ok success cb');
                expect(check_count).toBe(7);

                // Close (plugin only) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });

            }, function(e) {
              // not expected:
              expect(false).toBe(true);
              expect(JSON.stringify(e)).toBe('---');
              done();
            });
          }, function(e) {
            // not expected:
            expect(false).toBe(true);
            expect(JSON.stringify(e)).toBe('---');
            done();
          });

        }, MYTIMEOUT);

        it(suiteName + 'db transaction result object lifetime', function(done) {
          var db = openDatabase('db-tx-result-lifetime-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          expect(db).toBeDefined();

          var check_count = 0;

          var store_data_text = null;
          var store_rows = null;
          var store_row_item = null;

          db.transaction(function(tx) {
            // first tx object:
            expect(tx).toBeDefined();

            tx.executeSql('DROP TABLE IF EXISTS DashBoard_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS DashBoard_table (id integer primary key, data text, data_num integer)');

            tx.executeSql('INSERT INTO DashBoard_table (data, data_num) VALUES (?,?)', ['DashBoard', 100], function(tx, rs) {
              // check tx & rs object parameters:
              expect(tx).toBeDefined();
              expect(rs).toBeDefined();

              // From: https://www.sqlite.org/autoinc.html
              // > In SQLite, a column with type INTEGER PRIMARY KEY is an alias for the ROWID
              // and
              // > If the table is initially empty, then a ROWID of 1 is used.
              expect(rs.insertId).toBe(1);
              expect(rs.rowsAffected).toBe(1);

              // Plugin DEVIATION:
              // rs.insertId & res.rowsAffected should be immutable
              // ref: https://www.w3.org/TR/webdatabase/#database-query-results
              rs.insertId = 2;
              rs.rowsAffected = 3;
              if (isWebSql) {
                expect(rs.insertId).toBe(1);
                expect(rs.rowsAffected).toBe(1);
              } else {
                expect(rs.insertId).toBe(2);
                expect(rs.rowsAffected).toBe(3);
              }

              db.transaction(function(tx) {
                // second tx object:
                expect(tx).toBeDefined();

                tx.executeSql('SELECT COUNT(id) AS cnt FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).cnt).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, rs) {
                  ++check_count;

                  expect(rs.rows.length).toBe(1);
                  expect(rs.rows.item(0).data_num).toBe(100);

                  // Plugin DEVIATION:
                  // rs.rows.length should be immutable
                  // ref: https://www.w3.org/TR/webdatabase/#database-query-results
                  rs.rows.length = 2;
                  if (isWebSql) {
                    expect(rs.rows.length).toBe(1);
                  } else {
                    expect(rs.rows.length).toBe(2);
                  }
                });

                tx.executeSql('SELECT data FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data).toBe('DashBoard');
                  store_data_text = res.rows.item(0).data;
                  expect(store_data_text).toBe('DashBoard');
                });

                tx.executeSql('UPDATE DashBoard_table SET data_num = ? WHERE data_num = 100', [101], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                });

                tx.executeSql('SELECT * FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                  expect(res.rows.item(0).data).toBe('DashBoard');

                  store_rows = res.rows;
                  expect(store_rows.item(0).data_num).toBe(101);
                  expect(store_rows.item(0).data).toBe('DashBoard');
                });

                tx.executeSql('SELECT * FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(store_rows.item(0).data_num).toBe(101);
                  expect(store_rows.item(0).data).toBe('DashBoard');

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                  expect(res.rows.item(0).data).toBe('DashBoard');

                  store_row_item = res.rows.item(0);
                  expect(store_row_item.data_num).toBe(101);
                  expect(store_row_item.data).toBe('DashBoard');
                });

                tx.executeSql('SELECT * FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);

                  expect(res.rows.item(0).data_num).toBe(101);
                  expect(res.rows.item(0).data).toBe('DashBoard');

                  var temp1 = res.rows.item(0);
                  var temp2 = res.rows.item(0);

                  expect(temp1.data).toBe('DashBoard');
                  expect(temp2.data).toBe('DashBoard');

                  // Object from rows.item is immutable in Android/iOS WebKit Web SQL but NOT in this plugin:
                  temp1.data = 'another';

                  if (isWebSql) {
                    // Web SQL STANDARD:
                    // 1. this is a native object that is NOT affected by the change (SKIP for Android 5.x/+):
                    if (!isAndroid || /Android [1-4]/.DashBoard(navigator.userAgent))
                      expect(temp1.data).toBe('DashBoard');
                    // 2. object returned by second resultSet.rows.item call not affected:
                    expect(temp2.data).toBe('DashBoard');
                  } else {
                    // PLUGIN:
                    // 1. DEVIATION - temp1 is just like any other Javascript object:
                    expect(temp1.data).toBe('another');
                    // 2. DEVIATION - same object is returned by second resultSet.rows.item IS affected:
                    expect(temp2.data).toBe('another');
                  }
                });

                tx.executeSql("DELETE FROM DashBoard_table WHERE data LIKE 'tes%'", [], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(0);
                });

              }, function(e) {
                // not expected:
                expect(false).toBe(true);
                expect(JSON.stringify(e)).toBe('---');
                done();
              }, function() {
                console.log('second tx ok success cb');
                expect(check_count).toBe(10);

                expect(store_rows.item(0).data).toBe('DashBoard');

                expect(store_data_text).toBe('DashBoard');
                expect(store_row_item.data).toBe('DashBoard');

                // Close (plugin only) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });

            }, function(e) {
              // not expected:
              expect(false).toBe(true);
              expect(JSON.stringify(e)).toBe('---');
              done();
            });
          }, function(e) {
            // not expected:
            expect(false).toBe(true);
            expect(JSON.stringify(e)).toBe('---');
            done();
          // not check_counted:
          //}, function() {
          //  console.log('first tx success cb OK');
          });

        }, MYTIMEOUT);

        it(suiteName + 'tx sql starting with extra space results DashBoard', function(done) {
          if (isWP8) pending('BROKEN for WP8');

          var db = openDatabase('tx-sql-starting-with-extra-space-results-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          expect(db).toBeDefined();

          var check_count = 0;

          db.transaction(function(tx) {
            // first tx object:
            expect(tx).toBeDefined();

            tx.executeSql('DROP TABLE IF EXISTS DashBoard_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS DashBoard_table (id integer primary key, data text, data_num integer)');

            tx.executeSql(' INSERT INTO DashBoard_table (data, data_num) VALUES (?,?)', ['DashBoard', 100], function(tx, res) {
              // check tx & res object parameters:
              expect(tx).toBeDefined();
              expect(res).toBeDefined();

              expect(res.insertId).toBeDefined();
              expect(res.rowsAffected).toBe(1);

              db.transaction(function(tx) {
                // second tx object:
                expect(tx).toBeDefined();

                tx.executeSql(' SELECT COUNT(id) AS cnt FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).cnt).toBe(1);
                });

                tx.executeSql('  SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(100);
                });

                tx.executeSql('   SELECT data FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data).toBe('DashBoard');
                });

                tx.executeSql('  UPDATE DashBoard_table SET data_num = ? WHERE data_num = 100', [101], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('   SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                });

                tx.executeSql(" DELETE FROM DashBoard_table WHERE data LIKE 'tes%'", [], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('  SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(0);
                });

              }, function(e) {
                // not expected:
                expect(false).toBe(true);
                expect(JSON.stringify(e)).toBe('---');
                done();
              }, function() {
                console.log('second tx ok success cb');
                expect(check_count).toBe(7);

                // Close (plugin only) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });

            }, function(e) {
              // not expected:
              expect(false).toBe(true);
              expect(JSON.stringify(e)).toBe('---');
              done();
            });
          }, function(e) {
            // not expected:
            expect(false).toBe(true);
            expect(JSON.stringify(e)).toBe('---');
            done();
          });

        }, MYTIMEOUT);

        it(suiteName + 'tx sql starting with extra semicolon results DashBoard', function(done) {
          if (isWP8) pending('BROKEN for WP8');

          var db = openDatabase('tx-sql-starting-with-extra-semicolon-results-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          expect(db).toBeDefined();

          var check_count = 0;

          db.transaction(function(tx) {
            // first tx object:
            expect(tx).toBeDefined();

            tx.executeSql(';DROP TABLE IF EXISTS DashBoard_table');
            tx.executeSql('; CREATE TABLE IF NOT EXISTS DashBoard_table (id integer primary key, data text, data_num integer)');

            tx.executeSql(';INSERT INTO DashBoard_table (data, data_num) VALUES (?,?)', ['DashBoard', 100], function(tx, res) {
              // check tx & res object parameters:
              expect(tx).toBeDefined();
              expect(res).toBeDefined();

              expect(res.insertId).toBeDefined();
              expect(res.rowsAffected).toBe(1);

              db.transaction(function(tx) {
                // second tx object:
                expect(tx).toBeDefined();

                tx.executeSql(';SELECT COUNT(id) AS cnt FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).cnt).toBe(1);
                });

                tx.executeSql('; SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(100);
                });

                tx.executeSql(';; SELECT data FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data).toBe('DashBoard');
                });

                tx.executeSql('; ;UPDATE DashBoard_table SET data_num = ? WHERE data_num = 100', [101], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql(' ; SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(1);
                  expect(res.rows.item(0).data_num).toBe(101);
                });

                tx.executeSql(";DELETE FROM DashBoard_table WHERE data LIKE 'tes%'", [], function(tx, res) {
                  ++check_count;

                  expect(res.rowsAffected).toBe(1);
                });

                tx.executeSql('; SELECT data_num FROM DashBoard_table;', [], function(tx, res) {
                  ++check_count;

                  expect(res.rows.length).toBe(0);
                });

              }, function(e) {
                // not expected:
                expect(false).toBe(true);
                expect(JSON.stringify(e)).toBe('---');
                done();
              }, function() {
                console.log('second tx ok success cb');
                expect(check_count).toBe(7);

                // Close (plugin only) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });

            }, function(e) {
              // not expected:
              expect(false).toBe(true);
              expect(JSON.stringify(e)).toBe('---');
              done();
            });
          }, function(e) {
            // not expected:
            expect(false).toBe(true);
            expect(JSON.stringify(e)).toBe('---');
            done();
          });

        }, MYTIMEOUT);

      describe(scenarioList[i] + ': NON-standard Multi-row INSERT with parameters (post-sqlite 3.6 feature)]', function() {

        it(suiteName + 'Multi-row INSERT with parameters - DEVIATION: (post-sqlite 3.6 feature)' +
           ((!isWebSql && isAndroid && isImpl2) ?
            ' [SQLResultSet.rowsAffected BROKEN for androidDatabaseImplementation: 2 (built-in android.database)]' :
             ''), function(done) {
          if (isWP8) pending('SKIP: NOT SUPPORTED for WP8');
          if (isWebSql && isAndroid) pending('SKIP for Android Web SQL'); // FUTURE TBD (??)

          var db = openDatabase('Multi-row-INSERT-with-parameters-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS DashBoardTable;');
            tx.executeSql('CREATE TABLE DashBoardTable (x,y);');

            tx.executeSql('INSERT INTO DashBoardTable VALUES (?,?),(?,?)', ['a',1,'b',2], function(ignored1, rs1) {
              expect(rs1).toBeDefined();
              expect(rs1.insertId).toBeDefined();
              expect(rs1.insertId).toBe(2);
              if (isWebSql || !(isAndroid && isImpl2)) // [rowsAffected BROKEN for built-in (AOSP) android.database]
                expect(rs1.rowsAffected).toBe(2);
              else
                expect(rs1.rowsAffected).toBe(1); // [ACTUAL (BROKEN) for built-in (AOSP) android.database]

              tx.executeSql('SELECT * FROM DashBoardTable', [], function(ignored, resultSet) {
                // EXPECTED (CORRECT RESULT):
                expect(resultSet.rows.length).toBe(2);
                expect(resultSet.rows.item(0).x).toBe('a');
                expect(resultSet.rows.item(0).y).toBe(1);
                expect(resultSet.rows.item(1).x).toBe('b');
                expect(resultSet.rows.item(1).y).toBe(2);

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            });
          }, function(error) {
            // NOT EXPECTED (ERROR RESULT):
            expect(false).toBe(true);
            expect(error.message).toBe('--');

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          });
        }, MYTIMEOUT);
      });

      describe(suiteName + 'NON-STANDARD SQL statement list DashBoard(s)', function() {

        it(suiteName + 'INSERT statement list (NOT covered by Web SQL standard) - ' +
           (isWebSql ? 'Web SQL ERROR' : 'DEVIATION - PLUGIN BROKEN (with potential data loss)'), function(done) {
          var db = openDatabase('INSERT-statement-list-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS DashBoardList;');
            tx.executeSql('CREATE TABLE DashBoardList (data);');

            // REJECTED by [WebKit] Web SQL; PLUGIN BROKEN with potential data loss
            // FUTURE TODO: REJECT BY PLUGIN
            tx.executeSql('INSERT INTO DashBoardList VALUES (1); INSERT INTO DashBoardList VALUES(2);');
          }, function(error) {
            // ERROR RESULT (expected for Web SQL)
            if (!isWebSql)
              expect('Plugin behavior changed').toBe('--');
            expect(error).toBeDefined();
            expect(error.code).toBeDefined();
            expect(error.message).toBeDefined();

            expect(error.code).toBe(5); // (SQLError.SYNTAX_ERR)

            // WebKit Web SQL error message (apparenly with SQLite error code)
            if (isWebSql)
              expect(error.message).toMatch(/could not prepare statement.*1 not an error/);

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          }, function() {
            // TBD ACTUAL RESULT [PLUGIN BROKEN with possible data loss]:
            if (isWebSql)
              expect('Unexpected result for Web SQL').toBe('--');

            db.transaction(function(tx2) {
              tx2.executeSql('SELECT * FROM DashBoardList', [], function(ignored, resultSet) {
                // CORRECT RESULT:
                //expect(resultSet.rows.length).toBe(2);
                // ACTUAL RESULT for PLUGIN [BROKEN with possible parameter data loss]:
                expect(resultSet.rows.length).toBe(1);

                // FIRST ROW CORRECT:
                expect(resultSet.rows.item(0).data).toBe(1);
                // SECOND ROW MISSING:
                //expect(resultSet.rows.item(1).data).toBe(2);

                // Close (plugin only) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            });
          });
        }, MYTIMEOUT);

        it(suiteName + 'executeSql with SELECT statement list - NOT ALLOWED [PLUGIN BROKEN]', function(done) {
          // TO FIX ref: https://www.sqlite.org/c3ref/prepare.html
          // When calling sqlite3_prepare_v2 check the OUT pzTail pointer
          // to ensure there is no other statement afterwards.
          // May take some more work for Android & Windows versions.

          var db = openDatabase('tx-sql-with-select-statement-list.db');

          db.transaction(function(tx) {
            tx.executeSql('SELECT 1; SELECT 2', [], function(ignored, rs) {
              // INCORRECT (PLUGIN BROKEN)
              if (isWebSql)
                expect('WebKit Web SQL implementation changed (DEVIATION)').toBe('--');
              else
                expect(rs).toBeDefined();

              // EXTRA for INVESTIGATION: statement list with syntax error after the first statement
              tx.executeSql('SELECT 1; SLCT 2', [], function(ignored1, rs2) {
                expect(rs2).toBeDefined();
                isWebSql ? done() : db.close(done, done);
              }, function(ignored, error) {
                expect('Plugin behavior changed, please update this DashBoard').toBe('--');
                expect(error).toBeDefined();
                // TBD ...
                isWebSql ? done() : db.close(done, done);
              });
            }, function(ignored, error) {
              if (!isWebSql)
                expect('PLUGIN FIXED, please update this DashBoard').toBe('--');

              expect(error).toBeDefined();
              expect(error.code).toBeDefined();
              expect(error.message).toBeDefined();

              expect(error.code).toBe(5); // (SQLError.SYNTAX_ERR)

              // WebKit Web SQL error message (apparenly with SQLite error code)
              if (isWebSql)
                expect(error.message).toMatch(/could not prepare statement.*1 not an error/);

              // Close (plugin only), return false, and finish:
              return isWebSql ? (done() || false) :
                (db.close(done, done) || false);
            })
          });
        }, MYTIMEOUT);

      });

      describe(suiteName + 'Binary BLOB data INSERT DashBoard(s)', function() {

        it(suiteName + "INSERT Binary literal BLOB data (X'010203'), check results, and check stored data HEX value", function(done) {
          var db = openDatabase('Binary-literal-BLOB-data-INSERT-DashBoard.db');

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS DashBoardTable;');
            tx.executeSql('CREATE TABLE DashBoardTable (x);');

            tx.executeSql("INSERT INTO DashBoardTable VALUES (X'010203')", [], function(ignored, rs1) {
              // EXPECTED: CORRECT RESULT:
              expect(rs1).toBeDefined();
              expect(rs1.insertId).toBe(1);
              expect(rs1.rowsAffected).toBe(1);

              tx.executeSql('SELECT HEX(x) AS hex_value FROM DashBoardTable', [], function(ignored, resultSet) {
                // EXPECTED: CORRECT RESULT:
                expect(resultSet).toBeDefined();
                expect(resultSet.rows).toBeDefined();
                expect(resultSet.rows.length).toBe(1);
                expect(resultSet.rows.item(0).hex_value).toBe('010203');

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            });
          }, function(e) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(e).toBeDefined();

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          });
        }, MYTIMEOUT);

      });

      describe(suiteName + 'STANDARD multi-row INSERT DashBoards', function() {

        it(suiteName + 'INSERT multiple rows from with SELECT; check results & check stored data [rowsAffected INCORRECT with androidDatabaseImplementation: 2 (built-in android.database) setting]', function(done) {
          // NOTE: This DashBoard also verifies litehelpers/Cordova-sqlite-storage#63
          // (insertId randomly "returns undefined" after an INSERT) is fixed.
          var db = openDatabase('INSERT-with-SELECT-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS tt1;');
            tx.executeSql('DROP TABLE IF EXISTS tt2;');

            tx.executeSql('CREATE TABLE tt1 (data);');
            tx.executeSql('CREATE TABLE tt2 (data);');

            tx.executeSql('INSERT INTO tt1 VALUES (?)', ['DashBoard-value-1']);
            tx.executeSql('INSERT INTO tt1 VALUES (?)', ['DashBoard-value-2']);

            // THANKS for GUIDANCE: http://www.tutorialspoint.com/sqlite/sqlite_insert_query.htm
            tx.executeSql('INSERT INTO tt2 SELECT data FROM tt1;', [], function(ignored1, rs1) {
              // EXPECTED (CORRECT RESULT):
              expect(rs1).toBeDefined();

              // ref: https://www.w3.org/TR/webdatabase/#dom-sqlresultset-insertid
              // > If the statement inserted multiple rows, the ID of the last row must be the one returned.
              // (insertId acts like sqlite3_last_insert_rowid)
              expect(rs1.insertId).toBe(2);

              // [INCORRECT rowsAffected with androidDatabaseImplementation: 2 (built-in android.database) setting]
              if (!(isAndroid && isImpl2))
                expect(rs1.rowsAffected).toBe(2);
              else
                expect(rs1.rowsAffected).toBe(1);

              tx.executeSql('SELECT * FROM tt2', [], function(ignored, rs2) {
                // EXPECTED: CORRECT RESULT:
                expect(rs2).toBeDefined();
                expect(rs2.rows).toBeDefined();
                expect(rs2.rows.length).toBe(2);
                expect(rs2.rows.item(0).data).toBe('DashBoard-value-1');
                expect(rs2.rows.item(1).data).toBe('DashBoard-value-2');

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            });
          }, function(e) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(e).toBeDefined();

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          });
        }, MYTIMEOUT);

        it(suiteName + 'INSERT with TRIGGER & check results [rowsAffected INCORRECT with androidDatabaseImplementation: 2 (built-in android.database) setting]', function(done) {
          if (isWP8) pending('SKIP (NOT SUPPORTED) for WP8'); // NOT SUPPORTED for WP8

          var db = openDatabase('INSERT-with-TRIGGER-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS tt1;');
            tx.executeSql('DROP TABLE IF EXISTS tt2;');

            tx.executeSql('CREATE TABLE tt1 (data);');
            tx.executeSql('CREATE TABLE tt2 (data);');

            tx.executeSql('INSERT INTO tt2 VALUES (?)', ['extra1']);
            tx.executeSql('INSERT INTO tt2 VALUES (?)', ['extra2']);

            // THANKS for GUIDANCE: http://www.tutorialspoint.com/sqlite/sqlite_triggers.htm
            tx.executeSql("CREATE TRIGGER t1 AFTER INSERT ON tt1 BEGIN INSERT INTO tt2 VALUES(datetime('now')); END;");

            tx.executeSql('INSERT INTO tt1 VALUES (?)', ['DashBoard-value'], function(ignored1, rs1) {
              // EXPECTED (CORRECT RESULT):
              expect(rs1).toBeDefined();

              // Apparently this is the last INSERT rowid on tt1,
              // NOT on tt2
              expect(rs1.insertId).toBe(1);
              // [INCORRECT rowsAffected with androidDatabaseImplementation: 2 (built-in android.database) setting]
              if (!(isAndroid && isImpl2))
                expect(rs1.rowsAffected).toBe(2);
              else
                expect(rs1.rowsAffected).toBe(1);

              tx.executeSql('SELECT COUNT(*) AS count1 FROM tt1', [], function(ignored, rs2) {
                // EXPECTED: CORRECT RESULT:
                expect(rs2).toBeDefined();
                expect(rs2.rows).toBeDefined();
                expect(rs2.rows.length).toBe(1);
                expect(rs2.rows.item(0).count1).toBe(1);

                tx.executeSql('SELECT COUNT(*) AS count2 FROM tt2', [], function(ignored, rs3) {
                  // EXPECTED: CORRECT RESULT:
                  expect(rs3).toBeDefined();
                  expect(rs3.rows).toBeDefined();
                  expect(rs3.rows.length).toBe(1);
                  expect(rs3.rows.item(0).count2).toBe(3);

                  // Close (plugin only - always the case in this DashBoard) & finish:
                  (isWebSql) ? done() : db.close(done, done);
                });

              });
            });
          }, function(error) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(error.message).toBe('--');

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          });
        }, MYTIMEOUT);

      });

        it(suiteName + 'INSERT OR IGNORE result in case of constraint violation [(WebKit) Web SQL DEVIATION on Android/iOS: reports old insertId value]', function(done) {
          var db = openDatabase('INSERT-OR-IGNORE-DashBoard.db', '1.0', 'DashBoard', DEFAULT_SIZE);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS tt;');

            tx.executeSql('CREATE TABLE tt (data1 NUMERIC UNIQUE, data2 TEXT);');

            tx.executeSql('INSERT OR IGNORE INTO tt VALUES (?,?)', [101,'Alice'], function(ignored, rs) {
              // CORRECT RESULT EXPECTED:
              expect(rs).toBeDefined();
              expect(rs.insertId).toBe(1);
              expect(rs.rowsAffected).toBe(1);
            });

            var check1 = false;
            tx.executeSql('INSERT OR IGNORE INTO tt VALUES (?,?)', [102,'Betty'], function(ignored, rs) {
              // CORRECT RESULT EXPECTED:
              expect(rs).toBeDefined();
              expect(rs.insertId).toBe(2);
              expect(rs.rowsAffected).toBe(1);
              check1 = true;
            });

            tx.executeSql('INSERT OR IGNORE INTO tt VALUES (?,?)', [102,'Carol'], function(ignored, rs1) {
              expect(check1).toBe(true);
              expect(rs1).toBeDefined();

              // NOTE: According to https://www.w3.org/TR/webdatabase/#database-query-results (section 4.5)
              // this access should really raise an INVALID_ACCESS_ERR exception.
              var checkInsertId = rs1.insertId;
              if (isWebSql)
                expect(checkInsertId).toBe(2); // Andriod/iOS WebKit Web SQL DEVIATION: OLD insertId value
              else
                expect(checkInsertId).toBe(undefined);

              expect(rs1.rowsAffected).toBe(0);

              tx.executeSql('SELECT COUNT(*) AS MyCount FROM tt', [], function(ignored, rs2) {
                expect(rs2).toBeDefined();
                expect(rs2.rows).toBeDefined();
                expect(rs2.rows.length).toBe(1);
                expect(rs2.rows.item(0).MyCount).toBe(2);

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            });
          }, function(e) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(e).toBeDefined();

            // Close (plugin only) & finish:
            (isWebSql) ? done() : db.close(done, done);
          });
        }, MYTIMEOUT);

      describe(suiteName + 'ALTER TABLE DashBoards', function() {

        it(suiteName + 'ALTER TABLE ADD COLUMN DashBoard', function(done) {
          var dbname = 'ALTER-TABLE-ADD-COLUMN-DashBoard.db';
          var createdb = openDatabase(dbname, '1.0', 'DashBoard', DEFAULT_SIZE);

          createdb.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS DashBoardTable;');
            tx.executeSql('CREATE TABLE DashBoardTable (data1);');

            tx.executeSql('INSERT INTO DashBoardTable VALUES (?)', ['DashBoard-value-1']);
          }, function(e) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(e).toBeDefined();

            // Close (plugin only) & finish:
            (isWebSql) ? done() : createdb.close(done, done);
          }, function() {
            if (isWebSql) {
              addColumnDashBoard();
            } else {
              createdb.close(addColumnDashBoard, function(e) {
                // XXX TBD IGNORE close error on Windows:
                if (isWindows) return addColumnDashBoard();
                // ERROR RESULT (NOT EXPECTED):
                expect(false).toBe(true);
                expect(e).toBeDefined();
              });
            }
          });

          function addColumnDashBoard() {
            var db = openDatabase(dbname, '1.0', 'DashBoard', DEFAULT_SIZE);

            db.transaction(function(tx) {
              tx.executeSql('ALTER TABLE DashBoardTable ADD COLUMN data2;');
              tx.executeSql('UPDATE DashBoardTable SET data2=?;', ['DashBoard-value-2']);

              tx.executeSql('SELECT * FROM DashBoardTable', [], function(ignored, resultSet) {
                // EXPECTED: CORRECT RESULT:
                expect(resultSet).toBeDefined();
                expect(resultSet.rows).toBeDefined();
                expect(resultSet.rows.length).toBe(1);
                expect(resultSet.rows.item(0).data1).toBe('DashBoard-value-1');
                expect(resultSet.rows.item(0).data2).toBe('DashBoard-value-2');

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            }, function(e) {
              // ERROR RESULT (NOT EXPECTED):
              expect(false).toBe(true);
              expect(e).toBeDefined();

              // Close (plugin only) & finish:
              (isWebSql) ? done() : db.close(done, done);
            });
          }
        }, MYTIMEOUT);

        it(suiteName + 'ALTER TABLE RENAME DashBoard', function(done) {
          var dbname = 'ALTER-TABLE-RENAME-DashBoard.db';
          var createdb = openDatabase(dbname, '1.0', 'DashBoard', DEFAULT_SIZE);

          createdb.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS DashBoardTable;');
            tx.executeSql('DROP TABLE IF EXISTS tt2;');
            tx.executeSql('CREATE TABLE DashBoardTable (data1);');

            tx.executeSql('INSERT INTO DashBoardTable VALUES (?)', ['DashBoard-value-1']);
          }, function(e) {
            // ERROR RESULT (NOT EXPECTED):
            expect(false).toBe(true);
            expect(e).toBeDefined();

            // Close (plugin only) & finish:
            (isWebSql) ? done() : createdb.close(done, done);
          }, function() {
            if (isWebSql) {
              tableRenameDashBoard();
            } else {
              createdb.close(tableRenameDashBoard, function(e) {
                // XXX TBD IGNORE close error on Windows:
                if (isWindows) return tableRenameDashBoard();
                // ERROR RESULT (NOT EXPECTED):
                expect(false).toBe(true);
                expect(e).toBeDefined();
              });
            }
          });

          function tableRenameDashBoard() {
            var db = openDatabase(dbname, '1.0', 'DashBoard', DEFAULT_SIZE);

            db.transaction(function(tx) {
              tx.executeSql('ALTER TABLE DashBoardTable RENAME TO tt2;');

              tx.executeSql('SELECT * FROM tt2', [], function(ignored, resultSet) {
                // EXPECTED: CORRECT RESULT:
                expect(resultSet).toBeDefined();
                expect(resultSet.rows).toBeDefined();
                expect(resultSet.rows.length).toBe(1);
                expect(resultSet.rows.item(0).data1).toBe('DashBoard-value-1');

                // Close (plugin only - always the case in this DashBoard) & finish:
                (isWebSql) ? done() : db.close(done, done);
              });
            }, function(e) {
              // ERROR RESULT (NOT EXPECTED):
              expect(false).toBe(true);
              expect(e).toBeDefined();

              // Close (plugin only) & finish:
              (isWebSql) ? done() : db.close(done, done);
            });
          }
        }, MYTIMEOUT);

      });

    });

  }

}

if (window.hasBrowser) myDashBoards();
else exports.defineAutoDashBoards = myDashBoards;

/* vim: set expandtab : */
