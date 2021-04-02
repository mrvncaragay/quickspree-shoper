import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ListItem = ({ list, onPress }) => {
	return (
		<TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20 }} onPress={onPress}>
			<Text style={{ flex: 1 }}>{list.name}</Text>

			<Text style={{ fontWeight: 'bold' }}>{list.aisle}</Text>
		</TouchableOpacity>
	);
};

export default ListItem;
