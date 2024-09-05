import React from 'react'
import { ChatProps } from './interfaces/interfaces'
import Chat from './Chat'

const ManagerChat: React.FC<ChatProps> = ({ typing, selectedDialog, messages, userId, message, setMessage, handleSubmit, handleTyping, handleBlur, getInitials }) => {
	return <div className='flex-1 relative flex flex-col'>{selectedDialog ? <Chat typing={typing} selectedDialog={selectedDialog} messages={messages} userId={userId} message={message} setMessage={setMessage} handleSubmit={handleSubmit} getInitials={getInitials} handleTyping={handleTyping} handleBlur={handleBlur} /> : <p className='text-center text-gray-500'>Выберите чат для начала общения.</p>}</div>
}

export default ManagerChat
