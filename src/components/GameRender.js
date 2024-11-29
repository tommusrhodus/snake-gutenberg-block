import { __ } from '@wordpress/i18n';

const GameRender = ( {
	snake,
	blockWidth,
	blockHeight,
	apple,
	isSelected,
} ) => {
	return (
		<>
			{ snake.map( ( snakePart, index ) => {
				return (
					<div
						key={ index }
						className="snake"
						style={ {
							width: blockWidth,
							height: blockHeight,
							left: snakePart.Xpos,
							top: snakePart.Ypos,
						} }
					/>
				);
			} ) }
			<div
				className="apple"
				style={ {
					width: blockWidth,
					height: blockHeight,
					left: apple.Xpos,
					top: apple.Ypos,
				} }
			/>
			{ ! isSelected && (
				<div id="paused">{ __( 'Paused', 'snake-game-block' ) }</div>
			) }
		</>
	);
};

export default GameRender;
