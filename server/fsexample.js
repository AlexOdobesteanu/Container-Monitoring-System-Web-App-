const yaml = require('js-yaml');
const fs = require('fs')
const x = "alex"
const y = '365'
const z = '365'
const t = "nipio"

let data = {
    version: "3.4",
    services: {
        'image': 'kekru/docker-remote-api-tls:v0.4.0',
        ports: [
            '2376:443'
        ],
        environment: [
            'CREATE_CERTS_WITH_PW=' + x,
            'CERT_EXPIRATION_DAYS=' + y,
            'CA_EXPIRATION_DAYS=' + z,
            'CERT_HOSTNAME=' + t
        ],
        volumes: [
            '/data/certs',
            '/var/run/docker.sock:/var/run/docker.sock:ro'
        ]
    }
}

let yamlStr = yaml.safeDump(data)
fs.writeFileSync("lol.yaml", yamlStr, 'utf8')


const renderPaused = () => {
    if (data.length != 0) {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                {
                    data.map(item => {

                        if (item.State == 'paused') {
                            return (
                                <div class="card horizontal" style={{ flex: '1 1 0px' }}>
                                    <div class="card-image">
                                    </div>
                                    <div class="card-stacked">
                                        <div class="card-content">
                                            <p id='white-text'>
                                                Type:<b style={{ color: 'rgb(255, 205, 86)' }}> Container</b>
                                            </p>
                                            <p id='white-text'>Name: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Names}</b></p>
                                            <p id='white-text'>State: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.State}</b></p>
                                            <p id='white-text'>Status: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Status}</b></p>
                                            <p id='white-text'>ID: <b style={{ color: 'rgb(255, 205, 86)' }}> {item.Id}</b></p>
                                            <p id='white-text'>Image: <b style={{ color: 'rgb(255, 205, 86)' }}>{item.Image}</b></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div></div>
                            )
                        }
                    })
                }
            </div >
        )
    }
}
<div>
    {
        selectedPause ? <div>{renderPaused()}</div> :
            <div>
                {renderAll()}
            </div>
    }
</div>


setDates(dates => [...dates, new Date().toLocaleString()])
if (dates.length >= 20) {
    setDates(dates.slice(10, dates.length))
}

setMemoryPerc(memoryPerc => [...memoryPerc, ((parseFloat(result.data.memory_stats['usage']) / parseFloat(result.data.memory_stats['limit'])) * 100).toFixed(3)])
if (memoryPerc.length >= 20) {
    setMemoryPerc(memoryPerc.slice(10, memoryPerc.length))
}


setMemoryUsage(memoryUsage => [...memoryUsage, (parseFloat(result.data.memory_stats['usage']) / 1000000).toFixed(2)])
if (memoryUsage.length >= 20) {
    setMemoryUsage(memoryUsage.slice(10, memoryUsage.length))
}


setFullData((parseFloat(result.data.memory_stats['limit']) / 1000000000).toFixed(2))




setCache(cache => [...cache, (parseFloat(result.data.memory_stats.stats['total_cache'] / 1000000)).toFixed(3)])
if (cache.length >= 20) {
    setCache(cache.slice(10, cache.length))
}



let cpuDelta = parseFloat(result.data.cpu_stats.cpu_usage['total_usage']) - parseFloat(result.data.precpu_stats.cpu_usage['total_usage'])
let systemDelta = parseFloat(result.data.cpu_stats.system_cpu_usage) - parseFloat(result.data.precpu_stats.system_cpu_usage)
setOnlineCPU(result.data.cpu_stats['online_cpus'])


setCpuPercent(cpuPercent => [...cpuPercent, parseFloat(parseFloat((cpuDelta / systemDelta) * result.data.cpu_stats['online_cpus'] * 100)).toFixed(3)])
if (cpuPercent.length >= 20) {
    setCpuPercent(cpuPercent.slice(10, cpuPercent.length))
}


setUserMode(userMode => [...userMode, parseFloat(parseFloat((parseFloat(result.data.cpu_stats.cpu_usage['usage_in_usermode']) - parseFloat(result.data.precpu_stats.cpu_usage['usage_in_usermode'])) / systemDelta) * result.data.cpu_stats['online_cpus'] * 100).toFixed(3)])
if (userMode.length >= 20) {
    setUserMode(userMode.slice(10, userMode.length))
}


setKernelMode(kernelMode => [...kernelMode, parseFloat(parseFloat((parseFloat(result.data.cpu_stats.cpu_usage['usage_in_kernelmode']) - parseFloat(result.data.precpu_stats.cpu_usage['usage_in_kernelmode'])) / systemDelta) * result.data.cpu_stats['online_cpus'] * 100).toFixed(3)])
if (kernelMode.length >= 20) {
    setKernelMode(kernelMode.slice(10, kernelMode.length))
}

//MEMORY DOUGHNUT




setRxBytes(rxBytes => [...rxBytes, parseFloat(parseFloat(result.data.networks.eth0['rx_bytes']) / 1000000).toFixed(3)])
if (rxBytes.length >= 20) {
    setRxBytes(rxBytes.slice(10, rxBytes.length))
}


setTxBytes(txBytes => [...txBytes, parseFloat(parseFloat(result.data.networks.eth0['tx_bytes']) / 1000000).toFixed(3)])
if (txBytes.length >= 20) {
    setTxBytes(txBytes.slice(10, txBytes.length))
}

setRate(rate => [...rate, parseFloat(parseFloat(result.data.networks.eth0['tx_bytes']) / parseFloat(result.data.networks.eth0['rx_bytes'])).toFixed(3)])
if (rate.length >= 20) {
    setRate(rate.slice(10, rate.length))
}

setRxPackets(rxPackets => [...rxPackets, parseFloat(result.data.networks.eth0['rx_packets'])])
if (rxPackets.length >= 20) {
    setRxPackets(rxPackets.slice(10, rxPackets.length))
}

setTxPackets(txPackets => [...txPackets, parseFloat(result.data.networks.eth0['tx_packets'])])
if (txPackets.length >= 20) {
    setTxPackets(txPackets.slice(10, txPackets.length))
}

setRxDropped(rxDropped => [...rxDropped, parseFloat(result.data.networks.eth0['rx_dropped'])])
if (rxDropped.length >= 20) {
    setRxDropped(rxDropped.slice(10, rxDropped.length))
}

setTxDropped(txDropped => [...txDropped, parseFloat(result.data.networks.eth0['tx_dropped'])])
if (txDropped.length >= 20) {
    setTxDropped(txDropped.slice(10, txDropped.length))
}

setRxErrors(rxErrors => [...rxErrors, parseFloat(result.data.networks.eth0['rx_errors'])])
if (rxErrors.length >= 20) {
    setRxErrors(rxErrors.slice(10, rxErrors.length))
}


setTxErrors(txErrors => [...txErrors, parseFloat(result.data.networks.eth0['tx_errors'])])
if (txErrors.length >= 20) {
    setTxErrors(txErrors.slice(10, txErrors.length))
}



if (found == true) {
    GeneralData.updateOne({ ownedBy: ownedBy, idCluster: id_in_db, idContainer: idContainer, idNode: idNode },
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

