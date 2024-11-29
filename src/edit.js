import { useBlockProps, useSettings } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import GameSettings from './components/GameSettings';
import GameBoard from './components/GameBoard';
import GameScore from './components/GameScore';
import './editor.scss';

export default function Edit( { attributes, setAttributes, isSelected } ) {
	// Extract the attributes we need from the blockgame.
	const {
		snakeColor,
		appleColor,
		startSnakeSize,
		refreshRate,
		backgroundColor,
		highScore,
	} = attributes;

	// Here we're getting the content width from the global settings.
	const defaultContentWidth = '800px';
	const [ contentWidthString ] =
		useSettings( 'layout.contentSize' ) || defaultContentWidth;
	const contentWidth = parseInt( contentWidthString.replace( 'px', '' ) );

	// This sets the initial game of the game.
	const [ game, setGame ] = useState( {
		width: 0,
		height: 0,
		blockWidth: 0,
		blockHeight: 0,
		gameLoopTimeout: refreshRate,
		timeoutId: 0,
		snake: [],
		apple: {},
		direction: 'right',
		directionChanged: false,
		isGameOver: true, // Start on the gameover screen.
		score: 0,
		highScore,
	} );

	// This is the frame counter for the game loop, this is used to trigger the game loop.
	const [ frame, updateFrame ] = useState( 0 );

	// Here is where we start the game running once the block is mounted.
	useEffect( () => {
		initGame();
	}, [] );

	// This is the game loop, this runs every time the frame counter is updated.
	useEffect( () => {
		gameLoop();
	}, [ frame ] );

	// What to do when the block is selected or deselected.
	useEffect( () => {
		if ( isSelected ) {
			window.removeEventListener( 'keydown', handleKeyDown );
			window.addEventListener( 'keydown', handleKeyDown );
			gameLoop();
		} else {
			window.removeEventListener( 'keydown', handleKeyDown );
			clearTimeout( game.timeoutId );
		}
	}, [ isSelected ] );

	// Here we initialize the game, setting up the block width, height, snake, and apple.
	const initGame = () => {
		const width = contentWidth;
		const height = ( width / 3 ) * 2;
		const blockWidth = width / 30;
		const blockHeight = blockWidth;

		const snake = [];
		let Xpos = width / 2;
		const Ypos = height / 2;
		const snakeHead = { Xpos: width / 2, Ypos: height / 2 };
		snake.push( snakeHead );
		for ( let i = 1; i < startSnakeSize; i++ ) {
			Xpos -= blockWidth;
			const snakePart = { Xpos, Ypos };
			snake.push( snakePart );
		}

		// Set the x position of the apple to a random position on the board.
		const appleXpos =
			Math.floor(
				Math.random() * ( ( width - blockWidth ) / blockWidth + 1 )
			) * blockWidth;

		// Set the y position of the apple to a random position on the board.
		let appleYpos =
			Math.floor(
				Math.random() * ( ( height - blockHeight ) / blockHeight + 1 )
			) * blockHeight;

		// Make sure the apple is not on the snake.
		while ( appleYpos === snake[ 0 ].Ypos ) {
			appleYpos =
				Math.floor(
					Math.random() *
						( ( height - blockHeight ) / blockHeight + 1 )
				) * blockHeight;
		}

		setGame( ( prevGame ) => ( {
			...prevGame,
			width,
			height,
			blockWidth,
			blockHeight,
			startSnakeSize,
			snake,
			apple: { Xpos: appleXpos, Ypos: appleYpos },
			direction: 'right',
			directionChanged: false,
			isGameOver: false,
			gameLoopTimeout: refreshRate,
			score: 0,
		} ) );
	};

	// This is the main game loop, this runs every 50ms by default.
	const gameLoop = () => {
		const timeoutId = setTimeout( () => {
			if ( ! game.isGameOver && game.snake.length > 0 ) {
				moveSnake();
				tryToEatSnake();
				tryToEatApple();
				setGame( ( prevGame ) => ( {
					...prevGame,
					directionChanged: false,
				} ) );
			}

			updateFrame( frame + 1 );
		}, game.gameLoopTimeout );

		setGame( ( prevGame ) => ( {
			...prevGame,
			timeoutId,
		} ) );
	};

	// This is the function that moves the snake, it moves the head and then the rest of the body.
	const moveSnake = () => {
		const snake = [ ...game.snake ];
		let previousPartX = game.snake[ 0 ].Xpos;
		let previousPartY = game.snake[ 0 ].Ypos;
		let tmpPartX = previousPartX;
		let tmpPartY = previousPartY;

		moveHead();

		for ( let i = 1; i < snake.length; i++ ) {
			tmpPartX = snake[ i ].Xpos;
			tmpPartY = snake[ i ].Ypos;
			snake[ i ].Xpos = previousPartX;
			snake[ i ].Ypos = previousPartY;
			previousPartX = tmpPartX;
			previousPartY = tmpPartY;
		}

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// This function checks if the snake has eaten an apple, if it has it increases the size of the snake and moves the apple.
	const tryToEatApple = () => {
		const snake = game.snake;
		const apple = game.apple;

		// if the snake's head is on an apple
		if (
			snake[ 0 ].Xpos === apple.Xpos &&
			snake[ 0 ].Ypos === apple.Ypos
		) {
			const width = game.width;
			const height = game.height;
			const blockWidth = game.blockWidth;
			const blockHeight = game.blockHeight;
			let highScore = game.highScore;
			let gameLoopTimeout = game.gameLoopTimeout;

			// increase snake size
			snake.push( { Xpos: apple.Xpos, Ypos: apple.Ypos } );

			// create another apple
			apple.Xpos =
				Math.floor(
					Math.random() * ( ( width - blockWidth ) / blockWidth + 1 )
				) * blockWidth;
			apple.Ypos =
				Math.floor(
					Math.random() *
						( ( height - blockHeight ) / blockHeight + 1 )
				) * blockHeight;

			while ( isAppleOnSnake( apple.Xpos, apple.Ypos ) ) {
				apple.Xpos =
					Math.floor(
						Math.random() *
							( ( width - blockWidth ) / blockWidth + 1 )
					) * blockWidth;
				apple.Ypos =
					Math.floor(
						Math.random() *
							( ( height - blockHeight ) / blockHeight + 1 )
					) * blockHeight;
			}

			// increment high score if needed
			if ( game.score === highScore ) {
				highScore++;

				// Update the high score in the block attributes.
				setAttributes( {
					highScore,
				} );
			}

			// decrease the game loop timeout
			if ( gameLoopTimeout > 25 ) {
				gameLoopTimeout -= 0.5;
			}

			setGame( ( prevGame ) => ( {
				...prevGame,
				snake,
				apple,
				score: game.score + 1,
				highScore,
				gameLoopTimeout,
			} ) );
		}
	};

	// This function checks if the snake has eaten itself, if it has it ends the game.
	const tryToEatSnake = () => {
		const snake = game.snake;

		for ( let i = 1; i < snake.length; i++ ) {
			if (
				snake[ 0 ].Xpos === snake[ i ].Xpos &&
				snake[ 0 ].Ypos === snake[ i ].Ypos
			) {
				setGame( ( prevGame ) => ( {
					...prevGame,
					isGameOver: true,
				} ) );
			}
		}
	};

	// This function checks if the apple is on the snake, if it is it moves the apple.
	const isAppleOnSnake = ( appleXpos, appleYpos ) => {
		const snake = game.snake;

		for ( let i = 0; i < snake.length; i++ ) {
			if (
				appleXpos === snake[ i ].Xpos &&
				appleYpos === snake[ i ].Ypos
			) {
				return true;
			}
		}

		return false;
	};

	// This function moves the head of the snake in the direction it is facing.
	const moveHead = () => {
		const snake = game.snake;
		const width = game.width;
		const height = game.height;
		const blockWidth = game.blockWidth;
		const blockHeight = game.blockHeight;

		switch ( game.direction ) {
			case 'left':
				snake[ 0 ].Xpos =
					snake[ 0 ].Xpos <= 0
						? width - blockWidth
						: snake[ 0 ].Xpos - blockWidth;
				break;
			case 'up':
				snake[ 0 ].Ypos =
					snake[ 0 ].Ypos <= 0
						? height - blockHeight
						: snake[ 0 ].Ypos - blockHeight;
				break;
			case 'right':
				snake[ 0 ].Xpos =
					snake[ 0 ].Xpos >= width - blockWidth
						? 0
						: snake[ 0 ].Xpos + blockWidth;
				break;
			default:
				snake[ 0 ].Ypos =
					snake[ 0 ].Ypos >= height - blockHeight
						? 0
						: snake[ 0 ].Ypos + blockHeight;
		}

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// This function is used to handle game controls.
	const handleKeyDown = ( event ) => {
		// If the direction has already been changed this frame, don't allow another change.
		if ( game.directionChanged ) {
			return;
		}

		setGame( ( prevGame ) => {
			let newDirection = prevGame.direction;

			switch ( event.keyCode ) {
				case 65: // 'A' key
					if ( prevGame.direction !== 'right' ) {
						newDirection = 'left';
					}
					break;
				case 87: // 'W' key
					if ( prevGame.direction !== 'down' ) {
						newDirection = 'up';
					}
					break;
				case 68: // 'D' key
					if ( prevGame.direction !== 'left' ) {
						newDirection = 'right';
					}
					break;
				case 83: // 'S' key
					if ( prevGame.direction !== 'up' ) {
						newDirection = 'down';
					}
					break;
				default:
					return prevGame;
			}

			return {
				...prevGame,
				direction: newDirection,
				directionChanged: true,
			};
		} );
	};

	// Finally we return the block with the game board.
	return (
		<div { ...useBlockProps() }>
			<GameSettings
				backgroundColor={ backgroundColor }
				snakeColor={ snakeColor }
				appleColor={ appleColor }
				refreshRate={ refreshRate }
				setAttributes={ setAttributes }
			/>
			<GameBoard
				width={ game.width }
				height={ game.height }
				snakeColor={ snakeColor }
				appleColor={ appleColor }
				backgroundColor={ backgroundColor }
				isGameOver={ game.isGameOver }
				resetGame={ initGame }
				snake={ game.snake }
				blockWidth={ game.blockWidth }
				blockHeight={ game.blockHeight }
				apple={ game.apple }
				isSelected={ isSelected }
			/>
			<GameScore
				score={ game.score }
				highScore={ game.highScore }
				isSelected={ isSelected }
			/>
		</div>
	);
}
