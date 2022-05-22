var fs = require('fs')
var Docker = require('dockerode')

var mydocker = new Docker({
    host: 'https://remote-api.127-0-0-1.nip.io',
    port: 2376,
    ca: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/ca.pem'),
    cert: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/cert.pem'),
    key: fs.readFileSync('./configFiles/61d55a7468584592c1e39aef/alex/key.pem')
})


console.log("a")

// mydocker.info(function (err, data) {
//     if (err) {
//         throw err;
//     }

//     console.log('docker info %s', data);
// });



var container = mydocker.getContainer('4852cbe14deb')
// container.stats({ stream: false }, function (err, data) {
//     console.log(err)
//     console.log(data);
// });

container.stats({ stream: false }, function (err, stream) {
    console.log(stream.networks.eth0['rx_bytes'])
})

// mydocker.listContainers(function (err, containers) {
//     console.log(err)
//     console.log(containers)
// })

// console.log('a')

// container.inspect(function (err, data) {
//     console.log(data)
// }) 
