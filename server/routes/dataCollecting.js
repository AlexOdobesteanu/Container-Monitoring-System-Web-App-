const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const yaml = require('js-yaml');
const multer = require('multer')
var async = require('async')
var fs = require('fs')
var Docker = require('dockerode')
var cron = require('node-cron')
var crypto = require('crypto')
const schedule = require('node-schedule')
const Container = mongoose.model("Container")
const cpuModel = mongoose.model("cpuModel")
const Cluster = mongoose.model("Cluster")
const Alert = mongoose.model("Alert")
const Nodes = mongoose.model("Nodes")
const AlertNotification = mongoose.model("AlertNotification")
const GeneralData = mongoose.model("GeneralData")
const AlertHistory = mongoose.model("AlertHistory")
const requireLogin = require('../middleware/requireLogin')
const { SECRET } = require('../keys')
const { IV } = require('../keys')
const e = require('express')
const bcrypt = require('bcryptjs')
const path = require('path');
const { alertClasses } = require('@mui/material');
const { application } = require('express');


router.post('/getGeneralData', requireLogin, (req, response) => {
    const { idCluster, idNode } = req.body
    const MemPercDataset = []
    const MemUsedDataset = []
    const CacheDataset = []

    console.log(idNode)
    console.log(idCluster)


    const CpuPercDataset = []
    const UserModeDataset = []
    const KernelModeDataset = []
    const TxData = []
    const RxData = []
    const TxRxRateDataset = []
    const TxDroppedDataset = []
    const RxDroppedDataset = []
    const TxErrorsDataset = []
    const RxErrorsDataset = []
    const AllContainersDataset = []
    let Dates = []
    let dates_array = []

    GeneralData.find({ ownedBy: req.user._id, idCluster: idCluster, idNode: idNode })
        .populate("ownedBy idCluster idNode", "idContainer NodeName ContainerName ClusterNickname MemPerc MemUsed Cache CpuPerc UserMode KernelMode TxRxRate TxData RxData StatusChange PacketDropped PacketError")
        .then(res => {
            console.log(res)
            if (res == null) {
                response.json([])
            }

            for (let i = 0; i < res.length; i++) {
                dates_array.push(res[i].DateOfNotification.length)
            }
            const max = Math.max(...dates_array)
            const index = dates_array.indexOf(max)
            Dates.push(res[index].DateOfNotification)

            for (let i = 0; i < res.length; i++) {

                AllContainersDataset.push({ value: res[i].idContainer.toString(), label: res[i].ContainerName.toString().split("/")[1] })
                MemPercDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].MemPerc
                })

                MemUsedDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    borderWidth: '3',
                    tension: 0.4,
                    data: res[i].MemUsed
                })

                CacheDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    borderWidth: '3',
                    tension: 0.4,
                    data: res[i].Cache
                })

                CpuPercDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].CpuPerc
                })

                UserModeDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].UserMode
                })

                KernelModeDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].KernelMode
                })

                TxData.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    borderWidth: '3',
                    data: res[i].TxData
                })

                RxData.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    borderWidth: '3',
                    data: res[i].RxData
                })

                TxRxRateDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    borderWidth: '3',
                    data: res[i].TxRxRate
                })

                TxDroppedDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].TxDropped
                })

                RxDroppedDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].RxDropped
                })

                RxErrorsDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,

                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].RxError
                })

                TxErrorsDataset.push({
                    label: res[i].ContainerName.toString().split("/")[1],
                    fill: true,
                    pointBorderColor: 'white',
                    pointBorderWidth: 2,
                    pointRadius: 2,
                    tension: 0.4,
                    data: res[i].TxError
                })

            }

            response.json({
                MemPercDataset,
                MemUsedDataset,
                CacheDataset,
                CpuPercDataset,
                UserModeDataset,
                KernelModeDataset,
                TxData,
                RxData,
                TxRxRateDataset,
                TxDroppedDataset,
                RxDroppedDataset,
                TxErrorsDataset,
                RxErrorsDataset,
                Dates,
                AllContainersDataset
            })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/getGeneralDataForContainer', requireLogin, (req, res) => {
    const { idCluster, idContainer, idNode } = req.body

    const MemPercDataset = []
    const MemUsedDataset = []
    const CacheDataset = []


    const CpuPercDataset = []
    const UserModeDataset = []
    const KernelModeDataset = []
    const TxData = []
    const RxData = []
    const TxRxRateDataset = []
    const TxDroppedDataset = []
    const RxDroppedDataset = []
    const TxErrorsDataset = []
    const RxErrorsDataset = []
    const Dates = []
    let dates_array = []

    GeneralData.find({ ownedBy: req.user._id, idCluster: idCluster, idContainer: idContainer, idNode: idNode })
        .populate("ownedBy idCluster idContainer idNode", "ContainerName ClusterNickname MemPerc MemUsed Cache CpuPerc UserMode KernelMode TxRxRate TxData RxData StatusChange PacketDropped PacketError")
        .then(response => {
            // console.log(response[0].RxError)
            // res.json({ response })
            if (response == null) {

            }
            for (let i = 0; i < response.length; i++) {
                dates_array.push(response[i].DateOfNotification.length)
            }
            const max = Math.max(...dates_array)
            const index = dates_array.indexOf(max)
            Dates.push(response[index].DateOfNotification)

            MemPercDataset.push({
                label: response[0].ContainerName,
                fill: true,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].MemPerc
            })

            MemUsedDataset.push({
                label: response[0].ContainerName,
                fill: true,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                borderWidth: '3',
                tension: 0.4,
                data: response[0].MemUsed
            })

            CacheDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                borderWidth: '3',
                tension: 0.4,
                data: response[0].Cache
            })

            CpuPercDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].CpuPerc
            })

            UserModeDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].UserMode
            })

            KernelModeDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].KernelMode
            })

            TxData.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                borderWidth: '3',
                data: response[0].TxData
            })

            RxData.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                borderWidth: '3',
                data: response[0].RxData
            })

            TxRxRateDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                borderWidth: '3',
                data: response[0].TxRxRate
            })

            TxDroppedDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].TxDropped
            })

            RxDroppedDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].RxDropped
            })

            RxErrorsDataset.push({
                label: response[0].ContainerName,
                fill: true,

                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].RxError
            })

            TxErrorsDataset.push({
                label: response[0].ContainerName,
                fill: true,
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 2,
                tension: 0.4,
                data: response[0].TxError
            })

            res.json({
                MemPercDataset,
                MemUsedDataset,
                CacheDataset,
                CpuPercDataset,
                UserModeDataset,
                KernelModeDataset,
                TxData,
                RxData,
                TxRxRateDataset,
                TxDroppedDataset,
                RxDroppedDataset,
                TxErrorsDataset,
                RxErrorsDataset,
                Dates
            })
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router