import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useTheme, Text, ActivityIndicator, Switch, Button } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import { useStateValue } from '../../../context';
import { pageCrawler } from '../../../../config';
import { saveProductToDB, saveBatchTempImagesToDB } from '../../../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const ControlButtons = (product) => {
	const { status, id } = product;
	let btns = {
		btn1: '',
		btn2: '',
	};

	if (status === 'looking') {
		btns = {
			btn1: 'Replace',
			btn2: 'Found',
		};
	} else if (status === 'replace') {
		btns = {
			btn1: 'New',
			btn2: 'Found',
		};
	} else if (status === 'found') {
		btns = {
			btn1: 'New',
			btn2: 'Replace',
		};
	}

	const onOptionClick = async (type) => {
		await saveProductToDB({ ...product, status: type }, `batch/${id}`);
	};

	return (
		status !== 'new' && (
			<View style={styles.buttonContainer}>
				<Button
					mode='outlined'
					compact
					labelStyle={styles.buttonLabel}
					onPress={() => onOptionClick(btns.btn1.toLowerCase())}
				>
					{btns.btn1}
				</Button>

				<Button
					mode='outlined'
					style={{ marginLeft: 10 }}
					compact
					labelStyle={styles.buttonLabel}
					onPress={() => onOptionClick(btns.btn2.toLowerCase())}
				>
					{btns.btn2}
				</Button>
			</View>
		)
	);
};

const BatchItem = ({ product, onPress }) => {
	const [{ store }] = useStateValue();
	const navigation = useNavigation();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const [searchImage, setSearhImage] = useState(false);
	const [isSwitchOn, setIsSwitchOn] = useState(false);
	const image = [{ url: product?.uri ? product?.uri : '../../../../assets/camera/noImage.png' }];
	const tempImages = [];

	for (let key in product.images) {
		tempImages.push(product.images[key]);
	}

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

		if (response.data?.urls) {
			saveBatchTempImagesToDB(response.data.urls, `batch/${product.id}/images`);
		}

		setSearhImage(false);
	};

	const onToggleSwitch = async () => {
		await saveProductToDB({ ...product, status: !isSwitchOn ? 'looking' : 'new' }, `batch/${product.id}`);
		setIsSwitchOn(!isSwitchOn);
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: 'white',
				height: 150,
				padding: 20,
				borderTopWidth: 1,
				borderColor: 'lightgray',
			}}
		>
			{searchImage ? (
				<ActivityIndicator style={{ width: 90, height: 90 }} size='large' />
			) : tempImages.length > 0 ? (
				<MaterialCommunityIcons
					name='image-search-outline'
					size={70}
					color='gray'
					style={[
						styles.small,
						{
							padding: 5,
							alignSelf: 'center',
						},
					]}
					onPress={() => navigation.navigate('ImageSelect', { urls: tempImages, id: product.id })}
				/>
			) : (
				<TouchableOpacity onPress={() => (product?.uri ? setViewImage(true) : handleSearchImage())}>
					<Image
						style={styles.small}
						source={product?.uri ? { uri: product.uri } : require('../../../../assets/camera/noImage.png')}
					/>
				</TouchableOpacity>
			)}

			<TouchableOpacity style={{ flex: 1, width: 190, paddingHorizontal: 5 }} onPress={onPress}>
				<CustomText containerStyle={{ width: 190 }} title>
					<Text style={{ fontWeight: '600' }}>{product?.quantity} </Text>
					{product?.productName}
					{'\n'}
					<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
				</CustomText>

				<CustomText label={`${product?.aisleCode || ''} ${product?.memo ? '- ' + product?.memo : ''}`} />
			</TouchableOpacity>

			{(product.status === 'looking' || product.status === 'new') && (
				<Switch color='darkred' value={product.status === 'looking'} onValueChange={onToggleSwitch} />
			)}

			{product.status !== 'management' && ControlButtons(product)}
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

	buttonContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		position: 'absolute',
		left: '72%',
		top: 100,
	},

	buttonLabel: {
		fontSize: 11,
		color: 'gray',
		textTransform: 'capitalize',
		letterSpacing: 0.5,
	},
});

export default BatchItem;
