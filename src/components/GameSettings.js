import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	ColorPaletteControl,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

const GameSettings = ( {
	backgroundColor,
	snakeColor,
	appleColor,
	refreshRate,
	setAttributes,
} ) => {
	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Game Settings', 'snake-game-block' ) }
				initialOpen={ true }
			>
				<ColorPaletteControl
					value={ backgroundColor }
					onChange={ ( color ) =>
						setAttributes( { backgroundColor: color } )
					}
					label={ __( 'Background Color', 'snake-game-block' ) }
				/>
				<ColorPaletteControl
					value={ snakeColor }
					onChange={ ( color ) =>
						setAttributes( { snakeColor: color } )
					}
					label={ __( 'Snake Color', 'snake-game-block' ) }
				/>
				<ColorPaletteControl
					value={ appleColor }
					onChange={ ( color ) =>
						setAttributes( { appleColor: color } )
					}
					label={ __( 'Apple Color', 'snake-game-block' ) }
				/>
				<RangeControl
					label={ __( 'Game Speed(ms)', 'snake-game-block' ) }
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
	);
};

export default GameSettings;
