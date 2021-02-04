import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, View, Platform, Modal, TouchableOpacity } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { Fontisto } from '@expo/vector-icons';
import { useStateValue } from '../../context';
import { saveProductToDB } from '../../firebase';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageContainer = ({ navigation, url, id }) => {
	const [{ batch }] = useStateValue();
	const { colors } = useTheme();
	const [viewImage, setViewImage] = useState(false);
	const image = [{ url }];

	const updateProductImage = async () => {
		const product = batch.filter((p) => p.id === id)[0];
		delete product.id;
		delete product.images;
		await saveProductToDB({ ...product, uri: url }, `batch/${id}`);
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
			<TouchableOpacity onPress={() => setViewImage(true)}>
				<Image
					style={styles.small}
					source={Platform.OS === 'ios' ? { url: url.toLowerCase() } : { uri: url.toLowerCase() }}
				/>
			</TouchableOpacity>

			<Fontisto
				name='angle-right'
				color={colors.primary}
				size={22}
				style={{ width: 35 }}
				onPress={updateProductImage}
			/>
			<Modal visible={viewImage} transparent={true} onRequestClose={() => setViewImage(false)}>
				<ImageViewer
					imageUrls={image}
					renderIndicator={() => null}
					onSwipeDown={() => setViewImage(false)}
					enableSwipeDown
					backgroundColor='white'
				/>
			</Modal>
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
