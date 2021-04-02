import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SvgUri, Rect } from 'react-native-svg';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';
import Marker from './Marker';

const StoreMap = ({ list, handleLocation, isForm }) => {
	const { width } = Dimensions.get('screen');
	const { colors } = useTheme();

	const handleMarker = (e) => {
		const { locationX, locationY } = e.nativeEvent;
		handleLocation({
			x: Math.ceil(locationX),
			y: Math.ceil(locationY),
		});
	};

	return (
		<View style={styles.container}>
			<SvgPanZoom
				canvasWidth={400}
				minScale={0.7}
				maxScale={1.4}
				initialZoom={0.7}
				canvasStyle={{
					height: 300,
					top: 121,
					left: Platform.OS === 'ios' ? 70 : 50,
					backgroundColor: 'transparent',
				}}
				viewStyle={{
					width: width,
					backgroundColor: 'lightgray',
				}}
			>
				<SvgUri uri={`https://quickspree.s3-us-west-1.amazonaws.com/svg/doubleVertical.svg`} />

				<>
					{isForm && (
						<SvgPanZoomElement onClick={handleMarker}>
							<Rect x='0' y='0' width='400' height='300' fill='transparent' />
						</SvgPanZoomElement>
					)}

					{list && <Marker x={list.location.x} y={list.location.y} color={colors.primary} />}
				</>
			</SvgPanZoom>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 220,
	},
});

export default StoreMap;
