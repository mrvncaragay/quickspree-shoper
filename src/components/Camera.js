import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

const Camera = ({ handleBarcodeScan, handleTakePicture, closeCamera, type }) => {
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

	const takePicture = async () => {
		const option = {
			quality: 1,
		};

		if (cameraRef.current) {
			const img = await cameraRef.current.takePictureAsync(option);
			handleTakePicture(img);
		}
	};

	return (
		<View style={styles.container}>
			<ExpoCamera
				ref={cameraRef}
				style={styles.camera}
				autoFocus
				onBarCodeScanned={type === 'barcode' ? handleBarcodeScan : null}
			>
				<View style={{ flex: 1 }}>
					<View style={{ height: 80, alignItems: 'flex-end' }}>
						<TouchableOpacity style={styles.capture} onPress={closeCamera}>
							<Image
								source={require('../../assets/camera/cameraClose.png')}
								style={{ width: 30, height: 30 }}
								resizeMode={'contain'}
							/>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1 }} />
					<View style={{ height: 80, alignItems: 'center' }}>
						{type === 'camera' && (
							<TouchableOpacity style={styles.capture} onPress={takePicture}>
								<Image
									source={require('../../assets/camera/cameraButton.png')}
									style={{ width: 50, height: 50 }}
									resizeMode={'contain'}
								/>
							</TouchableOpacity>
						)}
					</View>
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
	},
});

export default Camera;
