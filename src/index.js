import connectDB from "./config/db.config.js"
import config from "./config/app.config.js"
import { app } from "./app.js"

connectDB()
  .then(() => {
    console.log("Database Connected!")
    app.listen(config.app.port, () => {
      console.log(`Server is running on: ${config.app.port}`)
    })
  })
  .catch((error) => {
    console.log("MONGODB ERROR: ", error.message)
  })
