import React, { useEffect, useState } from 'react'

const ImageSlider: React.FC = () => {
	const [images, setImages] = useState<string[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		// Запрос для получения изображений
		fetch('http://localhost:3000/images')
			.then((response) => response.json())
			.then((data) => setImages(data))
			.catch((error) => console.error('Ошибка получения изображений:', error))
	}, [])

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
	}

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
	}

	if (images.length === 0) return <div>Загрузка изображений...</div>

	return (
		<div className='relative w-full max-w-2xl mx-auto'>
			<button onClick={prevSlide} className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100'>
				<img src='../icon/left.svg'></img>
			</button>
			<div className='flex overflow-hidden'>
				<img src={'http://localhost:3000/images' + images[currentIndex]} alt='Current' className='w-3/3 h-auto object-cover' />
			</div>
			<button onClick={nextSlide} className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100'>
				<img src='../icon/right.svg'></img>
			</button>
		</div>
	)
}

export default ImageSlider
