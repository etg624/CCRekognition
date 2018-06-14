var Service = require('node-windows').Service;

var appRoot = process.argv[1]
//console.log (appRoot)

// Create a new service object
var svc = new Service({
  name:'CommandCenter',
  description: 'Mobile Security Solutions Command Center',
  //script: appRoot,
  
  //script: 'C:\\Users\\psb\\Dropbox\\CC550_10302017-master\\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();