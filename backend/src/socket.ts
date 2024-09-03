import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
	let dialogs: { [userId: string]: Dialog } = {} // Хранение диалогов

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

		// Создание нового диалога для клиента
		socket.on('createDialog', ({ userId }: { userId: string }) => {
			if (!dialogs[userId]) {
				dialogs[userId] = {
					id: userId,
					messages: [], // Массив сообщений для этого диалога
				}
				console.log(`Диалог создан для пользователя: ${userId}`)
			}
		})

		// Пользователь печатает в диалоге
		socket.on('typing', ({ dialogId, user }: { dialogId: string; user: string }) => {
			// Отправляем статус печати всем участникам диалога
			socket.broadcast.emit('typing', { dialogId, user }) // Используем broadcast, чтобы не отправлять сообщение текущему пользователю
		})

		// Пользователь остановил печать
		socket.on('stop_typing', () => {
			socket.broadcast.emit('user_stopped_typing')
		})

		// Обработка получения сообщений
		socket.on('message', (message: Message) => {
			const { user } = message // Извлекаем ID пользователя из сообщения
			if (dialogs[user]) {
				dialogs[user].messages.push(message) // Добавляем сообщение в соответствующий диалог
				// Отправляем сообщение всем участникам диалога
				io.emit('message', message)
			}
		})

		// Обработка отключения пользователя
		socket.on('disconnect', () => {
			console.log(`Пользователь отключен: ${socket.id}`)
		})
	})
}

// Определение типов для диалога и сообщения
interface Dialog {
	id: string // Идентификатор пользователя
	messages: Message[] // Сообщения в диалоге
}

interface Message {
	user: string // Идентификатор пользователя, отправившего сообщение
	content: string // Содержимое сообщения
}
