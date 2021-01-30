import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { ProductItem } from '../../../components';
import { useStateValue } from '../../../context';
import firebase from '../../../firebase';

const SavedItemList = ({ navigation }) => {
	const [{ saved }, dispatch] = useStateValue();

	useEffect(() => {
		const savedtRef = firebase.database().ref(`saved`);
		savedtRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const saveState = [];

			for (let key in dbBatches) {
				saveState.push({ ...dbBatches[key] });
			}

			dispatch({ type: 'setSaved', value: saveState });
		});
	}, []);

	// save image to storage
	// const uri = await saveImageToStorage(image, `images/${image.filename}`);
	// const copyProduct = { ...product, image: { ...image, uri } };
	// await saveProductToDB(copyProduct, 'scanned');

	// const saveProduct = async () => {
	// 	try {
	// 		const scannedRef = firebase.database().ref(`scanned/${product.id}`); // change the status
	// 		await saveProductToDB(product, `saved/${product.id}`);
	// 		await scannedRef.set(null);
	// 		navigation.goBack();
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// };

	// const handleUpdate = async () => {
	// 	const scannedProductRef = firebase.database().ref(`scanned/${product.id}`);
	// 	scannedProductRef.set(product, async (error) => {
	// 		if (error) {
	// 			console.log(error);
	// 		} else {
	// 			setVisible({
	// 				status: true,
	// 				message: 'Successfully updated.',
	// 			});
	// 		}
	// 	});
	// };

	// const handleDelete = async () => {
	// 	await deleteProductToDB(`scanned/${product.id}`);
	// 	await deleteImageToStorage(product.image.filename);
	// 	setVisible({
	// 		status: 'true',
	// 		message: 'Successfully deleted.',
	// 	});
	// 	setTimeout(() => {
	// 		navigation.goBack();
	// 	}, 2000);
	// };

	return (
		<FlatList
			style={{ paddingHorizontal: 20, paddingTop: 10 }}
			contentContainerStyle={{ paddingBottom: 15 }}
			showsHorizontalScrollIndicator={true}
			data={saved}
			renderItem={({ item }) => <ProductItem replacement product={item} />}
			keyExtractor={(item) => item.id}
			ItemSeparatorComponent={() => <Divider style={{ height: 10, backgroundColor: '#fff' }} />}
		/>
	);
};

export default SavedItemList;
