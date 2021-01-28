import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const ScannedItemList = ({ navigation }) => {
	const [{ scanned }, dispatch] = useStateValue();

	useEffect(() => {
		const scannedRef = firebase.database().ref(`scanned`);
		scannedRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const scannedeState = [];

			for (let key in dbBatches) {
				scannedeState.push({ id: key, ...dbBatches[key] });
			}

			dispatch({ type: 'setScanned', value: scannedeState });
		});
	}, []);

	return (
		<FlatList
			style={{ paddingHorizontal: 20, paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={scanned}
			renderItem={({ item }) => (
				<ProductItem product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default ScannedItemList;
