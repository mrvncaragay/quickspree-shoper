import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, TextInput, Button, IconButton, Caption } from 'react-native-paper';
import { BarCodeScanner, StoreMap } from '../../../components';
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
					mode={active.status && active.index === i ? 'contained' : 'outlined'}
					dark
					key={i}
					compact
					labelStyle={{ fontSize: 10, color: active.status && active.index === i ? 'white' : 'gray' }}
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
	const [scan, setScan] = useState(false);

	const { colors } = useTheme();

	const handleBarcodeScan = async (info) => {
		const productRef = firebase.database().ref('scanned');

		productRef.push().set({ ...product, upc: info.data }, async (error) => {
			if (error) {
				console.log(error);
			} else {
				setProduct(initialData);
				setScan(false);
			}
		});
	};

	const handleLocation = (coord) => {
		setProduct({
			...product,
			location: coord,
		});
	};

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{!scan ? (
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
								label='upc...'
								disabled
								value={product.upc}
							/>

							<IconButton
								style={{ position: 'relative', top: 5 }}
								icon='barcode-scan'
								size={30}
								color={colors.primary}
								onPress={() => setScan(true)}
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
				<BarCodeScanner handleScan={handleBarcodeScan} />
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
