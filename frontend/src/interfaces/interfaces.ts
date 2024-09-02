import { Socket } from 'socket.io-client'

// Интерфейс, описывающий структуру объекта Message
export interface Message {
	id: number
	user: string
	text: string
}

// Интерфейс для описания диалога
export interface Dialog {
	id: number
	name: string
}

// Интерфейс для пропсов компонента
export interface ManagerProps {
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
