import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Rect, SvgXml } from 'react-native-svg';
import SvgPanZoom, { SvgPanZoomElement } from 'react-native-svg-pan-zoom';
import Marker from './Marker';

const svgAisle = `<svg width="400px" height="300px" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
<defs>
	<bx:grid x="0" y="0" width="10.089" height="8.773"/>
</defs>
<rect width="400" height="300" style="paint-order: fill; vector-effect: non-scaling-stroke; fill: rgb(255, 255, 255); stroke: rgb(203, 203, 203);" y="-1.718"/>
<rect x="86.65" y="150.661" width="227" height="12" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 305.174011, -50.050007)"/>
<rect x="86.65" y="134.616" width="227" height="12" style="paint-order: fill; stroke-width: 0px; stroke: rgb(236, 236, 236); fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 305.174011, -50.050007)"/>
<rect x="315.95" y="133.661" width="12" height="29" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 305.174011, -50.050007)"/>
<rect x="72.15" y="133.661" width="12" height="29" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 305.174011, -50.050007)"/>
<rect x="86.65" y="150.661" width="227" height="12" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 394.708008, -50.050007)"/>
<rect x="86.65" y="134.616" width="227" height="12" style="paint-order: fill; stroke-width: 0px; stroke: rgb(236, 236, 236); fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 394.708008, -50.050007)"/>
<rect x="315.95" y="133.661" width="12" height="29" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 394.708008, -50.050007)"/>
<rect x="72.15" y="133.661" width="12" height="29" style="stroke: rgb(144, 144, 144); paint-order: fill; stroke-width: 0px; fill: rgb(206, 255, 208);" transform="matrix(0, 1, -1, 0, 394.708008, -50.050007)"/>
</svg>`;

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
				<SvgXml xml={svgAisle} />

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
