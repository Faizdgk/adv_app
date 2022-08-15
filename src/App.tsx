/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Suspense,FC,useEffect} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLite from 'react-native-sqlite-storage';
import Search from './screens/search';
import Diary from './screens/diary';

const Stack = createNativeStackNavigator();

const App: FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  SQLite.DEBUG = true;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function errorCB(err) {
    console.log("SQL Error: " + err);
  }
  
  function successCB() {
    console.log("SQL executed fine");

  }
  
  function okCallback() {
    console.log("Database OPENED");
  }



  useEffect(()=>{
   // sqlite.openDatabase({name: 'myapp.db', location: 'default'},okCallback, errorCB);
   onMakeDb();

  
  },[]);


  const onMakeDb= async()=>{
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if(!readGranted || !writeGranted) {
      console.log('Read and write permissions have not been granted');
      return;
    }

    let db=await SQLite.openDatabase({name : "SQLite",
    location: 'default',
     createFromLocation : "~SQLite.db"}, okCallback,errorCB);
    if(db)
    db.transaction((tx) => {
     tx.executeSql('CREATE TABLE IF NOT EXISTS hearings (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(50), topic VARCHAR(20), last_hearing VARCHAR(20),next_hearing VARCHAR(20), fee VARCHAR(20), is_active INTEGER, phone VARCHAR(20) )', [], (tx, results) => {
         console.log("hearings TABLE created");
   
       });

   });
 

  }

  return (
    <SafeAreaProvider style={{flex:1}}>
       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
       <NavigationContainer>
      <Stack.Navigator initialRouteName='search'>
        <Stack.Screen name="search" component={Search} options={{ headerShown:false}}/>
        <Stack.Screen name="diary" component={Diary} options={{ headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
     </SafeAreaProvider>
  );
};



export default App;
