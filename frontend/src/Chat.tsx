import React, { useState } from 'react'
import { ChatProps } from './interfaces/interfaces'

const Chat: React.FC<ChatProps> = ({ selectedDialog, messages, userId, message, setMessage, handleSubmit, handleTyping, handleBlur, getInitials, typing }) => {
	const [isInputFocused, setIsInputFocused] = useState(false)

	function InputFocus() {
		handleTyping()
		setIsInputFocused(true)
	}

	function InputBlur() {
		handleBlur()
		setIsInputFocused(false)
	}

	return (
		<>
			<div className='flex-grow overflow-y-auto flex flex-col justify-end p-4' style={{ backgroundColor: '#f1f1f1' }}>
				{(messages[selectedDialog?.id] || []).map((msg, index, arr) => {
					const isFirstMessageFromUser = index === 0 || arr[index - 1].user !== msg.user
					const marginStyle = isFirstMessageFromUser ? { margin: '14px 0px 2px 0px' } : { margin: '2px 0px 2px 0px' }
					return (
						<div key={msg.id} className={`flex items-end`} style={{ ...marginStyle }}>
							<div
								className={`w-9 h-9 rounded-full flex justify-center items-center mr-1`}
								style={{
									backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
									color: '#111C26',
									fontSize: '15px',
									fontWeight: '600',
									lineHeight: '12px',
									textAlign: 'center',
									zIndex: 1,
								}}
							>
								{getInitials(msg.user)}
							</div>
							<div className={`flex items-end p-2 relative`} style={{ width: '420px', height: '52px', borderRadius: '8px 8px 8px 0px', backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1' }}>
								<p className='text-sm font-semibold' style={{ maxWidth: '360px', overflow: 'hidden' }}>
									{msg.text}
								</p>
								<div
									className={`absolute bottom-0 left-[-14px]`}
									style={{
										width: '14px', // Ширина заостренного угла
										height: '24px', // Высота заостренного угла
										backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
									}}
								></div>
								<div
									className='absolute rounded-full bottom-0 left-[-14px] '
									style={{
										backgroundColor: '#f1f1f1',
										borderRadius: '0% 0% 100% 0%', // Закругление углов
										width: '14px', // Ширина заостренного угла
										height: '24px', // Высота заостренного угла
									}}
								></div>
							</div>
						</div>
					)
				})}
				<p className='pb-8 text-sm text-gray-500'>{typing}.</p>
			</div>
			<form onBlur={InputBlur} onSubmit={handleSubmit} className='flex mt-4 border-t border-gray-300 absolute bottom-0 w-full h-12'>
				<input maxLength={82} type='text' value={message} onFocus={InputFocus} onChange={(e) => setMessage(e.target.value)} placeholder='Написать сообщение...' className='outline-none border-none p-2 pl-4 flex-grow text-gray-800 text-sm' />
				<button className='flex justify-center items-center absolute right-3 top-1/3' type='submit'>
					<img className='w-4 h-4' src={isInputFocused ? '../icon/sel1.svg' : '../icon/sel2.svg'} alt='send icon' />
				</button>
			</form>
		</>
	)
}
// Функция для обрезки текста сообщения до 50 символов

export default Chat
