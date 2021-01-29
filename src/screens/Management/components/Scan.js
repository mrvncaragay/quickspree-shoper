import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button, IconButton } from 'react-native-paper';
import { Camera, StoreMap, InlineButtons, Snackbar } from '../../../components';
import * as ImageManipulator from 'expo-image-manipulator';
import { useStateValue } from '../../../context';
import { saveImageToStorage, saveProductToDB } from '../../../firebase';

const initialData = {
	aisleType: 'aisle',
	aisleCode: '',
	location: {
		x: 0,
		y: 0,
	},
	productName: '',
	upc: '',
	size: '',
	image: {},
	memo: '',
};

const aisle = [
	{ label: 'Aisle', value: 'aisle' },
	{ label: 'Produce', value: 'produce' },
	{ label: 'Dairy', value: 'dairy' },
	{ label: 'Meat', value: 'meat' },
	{ label: 'Deli', value: 'deli' },
	{ label: 'Bakery', value: 'bakery' },
];

const btns = [
	{ label: 'Top', value: 'top' },
	{ label: 'Middle', value: 'middle' },
	{ label: 'Bottom', value: 'bottom' },
];

const Scan = () => {
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(initialData);
	const [cameraType, setCameraType] = useState(false);
	const [image, setImage] = useState({
		filename: '',
		uri: '',
	});
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});
	const { colors } = useTheme();

	const handleBarcodeScan = async (info) => {
		setProduct({
			...product,
			upc: info.data,
		});

		setCameraType(false);
	};

	const handleLocation = (coord) => {
		setProduct({
			...product,
			location: coord,
		});
	};

	const handleTakePicture = async (img) => {
		const compressedImg = await ImageManipulator.manipulateAsync(img.uri, [{ resize: { width: 400, height: 600 } }], {
			compress: 1,
			format: ImageManipulator.SaveFormat.PNG,
		});
		const filename = compressedImg.uri.substring(compressedImg.uri.lastIndexOf('/') + 1);
		setImage({
			filename,
			uri: compressedImg.uri,
		});

		setCameraType(false);
	};

	const handleRetakePic = () => {
		setImage({
			filename: '',
			uri: '',
		});
	};

	const handleSave = async () => {
		const uri = await saveImageToStorage(image, `images/${image.filename}`);
		const copyProduct = { ...product, image: { ...image, uri } };
		await saveProductToDB(copyProduct, 'scanned');
		setVisible({
			status: 'true',
			message: 'Successfully save.',
		});
		setProduct(initialData);
		setImage({
			filename: '',
			uri: '',
		});
	};

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{!cameraType ? (
				<>
					<StoreMap store={store} product={product} handleLocation={handleLocation} isForm />

					<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
						<InlineButtons data={aisle} product={product} setData={setProduct} type='aisleType' />
						<TextInput
							style={styles.input}
							mode='outlined'
							dense
							label='Aisle code'
							value={product.aisleCode}
							onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
						/>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<TextInput
								style={[styles.input, { flex: 1 }]}
								mode='outlined'
								dense
								label='filename...'
								disabled
								value={image.filename}
							/>

							{image.uri ? (
								<IconButton
									style={{ position: 'relative', top: 5 }}
									icon='delete'
									size={30}
									color='red'
									onPress={handleRetakePic}
								/>
							) : null}

							<IconButton
								style={{ position: 'relative', top: 5 }}
								icon='camera'
								size={30}
								color={colors.primary}
								onPress={() => setCameraType('camera')}
							/>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<TextInput
								style={[styles.input, { width: '85%' }]}
								mode='outlined'
								dense
								label='upc...'
								disabled
								value={product.upc}
							/>

							<IconButton
								style={{ position: 'relative', top: 5 }}
								icon='barcode-scan'
								size={30}
								color={colors.primary}
								onPress={() => setCameraType('barcode')}
							/>
						</View>

						<InlineButtons
							containerStyle={{ justifyContent: 'flex-start' }}
							label='Location'
							data={btns}
							product={product}
							setData={setProduct}
							type='memo'
						/>

						<Button
							labelStyle={{ textTransform: 'capitalize' }}
							style={{ marginTop: 10, padding: 5, backgroundColor: colors.primary }}
							mode='contained'
							onPress={handleSave}
						>
							Save
						</Button>
					</View>
					<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
				</>
			) : (
				<Camera handleBarcodeScan={handleBarcodeScan} handleTakePicture={handleTakePicture} type={cameraType} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 5,
	},
});
export default Scan;
