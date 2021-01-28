import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const SavedItemList = ({ navigation }) => {
	const [{ saved }, dispatch] = useStateValue();

	useEffect(() => {
		const savedtRef = firebase.database().ref(`saved`);
		savedtRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const saveState = [];

			for (let key in dbBatches) {
				saveState.push({ ...dbBatches[key] });
			}

			dispatch({ type: 'setSaved', value: saveState });
		});
	}, []);

	return (
		<FlatList
			style={{ paddingHorizontal: 20, paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={saved}
			renderItem={({ item }) => <ProductItem replacement product={item} />}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default SavedItemList;
