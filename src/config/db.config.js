import mongoose from "mongoose"
import config from "../config/app.config.js"

export default async () => {
  try {
    if (config.db.mongoURI === undefined) {
      throw new Error("Mongodb URI is missing.")
    }
    await mongoose.connect(config.db.mongoURI)
  } catch (error) {
    console.log(`MONGODB ERROR: ${error.message}`)
    process.exit(1)
  }
}
