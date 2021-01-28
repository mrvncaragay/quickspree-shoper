import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const DoneItemList = ({ navigation }) => {
	const [{ done }, dispatch] = useStateValue();

	useEffect(() => {
		const doneRef = firebase.database().ref(`done`);
		doneRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const doneState = [];

			for (let key in dbBatches) {
				doneState.push({ id: key, ...dbBatches[key] });
			}

			dispatch({ type: 'setDone', value: doneState });
		});
	}, []);

	return (
		<FlatList
			style={{ paddingHorizontal: 20, paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={done}
			renderItem={({ item }) => (
				<ProductItem done product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default DoneItemList;
