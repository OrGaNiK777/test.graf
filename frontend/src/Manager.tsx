import React, { useEffect, useState } from 'react'
import { Dialog, ManagerProps, Message } from './interfaces/interfaces'
import ManagerChat from './ManagerChat'

const Manager: React.FC<ManagerProps> = ({ userId, socket, getInitials, typingUsers, userIdDialog }) => {
	const [dialogs, setDialogs] = useState<Dialog[]>([])
	const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

	useEffect(() => {
		if (selectedDialog) {
			socket.emit('getPreviousMessages', selectedDialog.id)
		}

		// Слушаем обновления диалогов
		socket.on('dialogs', (updatedDialogs: Dialog[]) => {
			setDialogs(updatedDialogs)
		})

		// Обработка нового сообщения
		socket.on('message', ({ dialogId, message }: { dialogId: number; message: Message }) => {
			if (message.user !== userId) {
				setMessages((prevMessages) => ({
					...prevMessages,
					[dialogId]: [...(prevMessages[dialogId] || []), message],
				}))

				if (selectedDialog?.id !== dialogId) {
					document.title = `Новое сообщение в ${dialogs.find((dialog) => dialog.id === dialogId)?.name}`
				}
			}
		})

		// Получение предыдущих сообщений при подключении
		socket.on('previousMessages', (previousMessages: Message[]) => {
			const groupedMessages: { [key: number]: Message[] } = {}

			previousMessages.forEach((msg) => {
				if (!groupedMessages[msg.dialogId]) {
					groupedMessages[msg.dialogId] = []
				}
				groupedMessages[msg.dialogId].push(msg)
			})

			setMessages((prevMessages) => ({
				...prevMessages,
				...groupedMessages,
			}))
		})
		console.log(messages)
		// Очищаем сокет при размонтировании компонента
		return () => {
			socket.off('previousMessages')
			socket.off('dialogs')
			socket.off('message')
		}
	}, [selectedDialog, userId, dialogs, socket])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim() && selectedDialog) {
			console.log(userIdDialog(selectedDialog.id))
			const messageObject: Message = {
				id: Date.now(),
				user: userId,
				text: message,
				dialogId: userIdDialog(selectedDialog.id),
			}
			socket.emit('message', { dialogId: selectedDialog.id, message: messageObject })

			setMessages((prevMessages) => ({
				...prevMessages,
				[selectedDialog.id]: [...(prevMessages[selectedDialog.id] || []), messageObject],
			}))

			setMessage('')
		}
	}

	const handleDialogClick = (dialog: Dialog) => {
		if (selectedDialog) {
			socket.emit('leaveDialog', selectedDialog.id)
		}
		setSelectedDialog(dialog)
		document.title = dialog.name
		socket.emit('joinDialog', dialog.id)
	}

	return (
		<div className='flex h-full pt-16'>
			<div className='w-[360px] border-r border-gray-300'>
				<ul>
					{dialogs.map((dialog) => (
						<div key={dialog.id}>
							<button
								className={`flex items-center w-full text-left py-2 transition-colors duration-300 
                  ${selectedDialog?.id === dialog.id ? 'bg-blue-200' : 'bg-white'} 
                  hover:bg-gray-200 pl-3`}
								onClick={() => handleDialogClick(dialog)}
							>
								<div className='w-10 h-10 rounded-full bg-gray-200 text-black flex justify-center items-center mr-2'>{getInitials(dialog.name)}</div>
								<div>
									<p className='text-black text-sm font-semibold'>{dialog.name}</p>
									<p className='text-sm font-light text-gray-600'>{typingUsers[dialog.id] ? `${typingUsers[dialog.id]} печатает...` : messages[dialog.id]?.length > 0 ? trimMessage(messages[dialog.id][messages[dialog.id].length - 1].text) : 'Нет сообщений'}</p>
								</div>
							</button>
						</div>
					))}
				</ul>
			</div>

			<ManagerChat
				typing={''}
				selectedDialog={selectedDialog}
				messages={messages}
				userId={userId}
				message={message}
				setMessage={setMessage}
				handleSubmit={handleSubmit}
				getInitials={getInitials}
				handleTyping={() => {
					if (selectedDialog) {
						socket.emit('typing', { dialogId: selectedDialog.id, user: userId })
					}
				}}
				handleBlur={() => {
					socket.emit('stop_typing')
				}}
			/>
		</div>
	)
}

const trimMessage = (text: string) => {
	return text.length > 40 ? text.substring(0, 40) + '...' : text
}

export default Manager
