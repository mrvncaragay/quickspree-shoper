import React, { useEffect } from 'react';
import { AddStore, SearchStore } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { UpdateScannedItem } from '../screens/Management/components';
import ImageSelect from '../screens/ImageSelect';
import BottomTabNavigator from '../navigations/BottomTabNavigator';
import { readData } from '../utils/asyncStorage';
import { useStateValue } from '../context';
import firebase from '../firebase';

const Stack = createStackNavigator();

const CreateAdd = () => {
	const [{}, dispatch] = useStateValue();

	useEffect(() => {
		const scannedRef = firebase.database().ref(`batch`);
		scannedRef.on('value', (snapshot) => {
			const dbBatches = snapshot.val();
			const batchState = [];
			for (let key in dbBatches) {
				batchState.push({ id: key, ...dbBatches[key] });
			}
			dispatch({ type: 'setBatch', value: batchState });
		});

		(async () => {
			const scannedInAsynStorage = await readData('scanned');
			if (scannedInAsynStorage) {
				dispatch({ type: 'setScanned', value: scannedInAsynStorage });
			}

			// const batchInAsynStorage = await readData('batch');
			// if (scannedInAsynStorage) {
			// 	dispatch({ type: 'setBatch', value: batchInAsynStorage });
			// }
		})();
	}, []);

	return (
		<Stack.Navigator>
			<Stack.Screen name='Shopper' component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
			<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
			<Stack.Screen name='UpdateBatch' component={UpdateScannedItem} options={{ headerShown: false }} />
			<Stack.Screen name='ImageSelect' component={ImageSelect} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};
export default CreateAdd;
