import { Dimensions } from 'react-native';

export const StateReducer = (state, action) => {
	switch (action.type) {
		case 'setStore':
			return {
				...state,
				store: action.value,
			};
		case 'setSearchableLists':
			return {
				...state,
				lists: action.value,
			};
		case 'setList':
			return {
				...state,
				list: action.value,
			};
		case 'isLoading':
			return {
				...state,
				isLoading: action.value,
			};

		default:
			return state;
	}
};

export const InitialState = {
	store: null,
	lists: [],
	list: undefined,
	dimensions: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('screen').height,
	},
	isLoading: true,
};
