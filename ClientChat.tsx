import React, { useEffect, useState } from 'react'
import { MyComponentProps, Message } from './interfaces/interfaces'

const ClientChat: React.FC<MyComponentProps> = ({ userId, socket }) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])

	useEffect(() => {
		socket.on('message', (message: Message) => {
			setMessages((prevMessages) => [...prevMessages, message])
		})

		// Создаем диалог при подключении
		socket.emit('createDialog', { userId })

		return () => {
			socket.off('message')
		}
	}, [userId, socket])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim()) {
			const messageObject: Message = { id: Date.now(), user: userId, text: message }
			socket.emit('message', { dialogId: 'admin', message: messageObject }) // отправка сообщения администраторам
			setMessage('')
		}
	}

	return (
		<div>
			<h1>Клиентский чат</h1>
			<div>
				{messages.map((msg) => (
					<div key={msg.id}>
						<strong>{msg.user}:</strong> {msg.text}
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit}>
				<input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Напишите сообщение...' />
				<button type='submit'>Отправить</button>
			</form>
		</div>
	)
}

export default ClientChat
