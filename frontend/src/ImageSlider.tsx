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
		<div className='flex justify-center items-center relative w-[100%] h-[max] overflow-hidden'>
			<div className='flex transition-transform duration-300 ease-in-out w-[1240px]' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
				{images.map((image, index) => (
					<img key={index} src={'http://localhost:3000/images' + image} className='w-[1230px] h-[800px] object-cover flex-shrink-0 mx-1' alt={image} />
				))}
			</div>
			<div className='absolute top-1/2 w-full flex justify-between px-4'>
				<button onClick={goToPrevious} className='absolute left-40 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-300'>
					<img src='../icon/left.svg' alt='Previous' />
				</button>
				<button onClick={goToNext} className='absolute right-40 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-300'>
					<img src='../icon/right.svg' alt='Next' />
				</button>
			</div>
		</div>
	)
}

export default ImageSlider
