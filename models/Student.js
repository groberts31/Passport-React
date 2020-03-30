const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema ({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
        unique: true
      },
      attending:{
          type: Boolean
      },
      lessons: [
          {
          type: Schema.Types.ObjectId,
          ref: "Lesson"
          }
      ]

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;