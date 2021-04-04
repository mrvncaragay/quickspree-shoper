import React from 'react';
import { SearchStore, AddStore } from '../screens/Store';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigatorLocator from '../navigations/BottomTabNavigatorLocator';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Locator' component={BottomTabNavigatorLocator} options={{ headerShown: false }} />
			<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
			<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};
export default HomeStackNavigator;
