import React, { useEffect, useState } from 'react'
import { ClientChatProps, Message } from './interfaces/interfaces'
import Chat from './Chat'

const ClientChat: React.FC<ClientChatProps> = ({ userId, socket, getInitials, typingUsers, userIdDialog }) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

	useEffect(() => {
		// Слушаем сообщения от других пользователей
		socket.on('message', ({ dialogId, message }: { dialogId: number; message: Message }) => {
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
			const messageObject: Message = { id: Date.now(), user: userId, text: message, dialogId: userIdDialog(userId) }
			// Отправляем сообщение на сервер
			socket.emit('message', { dialogId: userId, message: messageObject })
			setMessage('')
		}
	}

	return (
		<div className='relative flex flex-col w-[720px] border-l border-gray-300'>
			<h1 className='p-4 text-lg font-semibold leading-6  mt-6'>Чат с поддержкой</h1>
			<Chat
				selectedDialog={{ id: userId }}
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
				typing={typingUsers[userId] ? typingUsers[userId] + ' печатает...' : ''}
			/>
		</div>
	)
}

export default ClientChat
