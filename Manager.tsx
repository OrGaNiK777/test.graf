import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { MyComponentProps } from './interfaces/interfaces'

interface Message {
	id: number
	user: string
	text: string
}

interface Dialog {
	id: string
	name: string
}

const Manager: React.FC<MyComponentProps> = ({ userId, socket }) => {
	const [dialogs, setDialogs] = useState<Dialog[]>([])
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: string]: Message[] }>({})
	const [selectedDialogId, setSelectedDialogId] = useState<string | null>(null)

	useEffect(() => {
		// Слушаем обновления диалогов
		socket.on('dialogs', (updatedDialogs: Dialog[]) => {
			setDialogs(updatedDialogs)
		})

		// Слушаем сообщения от других пользователей
		socket.on('message', ({ message }: { message: Message }) => {
			const dialogId = message.user // Используем user как id диалога
			setMessages((prevMessages) => ({
				...prevMessages,
				[dialogId]: [...(prevMessages[dialogId] || []), message],
			}))
		})

		// Запрашиваем список диалогов при подключении
		socket.emit('requestDialogs')

		return () => {
			socket.off('message')
			socket.off('dialogs')
		}
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim()) {
			const messageObject: Message = { id: Date.now(), user: userId, text: message }
			// Отправляем сообщение на сервер
			socket.emit('message', { message: messageObject })
			setMessage('')
		}
	}

	const handleDialogClick = (dialogId: string) => {
		setSelectedDialogId(dialogId)
	}

	return (
		<div style={{ display: 'flex', height: '100%', paddingTop: '42.4px' }}>
			<div style={{ width: '360px', borderRight: '1px solid #EBECF2' }}>
				<ul>
					{dialogs.map((dialog) => (
						<li key={dialog.id}>
							<button style={{ marginLeft: '12px' }} className='flex items-center w-full text-left py-2 transition-colors duration-300 bg-white' onClick={() => handleDialogClick(dialog.id)}>
								<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F2F2F2', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '8px' }}>
									{dialog.name.charAt(0)} {/* Отображаем первую букву имени */}
								</div>
								<p style={{ color: '#000' }}>{dialog.name}</p>
							</button>
						</li>
					))}
				</ul>
			</div>
			<div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
				<div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f1f1f1' }}>
					{selectedDialogId && (
						<div>
							<h3>Чат с {selectedDialogId}</h3>
							{(messages[selectedDialogId] || []).map((msg) => (
								<div key={msg.id} style={{ margin: '2px 0' }}>
									<p>
										{msg.user}: {msg.text}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
				<form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '16px' }}>
					<input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Написать сообщение...' style={{ flexGrow: 1, padding: '8px' }} />
					<button type='submit'>Отправить</button>
				</form>
			</div>
		</div>
	)
}

export default Manager
