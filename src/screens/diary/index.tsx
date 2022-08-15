import * as React from 'react';
import { FC,useState,useRef, useCallback,useEffect } from 'react';
import {
  View, 
  Text,
  TouchableOpacity,
  Alert, 
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  TextInput} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions, useNavigation } from '@react-navigation/native';

import NHCSafeAreaView from '../../components/NHCSafeAreaView';
import styles from './styles';

import SQLite from 'react-native-sqlite-storage';
import DatePicker from 'react-native-date-picker';

type Nav = {
  navigate: (value: string) => void;
  goBack: (value: any) => void;
  dispatch:(value: any) => void;
}

const Diary: FC = () => {

  const[search1,setSearch]=useState('');

  const[title,setTitle]=useState('');
  const[topic,setTopic]=useState('');
  const[phone,setPhone]=useState('');
  const[fee,setFee]=useState('');
  const[prevDate,setPrevDate]=useState(new Date());
  const[nextDate,setNextDate]=useState(new Date());
  const[hearungsResult,setHearingResult]=useState([]);

  const[editTitle,setEditTitle]=useState('');
  const[editTopic,setEditTopic]=useState('');
  const[editPhone,setEdiitPhone]=useState('');
  const[editFee,setEditFee]=useState('');
  const[editPrevDate,setEditPrevDate]=useState(undefined);
  const[editNextDate,setEditNextDate]=useState(undefined);
  const[editID,setEditID]=useState(0);

  let editPrevDateRef:any=useRef(null);
  let editNextDateRef:any=useRef<TextInput>(null);
  let editTitleRef:any=useRef(null);
  let editTopicRef:any=useRef(null);

  let editPhoneRef:any=useRef(null);
  let editFeeRef:any=useRef(null);


  const[showEditModal,setShowEditModal]=useState(false);


  const navigation = useNavigation<Nav>();
  const popAction = useCallback(() => StackActions.pop(), []);

  let searchRef:any=useRef(null);

  let titleRef:any=useRef(null);
  let topicRef:any=useRef(null);

  let phoneRef:any=useRef(null);
  let feeRef:any=useRef(null);

  useEffect(()=>{
    SelectHearingQuery();
  },[]);




    /**
11  * Execute sql queries
12  * 
13  * @param sql
14  * @param params
15  * 
16  * @returns {resolve} results
17  */

  const   ExecuteQuery = (sql, params = []) => new Promise(async(resolve, reject) => {
    let db=await SQLite.openDatabase({name : "SQLite",
    location: 'default',
     createFromLocation : "~SQLite.db"});
    
    db.transaction((trans) => {
          trans.executeSql(sql, params, (trans, results) => {
            resolve(results);
          },
            (error) => {
              reject(error);
           });
       });
      });
  

  const onInsertHearing= async()=>{

     if(title){
      if(topic){
        const dd1=prevDate;
        const dd2=nextDate;
        let d1= dd1.toString().substring(4,15);
        let d2= dd2.toString().substring(4,15);
        let p= phone?phone:null;
        let f= fee?fee:null;
      //  console.log(d1,' pre : nxt ', d2, ' . ',title,' title : topic',topic);

       let singleInsert:any  = await ExecuteQuery("INSERT INTO hearings (id, title, topic, last_hearing,next_hearing,fee,is_active,phone) VALUES (?,  ?, ?, ?, ?, ?, ?, ?)", [null,title, topic, d1,d2,f,1,p]as any);
       let res= singleInsert?.insertId;
        if(res > 0){
          Alert.alert('Record Added successfully');
          setShowModal(!showModal);
          SelectHearingQuery();

          setTitle('');
          setTopic('');
          setPhone('');
          setFee('');

          setNextDate(new Date());
          setPrevDate(new Date());
        }
     

      }else{
        Alert.alert('Enter Topic of hearing');
      }
     } else {
      Alert.alert('Enter Title of hearing');
     }
  
 

  }

  const onSearch=async()=>{
   // console.log('key ==> ',search1);

    let selectQuery:any = await ExecuteQuery("SELECT * FROM hearings WHERE title LIKE   ?",['%'+search1+'%']as any );
    var rows = selectQuery?.rows;
   // console.log('rows ==> ',rows);
    if(rows && rows.length>0){
      let temp:any=[];
    
      for (let i = 0; i < rows.length; i++) {
        var item = rows.item(i);
        temp.push(item);
      }
      setHearingResult(temp);
     // console.log('',temp);
     }

 
   }

  const onUpdateHearing=async()=>{
    if(editID>0){
      //  title, topic, last_hearing,next_hearing,fee,is_active,phone
      let updateQuery = await ExecuteQuery('UPDATE hearings SET title = ? , topic = ? ,next_hearing = ?, last_hearing = ? ,fee = ?,phone = ?  WHERE id = ?', [editTitle, editTopic,editNextDate,editPrevDate,editFee,editPhone, editID] as any);
      console.log(updateQuery);

      setShowEditModal(!showEditModal);
      SelectHearingQuery();

    }

  }

 const onDeleteConfirm=(id:number)=>{
  Alert.alert(
    "Delete reccord?",
    "Do you want to Delete this record.",
    [
      {
        text: "Cancel",
     //   onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => onDeleteHearing(id) }
    ]
  );


 } 


  const onDeleteHearing=async(id:number)=>{
    let deleteQuery = await ExecuteQuery('DELETE FROM hearings WHERE id = ?', [id]as any);
      console.log(deleteQuery);
      SelectHearingQuery();
  }

  const SelectHearingQuery=async()=>{
      let selectQuery:any = await ExecuteQuery("SELECT * FROM hearings",[]);
       var rows = selectQuery?.rows;
       if(rows && rows.length>0){
        let temp:any=[];
      
        for (let i = 0; i < rows.length; i++) {
          var item = rows.item(i);
          temp.push(item);
        }
        setHearingResult(temp);
       // console.log('',temp);
       }
    
   }


  const goSearch=()=>{
    navigation.navigate('search');
  }

  const goBack = useCallback(() => {
    navigation.dispatch(popAction);
  }, [navigation, popAction]);


  const [showModal,setShowModal]=useState(false);

  const onEditRecord =(item:any)=>{
   // console.log('-=-=- ',editNextDateRef);
    setEditTopic(item.topic);
    setEditFee(item.fee);
    setEditTitle(item.title);
    setEdiitPhone(item.phone);
   // editNextDateRef?.current?.setValue(item.next_hearing);
    setEditNextDate(item.next_hearing);
    setEditPrevDate(item.last_hearing);
    setEditID(item.id);

   let tim = setTimeout(() => {
      setShowEditModal(!showEditModal);
      clearTimeout(tim);
    }, 500);
  }

  function _renderItem1({ item ,index}: { item: any ,index:number}) {
    return (
      <View key={index}
       style={styles.slide}>
         <View style={{flexDirection:'row'}}>
          <View style={{width:'35%',marginLeft:5}}>
            <Text style={styles.title}>Title: {item.title}</Text>
            <Text style={styles.topic}>Topic:{item.topic}</Text>
            <Text style={styles.phone}>Phone: {item.phone}</Text>
          </View>
          <View style={{width:'40%'}}>
            <Text style={styles.nextDate}>Next: {item.next_hearing}</Text>
            <Text style={styles.prevDate}>Last: {item.last_hearing}</Text>
            <Text style={styles.fee}>Fee : {item.fee}</Text>
          </View>

          <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>onEditRecord(item)}>  
            <Icon name="file-edit-outline" size={30} color="#333" />
           </TouchableOpacity> 

          <TouchableOpacity style={{alignSelf:'center',paddingLeft:5}} onPress={()=>onDeleteConfirm(item.id)} >  
            <Icon name="delete-forever-outline" size={30} color="#333" />
           </TouchableOpacity>   

         </View>
        
      </ View>
    );
  }

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 :- heightPercentageToDP(29);
  return (
    <NHCSafeAreaView>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >  
    <View style={styles.container}>
    <View style={styles.topContainer}>
      <View style={{flexDirection:'row',}}>

      <TouchableOpacity onPress={goSearch}
          style={{paddingLeft:widthPercentageToDP(5),paddingTop:2}}>  
            <Icon name="layers-search" size={30} color="#FFFFFF" />
           </TouchableOpacity> 

           <TouchableOpacity onPress={SelectHearingQuery}
          style={{paddingLeft:widthPercentageToDP(75),paddingTop:2}}>  
            <Icon name="reload" size={30} color="#FFFFFF" />
           </TouchableOpacity> 
      </View>
       

      </View>
      <Modal
      visible={showModal}
      animationType='fade'
      transparent={true}
      // onRequestClose={() => {
      // setShowModal(!showModal);
      // }}
       >
        <View style={{flex:1,width:widthPercentageToDP(100),
          justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:'rgba(0, 0, 0, 0.3)'
         }}>

        

            <View style={{backgroundColor:'#FFFFFF',height:heightPercentageToDP(95),
            justifyContent:'flex-start',alignItems:'center' ,
            width:widthPercentageToDP(100)}}>
                  <View style={{position:'absolute',top:5,left:10}}>
            <TouchableOpacity style={{paddingRight:5}} onPress={()=>  setShowModal(!showModal)}>  
              <Icon name="close-box-outline" size={30} color="#333" />
            </TouchableOpacity>   

            </View>
            <View>
            <View>
            <Text style={{marginVertical:5,color:'#3A3A39',fontWeight:'700',fontSize:18}}>Last Date</Text>
            <DatePicker
              date={prevDate}
              theme='light'
              mode='date'
             // androidVariant='iosClone'
              onDateChange={setPrevDate}
              // onConfirm={(date) => {
              //   setOpen(false)
              //   setDate(date)
              // }}
              // onCancel={() => {
              //   setOpen(false)
              // }}s
            />
            </View>

            <View>
            <Text style={{marginVertical:5,color:'#3A3A39',fontWeight:'700',fontSize:18}}>Next Date</Text>
            <DatePicker
              date={nextDate}
              theme='light'
              mode='date'
             // androidVariant='iosClone'
              onDateChange={setNextDate}
              // onConfirm={(date) => {
              //   setOpen(false)
              //   setDate(date)
              // }}
              // onCancel={() => {
              //   setOpen(false)
              // }}
            />
            </View>

            </View>

            <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={title}
             ref={titleRef}
             placeholder='Title'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setTitle(e.nativeEvent.text); }} 

             onEndEditing={()=> topicRef?.current?.focus()}
               
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="format-title" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={topic}
             ref={topicRef}
             placeholder='Topic'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setTopic(e.nativeEvent.text); }} 
             onEndEditing={()=> phoneRef?.current?.focus()}
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="subtitles-outline" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={phone}
             ref={phoneRef}
             placeholder='Phone'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setPhone(e.nativeEvent.text); }} 
             onEndEditing={()=> feeRef?.current?.focus()}
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="file-phone-outline" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={fee}
             ref={feeRef}
             placeholder='Fee'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='done'  
             onChange={(e: any) => {setFee(e.nativeEvent.text); }} 
               
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="bank-plus" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <TouchableOpacity style={{paddingTop:8}}  onPress={onInsertHearing}>  
            <Icon name="plus-box-outline" size={30} color="#333" />
           </TouchableOpacity>  
            </View>

        </View>
      </Modal>
      <Modal
      visible={showEditModal}
      animationType='fade'
      transparent={true}
       >
        <View style={{flex:1,width:widthPercentageToDP(100),
          justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:'rgba(0, 0, 0, 0.3)'
         }}>
          <View style={{backgroundColor:'#FFFFFF',height:heightPercentageToDP(65),
            justifyContent:'flex-start',alignItems:'center' ,
            width:widthPercentageToDP(100)}}>
                  <View style={{position:'absolute',top:5,left:10}}>
            <TouchableOpacity style={{paddingRight:5}} onPress={()=>  setShowEditModal(!showEditModal)}>  
              <Icon name="close-box-outline" size={30} color="#333" />
            </TouchableOpacity>   

            </View>
            <View>
            <View>
             <Text style={{marginVertical:5,color:'#3A3A39',fontWeight:'700',fontSize:18,textAlign:'center'}}>Edit Last Date</Text>
            <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             ref={editPrevDateRef}
             value={editPrevDate}
             defaultValue={editPrevDate}
           //  placeholder=''
           //  secureTextEntry={showPassword} 
           //  placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setEditPrevDate(e.nativeEvent.text); }} 
            // onEndEditing={()=> topicRef?.current?.focus()}
               
            />
            </View>
            </View>

            <View>
             <Text style={{marginVertical:5,color:'#3A3A39',fontWeight:'700',fontSize:18,textAlign:'center'}}>Edit Next Date</Text>
            <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             ref={editNextDateRef}
             defaultValue={editNextDate}
              value={editNextDate}
             returnKeyType='next'  
             onChange={(e: any) => {setEditNextDate(e.nativeEvent.text); }} 
            // onEndEditing={()=> topicRef?.current?.focus()}
               
            />
            </View>
            </View>

            </View>

            <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             defaultValue={editTitle}
             ref={editTitleRef}
           //  placeholder='Title'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setEditTitle(e.nativeEvent.text); }} 
            // onEndEditing={()=> topicRef?.current?.focus()}  
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="format-title" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             defaultValue={editTopic}
             ref={editTopicRef}
            // placeholder='Topic'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setEditTopic(e.nativeEvent.text); }} 
           //  onEndEditing={()=> phoneRef?.current?.focus()}
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="subtitles-outline" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             defaultValue={editPhone}
            ref={editPhoneRef}
           //  placeholder='Phone'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='next'  
             onChange={(e: any) => {setEdiitPhone(e.nativeEvent.text); }} 
           //  onEndEditing={()=> feeRef?.current?.focus()}
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="file-phone-outline" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             defaultValue={editFee}
             ref={editFeeRef}
           //  placeholder='Fee'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='done'  
             onChange={(e: any) => {setEditFee(e.nativeEvent.text); }} 
               
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="bank-plus" size={30} color="#333" />
           </TouchableOpacity>    
           </View>

           <TouchableOpacity style={{paddingTop:8}}  onPress={onUpdateHearing}>  
             <Icon name="plus-box-outline" size={30} color="#333" />
           </TouchableOpacity>  
            </View>

        </View>
      </Modal>
      <View style={styles.bottomContainer}>
       <View style={styles.inputContainer}>
       <View style={styles.searchView}>
            <TextInput
             style={styles.searchTextInput}
             value={search1}
             ref={searchRef}
             placeholder='Search Hearing'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             returnKeyType='done'  
             onChange={(e: any) => {setSearch(e.nativeEvent.text); }} 
             onSubmitEditing={onSearch}        
            />

           <TouchableOpacity style={{paddingRight:5}}>  
            <Icon name="text-box-search-outline" size={30} color="#333" />
           </TouchableOpacity>    
        </View>

        <TouchableOpacity style={styles.searchView} onPress={()=>  setShowModal(!showModal)}>
            <TextInput
             style={styles.searchTextInput}
             
             ref={searchRef}
             placeholder='Add a Hearng'
           //  secureTextEntry={showPassword} 
             placeholderTextColor={'#7A869A'}  
             editable={false}
                
            />

           <View style={{paddingRight:5}} >  
            <Icon name="text-box-plus-outline" size={30} color="#333" />
           </View>    
        </TouchableOpacity>
    
        <Text style={{marginVertical:2,color:'#333',fontWeight:'700',fontSize:18,marginLeft:widthPercentageToDP(38)}}>List</Text>
          <View style={{height:heightPercentageToDP(60)}}>
          <FlatList
            data={hearungsResult}
          // refreshing={this.state.refreshing}
          // ref={ref => { this.newsFeedListRef = ref; }}
            renderItem={_renderItem1}
            keyExtractor={(_item, index) => `feed_${index}`}
            showsVerticalScrollIndicator={false}
         
           />

          </View>
         
        </View> 

      </View>
    </View>
    </KeyboardAvoidingView>  
    </NHCSafeAreaView>
  );
};

export default React.memo(Diary);
