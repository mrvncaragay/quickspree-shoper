import React from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { BatchItem } from '../../components';
import { useStateValue } from '../../context';

const Management = ({ navigation }) => {
	const [{ batch }] = useStateValue();

	return (
		<FlatList
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={batch.filter((b) => b.status === 'management').sort((a, b) => a.aisleCode > b.aisleCode)}
			renderItem={({ item }) => (
				<BatchItem done product={item} onPress={() => navigation.navigate('UpdateBatch', { product: item })} />
			)}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default Management;
