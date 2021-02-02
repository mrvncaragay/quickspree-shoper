import React from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';

const DoneItemList = ({ navigation }) => {
	const [{ batch }] = useStateValue();

	return (
		<FlatList
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={batch.filter((b) => b.status === 'found').sort((a, b) => a.aisleCode > b.aisleCode)}
			renderItem={({ item }) => (
				<ProductItem done product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default DoneItemList;
