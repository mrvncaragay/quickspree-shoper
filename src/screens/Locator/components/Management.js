import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Snackbar } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useStateValue } from '../../../context';
// import { storeData } from '../../../utils/asyncStorage';
import { pageCrawler } from '../../../../config';
import axios from 'axios';

const Management = ({ route }) => {
	const [{ unsaved, store, dimensions }, dispatch] = useStateValue();
	const [product, setProduct] = useState({
		name: '',
		aisle: '',
		note: '',
	});
	const [pulling, setPulling] = useState(false);
	const [images, setImages] = useState([]);
	const [productImage, setProductImage] = useState('');
	const [viewImage, setViewImage] = useState(false);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});

	// const handleSave = async () => {
	// 	const copyUnsaved = [...unsaved];

	// 	const unsave = copyUnsaved.filter((data) => data.id !== product.id);

	// 	await storeData('unsaved', [...unsave, product]);
	// 	dispatch({ type: 'setUnsaved', value: [...unsave, { ...product, urls: productImages }] });

	// 	setVisible({
	// 		status: 'true',
	// 		message: 'Successfully save.',
	// 	});
	// };

	const handleFindImage = async () => {
		if (!product.name) return;

		setPulling(true);
		const response = await axios.get(pageCrawler(store.name, product.name));
		if (response.data?.urls) {
			setImages(response.data.urls);
		}

		setPulling(false);
	};

	// const handleSelectedImage = (imgIndex) => {
	// 	if (productImages.includes(images[imgIndex].url)) {
	// 		return;
	// 	} else {
	// 		setProductImages([...productImages, images[imgIndex].url]);
	// 	}
	// };

	// const handlePrimaryImage = (imgIndex) => {
	// 	setViewImage(false);
	// 	const newPrimaryUrl = images[imgIndex].url;
	// 	const oldPrimaryUrl = productImages[0];
	// 	productImages[0] = newPrimaryUrl;
	// 	productImages[imgIndex] = oldPrimaryUrl;
	// 	setImages(productImages.map((url) => ({ url })));
	// };

	return (
		<KeyboardAwareScrollView>
			<View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
				<View style={{ height: 200, justifyContent: 'center' }}>
					{pulling ? (
						<ActivityIndicator style={{ alignSelf: 'center', height: 200 }} />
					) : images.length > 0 ? (
						<TouchableWithoutFeedback onPress={() => setViewImage(true)}>
							<Image style={{ alignSelf: 'center', height: 180, width: 180 }} source={{ uri: images[0] }} />
						</TouchableWithoutFeedback>
					) : (
						<Image
							style={{ alignSelf: 'center', height: 120, width: 120 }}
							source={require('../../../../assets/camera/noImage.png')}
						/>
					)}
				</View>
				<TextInput
					multiline
					style={styles.input}
					mode='outlined'
					dense
					label='Product name'
					value={product.name}
					onChangeText={(name) => setProduct({ ...product, name })}
				/>
				<TextInput
					style={styles.input}
					mode='outlined'
					dense
					label='Aisle'
					value={product.aisle}
					onChangeText={(aisle) => setProduct({ ...product, aisle })}
				/>

				<TextInput
					style={styles.input}
					mode='outlined'
					multiline
					dense
					label='Note'
					value={product.note}
					onChangeText={(note) => setProduct({ ...product, note })}
				/>

				<Button
					disabled={product.name ? false : true}
					labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
					style={{
						marginTop: 10,
						padding: 5,
					}}
					mode='contained'
					onPress={handleFindImage}
				>
					Find Image
				</Button>

				<Button
					labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
					style={{
						marginTop: 10,
						padding: 5,
					}}
					mode='contained'
					// onPress={handleSave}
				>
					Save
				</Button>
			</View>
			<Modal visible={viewImage} transparent={true} onRequestClose={() => setViewImage(false)}>
				<ImageViewer
					imageUrls={images.length > 0 ? images.map((url) => ({ url })) : []}
					onSwipeDown={() => setViewImage(false)}
					enableSwipeDown
					backgroundColor='white'
					renderFooter={(index) => (
						<Button
							labelStyle={{ textTransform: 'capitalize', width: dimensions.width }}
							style={{
								marginTop: 10,
								padding: 5,
							}}
							mode='contained'
						>
							Select
						</Button>
					)}
				/>
			</Modal>
			<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 10,
	},
});
export default Management;
