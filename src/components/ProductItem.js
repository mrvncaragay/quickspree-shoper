import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

const ProductItem = ({ product, onPress, done }) => {
	const { colors } = useTheme();

	const CustomText = ({ label, children, containerStyle, title }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={{ color: colors.backdrop }}>{label}</Text>
				<Text style={{ flex: 1, color: colors.dark600, fontSize: 16 }}>{children}</Text>
			</View>
		);
	};

	return (
		<TouchableOpacity onPress={!done ? onPress : null}>
			<View
				style={{
					flexDirection: 'row',
					flex: 1,
					backgroundColor: 'white',
					padding: 20,
					height: 'auto',
					borderWidth: 1,
					borderColor: 'lightgray',
				}}
			>
				<Image
					style={styles.small}
					source={{
						uri: product.url,
					}}
				/>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>
					<CustomText containerStyle={{ flex: 1 }} title>
						{product?.productName}
						{'\n'}
						<Text style={{ color: colors.backdrop, fontSize: 14 }}>
							{!product?.size ? '' : '(' + product.size + ')'}
						</Text>
					</CustomText>

					<CustomText label={`Aisle - ${product?.aisleCode}`} />
					<CustomText label={`Location - ${product?.memo}`} />
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 120,
		height: 120,
	},
});

export default ProductItem;
