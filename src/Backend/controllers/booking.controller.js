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
        const { video } = req.body;
        const parts = video.split(".");
        converter(video, parts[0]).then(() => {
            console.log('Conversion completa');
        }).catch(err => {
            console.error('Error:', err);
        });


        save = await Booking.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).send(save)
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




module.exports = BookingCtrl;