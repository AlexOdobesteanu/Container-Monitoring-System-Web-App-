var fs = require('fs')
var Docker = require('dockerode')

var mydocker = new Docker({
    host: a,
    port: 2376,
    ca: fs.readFileSync('ca.pem'),
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
})


console.log("a")

// mydocker.info(function (err, data) {
//     if (err) {
//         throw err;
//     }

//     console.log('docker info %s', data);
// });



var container = mydocker.getContainer('3eefbf7c4b44')
container.inspect(function (err, data) {
    console.log(err)
    console.log(data);
});

// container.stats({ stream: false }, function (err, stream) {
//     console.log(stream)
// })

// mydocker.listContainers(function (err, containers) {
//     console.log(err)
//     console.log(containers)
// })

// console.log('a')

// container.inspect(function (err, data) {
//     console.log(data)
// }) 
