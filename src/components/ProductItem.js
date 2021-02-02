import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useTheme, Text, ActivityIndicator } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import { useStateValue } from '../context';
import { pageCrawler } from '../../config';
import axios from 'axios';

const ProductItem = ({ product, onPress }) => {
	const [{ store }] = useStateValue();
	const navigation = useNavigation();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const [searchImage, setSearhImage] = useState(false);
	const image = [{ url: product?.uri ? product?.uri : '../../assets/camera/noImage.png' }];

	const CustomText = ({ label, children, containerStyle }) => {
		return (
			<View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, containerStyle]}>
				<Text style={{ color: colors.backdrop }}>{label}</Text>
				<Text style={{ flex: 1, color: colors.dark600, fontSize: 16 }}>{children}</Text>
			</View>
		);
	};

	const handleSearchImage = async () => {
		setSearhImage(true);
		const response = await axios.get(pageCrawler(store.name, product.productName));

		navigation.navigate('ImageSelect', { urls: response.data.urls, id: product.id });
		setSearhImage(false);
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
			<TouchableOpacity onPress={() => (product?.uri ? setViewImage(true) : handleSearchImage())}>
				{searchImage ? (
					<ActivityIndicator style={{ width: 90, height: 90 }} size='large' />
				) : (
					<Image
						style={styles.small}
						source={product?.uri ? { uri: product.uri } : require('../../assets/camera/noImage.png')}
					/>
				)}
			</TouchableOpacity>
			<TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>
					<CustomText containerStyle={{ flex: 1 }} title>
						{product?.productName}
						{'\n'}
						<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
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
		width: 90,
		height: 90,
	},
});

export default ProductItem;
