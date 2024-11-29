import GameOver from './GameOver';
import GameRender from './GameRender';

const GameBoard = ( {
	width,
	height,
	snakeColor,
	appleColor,
	backgroundColor,
	isGameOver,
	resetGame,
	snake,
	blockWidth,
	blockHeight,
	apple,
	isSelected,
} ) => {
	return (
		<div
			id="GameBoard"
			style={ {
				'--game-width': width + 'px',
				'--game-height': height + 'px',
				'--snake-color': snakeColor,
				'--apple-color': appleColor,
				'--background-color': backgroundColor,
			} }
		>
			{ isGameOver ? (
				<GameOver onReset={ resetGame } />
			) : (
				<GameRender
					snake={ snake }
					blockWidth={ blockWidth }
					blockHeight={ blockHeight }
					apple={ apple }
					isSelected={ isSelected }
				/>
			) }
		</div>
	);
};

export default GameBoard;
