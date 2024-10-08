import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import ImageSlider from './ImageSlider'
import Manager from './Manager'
import ClientChat from './ClientChat'

const socket = io('http://localhost:3000')

const App: React.FC = () => {
	const [userId, setUserId] = useState<string>('')
	const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({})

	const getInitials = (id: any) => {
		const words = id.toUpperCase().split(' ')
		return words.length > 1 ? words[0][0] + words[1][0] : words[0].substring(0, 2)
	}

	useEffect(() => {
		socket.on('connect', () => {
			setUserId(socket.id || '')
		})

		socket.on('typing', ({ dialogId, user }: { dialogId: string; user: string }) => {
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

		return () => {
			socket.off('connect')
			socket.off('typing')
			socket.off('user_stopped_typing')
		}
	}, [userId, socket])

	return (
		<Router>
			<Nav />
			<Routes>
				<Route
					path='/'
					element={
						<div className='flex h-screen w-full pt-10'>
							<ImageSlider />
							<ClientChat userId={userId} socket={socket} getInitials={getInitials} typingUsers={typingUsers} />
						</div>
					}
				/>
				<Route path='/manager' element={<Manager typing='' typingUsers={typingUsers} getInitials={getInitials} userId={userId} socket={socket} />} />
			</Routes>
		</Router>
	)
}

const Nav: React.FC = () => {
	const location = useLocation()

	return (
		<nav className='border-b flex items-center justify-around p-4 z-10'>
			<a target='_blank' rel='noreferrer' href='https://www.graff.tech/contacts' className='text-xl font-semibold'>
				{location.pathname === '/' ? 'graff.test' : 'graff.support'}
			</a>
			<div>
				<Link to='/' className='text-blue-500 hover:underline mx-2'>
					Слайдер
				</Link>
				<Link to='/manager' className='text-blue-500 hover:underline mx-2'>
					Менеджер
				</Link>
			</div>
		</nav>
	)
}

export default App
