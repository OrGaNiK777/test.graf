import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { setupSocket } from './socket'
import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type'],
	},
})
app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	})
)
app.use('/images', express.static(path.join(__dirname, '../public')))

const images = ['/image1.png', '/image2.png', '/image3.png', '/image4.png', '/image5.png', '/image6.png', '/image7.png']

app.get('/images', (req, res) => {
	res.json(images)
})
setupSocket(io)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
