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
		const words = id.toUpperCase().split(' ')
		return words.length > 1 ? words[0][0] + words[1][0] : words[0].substring(0, 2) // Если нет второго слова, берем первые две буквы первого
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
		document.title = `Чат Д` + dialog.id
		socket.emit('joinDialog', dialog.id)
	}

	return (
		<div style={{ display: 'flex', height: '100%', paddingTop: '42.4px' }}>
			<div style={{ width: '360px', borderRight: '1px solid #EBECF2' }}>
				<ul>
					{dialogs.map((dialog) => {
						return (
							<div key={dialog.id}>
								<button
									style={{ marginLeft: '12px' }}
									className={`flex items-center w-full text-left py-2 transition-colors duration-300 
														${selectedDialog?.id === dialog.id ? 'bg-blue-200' : 'bg-white'} 
														${newMessageDialogIds.has(dialog.id) ? 'text-red-500' : 'text-black'} 
														hover:bg-[#EBECF2]`} // Добавляем hover эффект
									onClick={() => handleDialogClick(dialog)}
								>
									<div
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											backgroundColor: '#F2F2F2', // Цвет фона
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
										{getInitials(dialog.name)} {/* Отображаем инициалы */}
									</div>
									<div>
										<p
											style={{
												color: '#000000',
											}}
										>
											{dialog.name}
										</p>
										<p
											style={{
												fontSize: '14px',
												fontWeight: '400',
												lineHeight: '16.8px',
												color: '#777B8C',
											}}
										>
											{typingUsers[dialog.id]
												? typingUsers[dialog.id] + ' печатает...'
												: messages[dialog.id] && messages[dialog.id].length > 0
												? trimMessage(messages[dialog.id][messages[dialog.id].length - 1].text) // Исправлено обращение
												: 'Нет сообщений'}
										</p>
									</div>
								</button>
							</div>
						)
					})}
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
								style={{ outline: 'none', border: 'none', padding: '8px 8px 8px 16px', flexGrow: 1, color: '#14161F', fontSize: '14px', height: '48px' }}
							/>
							<button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: '12px', top: '12px', width: '24px', height: '24px' }} type='submit'>
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
	return text.length > 30 ? text.substring(0, 30) + '...' : text
}
export default Manager
