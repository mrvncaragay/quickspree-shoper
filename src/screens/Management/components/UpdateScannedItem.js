import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { StoreMap, Snackbar } from '../../../components';
import { storeData } from '../../../utils/asyncStorage';
import { saveImageToStorage, saveProductToDB } from '../../../firebase';

const UpdateScannedItem = ({ navigation, route }) => {
	const { colors } = useTheme();
	const [{ store, scanned }, dispatch] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [saving, setSaving] = useState(false);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});

	const saveProduct = async () => {
		// save image to storage
		setSaving(true);
		const uri = await saveImageToStorage(product.image, `images/${product.image.filename}`);
		const copyProduct = { ...product, image: { ...product.image, uri } };
		await saveProductToDB(copyProduct, `products/${product.productName.toLowerCase()}`);

		const scannedArr = scanned.filter((data) => data.image.filename !== product.image.filename && data);
		dispatch({ type: 'setScanned', value: scannedArr });
		storeData('scanned', scannedArr);
		setVisible({
			status: true,
			message: 'Successfully saved.',
		});
		setSaving(false);
		setTimeout(() => {
			navigation.goBack();
		}, 2000);
	};

	const handleUpdate = async () => {
		const updatedScanned = scanned.map((data) => {
			if (data.image.filename === product.image.filename) {
				return product;
			} else {
				return data;
			}
		});

		dispatch({ type: 'setScanned', value: updatedScanned });
		storeData('scanned', updatedScanned);

		setVisible({
			status: true,
			message: 'Successfully updated.',
		});
	};

	const handleDelete = async () => {
		const updatedScanned = scanned.filter((data) => {
			if (data.image.filename !== product.image.filename) {
				return product;
			}
		});

		dispatch({ type: 'setScanned', value: updatedScanned });
		storeData('scanned', updatedScanned);

		setVisible({
			status: 'true',
			message: 'Successfully deleted.',
		});
		setTimeout(() => {
			navigation.goBack();
		}, 2000);
	};

	return (
		<>
			<KeyboardAwareScrollView
				scrollEnabled={false}
				resetScrollToCoords={{ x: 0, y: 0 }}
				style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}
			>
				<StoreMap store={store} product={product} />

				<View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
					<View
						style={{
							marginTop: 5,
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{[
							{ label: 'Aisle', value: 'aisle' },
							{ label: 'Produce', value: 'produce' },
							{ label: 'Dairy', value: 'dairy' },
							{ label: 'Meat', value: 'meat' },
							{ label: 'Deli', value: 'deli' },
							{ label: 'Bakery', value: 'bakery' },
						].map((aisle, i) => (
							<Button
								disabled={product.aisleType !== aisle.value}
								mode={product.aisleType === aisle.value ? 'contained' : 'outlined'}
								dark
								key={i}
								compact
								labelStyle={{ fontSize: 10, color: product.aisleType === aisle.value ? 'white' : 'gray' }}
								onPress={() => {
									if (product.aisleType === aisle.value) return;

									setProduct({ ...product, aisleType: aisle.value });
								}}
							>
								{aisle.label}
							</Button>
						))}
					</View>
					<TextInput
						multiline
						style={styles.input}
						mode='outlined'
						dense
						label='Product name'
						value={product.productName}
						onChangeText={(productName) => setProduct({ ...product, productName })}
					/>
					<TextInput
						disabled={product.aisleCode && true}
						style={styles.input}
						mode='outlined'
						dense
						label='Aisle'
						multiline
						value={product?.aisleCode || ''}
						onChangeText={(aisleCode) => setProduct({ ...product, aisleCode })}
					/>

					<TextInput style={styles.input} mode='outlined' dense label='upc...' disabled value={product.upc} />

					<TextInput
						style={styles.input}
						mode='outlined'
						dense
						label='Size'
						value={product.size}
						onChangeText={(size) => setProduct({ ...product, size })}
					/>
					<TextInput
						style={styles.input}
						mode='outlined'
						label='Memo (optional)'
						placeholder='Look middle, top, or bottom?'
						dense
						multiline
						value={product.memo}
						onChangeText={(memo) => setProduct({ ...product, memo })}
					/>

					<Button
						style={{ marginTop: 15, padding: 5 }}
						labelStyle={{ textTransform: 'capitalize' }}
						mode='contained'
						onPress={handleUpdate}
					>
						Update
					</Button>

					<Button
						labelStyle={{ textTransform: 'capitalize' }}
						style={{ marginTop: 10, padding: 5, backgroundColor: product.upc ? 'darkorange' : colors.disabled }}
						mode='contained'
						onPress={handleDelete}
					>
						Delete
					</Button>

					<Button
						disabled={product.upc ? false : true}
						labelStyle={{ textTransform: 'capitalize' }}
						style={{ marginTop: 10, padding: 5, backgroundColor: product.upc ? 'green' : colors.disabled }}
						mode='contained'
						onPress={saveProduct}
					>
						{saving ? Platform.OS === 'ios' ? <ActivityIndicator color='#fff' /> : 'Saving...' : 'Save'}
					</Button>
				</View>
			</KeyboardAwareScrollView>
			<Snackbar controller={visible} setVisible={() => setVisible({ status: false, message: '' })} />
		</>
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

export default UpdateScannedItem;
