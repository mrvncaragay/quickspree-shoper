import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const ReplacementItemList = ({ navigation }) => {
	const [{ replacement }, dispatch] = useStateValue();

	useEffect(() => {
		const replacementRef = firebase.database().ref(`replacement`);
		replacementRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const replacementState = [];

			for (let key in dbBatches) {
				replacementState.push({ id: key, ...dbBatches[key] });
			}

			dispatch({ type: 'setReplacement', value: replacementState });
		});
	}, []);

	return (
		<FlatList
			style={{ paddingHorizontal: 20, paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={replacement}
			renderItem={({ item }) => (
				<ProductItem replacement product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default ReplacementItemList;
