const Booking = require("../models/booking");
const { converter } = require("../utils/converter");

const BookingCtrl = {};


BookingCtrl.getBookings = async (req, res, next) => {
    try {
        const save = await Booking.find();
        res.status(200).send(save)
    } catch (err) {
        res.status(400).send(err)

    }
};

BookingCtrl.createBooking = async (req, res, next) => {
    try {
        const { video, response } = req.body;
        const body = { video, response };
        console.log(body)
        var save = await Booking.create(body);
        res.status(200).send(save)
    } catch (err) {
        res.status(400).send(err)

    }
};


BookingCtrl.getBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const save = await Booking.find({ email: id });
        res.status(200).send(save)
    } catch (err) {
        res.status(400).send(err)

    }
};




BookingCtrl.editBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const  video  = req.file.filename;
        const parts = video.split(".");
        await converter(video, parts[0])

        let save = await Booking.findById(id);
        console.log(save.video.length)
        if (save.video.length> 0){
            await openAi(`${parts[0]}.mp3`,save.video[0]);
            save.video.pop()
        }else{
            save.video.push(`${parts[0]}.mp3`)
        }
        const res = await Booking.findByIdAndUpdate(save._id,save)

        res.status(200).send({ status: "Nice" })
    } catch (err) {
        res.status(400).send(err)
    }

};

BookingCtrl.deleteBooking = async (req, res, next) => {
    try {
        await Booking.findByIdAndRemove(req.params.id);
        res.json({ status: "Booking Deleted" });
    } catch (err) {
        res.status(400).send(err)
    }
};

const { whisper,resumen } = require("../utils/openai");

 const openAi = async (video1,video2) =>{
    const transcription = await whisper(video1,video2)
    const dep = await resumen(transcription.transcription1.text,transcription.transcription2.text)
    const data =dep.split("'");
    //Pues, me fue muy bien, gracias, concuerdo contigo deberiamos hacer la lista prontamente
    const res = data[3];
    const pen = data[7];
    console.log(res)
    console.log(pen)

    
 }

module.exports = BookingCtrl;