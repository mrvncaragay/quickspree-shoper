import { DefaultTheme } from 'react-native-paper';

const THEME = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		...DefaultTheme.colors,
		primary: '#165E7C',
		dark600: '#303030',
		accent: '#f1c40f',
	},
};

export default THEME;
