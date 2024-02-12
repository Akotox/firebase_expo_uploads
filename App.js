import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'
import { Button, StyleSheet, Image, View } from 'react-native';
import { fbApp, uploadToFirebase } from './firebas-config';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  function generateRandomTitle(length = 26) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const title = generateRandomTitle();
        setSelectedImage(result.assets[0].uri);

        const uploadResponse = await uploadToFirebase(uri, title);

        console.log(uploadResponse);
      } else {
        alert('You did not select any image.');
      }
    } catch (error) {
      console.log(error);
    }

  };


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>

        <Button title="Pick an image from camera roll" onPress={pickImageAsync} />
        {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}
      </View>

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
