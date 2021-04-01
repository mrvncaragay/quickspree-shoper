import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Snackbar } from '../../../components';
import { useStateValue } from '../../../context';
import { StoreMap } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { storeData } from '../../../utils/asyncStorage';
import firebase from '../../../firebase';

const defaultProduct = {
	name: '',
	aisle: '',
	note: '',
	location: {
		x: undefined,
		y: undefined,
	},
};

const Management = ({ route }) => {
	const [{ store }] = useStateValue();
	const [product, setProduct] = useState(defaultProduct);
	const [visible, setVisible] = useState({
		status: false,
		message: '',
	});

	const handleLocation = (coor) => {
		setProduct({ ...product, location: coor });
	};

	const handleSave = async () => {
		const productRef = firebase.database().ref(`products/${store.name.toLowerCase()}/${product.name.toLowerCase()}`);
		delete product.name;
		productRef.child(`${store.storeNumber}`).set(product, async (error) => {
			if (error) {
				throw new Error(error);
			} else {
				setVisible({
					status: 'true',
					message: 'Successfully save.',
				});
				setProduct(defaultProduct);
			}
		});
	};

	return (
		<KeyboardAwareScrollView>
			<View style={{ backgroundColor: 'white' }}>
				<StoreMap isForm handleLocation={handleLocation} product={product} />

				<View style={{ paddingHorizontal: 20, backgroundColor: '#fff' }}>
					<TextInput
						multiline
						style={styles.input}
						mode='outlined'
						dense
						label='Name'
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
						disabled={product.name && product.aisle ? false : true}
						labelStyle={{ textTransform: 'capitalize', alignSelf: 'center', flex: 1 }}
						style={{
							marginTop: 10,
							padding: 5,
						}}
						mode='contained'
						onPress={handleSave}
					>
						Save
					</Button>
				</View>
			</View>
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
