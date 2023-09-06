import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import router from "./routes/index.routes"

const app = express()

dotenv.config()

app
.use(cors())
.use(express.json())
.use(router)
.get('/health', (req, res) => res.send("I'm okay!"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Servidor conectado a porta ${PORT}`))