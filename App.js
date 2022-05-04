import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";


// requires firebase for database connection through WebSocket
// connects app and firestore database
const firebaseConfig = {
  apiKey: "AIzaSyAV2skXDfLBUQNPtpHwKkrdTQmEj92OXzU",
  authDomain: "test-98f87.firebaseapp.com",
  projectId: "test-98f87",
  storageBucket: "test-98f87.appspot.com",
  messagingSenderId: "884521126238",
  appId: "1:884521126238:web:b144aa7f19f882161a67cf",
  measurementId: "G-1PE65G2Z1Z"
}

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



export default function App() {

  let [list, setList] = useState([]);

  // Creates reference to shopping list collection on firestore
  const shoppingListRef = collection(db, 'shoppinglist');

  // Adds news doc to collection 
  const addList = () => {
    addDoc(shoppingListRef, {
      name: 'Test List',
      items: ['eggs', 'peas', 'veggies'],

    })
  }
  const onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    setList(lists);
  };

  useEffect(() => {
    referenceShoppingLists = firebase.firestore().collection('shoppinglists');
    if(!referenceShoppingLists) {
      unsubscribe = referenceShoppingLists.onSnapshot(this.onCollectionUpdate) 
      return unsubscribe;
    } else {
      referenceShoppingLists
    }
  
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>All Shopping List</Text>
      <FlatList
        data={list}
        renderItem={({ item }) =>
        <Text style={styles.item}>{item.name}: {item.items}</Text>}
      />
      <Button 
        onPress={addList} title='Add List'></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,     
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});