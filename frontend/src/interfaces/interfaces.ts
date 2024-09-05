import { Socket } from 'socket.io-client'

export interface Message {
	id: number
	user: string
	text: string
	dialogId: any
}

export interface Dialog {
	id: number
	name: string
	lastMessage: string
}

export interface ManagerProps {
	typingUsers: { [key: string]: string }
	userId: string
	socket: Socket
	getInitials: (name: string) => string
	typing: string
}

export interface ClientChatProps {
	userId: string
	socket: Socket
	getInitials: (name: string) => string
	typingUsers: { [key: string]: string }
}

export interface ChatProps {
	selectedDialog: any
	messages: { [dialogId: number]: Message[] }
	userId: string
	message: string
	setMessage: React.Dispatch<React.SetStateAction<string>>
	handleSubmit: (e: React.FormEvent) => void
	handleTyping: () => void
	handleBlur: () => void
	getInitials: (name: string) => string
	typing: string
}
