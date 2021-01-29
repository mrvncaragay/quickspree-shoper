import React, { useState } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, Modal } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';

const ProductItem = ({ product, onPress }) => {
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const image = [{ url: product.image.uri }];

	const CustomText = ({ label, children, containerStyle }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={{ color: colors.backdrop }}>{label}</Text>
				<Text style={{ flex: 1, color: colors.dark600, fontSize: 16 }}>{children}</Text>
			</View>
		);
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				flex: 1,
				backgroundColor: 'white',
				padding: 20,
				height: 'auto',
				borderTopWidth: 1,
				borderColor: 'lightgray',
			}}
		>
			<TouchableWithoutFeedback onPress={() => setViewImage(true)}>
				<Image
					style={styles.small}
					source={{
						uri: product.image.uri,
					}}
				/>
			</TouchableWithoutFeedback>
			<TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
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
			</TouchableOpacity>
			<Modal visible={viewImage} transparent={true} onRequestClose={() => setViewImage(false)}>
				<ImageViewer
					imageUrls={image}
					renderIndicator={() => null}
					onSwipeDown={() => setViewImage(false)}
					enableSwipeDown
					backgroundColor='white'
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 120,
		height: 120,
	},
});

export default ProductItem;
