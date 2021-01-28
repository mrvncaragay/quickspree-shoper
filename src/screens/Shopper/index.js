import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { Header as HeaderComponent, SelectStore } from '../../components';
import { useStateValue } from '../../context';
import { readData } from '../../utils/asyncStorage';
import ShopperTopTabNavigator from '../../navigations/ShopperTopTabNavigator';

const Shopper = ({ navigation }) => {
	const [{ store, isLoading }, dispatch] = useStateValue();
	const { colors } = useTheme();

	useEffect(() => {
		(async () => {
			const store = await readData('store');
			if (store) {
				dispatch({ type: 'setStore', value: store });
			}

			dispatch({ type: 'isLoading', value: false });
		})();
	}, []);

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{isLoading ? (
				<ActivityIndicator size='large' style={{ flex: 1 }} />
			) : store ? (
				<>
					<HeaderComponent store={store} colors={colors} navigation={navigation} />
					<ShopperTopTabNavigator />
				</>
			) : (
				<SelectStore colors={colors} navigation={navigation} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	input: {
		marginTop: 5,
	},
});

export default Shopper;
