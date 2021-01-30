import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scan, ScannedItemList } from '../screens/Management/components';
import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
	const { colors } = useTheme();

	const [{ scanned }] = useStateValue();

	return (
		<Tab.Navigator
			tabBarOptions={{
				inactiveTintColor: 'gray',
				activeTintColor: colors.primary,

				indicatorStyle: {
					backgroundColor: colors.primary,
				},
			}}
		>
			<Tab.Screen name='SCAN' component={Scan} />
			<Tab.Screen name='SCANNED' component={ScannedItemList} options={{ title: `${scanned?.length || ''} SCANNED` }} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
