import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TextInput, Divider } from 'react-native-paper';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const Search = () => {
	const [{ store, lists }] = useStateValue();
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
						searchableState.push(id);
					}
				}
			}

			dispatch({ type: 'setSearchableLists', value: searchableState });
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<TextInput placeholder='Search...' dense value={query} onChangeText={(q) => setQuery(q)} />
			{query.length > 0 && (
				<View
					style={{
						position: 'absolute',
						top: 40,
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
						data={lists.filter((q) => q.includes(query.toLowerCase()))}
						renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
						keyExtractor={(item, i) => i.toString()}
						ItemSeparatorComponent={() => <Divider />}
					/>
				</View>
			)}

			<View>
				<Text>Profile Searched</Text>
			</View>
		</View>
	);
};

export default Search;
