import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
	let dialogs = {} // Хранение диалогов
	// Обработка подключения сокетов
	io.on('connection', (socket) => {
		console.log(`User connected: ${socket.id}`)

		socket.on('joinDialog', (dialogId) => {
			socket.join(dialogId) // Добавление пользователя в комнату по dialogId
		})

		socket.on('leaveDialog', (dialogId) => {
			socket.leave(dialogId) // Удаляем пользователя из комнаты
		})
		socket.on('createDialog', ({ userId }) => {
			// Создаем новый диалог для клиента
			if (!dialogs[userId]) {
				dialogs[userId] = {
					id: userId,
					messages: [], // Массив сообщений для этого диалога
				}
				console.log(`Dialog created for user: ${userId}`)
			}
		})

		socket.on('typing', ({ dialogId, user }) => {
			// Отправляем статус печати всем участникам диалога
			socket.broadcast.emit('typing', { dialogId, user }) // Используем broadcast, чтобы не отправлять сообщение текущему пользователю
		})

		socket.on('stop_typing', () => {
			socket.broadcast.emit('user_stopped_typing')
		})

		// Обработка получения сообщений
		socket.on('message', (message) => {
			const { user } = message // Извлекаем ID пользователя из сообщения
			if (dialogs[user]) {
				dialogs[user].messages.push(message) // Добавляем сообщение в соответствующий диалог
				// Отправляем сообщение всем участникам диалога
				io.emit('message', message)
			}
		})

		// Обработка отключения пользователя
		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`)
		})
	})
}
