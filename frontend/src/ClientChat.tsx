import React, { useEffect, useState } from 'react'
import { Message, MyComponentProps } from './interfaces/interfaces'
import Chat from './Chat'

const ClientChat: React.FC<MyComponentProps> = ({ userId, socket, getInitials, typingUsers, setTypingUsers }) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

	useEffect(() => {
		// Слушаем сообщения от других пользователей
		socket.on('message', ({ dialogId, message }: { dialogId: number; message: Message }) => {
			console.log(dialogId) // Используем user как id диалога

			setMessages((prevMessages) => ({
				...prevMessages,
				[dialogId]: [...(prevMessages[dialogId] || []), message],
			}))
		})
		return () => {
			socket.off('message')
		}
	}, [socket])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (message.trim()) {
			console.log(messages)
			const messageObject: Message = { id: Date.now(), user: userId, text: message }
			// Отправляем сообщение на сервер
			socket.emit('message', { dialogId: userId, message: messageObject })
			setMessage('')
		}
	}

	return (
		<div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '720px' }}>
			{typingUsers[userId] ? typingUsers[userId] + ' печатает...' : ''}
			<h1 style={{ padding: '16px', fontSize: '20px', fontWeight: '600', lineHeight: '24px', height: '56px', marginTop: '20px', border: '1px solid #EBECF2' }}>Чат с поддержкой</h1>
			<Chat
				selectedDialog={userId}
				messages={messages}
				userId={userId}
				message={message}
				setMessage={setMessage}
				handleSubmit={handleSubmit}
				getInitials={getInitials}
				handleTyping={() => {
					socket.emit('typing', { dialogId: userId, user: userId })
				}}
				handleBlur={() => {
					socket.emit('stop_typing')
				}}
			/>
		</div>
	)
}

export default ClientChat
