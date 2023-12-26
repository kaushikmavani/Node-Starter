import mongoose, { Schema } from "mongoose"

const keyShema = new Schema(
  {
    keyName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const Key = mongoose.model("Key", keyShema)

export default Key
