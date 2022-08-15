import * as React from 'react';
import { FC,useState,useRef, useCallback } from 'react';
import {
  View, 
  Text,
  TouchableOpacity,
  ScrollView, 
  Alert, 
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';

import axios from 'axios';
import qs from 'qs';
import { StackActions, useNavigation } from '@react-navigation/native';
import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import styles from './styles';


type Nav = {
  navigate: (value: string) => void;
  goBack: (value: any) => void;
  dispatch:(value: any) => void;
}

const Search: FC = () => {

  const[search1,setSearch]=useState('');

  const[searchResult,setSearchResult]=useState('');

  const[showResult,setShowResult]=useState(false);

  const navigation = useNavigation<Nav>();
  const popAction = useCallback(() => StackActions.pop(), []);

  let searchRef:any=useRef(null);
  let webviewRef:any=useRef(null);



  const onSearch=()=>{
  // console.log('key ==> ',search1);

    if(search1 && search1.length){
      var data = qs.stringify({
        'key': search1,
        'B1': 'Search' 
      });
      var config = {
        method: 'post',
        url: 'http://www.punjablaws.gov.pk/keyword.php',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
      
        if(response.data){
         // console.log(JSON.stringify(response.data));
          setSearchResult(response.data);
          setShowResult(true);
        }
       
      })
      .catch(function (error) {
        console.log(error);
      });


    }
  }

  const goDiary=()=>{
    navigation.navigate('diary');
  }

  const goBack = useCallback(() => {
    navigation.dispatch(popAction);
  }, [navigation, popAction]);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 :- heightPercentageToDP(29);
  return (
    <NHCSafeAreaView>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >  
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
  
    <View style={{flexDirection:'row',}}>

    <TouchableOpacity onPress={goDiary}
    style={{paddingLeft:widthPercentageToDP(5),paddingTop:2}}>  
      <Icon name="note-edit" size={30} color="#FFFFFF" />
     </TouchableOpacity> 

     <TouchableOpacity onPress={()=>setShowResult(!showResult)}
    style={{paddingLeft:widthPercentageToDP(75),paddingTop:2}}>  
      <Icon name="reload" size={30} color="#FFFFFF" />
     </TouchableOpacity> 
   </View>
      </View>
      <View style={styles.bottomContainer}>
       <View style={styles.inputContainer}>
       <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={search1}
             ref={searchRef}
             placeholder='Search keywords'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='done'  
             onChange={(e: any) => {setSearch(e.nativeEvent.text); }} 
             onSubmitEditing={onSearch}        
            />

           <TouchableOpacity style={{paddingRight:5}} onPress={onSearch}>  
            <Icon name="layers-search" size={30} color="#333" />
           </TouchableOpacity>    
          </View>
          {showResult?
          <TouchableOpacity onPress={()=>webviewRef.current.goBack()}>
          <Text style={{marginLeft:23,marginTop:7,color:'#333',fontWeight:'700',fontSize:18}}>Back</Text>
          </TouchableOpacity>:
          <Text style={{marginLeft:23,marginTop:7,color:'#333',fontWeight:'700',fontSize:18}}>Enter keywords</Text>
          }
       
          {showResult ?
            <WebView
            ref={webviewRef}
            automaticallyAdjustContentInsets={true}
            style={styles.webView}
            source={{html:searchResult }}
             // html={searchResult} 
            />:
            <View style={styles.webView}>
              <View style={{marginTop:heightPercentageToDP(30)}}>
               {/* <ActivityIndicator size="large" color="#00ff00" /> */}
               <Text style={{color:'#d3d3d3',fontWeight:'700',fontSize:18,textAlign:'center'}}>Search online from punjablaws</Text>
              </View> 
            </View>
          }
        </View> 

      </View>
    </ScrollView>
    </KeyboardAvoidingView>  
    </NHCSafeAreaView>
  );
};

export default React.memo(Search);
