import { __ } from '@wordpress/i18n';

const GameScore = ( { score, highScore, isSelected } ) => {
	if ( ! isSelected ) {
		return null;
	}

	return (
		<div id="score">
			<span>
				{ __( 'High Score', 'snake-game-block' ) }: { highScore }
			</span>
			<span>
				{ __( 'Score', 'snake-game-block' ) }: { score }
			</span>
		</div>
	);
};

export default GameScore;
