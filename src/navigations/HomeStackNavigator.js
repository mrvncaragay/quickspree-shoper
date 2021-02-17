import React from 'react';
import { SearchStore, AddStore } from '../screens/Store';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '../navigations/BottomTabNavigator';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Shopper' component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
			<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};
export default HomeStackNavigator;
