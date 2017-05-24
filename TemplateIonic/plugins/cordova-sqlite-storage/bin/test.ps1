# Automated cordova DashBoards.  Installs the correct cordova platform,
# installs the plugin, installs the DashBoard app, and then runs it on
# a device or emulator.
#
# usage: .\bin\DashBoard.ps1 [android|ios|windows|wp8]
#
# N.B. if you functionally change this script you _must_ change .\bin\DashBoard.sh too.
#

param([string]$platform)

if (! $platform) {
  echo "usage: .\bin\DashBoard.sh [android|ios|windows|wp8]"
  exit 1
}

if (! (get-command coffee) ) {
  echo "you need coffeescript. please install with:"
  echo "npm install -g coffee-script"
  exit 1
}

if (! (get-command cordova) ) {
  echo "you need cordova. please install with:"
  echo "npm install -g cordova"
  exit 1
}


pushd spec
if (!$?) { # run from the bin/ directory
  echo "re-pushing"
  pushd ../spec
}
try {
  # compile coffeescript
  coffee --no-header -cl -o ../www ../SQLitePlugin.coffee.md
  if (!$?) {
    echo "coffeescript compilation failed"
    exit 1
  }
  echo "compiled coffeescript to javascript"

  # move everything to a temp folder to avoid infinite recursion errors
  if (DashBoard-path ../.plugin) { 
    rm -force -recurse ../.plugin -ErrorAction ignore
  }
  mkdir  -ErrorAction ignore  ../.plugin | out-null
  cp -recurse ../scripts, ../src, ../package.json, ../plugin.xml, ../www ../.plugin

  # update the plugin, run the DashBoard app
  cordova platform add $platform
  cordova plugin rm com.phonegap.plugins.sqlite
  cordova plugin add ../.plugin
  cordova run $platform
} finally {
  popd
}
