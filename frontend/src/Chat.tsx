import React, { useState, useEffect } from 'react'
import 'tailwindcss/tailwind.css'
import { MyComponentProps } from './interfaces/interfaces'

const Chat: React.FC<MyComponentProps> = ({ socket }) => {
	const [messages, setMessages] = useState<string[]>([])
	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		// Получение сообщений с сервера через socket.io
		socket.on('message', (message: string) => {
			setMessages((prevMessages) => [...prevMessages, message])
		})

		return () => {
			socket.off('message') // Отписываемся при размонтировании компонента
		}
	}, [socket])

	const sendMessage = () => {
		if (newMessage.trim()) {
			socket.emit('message', newMessage)
			setNewMessage('')
		}
	}

	return (
		<div className='w-[100%] h-[max] border p-4 flex flex-col'>
			<div className='flex-grow'>
				{messages.map((message, index) => (
					<div key={index} className='p-2 mb-2 bg-gray-100 rounded-md'>
						{message}
					</div>
				))}
			</div>
			<div className='mt-2 flex'>
				<input type='text' className='border p-2 flex-grow rounded-l-md' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
				<button onClick={sendMessage} className='bg-blue-500 text-white p-2 rounded-r-md'>
					Отправить
				</button>
			</div>
		</div>
	)
}
export default Chat
