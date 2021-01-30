import React, { useEffect } from 'react';
import { AddStore, SearchStore } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { UpdateScannedItem } from '../screens/Management/components';
import BottomTabNavigator from '../navigations/BottomTabNavigator';
import { readData, removeData } from '../utils/asyncStorage';
import { useStateValue } from '../context';

const Stack = createStackNavigator();

const CreateAdd = () => {
	const [{}, dispatch] = useStateValue();

	useEffect(() => {
		// const scannedRef = firebase.database().ref(`scanned`);
		// scannedRef.on('value', (snapshot) => {
		// 	const dbBatches = snapshot.val();
		// 	const scannedeState = [];

		// 	for (let key in dbBatches) {
		// 		scannedeState.push({ id: key, ...dbBatches[key] });
		// 	}

		// 	dispatch({ type: 'setScanned', value: scannedeState });
		// });

		(async () => {
			const scannedInAsynStorage = await readData('scanned');
			if (scannedInAsynStorage) {
				dispatch({ type: 'setScanned', value: scannedInAsynStorage });
			}
		})();
	}, []);

	return (
		<Stack.Navigator>
			<Stack.Screen name='Shopper' component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
			<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
			<Stack.Screen name='UpdateBatch' component={UpdateScannedItem} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};
export default CreateAdd;
