import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BatchItemList, DoneItemList, ReplacementItemList } from '../screens/Shopper/components';
import { useStateValue } from '../context';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = ({ navigation, route }) => {
	const { colors } = useTheme();

	const [{ batch }] = useStateValue();

	const count = batch.reduce(
		(acc, val) => {
			if (val.status === 'new' || val.status === 'looking') {
				acc = {
					...acc,
					find: acc.find + 1,
				};
			} else if (val.status === 'replace') {
				acc = {
					...acc,
					replace: acc.replace + 1,
				};
			} else if (val.status === 'found') {
				acc = {
					...acc,
					found: acc.found + 1,
				};
			}

			return acc;
		},
		{
			find: 0,
			replace: 0,
			found: 0,
		},
	);
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
			<Tab.Screen name='BATCH' component={BatchItemList} options={{ title: `${count.find || ''} TO-FIND` }} />
			<Tab.Screen
				name='REPLACEMENT'
				component={ReplacementItemList}
				options={{ title: `${count.replace || ''} REPLACE` }}
			/>
			<Tab.Screen name='DONE' component={DoneItemList} options={{ title: `${count.found || ''} DONE` }} />
		</Tab.Navigator>
	);
};

export default TopTabNavigator;
