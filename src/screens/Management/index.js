import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Header as HeaderComponent, SelectStore } from '../../components';
import { useStateValue } from '../../context';
import { readData } from '../../utils/asyncStorage';

import Management from './components/Management';

const Shopper = ({ navigation, route }) => {
	const [{ store }, dispatch] = useStateValue();
	const { colors } = useTheme();

	// Fetch store data in local storage
	useEffect(() => {
		(async () => {
			const store = await readData('store');
			if (store) {
				dispatch({ type: 'setStore', value: store });
			}
		})();
	}, []);

	return (
		<View style={[styles.container, !store && { justifyContent: 'center', alignItems: 'center' }]}>
			{store ? (
				<>
					<HeaderComponent store={store} colors={colors} navigation={navigation} />
					<Management route={route} />
				</>
			) : (
				<SelectStore colors={colors} navigationLocator={navigation} />
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
