// models/DailyslotModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailySlotSchema = new Schema({
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop', // Assuming there is a Shop model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  availableSpiceCapacity: {
    type: Number,
    required: true,
  },
  slots: [
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],
});

const DailySlot = mongoose.model('DailySlot', dailySlotSchema);

module.exports = DailySlot;
