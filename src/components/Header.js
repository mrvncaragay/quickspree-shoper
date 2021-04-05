import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Avatar } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import storeUrls from '../utils/storeUrls';

const Header = ({ store, colors, navigation }) => {
	return (
		<Surface style={styles.surface}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Avatar.Image
					size={38}
					style={{ backgroundColor: '#fff' }}
					source={{
						uri: storeUrls[store.name.toLowerCase()],
					}}
				/>
				<View style={{ marginLeft: 5 }}>
					<Text style={{ fontSize: 14 }}>{`${store.name} - ${store.storeNumber}`}</Text>
					<Text style={{ fontSize: 12, color: 'gray' }}>{`${store.city}, ${store.state}`}</Text>
				</View>
			</View>
			<FontAwesome
				style={{ marginRight: 5 }}
				name='exchange'
				size={20}
				color={colors.primary}
				icon='exchange-alt'
				onPress={() => navigation.navigate('SearchStore')}
			/>
		</Surface>
	);
};

const styles = StyleSheet.create({
	surface: {
		zIndex: 1,
		flexDirection: 'row',
		height: 60,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
		elevation: 4,
	},
});

export default Header;
