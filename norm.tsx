import React, { useEffect, useState } from 'react'
import { MyComponentProps, Message, Dialog } from './interfaces/interfaces' // Импортируем интерфейсы

const Manager: React.FC<MyComponentProps> = ({ userId, socket }) => {
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
	const [isInputFocused, setIsInputFocused] = useState(false)

	useEffect(() => {
		socket.on('typing', ({ dialogId, user }: { dialogId: number; user: string }) => {
			console.log(user)
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

		return () => {
			socket.off('typing')
			socket.off('user_stopped_typing')
			socket.off('message')
		}
	}, [selectedDialog, userId, dialogs])

	const getInitials = (id: string) => {
		return id.substring(0, 2).toUpperCase()
	}

	const handleTyping = () => {
		if (selectedDialog) {
			socket.emit('typing', { dialogId: selectedDialog.id, user: userId })
		}
	}

	const handleBlur = () => {
		socket.emit('stop_typing')
	}

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
		document.title = 'Ваш чат'
		socket.emit('joinDialog', dialog.id)
	}

	return (
		<div style={{ display: 'flex', height: '100%', paddingTop: '42.4px' }}>
			<div style={{ width: '360px', borderRight: '1px solid #ccc', padding: '10px', boxSizing: 'border-box' }}>
				<h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Диалоги</h2>
				<ul>
					{dialogs.map((dialog) => (
						<div key={dialog.id} style={{ marginBottom: '10px' }}>
							<button
								style={{
									width: '100%',
									textAlign: 'left',
									padding: '10px',
									borderRadius: '5px',
									color:{},
									backgroundColor: selectedDialog?.id === dialog.id ? '#cce5ff' : 'transparent',
								}}
								onClick={() => handleDialogClick(dialog)}
							>
								{dialog.name}
								{typingUsers[dialog.id] ? (
									<p style={{ fontStyle: 'italic' }}>{typingUsers[dialog.id]} печатает...</p>
								) : (
									<p style={{ fontStyle: 'italic' }}>
										{messages[dialog.id] && messages[dialog.id].length > 0
											? trimMessage(messages[dialog.id][messages[dialog.id].length - 1].text) // Исправлено обращение
											: 'Нет сообщений'}
									</p>
								)}
							</button>
						</div>
					))}
				</ul>
			</div>
			<div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
				{selectedDialog ? (
					<>
						<div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', padding: '16px', paddingBottom: '41px', backgroundColor: '#f1f1f1' }}>
							{(messages[selectedDialog?.id] || []).map((msg, index, arr) => {
								const isFirstMessageFromUser = index === 0 || arr[index - 1].user !== msg.user
								const marginStyle = isFirstMessageFromUser ? { margin: '2px 0px 14px 0px' } : { margin: '2px 0px 2px 0px' }

								return (
									<div key={msg.id} style={{ display: 'flex', alignItems: 'end', ...marginStyle }}>
										<div
											style={{
												width: '24px',
												height: '24px',
												borderRadius: '50%',
												backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
												color: '#111C26',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												marginRight: '3px',
												fontSize: '10px',
												fontWeight: '600',
												lineHeight: '12px',
												textAlign: 'center',
												zIndex: 1,
											}}
										>
											{getInitials(msg.user)}
										</div>
										<div
											style={{
												display: 'flex',
												alignItems: 'flex-end',
												backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
												borderRadius: '8px 8px 8px 0px', // Закругление углов
												padding: '8px 12px',
												width: '360px',
												maxHeight: '52px',
												position: 'relative',
											}}
										>
											<p style={{ fontSize: '14px', fontWeight: '400', lineHeight: '18.2px', textAlign: 'left', maxWidth: '360px', overflow: 'hidden' }}>{msg.text}</p>
											<div
												style={{
													position: 'absolute',
													bottom: '0px',
													left: '-7px',
													width: '7px', // Ширина заостренного угла
													height: '12px', // Высота заостренного угла
													backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
													zIndex: 0,
												}}
											></div>
											<div
												style={{
													position: 'absolute',
													borderRadius: '0% 0% 100% 0%', // Закругление углов
													bottom: '0px',
													left: '-7px',
													width: '7px', // Ширина заостренного угла
													height: '12px', // Высота заостренного угла
													backgroundColor: '#f1f1f1',
													zIndex: 0,
												}}
											></div>
										</div>
									</div>
								)
							})}
						</div>
						<form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '16px', position: 'absolute', bottom: '0px', width: '100%' }}>
							<input
								maxLength={82}
								type='text'
								value={message}
								onFocus={() => {
									setIsInputFocused(true)
									handleTyping()
								}}
								onBlur={() => {
									setIsInputFocused(false)
									handleBlur()
								}}
								onChange={(e) => setMessage(e.target.value)}
								placeholder='Написать сообщение...'
								style={{ outline: 'none', border: '1px solid #ccc', padding: '8px', flexGrow: 1, color: '#14161F', fontSize: '14px' }}
							/>
							<button style={{ position: 'absolute', right: '12px', top: '12px', width: '24px', height: '24px' }} type='submit'>
								<img style={{ width: '14.97px', height: '15.2px' }} src={isInputFocused ? '../icon/sel1.svg' : '../icon/sel2.svg'}></img>
							</button>
						</form>
					</>
				) : (
					<p>Выберите чат для начала общения.</p>
				)}
			</div>
		</div>
	)
}
// Функция для обрезки текста сообщения до 50 символов
const trimMessage = (text: string) => {
	return text.length > 40 ? text.substring(0, 40) + '...' : text
}
export default Manager
