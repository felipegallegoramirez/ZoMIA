const mongoose = require("mongoose");
//const mongoosePaginate = require("mongoose-paginate-v2");
//const mongoosePaginateAggregate = require("mongoose-aggregate-paginate-v2");
const StorageScheme = new mongoose.Schema(
  {
    video: [{
      type: String,
      required: true,
    }],
    response: {
      type: String,
    },
    

  },


  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", StorageScheme);