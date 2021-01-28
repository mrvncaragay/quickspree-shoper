import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scan, DoneItemList, ReplacementItemList } from '../screens/Management/components';
import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = ({ navigation, route }) => {
	const { colors } = useTheme();

	const [{ batch, done, replacement }] = useStateValue();

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
			<Tab.Screen
				name='SCANNED'
				component={ReplacementItemList}
				options={{ title: `${replacement.length || ''} SCANNED` }}
			/>
			<Tab.Screen name='SAVE' component={DoneItemList} options={{ title: `${done.length || ''} TO-SAVE` }} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
