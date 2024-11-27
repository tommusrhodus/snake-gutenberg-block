import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useSettings,
	ColorPaletteControl,
} from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { Button, PanelBody, RangeControl } from '@wordpress/components';
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
			const newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos };
			let highScore = game.highScore;
			let gameLoopTimeout = game.gameLoopTimeout;

			// increase snake size
			snake.push( newTail );

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
		switch ( game.direction ) {
			case 'left':
				moveHeadLeft( game.width, game.blockWidth, game.snake );
				break;
			case 'up':
				moveHeadUp( game.height, game.blockHeight, game.snake );
				break;
			case 'right':
				moveHeadRight( game.width, game.blockWidth, game.snake );
				break;
			default:
				moveHeadDown( game.height, game.blockHeight, game.snake );
		}
	};

	// These functions move the head of the snake in the direction it is facing and wrap it around the board if it goes off the edge.
	const moveHeadLeft = ( width, blockWidth, snake ) => {
		snake[ 0 ].Xpos =
			snake[ 0 ].Xpos <= 0
				? width - blockWidth
				: snake[ 0 ].Xpos - blockWidth;

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// These functions move the head of the snake in the direction it is facing and wrap it around the board if it goes off the edge.
	const moveHeadUp = ( height, blockHeight, snake ) => {
		snake[ 0 ].Ypos =
			snake[ 0 ].Ypos <= 0
				? height - blockHeight
				: snake[ 0 ].Ypos - blockHeight;

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// These functions move the head of the snake in the direction it is facing and wrap it around the board if it goes off the edge.
	const moveHeadRight = ( width, blockWidth, snake ) => {
		snake[ 0 ].Xpos =
			snake[ 0 ].Xpos >= width - blockWidth
				? 0
				: snake[ 0 ].Xpos + blockWidth;

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// These functions move the head of the snake in the direction it is facing and wrap it around the board if it goes off the edge.
	const moveHeadDown = ( height, blockHeight, snake ) => {
		snake[ 0 ].Ypos =
			snake[ 0 ].Ypos >= height - blockHeight
				? 0
				: snake[ 0 ].Ypos + blockHeight;

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
		} ) );
	};

	// This function resets the game to the initial state.
	const resetGame = () => {
		// Reset the keydown event listener for the game controls.
		window.removeEventListener( 'keydown', handleKeyDown );
		window.addEventListener( 'keydown', handleKeyDown );

		const width = game.width;
		const height = game.height;
		const blockWidth = game.blockWidth;
		const blockHeight = game.blockHeight;
		const apple = game.apple;

		// snake reset
		const snake = [];
		let Xpos = width / 2;
		const Ypos = height / 2;
		const snakeHead = { Xpos: width / 2, Ypos: height / 2 };
		snake.push( snakeHead );
		for ( let i = 1; i < game.startSnakeSize; i++ ) {
			Xpos -= blockWidth;
			const snakePart = { Xpos, Ypos };
			snake.push( snakePart );
		}

		// apple position reset
		apple.Xpos =
			Math.floor(
				Math.random() * ( ( width - blockWidth ) / blockWidth + 1 )
			) * blockWidth;
		apple.Ypos =
			Math.floor(
				Math.random() * ( ( height - blockHeight ) / blockHeight + 1 )
			) * blockHeight;
		while ( isAppleOnSnake( apple.Xpos, apple.Ypos ) ) {
			apple.Xpos =
				Math.floor(
					Math.random() * ( ( width - blockWidth ) / blockWidth + 1 )
				) * blockWidth;
			apple.Ypos =
				Math.floor(
					Math.random() *
						( ( height - blockHeight ) / blockHeight + 1 )
				) * blockHeight;
		}

		setGame( ( prevGame ) => ( {
			...prevGame,
			snake,
			apple,
			direction: 'right',
			directionChanged: false,
			isGameOver: false,
			gameLoopTimeout: refreshRate,
			score: 0,
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

	// This is the game over screen.
	const renderGameOver = () => {
		return (
			<div id="GameOver">
				<div id="PressSpaceText">
					<Button
						variant="primary"
						onClick={ resetGame }
						text="Start Game"
					/>
				</div>
			</div>
		);
	};

	// This is the game screen.
	const renderGame = () => {
		return (
			<>
				{ game.snake.map( ( snakePart, index ) => {
					return (
						<div
							key={ index }
							className="snake"
							style={ {
								width: game.blockWidth,
								height: game.blockHeight,
								left: snakePart.Xpos,
								top: snakePart.Ypos,
							} }
						/>
					);
				} ) }
				<div
					className="apple"
					style={ {
						width: game.blockWidth,
						height: game.blockHeight,
						left: game.apple.Xpos,
						top: game.apple.Ypos,
					} }
				/>
				{ ! isSelected && <div id="paused">Paused</div> }
			</>
		);
	};

	// Finally we return the block with the game board.
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Game Settings', 'text-domain' ) }
					initialOpen={ true }
				>
					<ColorPaletteControl
						value={ backgroundColor }
						onChange={ ( color ) =>
							setAttributes( { backgroundColor: color } )
						}
						label={ __( 'Background Color', 'text-domain' ) }
					/>
					<ColorPaletteControl
						value={ snakeColor }
						onChange={ ( color ) =>
							setAttributes( { snakeColor: color } )
						}
						label={ __( 'Snake Color', 'text-domain' ) }
					/>
					<ColorPaletteControl
						value={ appleColor }
						onChange={ ( color ) =>
							setAttributes( { appleColor: color } )
						}
						label={ __( 'Apple Color', 'text-domain' ) }
					/>
					<RangeControl
						label={ __( 'Game Speed(ms)', 'text-domain' ) }
						value={ refreshRate }
						onChange={ ( newValue ) =>
							setAttributes( { refreshRate: newValue } )
						}
						min={ 20 }
						max={ 200 }
						step={ 10 }
					/>
				</PanelBody>
			</InspectorControls>

			<div
				id="GameBoard"
				style={ {
					'--game-width': game.width + 'px',
					'--game-height': game.height + 'px',
					'--snake-color': snakeColor,
					'--apple-color': appleColor,
					'--background-color': backgroundColor,
				} }
			>
				{ game.isGameOver ? renderGameOver() : renderGame() }
			</div>
			{ isSelected && (
				<div id="score">
					<span>HIGH-SCORE: { game.highScore }</span>
					<span>SCORE: { game.score }</span>
				</div>
			) }
		</div>
	);
}
