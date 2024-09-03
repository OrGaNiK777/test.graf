import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import ImageSlider from './ImageSlider'
import Manager from './Manager'
import Chat from './ManagerChat'
import ClientChat from './ClientChat'

const socket = io('http://localhost:3000') // Подключение к серверу

const App: React.FC = () => {
	const [userId, setUserId] = useState<string>('') // Статус для userId
	const [typingUsers, setTypingUsers] = useState<{ [key: number]: string }>({})
	const getInitials = (id: any) => {
		const words = id.toUpperCase().split(' ')
		return words.length > 1 ? words[0][0] + words[1][0] : words[0].substring(0, 2)
	}
	useEffect(() => {
		// Установить userId, если socket.id доступен
		socket.on('connect', () => {
			setUserId(socket.id || '') // Сохраняем текущий socket.id
		})
		socket.on('typing', ({ dialogId, user }: { dialogId: number; user: string }) => {
			setTypingUsers((prev) => ({
				...prev,
				[dialogId]: user,
			}))

			socket.on('user_stopped_typing', () => {
				setTypingUsers((prev) => {
					const newTypingUsers = { ...prev }
					delete newTypingUsers[dialogId]
					return newTypingUsers
				})
			})
		})

		// Очищаем сокет при размонтировании компонента
		return () => {
			socket.off('connect')
			socket.off('typing')
			socket.off('user_stopped_typing')
		}
	}, [userId, socket])

	return (
		<Router>
			<nav className='border-b items-center'>
				<a
					target='blank'
					href='https://www.graff.tech/contacts'
					style={{
						fontSize: '24px',
						fontWeight: '600',
						lineHeight: '32.4px',
						textAlign: 'right',
					}}
				>
					graff.support
				</a>
				<Link to='/' className='text-blue-500 hover:underline'>
					Слайдер
				</Link>
				<Link to='/manager' className='text-blue-500 hover:underline ml-4'>
					Менеджер
				</Link>
				<Link to='' className='text-blue-500 hover:underline ml-4'></Link>
			</nav>
			<Routes>
				<Route
					path='/'
					element={
						<div style={{ display: 'flex', height: '100%', width:"100%", paddingTop: '42.4px' }}>
							<ImageSlider />
							<ClientChat userId={userId} socket={socket} getInitials={getInitials} typingUsers={typingUsers} setTypingUsers={setTypingUsers} />
						</div>
					}
				/>
				<Route path='/manager' element={<Manager typingUsers={typingUsers} setTypingUsers={setTypingUsers} getInitials={getInitials} userId={userId} socket={socket} />} />
			</Routes>
		</Router>
	)
}

export default App
