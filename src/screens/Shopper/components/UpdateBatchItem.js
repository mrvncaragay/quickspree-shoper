import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useStateValue } from '../../../context';
import { StoreMap, Camera } from '../../../components';
import firebase from '../../../firebase';

const EditBatchItem = ({ navigation, route }) => {
	const { colors } = useTheme();
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(route.params.product);
	const [scan, setScan] = useState(false);
	const [visible, setVisible] = useState(false);
	const [active, setActive] = useState({
		status: false,
		index: null,
	});

	const handleBarcodeScan = async (info) => {
		if (info) {
			if (!product.upc) {
				setProduct({
					...product,
					upc: info.data,
				});
			} else {
				try {
					// Match, move this product in Done
					if (info.data === product.upc) {
						const batchRef = firebase.database().ref(`batch/${store.name}-${store.storeNumber}/${product.id}`);
						const doneRef = firebase.database().ref(`done/${product.id}`);
						await doneRef.set(product);
						await batchRef.set(null);
						navigation.goBack();
					}
				} catch (error) {
					console.log(error.message);
				}
			}

			setScan(false);
		}
	};

	const handleLocation = (coord) => {
		setProduct({
			...product,
			location: coord,
		});
	};

	const handleUpdate = async () => {
		const scannedProductRef = firebase.database().ref(`scanned/${product.id}`);
		scannedProductRef.set(product, async (error) => {
			if (error) {
				console.log(error);
			} else {
				setVisible(true);
			}
		});
	};

	// const handleReplacement = async () => {
	// 	try {
	// 		// Match, move this product in replacement
	// 		const batchRef = firebase.database().ref(`batch/${store.name}-${store.storeNumber}/${product.id}`);
	// 		const replacementRef = firebase.database().ref(`replacement/${product.id}`);
	// 		await replacementRef.set(product);
	// 		await batchRef.set(null);
	// 		navigation.goBack();
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// };

	return !scan ? (
		<>
			<KeyboardAwareScrollView
				scrollEnabled={false}
				resetScrollToCoords={{ x: 0, y: 0 }}
				style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}
			>
				<StoreMap store={store} product={product} handleLocation={handleLocation} />

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

									setActive({
										status: true,
										index: i,
									});
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
						disabled={product.upc ? false : true}
						labelStyle={{ textTransform: 'capitalize' }}
						style={{ marginTop: 10, padding: 5, backgroundColor: product.upc ? 'green' : colors.disabled }}
						mode='contained'
						onPress={() => setScan(true)}
					>
						Save
					</Button>
				</View>
			</KeyboardAwareScrollView>
			<Snackbar
				style={{ backgroundColor: 'green' }}
				duration={2000}
				visible={visible}
				onDismiss={() => setVisible(false)}
			>
				Batch successfully updated!
			</Snackbar>
		</>
	) : (
		<Camera handleScan={handleBarcodeScan} />
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

export default EditBatchItem;
