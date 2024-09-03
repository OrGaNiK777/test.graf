import { Socket } from 'socket.io-client'

// Интерфейс, описывающий структуру объекта Message
export interface Message {
	id: number
	user: any
	text: any
}

// Интерфейс для описания диалога
export interface Dialog {
	id: any
	name: any
}

// Интерфейс для пропсов компонента
export interface ManagerProps {
	userId: string
	socket: Socket
	getInitials: any
	dialogs: any
	typingUsers: any
	setTypingUsers: any
	message: string
	setMessage: any
	messages: { [key: number]: Message[] }
	setMessages: (msg: string) => void
	selectedDialog: Dialog | null
	setSelectedDialog: any
	newMessageDialogIds: any
	setNewMessageDialogIds: any
	handleSubmit: any
}
// Интерфейс для пропсов компонента
export interface MyComponentProps {
	userId: string
	socket: Socket
	getInitials: any
}

export interface ChatProps {
	selectedDialog: Dialog | null
	messages: { [key: number]: Message[] }
	userId: string
	socket: any
	message: string
	setMessage: (msg: string) => void
	handleSubmit: (e: React.FormEvent) => void
	handleTyping: () => void
	handleBlur: () => void
	getInitials: any
}
