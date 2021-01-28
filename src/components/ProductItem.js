import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

const ProductItem = ({ product, onPress, done, replacement }) => {
	const { colors } = useTheme();

	const CustomText = ({ label, children }) => {
		return (
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 1 }}>
				<Text style={{ color: colors.backdrop }}>{label}:</Text>
				<Text style={{ flex: 1, color: colors.primary }}>{children}</Text>
			</View>
		);
	};

	return (
		<TouchableOpacity onPress={!done ? onPress : null}>
			<View
				style={{
					flex: 1,
					backgroundColor: 'white',
					padding: 10,
					height: 'auto',
					borderWidth: done || replacement ? 2 : 1,
					borderColor: done ? 'green' : replacement ? 'orange' : 'gray',
				}}
			>
				<CustomText label='Name'> {product?.productName}</CustomText>
				<CustomText label='Aisle'> {product?.aisleCode}</CustomText>
				<CustomText label='Location'> {product?.memo}</CustomText>
			</View>
		</TouchableOpacity>
	);
};

export default ProductItem;
