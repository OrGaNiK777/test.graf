import React, { useState } from 'react'
import { ChatProps } from './interfaces/interfaces'

const Chat: React.FC<ChatProps> = ({ selectedDialog, messages, userId, message, setMessage, handleSubmit, handleTyping, handleBlur, getInitials }) => {
	const [isInputFocused, setIsInputFocused] = useState(false)

	return (
		<div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
			{selectedDialog ? (
				<>
					<div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', padding: '16px', paddingBottom: '50px', backgroundColor: '#f1f1f1' }}>
						{(messages[selectedDialog?.id] || []).map((msg, index, arr) => {
							const isFirstMessageFromUser = index === 0 || arr[index - 1].user !== msg.user
							const marginStyle = isFirstMessageFromUser ? { margin: '2px 0px 14px 0px' } : { margin: '2px 0px 2px 0px' }
							console.log(messages)
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
											borderRadius: '8px 8px 8px 0px',
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
					<form onReset={handleBlur} onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '16px', position: 'absolute', bottom: '0px', width: '100%' }}>
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
	)
}

export default Chat
