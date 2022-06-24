import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Doughnut } from 'react-chartjs-2'
import { Bar, Line } from 'react-chartjs-2'
import { } from "materialize-css"
import { Parallax, Background } from 'react-parallax';
import { color } from '@mui/system';
import { Button } from 'react-materialize';
import { HashLoader } from 'react-spinners';
import Select from "react-select";
import { StylesConfig } from 'react-select';
import $ from 'jquery';
import { jsPDF } from "jspdf";

const customStyles = {
    container: provided => ({
        ...provided,
        width: 300
    })
};


function useInterval(callback, delay) {
    const savedCallback = useRef(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function useInterval2(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}


const GeneralData = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "whitesmoke" };
    const location = useLocation();
    const ref = useRef()

    const download = useCallback(() => {
        const link = document.createElement("a")
        link.download = "charts.png"
        link.href = ref.current.toBase64Image()
        link.click()
    }, [])

    const addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages()

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
                align: 'center'
            })
        }
    }

    const handlePdf = () => {
        var canvas1 = document.getElementById("myChart1")
        const canvasImage1 = canvas1.toDataURL('image/jpeg', 1.0)
        var canvas2 = document.getElementById("myChart2")
        const canvasImage2 = canvas2.toDataURL('image/jpeg', 1.0)
        var canvas3 = document.getElementById("myChart3")
        const canvasImage3 = canvas3.toDataURL('image/jpeg', 1.0)
        var canvas4 = document.getElementById("myChart4")
        const canvasImage4 = canvas4.toDataURL('image/jpeg', 1.0)
        var canvas5 = document.getElementById("myChart5")
        const canvasImage5 = canvas5.toDataURL('image/jpeg', 1.0)
        var canvas6 = document.getElementById("myChart6")
        const canvasImage6 = canvas6.toDataURL('image/jpeg', 1.0)
        var canvas7 = document.getElementById("myChart7")
        const canvasImage7 = canvas7.toDataURL('image/jpeg', 1.0)
        var canvas8 = document.getElementById("myChart8")
        const canvasImage8 = canvas8.toDataURL('image/jpeg', 1.0)
        var canvas9 = document.getElementById("myChart9")
        const canvasImage9 = canvas9.toDataURL('image/jpeg', 1.0)
        var canvas10 = document.getElementById("myChart10")
        const canvasImage10 = canvas10.toDataURL('image/jpeg', 1.0)

        var canvas11 = document.getElementById("myChart11")
        const canvasImage11 = canvas11.toDataURL('image/jpeg', 1.0)
        var canvas12 = document.getElementById("myChart12")
        const canvasImage12 = canvas12.toDataURL('image/jpeg', 1.0)
        var canvas13 = document.getElementById("myChart13")
        const canvasImage13 = canvas13.toDataURL('image/jpeg', 1.0)


        var date = new Date()
        let doc = new jsPDF();
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        doc.setFontSize(10);

        doc.setFontSize(15)
        doc.text("Container Monitoring Report - " + date.toDateString(), pageWidth / 2, 10, { align: 'center', textColor: 'black', fontSize: '40px' });

        doc.addImage(canvasImage1, "JPEG", (pageWidth - 140) / 2, 15, 140, 75);
        doc.addImage(canvasImage2, "JPEG", (pageWidth - 140) / 2, 100, 140, 75);
        doc.addImage(canvasImage3, "JPEG", (pageWidth - 140) / 2, 190, 140, 75);
        doc.addPage()

        doc.setFontSize(10);

        doc.addImage(canvasImage4, "JPEG", (pageWidth - 140) / 2, 15, 140, 75);
        doc.addImage(canvasImage5, "JPEG", (pageWidth - 140) / 2, 100, 140, 75);
        doc.addImage(canvasImage6, "JPEG", (pageWidth - 140) / 2, 190, 140, 75);
        doc.addPage()


        doc.addImage(canvasImage7, "JPEG", (pageWidth - 140) / 2, 15, 140, 75);
        doc.addImage(canvasImage8, "JPEG", (pageWidth - 140) / 2, 100, 140, 75);
        doc.addImage(canvasImage9, "JPEG", (pageWidth - 140) / 2, 190, 140, 75);
        doc.addPage()


        doc.addImage(canvasImage10, "JPEG", (pageWidth - 140) / 2, 15, 140, 75);
        doc.addImage(canvasImage11, "JPEG", (pageWidth - 140) / 2, 100, 140, 75);
        doc.addImage(canvasImage12, "JPEG", (pageWidth - 140) / 2, 190, 140, 75);
        doc.addPage()


        doc.addImage(canvasImage13, "JPEG", (pageWidth - 140) / 2, 15, 140, 75);
        addFooters(doc)
        doc.save('your-report-' + date.toUTCString() + ".pdf")
    }

    const [res, setRes] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)

    const [MemPercDataset, setMemPercDataset] = useState([])
    const [MemUsedDataset, setMemUsedDataset] = useState([])
    const [CacheDataset, setCacheDataset] = useState([])
    const [colors, setColors] = useState([])

    const [CpuPercDataset, setCpuPercDataset] = useState([])
    const [UserModeDataset, setUserModeDataset] = useState([])
    const [KernelModeDataset, setKernelModeDataset] = useState([])
    const [TxData, setTxData] = useState([])
    const [RxData, setRxData] = useState([])
    const [TxRxRateDataset, setTxRxRateDataset] = useState([])
    const [TxDroppedDataset, setTxDroppedDataset] = useState([])
    const [RxDroppedDataset, setRxDroppedDataset] = useState([])
    const [TxErrorsDataset, setTxErrorsDataset] = useState([])
    const [RxErrorsDataset, setRxErrorsDataset] = useState([])

    const idCluster = location.state.idCluster
    const domainName = location.state.domainName
    const nickname = location.state.nickname
    const idNode = location.state.idNode
    const NodeName = location.state.NodeName

    const [delay, setDelay] = useState(4000);
    const [delay2, setDelay2] = useState(4000);
    const [isRunning, setIsRunning] = useState(false);
    const [isRunning2, setIsRunning2] = useState(false);
    const [Dates, setDates] = useState([])
    const [LiveStarted, setLiveStarted] = useState(false)
    const [LiveStarted2, setLiveStarted2] = useState(false)

    const [selectedOption, setSelectedOption] = useState("none");
    const [options, setOptions] = useState([])




    // const options = [
    //     { value: "none", label: "Empty" },
    //     { value: "left", label: "Open Left" },
    //     { value: "right", label: "Open Right" },
    //     {
    //         value: "tilt,left",
    //         label: "Tilf and Open Left"
    //     },
    //     {
    //         value: "tilt,right",
    //         label: "Tilf and Open Right"
    //     }
    // ];


    const handleTypeSelect = e => {
        Stoplive()
        Stoplive_container()
        setIsRunning(false)
        setIsRunning2(false)
        setSelectedOption(e.value);
        setSelectedValue(e.label)
        if (e.label != "View All") {
            setLoading(false)
            fetch("/getGeneralDataForContainer", {
                method: "post",
                headers:
                {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCluster: idCluster,
                    idNode: idNode,
                    idContainer: e.value
                })
            }).then(res => res.json())
                .then(result => {
                    let aux_memPerc = result.MemPercDataset
                    let aux_memUsed = result.MemUsedDataset
                    let aux_cache = result.CacheDataset
                    let aux_cpuPerc = result.CpuPercDataset
                    let aux_userMode = result.UserModeDataset
                    let aux_kernelMode = result.KernelModeDataset
                    let aux_TxData = result.TxData
                    let aux_RxData = result.RxData
                    let aux_TxRxRate = result.TxRxRateDataset
                    let aux_TxDropped = result.TxDroppedDataset
                    let aux_RxDropped = result.RxDroppedDataset
                    let aux_TxErrors = result.TxErrorsDataset
                    let aux_RxErrors = result.RxErrorsDataset


                    console.log(e.label)
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].label == e.label) {
                            console.log(options[i].label)
                            aux_memPerc[0]['backgroundColor'] = colors[i][1]
                            aux_memPerc[0]['borderColor'] = colors[i][0]

                            aux_memUsed[0]['backgroundColor'] = colors[i][1]
                            aux_memUsed[0]['borderColor'] = colors[i][0]

                            aux_cache[0]['backgroundColor'] = colors[i][1]
                            aux_cache[0]['borderColor'] = colors[i][0]

                            aux_cpuPerc[0]['backgroundColor'] = colors[i][1]
                            aux_cpuPerc[0]['borderColor'] = colors[i][0]

                            aux_userMode[0]['backgroundColor'] = colors[i][1]
                            aux_userMode[0]['borderColor'] = colors[i][0]

                            aux_kernelMode[0]['backgroundColor'] = colors[i][1]
                            aux_kernelMode[0]['borderColor'] = colors[i][0]

                            aux_TxData[0]['backgroundColor'] = colors[i][1]
                            aux_TxData[0]['borderColor'] = colors[i][0]

                            aux_RxData[0]['backgroundColor'] = colors[i][1]
                            aux_RxData[0]['borderColor'] = colors[i][0]

                            aux_TxRxRate[0]['backgroundColor'] = colors[i][1]
                            aux_TxRxRate[0]['borderColor'] = colors[i][0]

                            aux_TxDropped[0]['backgroundColor'] = colors[i][1]
                            aux_TxDropped[0]['borderColor'] = colors[i][0]

                            aux_RxDropped[0]['backgroundColor'] = colors[i][1]
                            aux_RxDropped[0]['borderColor'] = colors[i][0]

                            aux_TxErrors[0]['backgroundColor'] = colors[i][1]
                            aux_TxErrors[0]['borderColor'] = colors[i][0]

                            aux_RxErrors[0]['backgroundColor'] = colors[i][1]
                            aux_RxErrors[0]['borderColor'] = colors[i][0]

                            console.log(aux_memPerc)
                            setMemPercDataset(aux_memPerc)
                            setMemUsedDataset(aux_memUsed)
                            setCacheDataset(aux_cache)
                            setCpuPercDataset(aux_cpuPerc)
                            setUserModeDataset(aux_userMode)
                            setKernelModeDataset(aux_kernelMode)
                            setTxData(aux_TxData)
                            setRxData(aux_RxData)
                            setTxRxRateDataset(aux_TxRxRate)
                            setTxDroppedDataset(aux_TxDropped)
                            setRxDroppedDataset(aux_RxDropped)
                            setTxErrorsDataset(aux_TxErrors)
                            setRxErrorsDataset(aux_RxErrors)
                            setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))

                        }
                    }

                    setLoading(true)

                })

        }
        else {
            setLoading(false)
            fetch("/getGeneralData", {
                method: "post",
                headers:
                {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCluster: idCluster,
                    idNode: idNode
                })
            }).then(res => res.json())
                .then(result => {

                    let aux_memPerc = result.MemPercDataset
                    let aux_memUsed = result.MemUsedDataset
                    let aux_cache = result.CacheDataset
                    let aux_cpuPerc = result.CpuPercDataset
                    let aux_userMode = result.UserModeDataset
                    let aux_kernelMode = result.KernelModeDataset
                    let aux_TxData = result.TxData
                    let aux_RxData = result.RxData
                    let aux_TxRxRate = result.TxRxRateDataset
                    let aux_TxDropped = result.TxDroppedDataset
                    let aux_RxDropped = result.RxDroppedDataset
                    let aux_TxErrors = result.TxErrorsDataset
                    let aux_RxErrors = result.RxErrorsDataset

                    for (let i = 0; i < result.MemPercDataset.length; i++) {
                        // let color_aux = dynamicColors()
                        // setColors(colors => [...colors, [color_aux[0], color_aux[1]]])


                        aux_memPerc[i]['backgroundColor'] = colors[i][1]
                        aux_memPerc[i]['borderColor'] = colors[i][0]

                        aux_memUsed[i]['backgroundColor'] = colors[i][1]
                        aux_memUsed[i]['borderColor'] = colors[i][0]

                        aux_cache[i]['backgroundColor'] = colors[i][1]
                        aux_cache[i]['borderColor'] = colors[i][0]

                        aux_cpuPerc[i]['backgroundColor'] = colors[i][1]
                        aux_cpuPerc[i]['borderColor'] = colors[i][0]

                        aux_userMode[i]['backgroundColor'] = colors[i][1]
                        aux_userMode[i]['borderColor'] = colors[i][0]

                        aux_kernelMode[i]['backgroundColor'] = colors[i][1]
                        aux_kernelMode[i]['borderColor'] = colors[i][0]

                        aux_TxData[i]['backgroundColor'] = colors[i][1]
                        aux_TxData[i]['borderColor'] = colors[i][0]

                        aux_RxData[i]['backgroundColor'] = colors[i][1]
                        aux_RxData[i]['borderColor'] = colors[i][0]

                        aux_TxRxRate[i]['backgroundColor'] = colors[i][1]
                        aux_TxRxRate[i]['borderColor'] = colors[i][0]

                        aux_TxDropped[i]['backgroundColor'] = colors[i][1]
                        aux_TxDropped[i]['borderColor'] = colors[i][0]

                        aux_RxDropped[i]['backgroundColor'] = colors[i][1]
                        aux_RxDropped[i]['borderColor'] = colors[i][0]

                        aux_TxErrors[i]['backgroundColor'] = colors[i][1]
                        aux_TxErrors[i]['borderColor'] = colors[i][0]

                        aux_RxErrors[i]['backgroundColor'] = colors[i][1]
                        aux_RxErrors[i]['borderColor'] = colors[i][0]
                    }
                    console.log("alex")

                    setMemPercDataset(aux_memPerc)
                    setMemUsedDataset(aux_memUsed)
                    setCacheDataset(aux_cache)
                    setCpuPercDataset(aux_cpuPerc)
                    setUserModeDataset(aux_userMode)
                    setKernelModeDataset(aux_kernelMode)
                    setTxData(aux_TxData)
                    setRxData(aux_RxData)
                    setTxRxRateDataset(aux_TxRxRate)
                    setTxDroppedDataset(aux_TxDropped)
                    setRxDroppedDataset(aux_RxDropped)
                    setTxErrorsDataset(aux_TxErrors)
                    setRxErrorsDataset(aux_RxErrors)
                    setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))
                    setLoading(true)

                })

        }

    };

    const Startlive = () => {
        setIsRunning(true)
        setLiveStarted(true)
    }

    const Startlive_container = () => {

        setIsRunning2(true)
        setLiveStarted2(true)
    }

    const Stoplive_container = () => {
        setIsRunning2(false)
        setLiveStarted2(false)
    }

    const Stoplive = () => {
        setIsRunning(false)
        setLiveStarted(false)

    }

    var dynamicColors = function () {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        let color = []
        color[0] = "rgb(" + r + "," + g + "," + b + ")"
        color[1] = "rgb(" + r + "," + g + "," + b + ",0.1)"
        return color;
    };

    useEffect(() => {
        console.log(idNode)
        console.log(selectedOption)
        console.log(idNode)
        fetch("/getGeneralData", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster,
                idNode: idNode
            })
        }).then(res => res.json())
            .then(result => {

                console.log(result)
                setOptions(result.AllContainersDataset)
                setOptions(options => [...options, { value: "View All", label: "View All" }])





                let aux_memPerc = result.MemPercDataset
                let aux_memUsed = result.MemUsedDataset
                let aux_cache = result.CacheDataset
                let aux_cpuPerc = result.CpuPercDataset
                let aux_userMode = result.UserModeDataset
                let aux_kernelMode = result.KernelModeDataset
                let aux_TxData = result.TxData
                let aux_RxData = result.RxData
                let aux_TxRxRate = result.TxRxRateDataset
                let aux_TxDropped = result.TxDroppedDataset
                let aux_RxDropped = result.RxDroppedDataset
                let aux_TxErrors = result.TxErrorsDataset
                let aux_RxErrors = result.RxErrorsDataset

                for (let i = 0; i < result.MemPercDataset.length; i++) {
                    let color_aux = dynamicColors()
                    setColors(colors => [...colors, [color_aux[0], color_aux[1]]])


                    aux_memPerc[i]['backgroundColor'] = color_aux[1]
                    aux_memPerc[i]['borderColor'] = color_aux[0]

                    aux_memUsed[i]['backgroundColor'] = color_aux[1]
                    aux_memUsed[i]['borderColor'] = color_aux[0]

                    aux_cache[i]['backgroundColor'] = color_aux[1]
                    aux_cache[i]['borderColor'] = color_aux[0]

                    aux_cpuPerc[i]['backgroundColor'] = color_aux[1]
                    aux_cpuPerc[i]['borderColor'] = color_aux[0]

                    aux_userMode[i]['backgroundColor'] = color_aux[1]
                    aux_userMode[i]['borderColor'] = color_aux[0]

                    aux_kernelMode[i]['backgroundColor'] = color_aux[1]
                    aux_kernelMode[i]['borderColor'] = color_aux[0]

                    aux_TxData[i]['backgroundColor'] = color_aux[1]
                    aux_TxData[i]['borderColor'] = color_aux[0]

                    aux_RxData[i]['backgroundColor'] = color_aux[1]
                    aux_RxData[i]['borderColor'] = color_aux[0]

                    aux_TxRxRate[i]['backgroundColor'] = color_aux[1]
                    aux_TxRxRate[i]['borderColor'] = color_aux[0]

                    aux_TxDropped[i]['backgroundColor'] = color_aux[1]
                    aux_TxDropped[i]['borderColor'] = color_aux[0]

                    aux_RxDropped[i]['backgroundColor'] = color_aux[1]
                    aux_RxDropped[i]['borderColor'] = color_aux[0]

                    aux_TxErrors[i]['backgroundColor'] = color_aux[1]
                    aux_TxErrors[i]['borderColor'] = color_aux[0]

                    aux_RxErrors[i]['backgroundColor'] = color_aux[1]
                    aux_RxErrors[i]['borderColor'] = color_aux[0]
                }

                setMemPercDataset(aux_memPerc)
                setMemUsedDataset(aux_memUsed)
                setCacheDataset(aux_cache)
                setCpuPercDataset(aux_cpuPerc)
                setUserModeDataset(aux_userMode)
                setKernelModeDataset(aux_kernelMode)
                setTxData(aux_TxData)
                setRxData(aux_RxData)
                setTxRxRateDataset(aux_TxRxRate)
                setTxDroppedDataset(aux_TxDropped)
                setRxDroppedDataset(aux_RxDropped)
                setTxErrorsDataset(aux_TxErrors)
                setRxErrorsDataset(aux_RxErrors)
                setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))
                setLoading(true)

            })


    }, [])

    useInterval(() => {
        fetch("/getGeneralData", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster,
                idNode: idNode
            })
        }).then(res => res.json())
            .then(result => {

                let aux_memPerc = result.MemPercDataset
                let aux_memUsed = result.MemUsedDataset
                let aux_cache = result.CacheDataset
                let aux_cpuPerc = result.CpuPercDataset
                let aux_userMode = result.UserModeDataset
                let aux_kernelMode = result.KernelModeDataset
                let aux_TxData = result.TxData
                let aux_RxData = result.RxData
                let aux_TxRxRate = result.TxRxRateDataset
                let aux_TxDropped = result.TxDroppedDataset
                let aux_RxDropped = result.RxDroppedDataset
                let aux_TxErrors = result.TxErrorsDataset
                let aux_RxErrors = result.RxErrorsDataset

                for (let i = 0; i < result.MemPercDataset.length; i++) {
                    // let color_aux = dynamicColors()
                    // setColors(colors => [...colors, [color_aux[0], color_aux[1]]])


                    aux_memPerc[i]['backgroundColor'] = colors[i][1]
                    aux_memPerc[i]['borderColor'] = colors[i][0]

                    aux_memUsed[i]['backgroundColor'] = colors[i][1]
                    aux_memUsed[i]['borderColor'] = colors[i][0]

                    aux_cache[i]['backgroundColor'] = colors[i][1]
                    aux_cache[i]['borderColor'] = colors[i][0]

                    aux_cpuPerc[i]['backgroundColor'] = colors[i][1]
                    aux_cpuPerc[i]['borderColor'] = colors[i][0]

                    aux_userMode[i]['backgroundColor'] = colors[i][1]
                    aux_userMode[i]['borderColor'] = colors[i][0]

                    aux_kernelMode[i]['backgroundColor'] = colors[i][1]
                    aux_kernelMode[i]['borderColor'] = colors[i][0]

                    aux_TxData[i]['backgroundColor'] = colors[i][1]
                    aux_TxData[i]['borderColor'] = colors[i][0]

                    aux_RxData[i]['backgroundColor'] = colors[i][1]
                    aux_RxData[i]['borderColor'] = colors[i][0]

                    aux_TxRxRate[i]['backgroundColor'] = colors[i][1]
                    aux_TxRxRate[i]['borderColor'] = colors[i][0]

                    aux_TxDropped[i]['backgroundColor'] = colors[i][1]
                    aux_TxDropped[i]['borderColor'] = colors[i][0]

                    aux_RxDropped[i]['backgroundColor'] = colors[i][1]
                    aux_RxDropped[i]['borderColor'] = colors[i][0]

                    aux_TxErrors[i]['backgroundColor'] = colors[i][1]
                    aux_TxErrors[i]['borderColor'] = colors[i][0]

                    aux_RxErrors[i]['backgroundColor'] = colors[i][1]
                    aux_RxErrors[i]['borderColor'] = colors[i][0]
                }
                console.log("alex")

                setMemPercDataset(aux_memPerc)
                setMemUsedDataset(aux_memUsed)
                setCacheDataset(aux_cache)
                setCpuPercDataset(aux_cpuPerc)
                setUserModeDataset(aux_userMode)
                setKernelModeDataset(aux_kernelMode)
                setTxData(aux_TxData)
                setRxData(aux_RxData)
                setTxRxRateDataset(aux_TxRxRate)
                setTxDroppedDataset(aux_TxDropped)
                setRxDroppedDataset(aux_RxDropped)
                setTxErrorsDataset(aux_TxErrors)
                setRxErrorsDataset(aux_RxErrors)
                setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))

            })





    }, isRunning ? delay : null);

    useInterval2(() => {
        fetch("/getGeneralDataForContainer", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idCluster: idCluster,
                idNode: idNode,
                idContainer: selectedOption.valueOf("value").toString()
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                let aux_memPerc = result.MemPercDataset
                let aux_memUsed = result.MemUsedDataset
                let aux_cache = result.CacheDataset
                let aux_cpuPerc = result.CpuPercDataset
                let aux_userMode = result.UserModeDataset
                let aux_kernelMode = result.KernelModeDataset
                let aux_TxData = result.TxData
                let aux_RxData = result.RxData
                let aux_TxRxRate = result.TxRxRateDataset
                let aux_TxDropped = result.TxDroppedDataset
                let aux_RxDropped = result.RxDroppedDataset
                let aux_TxErrors = result.TxErrorsDataset
                let aux_RxErrors = result.RxErrorsDataset


                for (let i = 0; i < options.length; i++) {
                    if (options[i].label == selectedValue) {
                        console.log(options[i].label)
                        aux_memPerc[0]['backgroundColor'] = colors[i][1]
                        aux_memPerc[0]['borderColor'] = colors[i][0]

                        aux_memUsed[0]['backgroundColor'] = colors[i][1]
                        aux_memUsed[0]['borderColor'] = colors[i][0]

                        aux_cache[0]['backgroundColor'] = colors[i][1]
                        aux_cache[0]['borderColor'] = colors[i][0]

                        aux_cpuPerc[0]['backgroundColor'] = colors[i][1]
                        aux_cpuPerc[0]['borderColor'] = colors[i][0]

                        aux_userMode[0]['backgroundColor'] = colors[i][1]
                        aux_userMode[0]['borderColor'] = colors[i][0]

                        aux_kernelMode[0]['backgroundColor'] = colors[i][1]
                        aux_kernelMode[0]['borderColor'] = colors[i][0]

                        aux_TxData[0]['backgroundColor'] = colors[i][1]
                        aux_TxData[0]['borderColor'] = colors[i][0]

                        aux_RxData[0]['backgroundColor'] = colors[i][1]
                        aux_RxData[0]['borderColor'] = colors[i][0]

                        aux_TxRxRate[0]['backgroundColor'] = colors[i][1]
                        aux_TxRxRate[0]['borderColor'] = colors[i][0]

                        aux_TxDropped[0]['backgroundColor'] = colors[i][1]
                        aux_TxDropped[0]['borderColor'] = colors[i][0]

                        aux_RxDropped[0]['backgroundColor'] = colors[i][1]
                        aux_RxDropped[0]['borderColor'] = colors[i][0]

                        aux_TxErrors[0]['backgroundColor'] = colors[i][1]
                        aux_TxErrors[0]['borderColor'] = colors[i][0]

                        aux_RxErrors[0]['backgroundColor'] = colors[i][1]
                        aux_RxErrors[0]['borderColor'] = colors[i][0]

                        console.log(aux_memPerc)
                        setMemPercDataset(aux_memPerc)
                        setMemUsedDataset(aux_memUsed)
                        setCacheDataset(aux_cache)
                        setCpuPercDataset(aux_cpuPerc)
                        setUserModeDataset(aux_userMode)
                        setKernelModeDataset(aux_kernelMode)
                        setTxData(aux_TxData)
                        setRxData(aux_RxData)
                        setTxRxRateDataset(aux_TxRxRate)
                        setTxDroppedDataset(aux_TxDropped)
                        setRxDroppedDataset(aux_RxDropped)
                        setTxErrorsDataset(aux_TxErrors)
                        setRxErrorsDataset(aux_RxErrors)
                        setDates(result.Dates[0].map(date => new Date(date).toUTCString([], { hour: '2-digit', minute: '2-digit' })))

                    }
                }


            })





    }, isRunning2 ? delay2 : null);


    return (
        <div id="reportPage">

            <div style={{ textAlign: "center" }}>
                <b id='white-text' style={{ fontSize: '30px', fontStyle: 'italic' }}>General Data for Cluster</b>
                <br></br>
                <b id='white-text' style={{ fontSize: '30px', fontStyle: 'italic' }}>with nickname <b id='blue-text' style={{ fontSize: '30px' }}>{nickname}</b></b>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <div>
                        {
                            LiveStarted ? <></> : <><Select
                                styles={customStyles}
                                options={options}
                                onChange={handleTypeSelect}
                                value={options.filter(function (option) {
                                    return option.value === selectedOption;
                                })}
                                label="Single select"
                            /></>
                        }

                    </div>
                </div>
            </div>


            {
                loading ? <div style={{ overflow: 'hidden', height: '6500px' }}>
                    <div style={{ textAlign: "center" }}>
                        <div>
                            {LiveStarted ? <><Button id='blue-button' onClick={() => Stoplive()} style={{ marginTop: '30px' }}>Stop RealTime</Button><br></br><b id='white-text' style={{ fontSize: '15px' }}>RealTime Data showing...</b>
                            </> :
                                <>
                                    {
                                        selectedOption == "View All" || selectedOption == "none" ? <><Button id='blue-button' onClick={() => Startlive()} style={{ marginTop: '30px' }}>View RealTime Data</Button></> :
                                            <>
                                                {
                                                    LiveStarted2 ? <></> : <><Button id='blue-button' onClick={() => Startlive_container()} style={{ marginTop: '30px' }}>
                                                        View RealTime Data for Container
                                                    </Button></>
                                                }

                                            </>
                                    }


                                </>
                            }


                        </div>

                        <div>

                            {
                                LiveStarted2 ? <><Button id='blue-button' onClick={() => Stoplive_container()} style={{ marginTop: '30px' }}>Stop RealTime</Button><br></br><b id='white-text' style={{ fontSize: '15px' }}>RealTime Data showing for container...</b></> : <></>
                            }
                        </div>

                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button id="blue-button" onClick={handlePdf}>download PDF REPORT</Button>
                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '100px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '60px', marginLeft: '100px'
                    }}>

                        <div style={{ width: '825px', height: '600px' }}>

                            <Line ref={ref} id="myChart1" data={{
                                labels: Dates,
                                datasets: MemPercDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'MEMORY USAGE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                            {/* <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Button id="blue-button" onClick={download}>download</Button>
                            </div> */}
                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar id="myChart2" data={{
                                labels: Dates,
                                datasets: MemUsedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'MEMORY USED (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar id="myChart3" data={{
                                labels: Dates,
                                datasets: CacheDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'CACHE (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '100px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart4" data={{
                                labels: Dates,
                                datasets: CpuPercDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'CPU PERCENTAGE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />


                        </div>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart5" data={{
                                labels: Dates,
                                datasets: UserModeDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'USER MODE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart6" data={{
                                labels: Dates,
                                datasets: KernelModeDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'KERNEL MODE %',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>



                    </div>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '150px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar id="myChart7" data={{
                                labels: Dates,
                                datasets: TxData
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX Data (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar id="myChart8" data={{
                                labels: Dates,
                                datasets: RxData
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX Data (MIB)',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Bar id="myChart9" data={{
                                labels: Dates,
                                datasets: TxRxRateDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX/RX RATE',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '150px', textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '200px', marginLeft: '100px'
                    }}>
                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart10" data={{
                                labels: Dates,
                                datasets: TxDroppedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX PACKETS DROPPED',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart11" data={{
                                labels: Dates,
                                datasets: RxDroppedDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX PACKETS DROPPED',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart12" data={{
                                labels: Dates,
                                datasets: TxErrorsDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'TX PACKETS ERRORS',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                        <div style={{ width: '825px', height: '600px' }}>
                            <Line id="myChart13" data={{
                                labels: Dates,
                                datasets: RxErrorsDataset
                            }} options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'RX PACKETS ERRORS',
                                        color: 'white',
                                        font: {
                                            size: 30 // 'size' now within object 'font {}'
                                        }
                                    },  // 'legend' now within object 'plugins {}'
                                    legend: {
                                        labels: {
                                            color: "white",  // not 'fontColor:' anymore
                                            // fontSize: 18  // not 'fontSize:' anymore
                                            font: {
                                                size: 15 // 'size' now within object 'font {}'
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: 'white'
                                        },
                                        grid: {
                                            color: 'rgb(40,44,52)',
                                            borderColor: 'white'
                                        }
                                    },
                                }
                            }} height={250} />
                        </div>

                    </div>

                </div> : <div style={style}><HashLoader color='white' speedMultiplier={2}></HashLoader></div>
            }
        </div >


    )

}

export default GeneralData