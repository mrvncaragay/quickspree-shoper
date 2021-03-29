import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useTheme, TextInput, Divider } from 'react-native-paper';

const Search = ({ navigation }) => {
	const { colors } = useTheme();
	const [query, setQuery] = useState('');

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
						data={['Produce', 'Deli', 'Spices', 'Grocery', 'Bakery']}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 5,
	},
});

export default Search;
