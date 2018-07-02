/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  TextInput,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './Menu';
import ModalDropdown from 'react-native-modal-dropdown';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

//type Props = {};
export default class EtherMarketArea extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'kycDone':'No',
      'drawerClosed':true,
      'user_token':'',
      'offerType':'Buy',
      'quant':'0.000000',
      'price':'0.00',
      'totalPrice':'0.00',
      'offerType':'Sell Offers',
      'ticker':'ETH',
      'lastSet':'',
      'offerPayMethod':'',
      'createOfferPayMethod':'',
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
    //search for KYC/bank status using async
    var value = await AsyncStorage.getItem('user_session');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_session':obj_value});

    }
    else{
      this.props.navigation.navigate('Login');
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
    
    try{
      //alert("a"); 
      fetch(GLOB_IP_DEV + '/getKYCStatus/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_session.user_id,
          
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
            //alert("No KYC Done");
            this.setState({'kycDone':'No'});
          }
          else{
            //kyc status done
            alert("KYC Done");
            this.setState({'kycDone':'Yes'});
          }
          //AsyncStorage.setItem('kyc_status', this.state.kycDone);
        }
        else{alert("Error fetching details.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
  }
  WalletRender(){
    if (this.state.etherAddressAvailable == 'Yes'){
      return(
        <View>
          <Text>Ether address: 0x{this.state.etherAddress}</Text>
          <Text>Ether ether at the above address to sell.</Text>
          <Text></Text>
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>You need to generate ether address before you sell.</Text>
          <TouchableOpacity onPress={this.generateAddress} style={styles.ButtonContainer}>
            <Text>Generate Ether Wallet</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  classRender(){
    if (this.state.kycDone!="Yes"){
      return(
        <View>
          <Text>Trade Area.</Text>
          <Text>Will display offers here with sorting parameters.</Text>
          <ModalDropdown options={['Sell Offers', 'Buy Offers']} 
          defaultValue='Sell Offers' value = {this.state.offerType}
          onSelect={this.selectedOfferTypeMethod}>
          </ModalDropdown>
          <ModalDropdown options={['Any', 'IMPS', 'PAYTM', 'UPI']} 
          defaultValue='Any' value = {this.state.offerPayMethod}
          onSelect={this.selectedOfferPayMethod}>          
          </ModalDropdown>
          <Text></Text>
          <View>
            <Text>Add offers here.</Text>
            <TextInput style={styles.Input} 
            onChangeText={(quant)=> this.onChangeQuantText(quant) } 
            value={this.state.quant}  placeholder='0.000000'>
            </TextInput>
            <TextInput style={styles.Input} 
            onChangeText={(price)=>this.onChangePriceText(price)} 
            value={this.state.price}  placeholder='00.00'>
            </TextInput>
            <TextInput style={styles.Input} 
            onChangeText={(totalPrice)=>this.onChangeTotalPriceText(totalPrice)} 
            value={this.state.totalPrice}  placeholder='00.00'>
            </TextInput>
            <ModalDropdown options={['Any', 'IMPS', 'PAYTM', 'UPI']} 
            defaultValue='Any' value = {this.state.createOfferPayMethod}
            onSelect={this.selectedCreateOfferPayMethod}>          
            </ModalDropdown>
            <TouchableOpacity onPress={this.submitEtherOffer} style={styles.ButtonContainer}>
              <Text>Submit Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>You can not trade. Complete KYC before Withdrawal or Deposit.</Text>
        </View>
      );
    }
  }
  render() {

    return (
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
        <View style={styles.Container}>
          <Text>Welcome {this.state.user_session.user_name}</Text>
          <Text>Welcome {this.state.user_session.name}</Text>
          <Text>Welcome {this.state.user_session.email}</Text>
          <Text>Welcome {this.state.user_session.phone}</Text>
          {this.classRender()}       
        </View>
      </DrawerLayout>
    );  
  }  
  onChangeQuantText = (quant) => {
    if (this.isNumeric(quant))
    {
      this.setState({'quant':quant}); 
    }
    else{
      alert("incorrect value " + this.state.quant);
    }
  }
  onChangePriceText = (price) => {
    if (this.isNumeric(price))
    {
      this.setState({'price':price}); 
    }
    else{
      alert("incorrect value " + this.state.price);
    }
  }
  onChangeTotalPriceText = (totalPrice) => {
    if (this.isNumeric(totalPrice))
    {
      this.setState({'totalPrice':totalPrice}); 
    }
    else{
      alert("incorrect value " + this.state.totalPrice);
    }
  }
  submitEtherOffer = () => {
    alert("offer submitted");
    //validate input
    inputValidated = 0;
    if (this.state.ticker != 'ETH') {
      alert("Invalid");
      return;
    }
    if (!(this.state.offerType == 'Buy' || this.state.offerType == 'Sell')){
      alert("Invalid");
      return;
    }
    if (!(this.state.createOfferPayMethod == 'Any' || this.state.createOfferPayMethod == 'IMPS' || this.state.createOfferPayMethod == 'UPI' || this.state.createOfferPayMethod == 'PAYTM')){
      alert("Invalid");
      return;
    }
    if (parseFloat(this.state.quant)*parseFloat(this.state.price) != parseFloat(this.state.totalPrice)){
      alert("Invalid");
      return;
    }
    if (inputValidated != 0){
      try{
        //alert("a"); 
        fetch(GLOB_IP_DEV+'/EtherAddOffer/'+this.state.user_token+'/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.state.user_id,
            ticker: this.state.ticker,
            offerType: this.state.offerType,
            quant: this.state.quant,
            price: this.state.price,
            totalPrice: this.state.totalPrice,
            paymethod: this.state.createOfferPayMethod
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
  }
  selectedOfferTypeMethod = (idx, value) => {
    this.setState({'offerType':value});
  }
  selectedOfferPayMethod = (idx, value) => {
    this.setState({'offerPayMethod':value});
  }
  selectedCreateOfferPayMethod = (idx, value) => {
    this.setState({'offerPayMethod':value});
  }
  isNumeric = (n) => {
    //alert(!isNaN(parseFloat(n)) && isFinite(n));
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  logout = () => {
    try{
      AsyncStorage.removeItem('kyc_status')
        .then((res)=>{AsyncStorage.removeItem('user_session')
          .then((res1) => this.props.navigation.navigate('Login'));})
      //AsyncStorage.removeItem('user_session').then((res) => this.props.navigation.navigate('Login'));
    }
    catch(error){alert(error);};
    //navigate('Login');
    //alert("logging out");
    //this.props.navigation.navigate('Login');
  }
  goToProfilePage = () =>{
    this.props.navigation.navigate('Memberarea');
  }
  goToKYCPage = () =>{
    this.props.navigation.navigate('KYCarea');
  }
  goToBankPage = () =>{
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

}


const styles = StyleSheet.create({
  Container:{
    flex:1,
    padding:20,

  },
  screen: {
    backgroundColor: '#33cc33',
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    //padding: 10
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
