import React, { useState } from 'react'
import { ChatProps } from './interfaces/interfaces'

const Chat: React.FC<ChatProps> = ({ selectedDialog, messages, userId, message, setMessage, handleSubmit, handleTyping, handleBlur, getInitials }) => {
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
			<div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', justifyContent: 'end', flexDirection: 'column', padding: '16px', paddingBottom: '62px', backgroundColor: '#f1f1f1' }}>
				{(messages[selectedDialog] || []).map((msg, index, arr) => {
					const isFirstMessageFromUser = index === 0 || arr[index - 1].user !== msg.user
					const marginStyle = isFirstMessageFromUser ? { margin: '14px 0px 2px 0px' } : { margin: '2px 0px 2px 0px' }
					return (
						<div key={msg.id} style={{ display: 'flex', alignItems: 'end', ...marginStyle }}>
							<div
								style={{
									width: '36px',
									height: '36px',
									borderRadius: '50%',
									backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
									color: '#111C26',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									marginRight: '3px',
									fontSize: '15px',
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
									borderRadius: '8px 8px 8px 0px',
									padding: '8px 12px',
									width: '420px',
									height: '52px',
									position: 'relative',
								}}
							>
								<p style={{ fontSize: '14px', fontWeight: '600', lineHeight: '18.2px', textAlign: 'left', maxWidth: '360px', overflow: 'hidden' }}>{msg.text}</p>
								<div
									style={{
										position: 'absolute',
										bottom: '0px',
										left: '-14px',
										width: '14px', // Ширина заостренного угла
										height: '24px', // Высота заостренного угла
										backgroundColor: msg.user === userId ? '#B9D7FB' : '#E2EAF1',
										zIndex: 0,
									}}
								></div>
								<div
									style={{
										position: 'absolute',
										borderRadius: '0% 0% 100% 0%', // Закругление углов
										bottom: '0px',
										left: '-14px',
										width: '14px', // Ширина заостренного угла
										height: '24px', // Высота заостренного угла
										backgroundColor: '#f1f1f1',
										zIndex: 0,
									}}
								></div>
							</div>
						</div>
					)
				})}
			</div>
			<form onReset={handleBlur} onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '16px', position: 'absolute', bottom: '0px', width: '100%', height: '48px', border: '1px solid #EBECF2' }}>
				<input maxLength={82} type='text' value={message} onFocus={InputFocus} onBlur={InputBlur} onChange={(e) => setMessage(e.target.value)} placeholder='Написать сообщение...' style={{ outline: 'none', border: 'none', padding: '8px 8px 8px 16px', flexGrow: 1, color: '#14161F', fontSize: '14px' }} />
				<button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: '12px', top: '12px', width: '24px', height: '24px' }} type='submit'>
					<img style={{ width: '14.97px', height: '15.2px' }} src={isInputFocused ? '../icon/sel1.svg' : '../icon/sel2.svg'}></img>
				</button>
			</form>
		</>
	)
}

export default Chat
