// import theme from '@theme';
// import { palette } from '@theme/colors';
// import { fonts } from '@theme/fonts';
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FBFBFB',
    flex:1
  },
  topContainer:{
   flex:0.75,
   backgroundColor:'#006600',
   borderBottomLeftRadius:20,
   borderBottomRightRadius:20,
  },
  bottomContainer:{
    flex:0.25,
   // backgroundColor:'#E5E5E5',
    justifyContent:'center',
    alignItems:'center'
  },
  inputContainer:{
    height:hp(95),
    width:wp(90),
    backgroundColor:'#FFFFFF',
    borderRadius:hp(2),
    position:'absolute',
    bottom:hp(0.8),
    alignItems:'flex-start',
    justifyContent:'flex-start',
    borderWidth:0.04,
    borderBottomColor:'#4B4B4B' 
  },
  searchTextInput:{
    height:hp(5.8),
    width:wp(60),
    color:'#333',
  //  borderWidth:0.2,
  //  backgroundColor:'#F9FAF9',
  //  borderColor:'#F2F4F7',
  //  paddingLeft:wp(4),
    fontSize:RFPercentage(1.8),
  //  fontFamily:fonts.regular,
    fontWeight:'500',
   //opacity:0.5
  },
  searchView:{
    height:hp(6),
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:wp(80),
    borderRadius:6,
    backgroundColor:'#F2F4F7',
    marginLeft:wp(5),
    marginTop:hp(2),
    borderColor:'#D2D2D2',
   // borderWidth:0.2,
    opacity:0.75
  },
  webView:{
    width:wp(90),
    minHeight:hp(55),
  //  alignItems:'center',
  //  justifyContent:'center'
  }

  
});

export default styles;
