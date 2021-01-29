import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button, IconButton, Caption } from 'react-native-paper';
import { Camera, StoreMap } from '../../../components';
import * as ImageManipulator from 'expo-image-manipulator';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

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
	url: '',
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

const InlineButtons = ({ label = '', data, setData, product, type, containerStyle }) => {
	const [active, setActive] = useState({
		status: label ? false : true,
		index: 0,
	});

	return (
		<View
			style={[
				{
					marginTop: 5,
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				containerStyle,
			]}
		>
			{label ? <Caption>{label}: </Caption> : null}

			{data.map((item, i) => (
				<Button
					style={{ marginRight: label ? 10 : 0 }}
					mode={(active.status && active.index === i) || product.memo === item.value ? 'contained' : 'outlined'}
					dark
					key={i}
					compact
					labelStyle={{
						fontSize: 10,
						color: (active.status && active.index === i) || product.memo === item.value ? 'white' : 'gray',
					}}
					onPress={() => {
						setActive({
							status: true,
							index: i,
						});
						setData({ ...product, [type]: item.value });
					}}
				>
					{item.label}
				</Button>
			))}
		</View>
	);
};

const Scan = () => {
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(initialData);
	const [cameraType, setCameraType] = useState(false);
	const { colors } = useTheme();

	const handleBarcodeScan = async (info) => {
		const productRef = firebase.database().ref('scanned');
		productRef.push().set({ ...product, upc: info.data }, async (error) => {
			if (error) {
				console.log(error);
			} else {
				setProduct(initialData);
			}
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

		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', compressedImg.uri, true);
			xhr.send(null);
		});

		try {
			const storageRef = firebase.storage().ref();
			var imagesFolder = storageRef.child(`images/${filename}`);

			const snapshot = await imagesFolder.put(blob);
			const url = await snapshot.ref.getDownloadURL();
			setProduct({ ...product, url });
			setCameraType(false);
		} catch (error) {
			console.log(error);
		}
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
								style={[styles.input, { width: '85%' }]}
								mode='outlined'
								dense
								label='filename...'
								disabled
								value={product.url}
							/>

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
					</View>
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
