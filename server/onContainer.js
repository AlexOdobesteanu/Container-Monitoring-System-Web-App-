const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
MONGOURI = "mongodb+srv://student:Alex27012000@cluster0.t2azq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})

mongoose.connection.on('error', (err) => {
    console.log("err connecting", err)
})

const cpuSchema = new mongoose.Schema({
    forContainer:
    {
        type: ObjectId,
        ref: "Container"
    },
    usePercentage:
    {
        type: String,
        required: true,
    }
})

mongoose.model("cpuModel", cpuSchema)




const interval = setInterval(function () {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python3', ['./script.py']);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString())
        // const cpuM = new cpuModel({
        //     forContainer: forContainer,
        //     usePercentage: data.toString()
        // })
        // cpuM.save().then(cpuM => {
        //     res.json(data.toString())
        // })
        //     .catch(err => {
        //         console.log(err)
        //     })
    });
    // method to be executed;
}, 2000);