import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const BatchItems = ({ navigation }) => {
	const [{ batch }, dispatch] = useStateValue();

	useEffect(() => {
		const batchesRef = firebase.database().ref(`batch`);
		batchesRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const batchState = [];
			for (let key in dbBatches) {
				batchState.push({ id: key, ...dbBatches[key] });
			}
			dispatch({ type: 'setBatch', value: batchState });
		});
	}, []);

	return (
		<FlatList
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={batch}
			renderItem={({ item }) => (
				<ProductItem product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default BatchItems;
