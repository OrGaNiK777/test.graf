import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
	// Обработка подключения сокетов
	io.on('connection', (socket) => {
		console.log(`User connected: ${socket.id}`)

		socket.on('joinDialog', (dialogId) => {
			socket.join(dialogId) // Добавление пользователя в комнату по dialogId
		})

		socket.on('leaveDialog', (dialogId) => {
			socket.leave(dialogId) // Удаляем пользователя из комнаты
		})

		socket.on('typing', ({ dialogId, user }) => {
			// Отправляем статус печати всем участникам диалога
			socket.broadcast.emit('typing', { dialogId, user }) // Используем broadcast, чтобы не отправлять сообщение текущему пользователю
		})

		socket.on('stop_typing', () => {
			socket.broadcast.emit('user_stopped_typing')
		})

		// Обработка получения сообщений
		socket.on('message', ({ dialogId, message }) => {
			socket.broadcast.emit('message', { dialogId, message }) // Отправка сообщения только в нужный диалог
		})

		// Обработка отключения пользователя
		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`)
		})
	})
}
