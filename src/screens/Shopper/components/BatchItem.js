import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal, Platform } from 'react-native';
import { useTheme, Text, ActivityIndicator, Switch, Button } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import { useStateValue } from '../../../context';
import { pageCrawler } from '../../../../config';
import { saveProductToDB } from '../../../firebase';
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
			navigation.navigate('ImageSelect', { urls: response.data.urls, id: product.id });
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
						source={product?.uri ? { uri: product.uri } : require('../../../../assets/camera/noImage.png')}
					/>
				)}
			</TouchableOpacity>

			<View style={{ flex: 1, paddingHorizontal: 20 }}>
				{(product.status === 'looking' || product.status === 'new') && (
					<Switch
						color='darkred'
						style={{ alignSelf: 'flex-end', position: 'absolute' }}
						value={product.status === 'looking'}
						onValueChange={onToggleSwitch}
					/>
				)}
				<TouchableOpacity style={{ flex: 1, width: 190 }} onPress={onPress}>
					<CustomText containerStyle={{ flex: 1, width: 190 }} title>
						{product?.productName}
						{'\n'}
						<Text style={{ color: colors.backdrop, fontSize: 14 }}>{!product?.size ? '' : product.size}</Text>
					</CustomText>
				</TouchableOpacity>

				<CustomText label={`Aisle - ${product?.aisleCode}`} />
				<CustomText label={`Location - ${product?.memo}`} />
			</View>

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
		alignSelf: 'flex-end',
		left: Platform.OS === 'ios' ? '73%' : '75%',
		justifyContent: 'flex-end',
		bottom: Platform.OS === 'ios' ? 0 : 1,
		marginBottom: 5,
	},

	buttonLabel: {
		fontSize: 11,
		color: 'gray',
		textTransform: 'capitalize',
		letterSpacing: 0.5,
	},
});

export default BatchItem;
