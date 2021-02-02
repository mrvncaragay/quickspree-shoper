import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Fontisto, AntDesign } from '@expo/vector-icons';
import { Shopper, Management } from '../screens';

const BottomTab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
	return (
		<BottomTab.Navigator
			shifting={true}
			activeColor='#FFFFFF'
			labelStyle={{ fontSize: 12 }}
			barStyle={{
				backgroundColor: '#165E7C',
				height: 80,
				paddingTop: 15,
				paddingBottom: 2,
			}}
		>
			<BottomTab.Screen
				name='Shopper'
				component={Shopper}
				options={{
					tabBarIcon: ({ color }) => <AntDesign name='shoppingcart' size={22} color={color} />,
				}}
			/>

			<BottomTab.Screen
				name='Management'
				component={Management}
				options={{
					tabBarIcon: ({ color }) => <Fontisto name='shopping-barcode' size={22} color={color} style={{ width: 35 }} />,
				}}
			/>
		</BottomTab.Navigator>
	);
};

export default BottomTabNavigator;
