import React, { useState, useEffect } from 'react'

const ImageSlider: React.FC = () => {
	const [images, setImages] = useState<string[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		// Загружаем изображения с сервера
		fetch('http://localhost:3000/images')
			.then((response) => response.json())
			.then((data) => setImages(data))
	}, [])

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
	}

	const goToNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
	}

	return (
	<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='relative mw-[1240px] h-[max] overflow-hidden'>
			<div className='flex transition-transform duration-300 ease-in-out' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
				{images.map((image, index) => (
					<img style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={index} src={'http://localhost:3000/images' + image} className='w-[1240px] h-[836px] object-cover flex-shrink-0' alt={image} />
				))}
			</div>
			<button onClick={goToPrevious} className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md'>
				◀️
			</button>
			<button onClick={goToNext} className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md'>
				▶️
			</button>
		</div>
	)
}

export default ImageSlider
