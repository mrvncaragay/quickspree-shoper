import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, TextInput, TouchableRipple, IconButton, useTheme } from 'react-native-paper';
import { useStateValue } from '../../context';
import { storeData } from '../../utils/asyncStorage';
import firebase from '../../firebase';

const Store = ({ store, navigation }) => {
	const [_, dispatch] = useStateValue();
	const { colors } = useTheme();

	return (
		<TouchableRipple
			onPress={() => {
				const storeProductsRef = firebase.database().ref(`products/${store.name.toLowerCase()}`);
				storeProductsRef.once('value', async (snapshot) => {
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
					dispatch({ type: 'setStore', value: store });
					dispatch({ type: 'setList', value: undefined });
					await storeData('store', store);
					await storeData('lists', searchableState);
					navigation.goBack();
				});
			}}
		>
			<Surface style={styles.store}>
				<View>
					<Text>{`${store.name} - ${store.storeNumber}`}</Text>
					<Text style={{ color: 'gray' }}>{`${store.city}, ${store.state}`}</Text>
				</View>

				<IconButton icon='chevron-right' color={colors.primary} size={24} />
			</Surface>
		</TouchableRipple>
	);
};

const SearchStore = ({ navigation }) => {
	const [stores, setStores] = useState([]);

	useEffect(() => {
		const citiesRef = firebase.database().ref('stores');
		citiesRef.on('value', (snapshot) => {
			const dbStores = snapshot.val();
			const storeState = [];

			for (let id in dbStores) {
				storeState.push(dbStores[id]);
			}

			setStores(storeState);
		});
	}, []);

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<TextInput
					style={{ marginBottom: 10, flex: 1 }}
					mode='outlined'
					placeholder='Enter ZIP, city, or store number...'
				/>
				<IconButton icon='plus' size={30} onPress={() => navigation.navigate('AddStore')} />
			</View>

			<FlatList
				showsHorizontalScrollIndicator={true}
				data={stores}
				initialNumToRender={6}
				windowSize={3}
				renderItem={({ item, index }) => <Store navigation={navigation} store={item} />}
				keyExtractor={(_, index) => 'listing' + index}
				ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},

	store: {
		height: 60,
		elevation: 2,
		margin: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		padding: 15,
		paddingRight: 0,
	},
});

export default SearchStore;
