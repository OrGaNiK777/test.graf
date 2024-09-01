import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import ImageSlider from './ImageSlider'
import Manager from './Manager'

const socket = io('http://localhost:3000') // Подключение к серверу

const App: React.FC = () => {
	const [userId, setUserId] = useState<string>('') // Статус для userId

	useEffect(() => {
		// Установить userId, если socket.id доступен
		socket.on('connect', () => {
			setUserId(socket.id || '') // Сохраняем текущий socket.id
		})

		console.log(userId)

		// Очищаем сокет при размонтировании компонента
		return () => {
			socket.off('connect')
		}
	}, []) // Зависимость от location, чтобы эффект выполнялся при изменении URL

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
				<Route path='/' element={<ImageSlider />} />
				<Route path='/manager' element={<Manager userId={userId} socket={socket} />} />
			</Routes>
		</Router>
	)
}

export default App
