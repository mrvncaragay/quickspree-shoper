import React from 'react';
import { SearchStore, AddStore } from '../screens/Store';
import { createStackNavigator } from '@react-navigation/stack';
// import BottomTabNavigator from '../navigations/BottomTabNavigator';
import BottomTabNavigatorLocator from '../navigations/BottomTabNavigatorLocator';
// import Shoppper from '../screens/Shopper';
import UpdateBatchItem from '../screens/Shopper/components/UpdateBatchItem';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Shopper' component={BottomTabNavigatorLocator} options={{ headerShown: false }} />
			{/* <Stack.Screen name='Shopper' component={Shoppper} options={{ headerShown: false }} /> */}
			<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
			<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
			<Stack.Screen name='UpdateBatch' component={UpdateBatchItem} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};
export default HomeStackNavigator;
