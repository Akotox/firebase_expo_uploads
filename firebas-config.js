import { initializeApp, getApp, getApps } from 'firebase/app';
import {FIREBASE_API_KEY,FIREBASE_PROJECT_ID,FIREBASE_AUTH_DOMAIN, FIREBASE_STORAGE_BUCKET, FIREBASE_APP_ID} from '@env'

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// Initialize Firebase
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    appId: FIREBASE_APP_ID,
    projectId: FIREBASE_PROJECT_ID,
    authDomain: FIREBASE_AUTH_DOMAIN,
};

if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}

const fbApp = getApp();
const fbStorage = getStorage();

/**
 * 
 * @param {*} uri 
 * @param {*} title 
 */

const uploadToFirebase = async(uri, title, onProgress) => {

    const response = await fetch(uri)
    const fileBlob = await response.blob();

    const imageRef =  ref(getStorage(), `images/${title}`);

    const uploadTask = uploadBytesResumable(imageRef, fileBlob)

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
                onProgress && onProgress(progress)
            },
            (error) => {
              reject(error)
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                    downloadUrl,
                    metadata: uploadTask.snapshot.metadata
                })
            }
        ) 
    })

    
};

export {
    fbApp,
    fbStorage,
    uploadToFirebase
}


