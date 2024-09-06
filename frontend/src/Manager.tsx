import React, { useEffect, useState } from 'react'
import { Dialog, ManagerProps, Message } from './interfaces/interfaces'
import ManagerChat from './ManagerChat'

const Manager: React.FC<ManagerProps> = ({ userId, socket, getInitials, typingUsers, userIdDialog }) => {
	const [dialogs, setDialogs] = useState<Dialog[]>([])
	const [selectedDialog, setSelectedDialog] = useState<Dialog | null>(null)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<{ [key: string]: Message[] }>({})

	useEffect(() => {
		console.log(messages)
		if (selectedDialog) {
			socket.emit('getPreviousMessages', selectedDialog.name)
		}

		socket.on('dialogs', (updatedDialogs: Dialog[]) => {
			setDialogs(updatedDialogs)
		})

		socket.on('message', ({ user, dialogId, message }: { user: string; dialogId: number; message: Message }) => {
			if (message.user !== userId) {
				setMessages((prevMessages) => ({
					...prevMessages,
					[user]: [...(prevMessages[user] || []), message],
				}))
				if (selectedDialog?.id !== dialogId) {
					document.title = `Новое сообщение в ${dialogs.find((dialog) => dialog.id === dialogId)?.name}`
				}
			}
		})

		socket.on('previousMessages', (previousMessages: Message[]) => {
			const groupedMessages: { [key: string]: Message[] } = {}

			previousMessages.forEach((msg) => {
				if (!groupedMessages[msg.user]) {
					groupedMessages[msg.user] = []
				}
				console.log(groupedMessages)
				console.log(groupedMessages[msg.user])
				console.log(msg)
				groupedMessages[msg.dialogId].push(msg)
			})

			setMessages((prevMessages) => ({
				...prevMessages,
				...groupedMessages,
			}))
		})
		return () => {
			socket.off('previousMessages')
			socket.off('dialogs')
			socket.off('message')
		}
	}, [selectedDialog, userId, dialogs, socket])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim() && selectedDialog) {
			const messageObject: Message = {
				id: Date.now(),
				user: userId,
				text: message,
				dialogId: userIdDialog(selectedDialog.name),
			}
			socket.emit('message', { user: selectedDialog.name, dialogId: userIdDialog(selectedDialog.name), message: messageObject })

			setMessages((prevMessages) => ({
				...prevMessages,
				[selectedDialog.name]: [...(prevMessages[selectedDialog.name] || []), messageObject],
			}))

			setMessage('')
		}
	}

	const handleDialogClick = (dialog: Dialog) => {
		if (selectedDialog) {
			socket.emit('leaveDialog', selectedDialog.name)
		}
		setSelectedDialog(dialog)
		console.log(dialog)
		document.title = dialog.name
		socket.emit('joinDialog', dialog.name)
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
									<p className='text-sm font-light text-gray-600'>{typingUsers[dialog.id] ? `${typingUsers[dialog.id]} печатает...` : messages[dialog.name]?.length > 0 ? trimMessage(messages[dialog.name][messages[dialog.name].length - 1].text) : trimMessage(dialog.lastMessage)}</p>
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
