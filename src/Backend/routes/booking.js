const express = require("express");
const router = express.Router();
const booking = require("../controllers/booking.controller")
const { uploadvideo } = require("../utils/savestorage")

router.get("/", booking.getBookings);
router.post("/", booking.createBooking); 
router.get("/:id", booking.getBooking);
router.put("/:id",uploadvideo.single('video'),booking.editBooking);
router.delete("/:id", booking.deleteBooking);



module.exports = router 