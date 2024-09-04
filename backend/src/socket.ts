import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
	let dialogs: { [key: string]: Dialog } = {} // Хранение диалогов
	let messages: { [dialogId: string]: Message[] } = {}

	// Обработка подключения сокетов
	io.on('connection', (socket) => {
		console.log(`Пользователь подключен: ${socket.id}`)

		// Пользователь входит в диалог
		socket.on('joinDialog', (dialogId: string) => {
			socket.join(dialogId) // Добавление пользователя в комнату по dialogId
		})

		// Пользователь покидает диалог
		socket.on('leaveDialog', (dialogId: string) => {
			socket.leave(dialogId) // Удаление пользователя из комнаты
		})

		// Предположим, что это в файле с настройками сокета
		socket.on('getPreviousMessages', (dialogId) => {
			if (messages[dialogId]) {
				socket.emit('previousMessages', messages[dialogId])
			}
		})

		// Отправляем список диалогов при подключении
		socket.emit('dialogs', Object.values(dialogs))

		// Пользователь печатает в диалоге
		socket.on('typing', ({ dialogId, user }: { dialogId: string; user: string }) => {
			// Отправляем статус печати всем участникам диалога
			socket.broadcast.emit('typing', { dialogId, user }) // Используем broadcast, чтобы не отправлять сообщение текущему пользователю
		})

		// Пользователь остановил печать
		socket.on('stop_typing', () => {
			socket.broadcast.emit('user_stopped_typing')
		})

		// Обработка входящих сообщений
		socket.on('message', (data: { message: Message; dialogId: string }) => {
			const { message, dialogId } = data
			// Добавляем сообщение в соответствующий диалог
			if (!messages[dialogId]) {
				messages[dialogId] = []
			}
			messages[dialogId].push(message)
			console.log(messages)
			// Добавляем диалог, если его еще нет
			if (!dialogs[dialogId]) {
				console.log(`Создался диалок: ${dialogId}`)
				dialogs[dialogId] = { id: dialogId, name: dialogId } // Можно изменить на более удобное имя
			}

			// Отправляем обновления всем клиентам
			io.emit('message', { dialogId, message })
			io.emit('dialogs', Object.values(dialogs)) // Отправляем обновленный список диалогов
		})

		// Обработка отключения пользователя
		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id)

			delete dialogs[socket.id]
			delete messages[socket.id]
			io.emit('dialogs', Object.values(dialogs))
		})
	})
}

interface Message {
	id: number
	user: string
	text: string
}

interface Dialog {
	id: string
	name: string
}
