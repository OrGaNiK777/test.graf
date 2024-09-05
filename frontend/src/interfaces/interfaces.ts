import { Socket } from 'socket.io-client'

// Интерфейс, описывающий структуру объекта Message
export interface Message {
	id: number // идентификатор сообщения
	user: string // идентификатор пользователя
	text: string // текст сообщения
	dialogId: number // идентификатор диалога, должен быть number
}

// Интерфейс для описания диалога
export interface Dialog {
	id: number
	name: string
}

// Интерфейс для пропсов компонента
export interface ManagerProps {
	typingUsers: { [key: string]: string }
	userId: string
	socket: Socket // Замените на точный тип, если у вас есть конкретный тип для сокета
	getInitials: (name: string) => string
	typing: string
	userIdDialog: (str: string | number) => number
}

export interface ClientChatProps {
	userIdDialog: (str: string | number) => number
	userId: string // ID текущего пользователя
	socket: Socket // Экземпляр сокета (обычно можно уточнить тип, если есть)
	getInitials: (name: string) => string // Функция для получения инициалов
	typingUsers: { [key: string]: string } // Объект пользователей, которые печатают, где ключ — ID пользователя, а значение — имя
}

export interface ChatProps {
	selectedDialog: any
	messages: { [dialogId: number]: Message[] } // Сообщения, сгруппированные по ID диалога
	userId: string // ID текущего пользователя
	message: string // Сообщение, вводимое пользователем
	setMessage: React.Dispatch<React.SetStateAction<string>> // Функция обновления состояния для сообщения
	handleSubmit: (e: React.FormEvent) => void // Обработчик отправки формы
	handleTyping: () => void // Обработчик события ввода текста
	handleBlur: () => void // Обработчик потери фокуса
	getInitials: (name: string) => string // Функция для получения инициалов пользователя
	typing: string
}
