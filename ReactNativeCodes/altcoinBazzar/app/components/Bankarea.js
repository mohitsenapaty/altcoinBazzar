import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  AsyncStorage,

} from 'react-native';

var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

import ModalDropdown from 'react-native-modal-dropdown';

export default class Bankarea extends React.Component{
  
  classRender(){
    if (this.state.paymentType == 'IMPS'){
      return (
        <View style={styles.InputContainer}>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          <TextInput style={styles.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TextInput style={styles.Input} onChangeText={(impsNumber)=>this.setState({impsNumber})} value={this.state.impsNumber}  placeholder='impsNumber'></TextInput>
          <TextInput style={styles.Input} onChangeText={(ifscCode)=>this.setState({ifscCode})} value={this.state.ifscCode}  placeholder='ifsc Code'></TextInput>
          <TextInput style={styles.Input} onChangeText={(accountType)=>this.setState({accountType})} value={this.state.accountType}  placeholder='Account type'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update Payment</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'PAYTM') {
      return (
        <View style={styles.InputContainer}>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          <TextInput style={styles.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TextInput style={styles.Input} onChangeText={(paytmNumber)=>this.setState({paytmNumber})} value={this.state.paytmNumber}  placeholder='PAYTM number'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update Payment</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else{
      return (
        <View style={styles.InputContainer}>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          <TextInput style={styles.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TextInput style={styles.Input} onChangeText={(upiAddress)=>this.setState({upiAddress})} value={this.state.upiAddress}  placeholder='PAYTM number'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update Payment</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {

    return(
      <ScrollView style={styles.Container}>
          <ImageBackground source={require('../img/background_cc.jpg')} style={styles.BackgroundImage}>
            <View style={styles.Content}>
              <Text style={styles.Logo}> -ALTCOINBAZZAR-
              </Text>
              <View>
                <Text>
                  Current Payment: {this.state.paymentType}
                </Text>
              </View>
              {this.classRender()}
            </View>
          </ImageBackground>
        </ScrollView>
    );

  }

  constructor(props){
    super(props);
    this.state = {username:'', password:'', defaultPayMethod:'', payMethodAdded:'N', paymentType:'IMPS', 'impsNumber':'', 'ifscCode':'', 'accountType':'', 'upiAddress':'', paytmNumber:''};
  }

  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
    var value = await AsyncStorage.getItem('user_session');
    if (value === null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      this.props.navigation.navigate('Login');
    }
    else{
      obj_value = JSON.parse(value);
      this.setState({'username':obj_value.user_name});

      //handle logic for default paymethod (both should be stored in AsyncStorage)
      //if payMethodAdded == N defaultPayMethod is empty string
      //else payMethodAdded == Y fetch from the website.
    }
  }
  updateBank = () =>{
    //alert("Update bank");
    if (this.state.paymentType == 'IMPS'){

    }
    else if (this.state.paymentType == 'UPI'){

    }
    else{

    }
  }
  selectedPayMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    alert("1");
    this.setState({'paymentType':value});
  }
}

const styles = StyleSheet.create({
  Container:{
    flex:1,
  },
  BackgroundImage:{
    flex:1,
    alignSelf:'stretch',
    width:null,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center'
  },
  Content:{
    alignItems:'center',
  },
  Logo:{
    color:'black',
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: '#ffffff',
    textShadowOffset: {width:2, height:2},
    textShadowRadius: 15,
    marginBottom: 20,
  },
  InputContainer:{
    margin:20,
    marginBottom: 0,
    padding: 20,
    paddingBottom: 0,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  Input:{
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    marginBottom: 10,
    padding: 10,
    height: 40,
  },
  ButtonContainer:{
    alignSelf: 'stretch',
    margin: 20,
    padding: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    alignItems: 'center'
  },
});
