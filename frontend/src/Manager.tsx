import React, { useEffect, useState } from 'react'
import { ManagerProps, Dialog, Message } from './interfaces/interfaces'
import Chat from './Chat' // Импортируем компонент Chat

const Manager: React.FC<ManagerProps> = ({ userId, socket, getInitials }) => {
	const [dialogs] = useState<Dialog[]>([
		{ id: 1, name: 'Диалог 1' },
		{ id: 2, name: 'Диалог 2' },
		{ id: 3, name: 'Диалог 3' },
		{ id: 4, name: 'Диалог 4' },
		{ id: 5, name: 'Диалог 5' },
		{ id: 6, name: 'Диалог 6' },
		{ id: 7, name: 'Диалог 7' },
		{ id: 8, name: 'Диалог 8' },
	])
	const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})
	const [typingUsers, setTypingUsers] = useState<{ [key: number]: string }>({})
	const [newMessageDialogIds, setNewMessageDialogIds] = useState<Set<number>>(new Set())

	useEffect(() => {
		// Установить userId, если socket.id доступен

		socket.on('typing', ({ dialogId, user }: { dialogId: number; user: string }) => {
			setTypingUsers((prev) => ({
				...prev,
				[dialogId]: user,
			}))

			socket.on('user_stopped_typing', () => {
				setTypingUsers((prev) => {
					const newTypingUsers = { ...prev }
					delete newTypingUsers[dialogId]
					return newTypingUsers
				})
			})
		})

		socket.on('message', ({ dialogId, message }: { dialogId: number; message: Message }) => {
			if (message.user !== userId) {
				setMessages((prevMessages) => ({
					...prevMessages,
					[dialogId]: [...(prevMessages[dialogId] || []), message],
				}))

				if (selectedDialog?.id !== dialogId) {
					setNewMessageDialogIds((prev) => new Set(prev).add(dialogId))
					document.title = `Новое сообщение в ${dialogs.find((dialog) => dialog.id === dialogId)?.name}`
				}
			}
		})

		// Очищаем сокет при размонтировании компонента
		return () => {
			socket.off('connect')
			socket.off('typing')
			socket.off('user_stopped_typing')
			socket.off('message')
		}
	}, [selectedDialog, userId, dialogs, socket])
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim() && selectedDialog) {
			const messageObject: Message = { id: Date.now(), user: userId, text: message }
			socket.emit('message', { dialogId: selectedDialog.id, message: messageObject })

			setMessages((prevMessages) => {
				const updatedMessages = {
					...prevMessages,
					[selectedDialog.id]: [...(prevMessages[selectedDialog.id] || []), messageObject],
				}
				return updatedMessages
			})

			setMessage('')
			setTypingUsers((prev) => ({ ...prev, [selectedDialog.id]: '' }))
		}
	}
	const handleDialogClick = (dialog: Dialog) => {
		if (selectedDialog) {
			socket.emit('leaveDialog', selectedDialog.id)
		}
		setSelectedDialog(dialog)
		newMessageDialogIds.delete(dialog.id)
		setNewMessageDialogIds(new Set(newMessageDialogIds))
		document.title = dialog.name
		socket.emit('joinDialog', dialog.id)
	}

	return (
		<div style={{ display: 'flex', height: '100%', paddingTop: '64px' }}>
			<div style={{ width: '360px', borderRight: '1px solid #EBECF2' }}>
				<ul>
					{dialogs.map((dialog) => (
						<div key={dialog.id}>
							<button
								style={{ marginLeft: '12px' }}
								className={`flex items-center w-full text-left py-2 transition-colors duration-300 
									${selectedDialog?.id === dialog.id ? 'bg-blue-200' : 'bg-white'} 
									${newMessageDialogIds.has(dialog.id) ? 'text-red-500' : 'text-black'} 
									hover:bg-[#EBECF2]`}
								onClick={() => handleDialogClick(dialog)}
							>
								<div
									style={{
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										backgroundColor: '#F2F2F2',
										color: '#000000',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										marginRight: '8px',
										fontSize: '14px',
										fontWeight: '600',
										lineHeight: '16.8px',
									}}
								>
									{getInitials(dialog.name)}
								</div>
								<div>
									<p style={{ color: '#000000' }}>{dialog.name}</p>
									<p
										style={{
											fontSize: '14px',
											fontWeight: '400',
											lineHeight: '16.8px',
											color: '#777B8C',
										}}
									>
										{typingUsers[dialog.id] ? typingUsers[dialog.id] + ' печатает...' : messages[dialog.id]?.length > 0 ? messages[dialog.id][messages[dialog.id].length - 1].text : 'Нет сообщений'}
									</p>
								</div>
							</button>
						</div>
					))}
				</ul>
			</div>{' '}
			<Chat
				selectedDialog={selectedDialog}
				messages={messages}
				userId={userId}
				socket={socket}
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

export default Manager
