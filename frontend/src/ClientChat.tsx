import React, { useEffect, useState } from 'react'
import { ClientChatProps, Message } from './interfaces/interfaces'
import Chat from './Chat'

const ClientChat: React.FC<ClientChatProps> = ({ userId, socket, getInitials, typingUsers, userIdDialog }) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

	useEffect(() => {
		socket.on('message', ({ user, message }: { user: number; message: Message }) => {
			setMessages((prevMessages) => ({
				...prevMessages,
				[user]: [...(prevMessages[user] || []), message],
			}))
		})

		return () => {
			socket.off('message')
		}
	}, [socket])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (message.trim()) {
			const messageObject: Message = { id: Date.now(), user: userId, text: message, dialogId: userIdDialog }
			socket.emit('message', { user: userId, dialogId: userIdDialog, message: messageObject })
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
					socket.emit('typing', { dialogId: userIdDialog, user: userId })
				}}
				handleBlur={() => {
					socket.emit('stop_typing')
				}}
				typing={typingUsers[userIdDialog] ? typingUsers[userIdDialog] + ' печатает...' : ''}
			/>
		</div>
	)
}

export default ClientChat
