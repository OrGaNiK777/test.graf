import { Server } from 'socket.io'

export const setupSocket = (io: Server) => {
	let dialogs: { [key: string]: Dialog } = {}
	let messages: { [dialogId: string]: Message[] } = {}

	io.on('connection', (socket) => {
		console.log(`Пользователь подключен: ${socket.id}`)

		socket.on('joinDialog', (dialogId: string) => {
			socket.join(dialogId)
		})

		socket.on('leaveDialog', (dialogId: string) => {
			socket.leave(dialogId)
		})

		socket.on('getPreviousMessages', (dialogId) => {
			if (messages[dialogId]) {
				socket.emit('previousMessages', messages[dialogId])
			}
		})

		socket.emit(
			'dialogs',
			Object.values(dialogs).map((dialog) => ({
				...dialog,
				lastMessage: messages[dialog.id]?.[messages[dialog.id].length - 1].text || null,
			}))
		)

		socket.on('typing', ({ dialogId, user }: { dialogId: string; user: string }) => {
			socket.broadcast.emit('typing', { dialogId, user })
		})

		socket.on('stop_typing', () => {
			socket.broadcast.emit('user_stopped_typing')
		})

		socket.on('message', (data: { message: Message; dialogId: string }) => {
			const { message, dialogId } = data
			if (!messages[dialogId]) {
				messages[dialogId] = []
			}
			messages[dialogId].push(message)

			if (!dialogs[dialogId]) {
				console.log(`Создался диалог: ${dialogId}`)
				dialogs[dialogId] = { id: dialogId, name: dialogId }
			}

			io.emit('message', { dialogId, message })
			io.emit('dialogs', Object.values(dialogs))
		})

		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id)
			delete dialogs[socket.id]
			delete messages[socket.id]
			io.emit('dialogs', Object.values(dialogs))
			socket.broadcast.emit('user_stopped_typing')
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
