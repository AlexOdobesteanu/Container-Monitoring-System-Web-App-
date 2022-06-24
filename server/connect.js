var fs = require('fs')
var Docker = require('dockerode')
const { Stream } = require('stream')
const { Node } = require('dockerode')

var mydocker = new Docker({
    host: 'https://remote-api.127-0-0-1.nip.io',
    port: 2376,
    ca: fs.readFileSync('./ca.pem'),
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')
})




// console.log("a")

// var node = mydocker.getNode("i7rp0ckav1ea8xbro2eujsja9")

// node.listContainers(function (err, containers) {
//     console.log(err)
//     console.log(containers)
// })

// var container = mydocker.getContainer("841f44da5c74")

// let params = {
//     Cmd: ['kubectl', 'get', 'nodes'],
//     AttachStdout: true,
//     AttachStderr: true,
// }

// container.exec(params, (err, exec) => {
//     let x = []
//     err && console.error(err);
//     exec.start({ hijack: true, stdin: false },
//         function (err, stream) {
//             stream.setEncoding('utf8');
//             container_output = (stream.pipe(process.stdout));
//             // console.log("Directory in container is", container_output)
//             x.push(container_output)
//         });

//     console.log(x)


// },
// );

// container.changes(function (err, data) {
//     console.log(data)
// })



// mydocker.swarmInspect(function (err, data) {
//     console.log(data)
// })

// mydocker.info(function (err, data) {
//     console.log(data)
// })

// let image = mydocker.getImage("sha256:604d80444252dd46a4b4d35bb0226fc16e1022efcd18bf5980650f72d1cf29e5")
// image.history(function (err, data) {
//     console.log(data)
// })

// let net = mydocker.getNetwork("948a70fbf8a2d58b9e0a81b2fbf040eb9e5d697323f8138635a33ef565bb513e")

// mydocker.listNetworks(function (err, data) {
//     console.log(data)
// })

// net.inspect(function (err, data) {
//     console.log(data)
// })

// mydocker.listNodes(function (err, data) {
//     console.log(data)
// })

// mydocker.listTasks(function (err, data) {
//     console.log(data)
// })

// mydocker.listNodes(function (err, nodes) {
//     console.log(err)
//     console.log(nodes)
// })

// var node = mydocker.getNode("7papfys0apqqi4alnt3lvlkhp")

// node.inspect(function (err, data) {
//     console.log(data)
// })
// var container = mydocker.getContainer('4852cbe14deb')



// container.top({ ps_args: "-e" }, function (err, data) {
//     console.log(data);
// });

// mydocker.listServices(function (err, data) {
//     // if (err) {
//     //     throw err;
//     // }
//     console.log(data)
// })

// let service = mydocker.getService("1abafr4fqtp038d0l6tn6lpde")





// mydocker.listServices({ 'all': true, filters: JSON.stringify() }, function (err, containers) {
//     if (err) {
//         console.log(err)
//     }

//     console.log(containers)
// })

mydocker.info(function (err, data) {
    if (err) {
        throw err;
    }

    console.log('docker info %s', data);
});




// container.stats({ stream: false }, function (err, data) {
//     console.log(err)
//     console.log(data);
// });

// container.stats({ stream: false }, function (err, stream) {
//     console.log(stream.networks.eth0['rx_bytes'])
// })

// var logOpts = {
//     stdout: true,
//     stderr: true,
//     follow: true,
//     timestamps: true
// };

// service.logs({
//     follow: true,
//     stdout: true,
//     stderr: true,
//     timestamps: true,
// }, function (err, stream) {
//     if (err) {
//         return logger.error(err.message);
//     }
//     else {
//         console.log(stream)
//     }


// });

// service.inspect(function (err, stream) {
//     console.log(stream)
// })


// mydocker.listContainers(function (err, containers) {
//     console.log(err)
//     console.log(containers)
// })

// console.log('a')

// service.inspect(function (err, data) {
//     console.log(data)
// }) 
