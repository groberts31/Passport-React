const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema ({
    dayOfWeek: {
        type: String,
        required: true,
      },
      time: {
        type: Number,
        required: true,
      },
      full:{
          type: Boolean,
          required: true
      }

});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;