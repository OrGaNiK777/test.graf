<div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
{selectedDialog ? (
	<>
		<div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse', padding: '16px', paddingBottom: '41px', backgroundColor: '#f1f1f1' }}>
			{(messages[selectedDialog?.id] || []).map((msg, index, arr) => {
				const isFirstMessageFromUser = index === 0 || arr[index - 1].user !== msg.user
				const marginStyle = isFirstMessageFromUser ? { margin: '2px 0px 14px 0px' } : { margin: '2px 0px 2px 0px' }

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
								borderRadius: '8px 8px 8px 0px', // Закругление углов
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