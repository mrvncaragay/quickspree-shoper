import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Divider, Paragraph, Title, Subheading } from 'react-native-paper';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';
import { ListItem, StoreMap } from '../../../components';

const Search = () => {
	const [{ store, lists, list }] = useStateValue();
	const [_, dispatch] = useStateValue();
	const [query, setQuery] = useState('');

	useEffect(() => {
		const storeProductsRef = firebase.database().ref(`products/${store.name.toLowerCase()}`);
		storeProductsRef.on('value', async (snapshot) => {
			const products = snapshot.val();
			const searchableState = [];

			for (let id in products) {
				for (let city in products[id]) {
					if (city === store.storeNumber) {
						searchableState.push({ name: id, ...products[id][city] });
					}
				}
			}

			dispatch({ type: 'setSearchableLists', value: searchableState });
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<TextInput style={{ paddingLeft: 10 }} placeholder='Search...' value={query} onChangeText={(q) => setQuery(q)} />
			{query.length > 0 && (
				<View
					style={{
						paddingLeft: 10,
						position: 'absolute',
						top: 63,
						width: '100%',
						backgroundColor: '#fff',
						borderWidth: 1,
						borderColor: 'lightgray',
						maxHeight: 200,
						zIndex: 2,
					}}
				>
					<FlatList
						showsHorizontalScrollIndicator={true}
						data={lists.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))}
						renderItem={({ item }) => (
							<ListItem
								list={item}
								onPress={() => {
									dispatch({ type: 'setList', value: item });
									setQuery('');
								}}
							/>
						)}
						keyExtractor={(item, i) => i.toString()}
						ItemSeparatorComponent={() => <Divider />}
					/>
				</View>
			)}

			{list && (
				<>
					<StoreMap list={list} />
					<View style={{ padding: 20 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 50 }}>
							<Title style={{ flex: 1 }}>{list.name}</Title>
							<Subheading style={{ fontWeight: 'bold' }}>{list.aisle}</Subheading>
						</View>
						<Paragraph style={{ alignSelf: 'flex-end' }}>{list.note}</Paragraph>
					</View>
				</>
			)}
		</View>
	);
};

export default Search;
