import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Caption } from 'react-native-paper';

const InlineButtons = ({ label = '', data, setData, product, type, containerStyle }) => {
	const [active, setActive] = useState({
		status: label ? false : true,
		index: 0,
	});

	return (
		<View
			style={[
				{
					marginTop: 5,
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				containerStyle,
			]}
		>
			{label ? <Caption>{label}: </Caption> : null}

			{data.map((item, i) => (
				<Button
					style={{ marginRight: label ? 10 : 0 }}
					mode={(active.status && active.index === i) || product.memo === item.value ? 'contained' : 'outlined'}
					dark
					key={i}
					compact
					labelStyle={{
						fontSize: 10,
						color: (active.status && active.index === i) || product.memo === item.value ? 'white' : 'gray',
					}}
					onPress={() => {
						setActive({
							status: true,
							index: i,
						});
						setData({ ...product, [type]: item.value });
					}}
				>
					{item.label}
				</Button>
			))}
		</View>
	);
};

export default InlineButtons;
