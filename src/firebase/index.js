import firebase from 'firebase';
import env from '../../config';

const firebaseConfig = {
	apiKey: env.apiKey,
	authDomain: env.authDomain,
	databaseURL: env.databaseURL,
	projectId: env.projectId,
	storageBucket: env.storageBucket,
	messagingSenderId: env.messagingSenderId,
	appId: env.appId,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// save product to db
export const saveProductToDB = (product, path) => {
	return new Promise(async (resolve, reject) => {
		const productRef = firebase.database().ref(path);
		productRef.push().set(product, async (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

// save image to storage
export const saveImageToStorage = (image, path) => {
	return new Promise(async (resolve, reject) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', image.uri, true);
			xhr.send(null);
		});

		try {
			const storageRef = firebase.storage().ref();
			var imagesFolder = storageRef.child(path);

			const snapshot = await imagesFolder.put(blob);
			const url = await snapshot.ref.getDownloadURL();
			resolve(url);
		} catch (error) {
			reject(error);
		}
	});
};

export default firebase;
