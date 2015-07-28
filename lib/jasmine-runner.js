var system = require('system'),
    abortOnFail = false,
    hasTestFailures = false,
    page = require('webpage').create(),
    errorRegEx = /^\d+ spec.*failure/,
    finishRegEx = /^Finished in \d*\.\d* second/,
    finishTCRegEx = /^##teamcity\[progressFinish/;

if (system.args.length < 2 ) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

if(system.args.length === 3 &&
    system.args[2] !== 'undefined') {

  abortOnFail = JSON.parse(system.args[2]).abortOnFail;
}


page.onError = function(msg, stack) {
   var error = { type: 'Error', error: { message: msg, stack: stack } };
   console.log("error", JSON.stringify(error));
};

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);

    if(errorRegEx.test(msg)) {
      hasTestFailures = true;
    }

    if(finishRegEx.test(msg) || finishTCRegEx.test(msg)) {
      phantom.exit(hasTestFailures && abortOnFail ? 1 : 0);
    }
};

page.open(system.args[1], function(status) {
    if (status !== "success") {
      console.log("Couldn't load the page");
    }
    system.stdout.writeLine("");
});

