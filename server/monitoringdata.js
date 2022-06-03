var Docker = require('dockerode')
var fs = require('fs')
const { get } = require('http')
require('./models/generaldata')
const mongoose = require('mongoose')
const GeneralData = mongoose.model("GeneralData")




function monitoringCont(clusterData) {
    const id_in_db = clusterData._id.toString()
    const domainName = clusterData.domainName.toString()
    const nickname = clusterData.nickname.toString()
    const ownedBy = clusterData.ownedBy.toString()

    if (fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem') && fs.existsSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')) {
        var mydocker = new Docker({
            host: domainName,
            port: 2376,
            ca: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'ca.pem'),
            cert: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'cert.pem'),
            key: fs.readFileSync('./configFiles/' + ownedBy + '/' + nickname + '/' + 'key.pem')
        })

        mydocker.listContainers({ all: true }, function (err, containers) {

            console.log("PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            for (i = 0; i < containers.length; i++) {
                const idContainer = containers[i].Id.toString()
                var container = mydocker.getContainer(idContainer)
                let validator = true
                let status = ""
                let name = ""

                container.inspect(function (err, data) {
                    name = data.Name

                    if (data.State['Status'] != 'running') {
                        validator = true
                        status = "exited"
                    }
                    else {
                        validator = false
                        status = "running"
                    }

                })

                if (validator == true) {
                    container.stats({ stream: false }, function (err, data) {
                        // console.log(data)


                        let memPercentage = (parseFloat(data.memory_stats['usage']) / parseFloat(data.memory_stats['limit'])) * 100
                        let memUsed = (parseFloat(data.memory_stats['usage'])) / 1000000
                        let cache = 0


                        if (data.memory_stats.stats != undefined) {
                            cache = parseFloat(data.memory_stats.stats['total_cache'] / 1000000)
                            console.log(cache)
                        }

                        let cpuDelta = parseFloat(data.cpu_stats.cpu_usage['total_usage']) - parseFloat(data.precpu_stats.cpu_usage['total_usage'])
                        let systemDelta = parseFloat(data.cpu_stats.system_cpu_usage) - parseFloat(data.precpu_stats.system_cpu_usage)
                        let cpuPercentage = parseFloat(parseFloat((cpuDelta / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                        let cpuUserPerc = parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100)
                        let cpuKernelPerc = (parseFloat(parseFloat((parseFloat(data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * data.cpu_stats['online_cpus'] * 100))
                        let TxRxRate = 0
                        let txMIB = 0
                        let rxMIB = 0
                        let rxDropped = 0
                        let txDropped = 0
                        let rxErrors = 0
                        let txErrors = 0

                        if (data.networks != undefined) {
                            TxRxRate = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / parseFloat(data.networks.eth0['rx_bytes']))
                            txMIB = parseFloat(parseFloat(data.networks.eth0['tx_bytes']) / 1000000)
                            rxMIB = parseFloat(parseFloat(data.networks.eth0['rx_bytes']) / 1000000)
                            rxDropped = parseFloat(data.networks.eth0['rx_dropped'])
                            txDropped = parseFloat(data.networks.eth0['tx_dropped'])
                            rxErrors = parseFloat(data.networks.eth0['rx_errors'])
                            txErrors = parseFloat(data.networks.eth0['tx_errors'])
                        }
                        let found = true
                        GeneralData.findOne({ ownedBy: ownedBy, idCluster: id_in_db, idContainer: idContainer })
                            .populate("ownedBy idCluster idContainer", "ContainerName ClusterNickname MemPerc MemUsed Cache CpuPerc UserMode KernelMode TxRxRate TxData RxData StatusChange PacketDropped PacketError")
                            .then(mygeneral => {
                                if (mygeneral == null) {
                                    found = false
                                    const generaldata = new GeneralData({
                                        ownedBy: ownedBy,
                                        idCluster: id_in_db,
                                        ClusterNickname: nickname,
                                        idContainer: idContainer,
                                        ContainerName: name.toString(),
                                        MemPerc: memPercentage.toString().split(-3),
                                        MemUsed: memUsed.toString().split(-3),
                                        Cache: cache.toString().split(-3),
                                        CpuPerc: cpuPercentage.toString().split(-3),
                                        UserMode: cpuUserPerc.toString().split(-3),
                                        KernelMode: cpuKernelPerc.toString().split(-3),
                                        TxRxRate: TxRxRate.toString().split(-3),
                                        TxData: txMIB.toString(),
                                        RxData: rxMIB.toString().split(-3),
                                        StatusChange: status.toString(),
                                        TxDropped: txDropped.toString(),
                                        RxDropped: rxDropped.toString(),
                                        TxError: txErrors.toString(),
                                        RxError: rxErrors.toString()
                                    })
                                    generaldata.save().then(result => {

                                    })
                                }
                            })

                        if (found == true) {
                            GeneralData.updateOne({ ownedBy: ownedBy, idCluster: id_in_db, idContainer: idContainer },
                                {
                                    $push: {
                                        MemPerc: memPercentage.toString().split(-3),
                                        MemUsed: memUsed.toString().split(-3),
                                        Cache: cache.toString().split(-3),
                                        CpuPerc: cpuPercentage.toString().split(-3),
                                        UserMode: cpuUserPerc.toString().split(-3),
                                        KernelMode: cpuKernelPerc.toString().split(-3),
                                        TxRxRate: TxRxRate.toString().split(-3),
                                        TxData: txMIB.toString(),
                                        RxData: rxMIB.toString().split(-3),
                                        StatusChange: status.toString(),
                                        TxDropped: txDropped.toString(),
                                        RxDropped: rxDropped.toString(),
                                        TxError: txErrors.toString(),
                                        RxError: rxErrors.toString(),
                                        DateOfNotification: Date.now()
                                    }
                                },
                                function (error, success) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(success);
                                    }
                                }
                            )
                        }
                    }
                    );
                }

            }
        })

    }



}

module.exports = { monitoringCont }