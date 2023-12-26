import express from "express"
import cors from "cors"
import errorHandler from "./utils/errorHandler.js"
import router from "./routers/index.router.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.set("view engine", "ejs")
app.set("views", "views")

app.use("/api", router)

errorHandler(app)

export { app }
