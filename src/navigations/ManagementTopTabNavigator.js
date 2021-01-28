import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scan, ScannedItemList, SavedItemList } from '../screens/Management/components';
import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = ({ navigation, route }) => {
	const { colors } = useTheme();

	const [{ scanned, saved }] = useStateValue();

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
			<Tab.Screen name='SCANNED' component={ScannedItemList} options={{ title: `${scanned.length || ''} SCANNED` }} />
			<Tab.Screen name='SAVE' component={SavedItemList} options={{ title: `${saved.length || ''} TO-SAVE` }} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
