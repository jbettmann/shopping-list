import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";


// requires firebase for database connection through WebSocket
// connects app and firestore database
const firebaseConfig = {
  apiKey: "AIzaSyAViZH5vwAxOQj3OSYJKcvNEOT0gIKOp8M",
  authDomain: "test-a0592.firebaseapp.com",
  projectId: "test-a0592",
  storageBucket: "test-a0592.appspot.com",
  messagingSenderId: "981317081479",
  appId: "1:981317081479:web:6af672d85d3bd1dc11db22",
  measurementId: "G-RS3SFEG7RB"
}

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



export default function App() {

  let [list, setList] = useState([]);
  let [uid, setUid] = useState();
  let [loggedInText, setLoggedInText] = useState("Please wait. You're being authenticated");


  // Creates reference to shopping list collection on firestore
  const shoppingListRef = collection(db, 'shoppinglists');

  // Adds news doc to collection 
  const addList = () => {
    addDoc(shoppingListRef, {
      name: 'Test List',
      items: ['eggs', 'peas', 'veggies'],
      uid: uid,
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
    const auth = getAuth();

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if(!user) {
        await signInAnonymously(auth);
      }
      // set user and logged in text state once authenticated
      setUid(user.uid);
      setLoggedInText('Hello there!')
      
    //  ques shoppinglist database and then calls Snapshot when list updates
    const userListQuery = query(shoppingListRef, where("uid", "==", uid));
    unsubscribe = onSnapshot(userListQuery, onCollectionUpdate) 
  });

    return () => {
      authUnsubscribe();
    }
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>All Shopping List</Text>
      <Text>{loggedInText}</Text>
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