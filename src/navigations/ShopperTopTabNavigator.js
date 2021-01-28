import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BatchItemList, DoneItemList, ReplacementItemList } from '../screens/Shopper/components';
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
			<Tab.Screen name='BATCH' component={BatchItemList} options={{ title: `${batch.length || ''} TO-FIND` }} />
			<Tab.Screen
				name='REPLACEMENT'
				component={ReplacementItemList}
				options={{ title: `${replacement.length || ''} NEEDED REPLACEMENT` }}
			/>
			<Tab.Screen name='DONE' component={DoneItemList} options={{ title: `${done.length || ''} DONE` }} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
