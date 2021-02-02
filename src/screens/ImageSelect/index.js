import React from 'react';
import { FlatList, Image, StyleSheet, View, Platform } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { Fontisto } from '@expo/vector-icons';
import { useStateValue } from '../../context';
import { saveProductToDB } from '../../firebase';

const ImageContainer = ({ navigation, url, id }) => {
	const [{ batch }] = useStateValue();
	const { colors } = useTheme();

	const updateProductImage = async () => {
		const product = batch.filter((p) => p.id === id)[0];
		delete product.id;
		const newUrl = url.replace('197x', '297x');
		await saveProductToDB({ ...product, uri: newUrl }, `batch/${id}`);
		navigation.goBack();
	};

	return (
		<View
			style={{
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row',
				padding: 20,
				backgroundColor: '#fff',
			}}
		>
			<Image
				style={styles.small}
				source={Platform.OS === 'ios' ? { url: url.toLowerCase() } : { uri: url.toLowerCase() }}
			/>
			<Fontisto
				name='angle-right'
				color={colors.primary}
				size={22}
				style={{ width: 35 }}
				onPress={updateProductImage}
			/>
		</View>
	);
};

const ImageSelect = ({ route, navigation }) => {
	const { urls, id } = route.params;

	return (
		<FlatList
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={urls}
			renderItem={({ item, index }) => <ImageContainer navigation={navigation} key={index} url={item} id={id} />}
			keyExtractor={(item, index) => index.toString()}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

const styles = StyleSheet.create({
	small: {
		width: 140,
		height: 140,
	},
});

export default ImageSelect;
