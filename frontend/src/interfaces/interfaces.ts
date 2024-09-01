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
export interface MyComponentProps {
	userId: string
	socket: Socket
}
