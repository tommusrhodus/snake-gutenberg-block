import { Button } from '@wordpress/components';

const GameOver = ( { onReset } ) => {
	return (
		<div id="GameOver">
			<div id="PressSpaceText">
				<Button
					variant="primary"
					onClick={ onReset }
					text="Start Game"
				/>
			</div>
		</div>
	);
};

export default GameOver;
