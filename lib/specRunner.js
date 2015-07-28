var scrs = document.querySelectorAll("script"),
  sc = scrs[scrs.length-1],
  reporter = sc.getAttribute("src").split("#")[1],
  consoleReporter;

if(reporter == "teamcity"){
  consoleReporter = new jasmineReporters.TeamCityReporter({});
} else {
  consoleReporter = new jasmineRequire.ConsoleReporter()({
    showColors: true,
    timer: new jasmine.Timer,
    print: function() {
      console.log.apply(console, arguments)
    }
  });
}


jasmine.getEnv().addReporter(consoleReporter);
