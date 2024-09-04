import React from 'react'
import { ChatProps } from './interfaces/interfaces'
import Chat from './Chat'

const ManagerChat: React.FC<ChatProps> = ({ selectedDialog, messages, userId, message, setMessage, handleSubmit, handleTyping, handleBlur, getInitials }) => {
	return <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>{selectedDialog ? <Chat typing={''} selectedDialog={selectedDialog} messages={messages} userId={userId} message={message} setMessage={setMessage} handleSubmit={handleSubmit} getInitials={getInitials} handleTyping={handleTyping} handleBlur={handleBlur} /> : <p>Выберите чат для начала общения.</p>}</div>
}

export default ManagerChat
