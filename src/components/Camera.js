import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

const Camera = ({ handleBarcodeScan, closeCamera }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const cameraRef = useRef(null);

	useEffect(() => {
		(async () => {
			const { status } = await ExpoCamera.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<ExpoCamera ref={cameraRef} style={styles.camera} autoFocus onBarCodeScanned={handleBarcodeScan}>
				<View style={{ flex: 1 }}>
					<TouchableOpacity style={styles.capture} onPress={closeCamera}>
						<Image
							source={require('../../assets/camera/cameraClose.png')}
							style={{ width: 30, height: 30 }}
							resizeMode={'contain'}
						/>
					</TouchableOpacity>
				</View>
			</ExpoCamera>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	camera: {
		flex: 1,
	},
	capture: {
		padding: 15,
		position: 'absolute',
		alignSelf: 'flex-end',
	},
});

export default Camera;
