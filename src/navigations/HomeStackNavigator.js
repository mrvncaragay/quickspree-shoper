import React from 'react';
import { AddStore, SearchStore } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { UpdateScannedItem } from '../screens/Management/components';
import BottomTabNavigator from '../navigations/BottomTabNavigator';

const Stack = createStackNavigator();

const CreateAdd = () => (
	<Stack.Navigator>
		<Stack.Screen name='Shopper' component={BottomTabNavigator} options={{ headerShown: false }} />
		<Stack.Screen name='SearchStore' component={SearchStore} options={{ headerShown: false }} />
		<Stack.Screen name='AddStore' component={AddStore} options={{ headerShown: false }} />
		<Stack.Screen name='UpdateBatch' component={UpdateScannedItem} options={{ headerShown: false }} />
	</Stack.Navigator>
);

export default CreateAdd;
