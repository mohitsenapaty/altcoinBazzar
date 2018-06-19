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
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './Menu';

var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

import ModalDropdown from 'react-native-modal-dropdown';
//import '../../shim.js';      
//import crypto from 'crypto';


export default class Bankarea extends React.Component{
  goToProfilePage = () =>{
    //this.toggleDrawer();
    this.props.navigation.navigate('Memberarea');
  }
  goToKYCPage = () =>{
    this.props.navigation.navigate('KYCarea');
  }
  goToBankPage = () =>{
    //this.toggleDrawer();
    this.props.navigation.navigate('Bankarea');
  }
  goToMarketPage = () =>{
    this.props.navigation.navigate('Marketarea');
  }
  goToWalletPage = () =>{
    this.props.navigation.navigate('Walletarea');
  }
  goToTradePage = () =>{
    this.props.navigation.navigate('Tradearea');
  }
  classRender(){
    if (this.state.paymentType == 'IMPS' && this.state.HasIMPS == 'No'){
      return (
        <View style={styles.InputContainer}>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          <TextInput style={styles.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TextInput style={styles.Input} onChangeText={(AccountHolderName)=>this.setState({AccountHolderName})} value={this.state.AccountHolderName}  placeholder='Account Holder Name'></TextInput>
          <TextInput style={styles.Input} onChangeText={(bank_name)=>this.setState({bank_name})} value={this.state.bank_name}  placeholder='Bank Name'></TextInput>
          <TextInput style={styles.Input} onChangeText={(impsNumber)=>this.setState({impsNumber})} value={this.state.impsNumber}  placeholder='impsNumber'></TextInput>
          <TextInput style={styles.Input} onChangeText={(ifscCode)=>this.setState({ifscCode})} value={this.state.ifscCode}  placeholder='ifsc Code'></TextInput>
          <TextInput style={styles.Input} onChangeText={(accountType)=>this.setState({accountType})} value={this.state.accountType}  placeholder='Account type'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update IMPS</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'IMPS' && this.state.HasIMPS == 'Yes'){
      return (
        <View style={styles.InputContainer}>
          <Text>IMPS Details here. {this.state.AccountHolderNameDB} {this.state.impsNumberDB}
            {this.state.ifscCodeDB} {this.state.bank_nameDB} {this.state.accountTypeDB}
          </Text>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          <TextInput style={styles.Input} onChangeText={(AccountHolderName)=>this.setState({AccountHolderName})} value={this.state.AccountHolderName}  placeholder='Account Holder Name'></TextInput>
          <TextInput style={styles.Input} onChangeText={(bank_name)=>this.setState({bank_name})} value={this.state.bank_name}  placeholder='Bank Name'></TextInput>
          <TextInput style={styles.Input} onChangeText={(impsNumber)=>this.setState({impsNumber})} value={this.state.impsNumber}  placeholder='Account Number'></TextInput>
          <TextInput style={styles.Input} onChangeText={(ifscCode)=>this.setState({ifscCode})} value={this.state.ifscCode}  placeholder='ifsc Code'></TextInput>
          <TextInput style={styles.Input} onChangeText={(accountType)=>this.setState({accountType})} value={this.state.accountType}  placeholder='Account type'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update IMPS</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'PAYTM' && this.state.HasPAYTM == 'No') {
      return (
        <View style={styles.InputContainer}>
          
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          
          <TextInput style={styles.Input} onChangeText={(paytmNumber)=>this.setState({paytmNumber})} value={this.state.paytmNumber}  placeholder='PAYTM number'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update PAYTM</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'PAYTM' && this.state.HasPAYTM == 'Yes') {
      return (
        <View style={styles.InputContainer}>
          <Text>PAYTM Details here. {this.state.paytmNumberDB}
          </Text>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='IMPS' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          
          <TextInput style={styles.Input} onChangeText={(paytmNumber)=>this.setState({paytmNumber})} value={this.state.paytmNumber}  placeholder='PAYTM number'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update PAYTM</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'UPI' && this.state.HasUPI == 'No'){
      return (
        <View style={styles.InputContainer}>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='UPI' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>
          
          <TextInput style={styles.Input} onChangeText={(upiAddress)=>this.setState({upiAddress})} value={this.state.upiAddress}  placeholder='PAYTM number'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update UPI</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.state.paymentType == 'UPI' && this.state.HasUPI == 'Yes'){
      return (
        <View style={styles.InputContainer}>
          <Text>UPI Details here. {this.state.upiAddressDB}
          </Text>
          <ModalDropdown options={['IMPS', 'UPI', 'PAYTM']} defaultValue='PAYTM' onSelect={this.selectedPayMethod}>
          
          </ModalDropdown>

          
          <TextInput style={styles.Input} onChangeText={(upiAddress)=>this.setState({upiAddress})} value={this.state.upiAddress}  placeholder='PAYTM number'></TextInput>
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TouchableOpacity onPress={this.updateBank} style={styles.ButtonContainer}>
            <Text>Update UPI</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else{
      return(
        <View style={styles.InputContainer}>
          <Text>There was some error.</Text>
        </View>
      );
    }
  }

  render() {

    return(
      <DrawerLayout
          drawerWidth={300}
          ref={drawerElement => {
            this.DRAWER = drawerElement;
          }}
          drawerPosition={DrawerLayout.positions.left}
          onDrawerOpen={this.setDrawerState}
          onDrawerClose={this.setDrawerState}
          renderNavigationView={() => <Menu _goToBankPage={()=>this.goToBankPage()}
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToMarketPage={()=>this.goToMarketPage()}
              _goToWalletPage={()=>this.goToWalletPage()}
              _goToTradePage={()=>this.goToTradePage()}
            />}
        >
          <ActionBar
              containerStyle={styles.bar}
              backgroundColor="#33cc33"
              leftIconName={'menu'}
              onLeftPress={this.toggleDrawer}/>
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
        </DrawerLayout>
    );

  }

  constructor(props){
    super(props);
    this.state = {'username':'', 'password':'', 'defaultPayMethod':'IMPS', 'user_token':'',
    'payMethodAdded':'No', 'paymentType':'IMPS', 'impsNumber':'', 
    'ifscCode':'', 'accountType':'', 'upiAddress':'', 'paytmNumber':'',
    'user_id':'', 'bank_name':'', 'AccountHolderName':'',
    'HasIMPS':'No', 'HasUPI':'No', 'HasPAYTM':'No', 'impsNumberDB':'', 
    'ifscCodeDB':'', 'accountTypeDB':'', 'upiAddressDB':'', 'paytmNumberDB':'',
    'AccountHolderNameDB':'', 'bank_nameDB':'',
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.setDrawerState = this.setDrawerState.bind(this);

    this.goToProfilePage = this.goToProfilePage.bind(this);
    this.goToBankPage = this.goToBankPage.bind(this);
    this.goToMarketPage = this.goToMarketPage.bind(this);
    this.goToWalletPage = this.goToWalletPage.bind(this);
    this.goToTradePage = this.goToTradePage.bind(this);
  }
  setDrawerState() {
    this.setState({
      drawerClosed: !this.state.drawerClosed,
    });
  }

  toggleDrawer = () => {
    if (this.state.drawerClosed) {
      this.DRAWER.openDrawer();
    } else {
      this.DRAWER.closeDrawer();
    }
  }
  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
    //alert(this.state.drawerClosed);
    var value = await AsyncStorage.getItem('user_session');
    if (value === null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      this.props.navigation.navigate('Login');
    }
    else{
      obj_value = JSON.parse(value);
      this.setState({'username':obj_value.user_name});
      this.setState({'user_id':obj_value.user_id});

      //handle logic for default paymethod (both should be stored in AsyncStorage)
      //if payMethodAdded == N defaultPayMethod is empty string
      //else payMethodAdded == Y fetch from the website.
    }

    value = await AsyncStorage.getItem('user_token');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_token':obj_value});
      //alert(this.state.user_token);
    }
    else{
      this.props.navigation.navigate('Login');
    }

    //connect to bank using fetch api.
    try{
      //alert("a"); 
      fetch(GLOB_IP_DEV+'/getKYCStatus/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          //alert("Login Success");
          //alert(res.data.user_name + " " + res.data.user_id + " " + res.data.name + " " + res.data.email + " " + res.data.phone)
          if (res.data.kyc_status === false){
            //no kyc status
            this.setState({'kycDone':'No'});
          }
          else{
            //kyc status done
            this.setState({'kycDone':'Yes'});
          }
          //alert(this.state.kycDone);
        }
        else{alert("Error fetching details.");}
      })
      .done();

      fetch(GLOB_IP_DEV+'/getAllPayMethods/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(JSON.stringify(res));
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          if (Object.keys(res.data.imps).length === 0 && Object.keys(res.data.upi).length === 0 && Object.keys(res.data.paytm).length === 0){
            alert("You don't have any bank Details. Please add a bank detail.");
          }
          if (Object.keys(res.data.imps).length !== 0){
            //has imps
            //alert(JSON.stringify(res.data.imps));
            this.setState({'HasIMPS':'Yes'});
            this.setState({'AccountHolderNameDB':res.data.imps.account_holder_name});
            this.setState({'bank_nameDB':res.data.imps.bank_name});
            this.setState({'accountTypeDB':res.data.imps.account_type});
            this.setState({'ifscCodeDB':res.data.imps.ifsc});
            this.setState({'impsNumberDB':res.data.imps.account_no});
          }
          if (Object.keys(res.data.upi).length !== 0){
            //has upi
            //alert(JSON.stringify(res.data.upi));
            this.setState({'HasUPI':'Yes'});
            this.setState({'upiAddressDB':res.data.upi.upi_address});
          }
          if (Object.keys(res.data.paytm).length !== 0){
            //has paytm
            //alert(JSON.stringify(res.data.paytm));
            this.setState({'HasPAYTM':'Yes'});
            this.setState({'paytmNumberDB':res.data.paytm.paytm_number});
          }
        }
        else{alert("Error fetching details. Or bank details not added.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
  }
  updateBank = () =>{
    //alert("Update bank");
    if (this.state.paymentType == 'IMPS'){
      try{
        //alert("a"); 
        fetch(GLOB_IP_DEV+'/updateIMPS/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.user_id,
            bank_name: this.state.bank_name,
            ifsc: this.state.ifscCode,
            account_no: this.state.impsNumber,
            account_type: this.state.accountType,
            account_holder_name: this.state.AccountHolderName
          }),
        })
        .then((response) => response.json())
        .then((res) => {
          //console.log(res);
          //alert(res.success);
          //alert("a");
          if (res.success === 1){
            alert("IMPS payment method added successfully.");
            this.setState()
          }
          else{alert("Error fetching details.");}
        })
        .done();
      }
      catch(error){
        alert(error);
      }
    }
    else if (this.state.paymentType == 'UPI'){
      try{
        //alert("a"); 
        fetch(GLOB_IP_DEV+'/updateUPI/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.user_id,
            upi_address: this.state.upiAddress,
          }),
        })
        .then((response) => response.json())
        .then((res) => {
          //console.log(res);
          //alert(res.success);
          //alert("a");
          if (res.success === 1){
            alert("UPI payment method added successfully.");
          }
          else{alert("Error fetching details.");}
        })
        .done();
      }
      catch(error){
        alert(error);
      }
    }
    else{
      try{
        //alert("a"); 
        fetch(GLOB_IP_DEV+'/updatePAYTM/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.user_id,
            paytm_number: this.state.paytmNumber,
          }),
        })
        .then((response) => response.json())
        .then((res) => {
          //console.log(res);
          //alert(res.success);
          //alert("a");
          if (res.success === 1){
            alert("PAYTM payment method added successfully.");
          }
          else{alert("Error fetching details.");}
        })
        .done();
      }
      catch(error){
        alert(error);
      }
    }
  }
  selectedPayMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
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
