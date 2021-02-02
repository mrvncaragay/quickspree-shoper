import React from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';

const ScannedItemList = ({ navigation }) => {
	const [{ scanned }] = useStateValue();

	return (
		<FlatList
			style={{ paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={scanned}
			renderItem={({ item, index }) => (
				<ProductItem
					key={index}
					product={item}
					onPress={() => navigation.navigate('UpdateScanned', { product: item })}
				/>
			)}
			keyExtractor={(item) => item.image.filename}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default ScannedItemList;
