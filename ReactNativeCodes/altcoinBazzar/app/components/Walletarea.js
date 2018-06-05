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

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import Menu from './Menu';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'


/*
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
*/

//type Props = {};
export default class Walletarea extends React.Component{
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
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'kycDone':'No',
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
            this.state.kycDone = "No";
          }
          else{
            //kyc status done
            //alert("KYC Done");
            this.state.kycDone = "Yes";
          }

        }
        else{alert("Error fetching details.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
  }
  classRender(){
    if (this.state.kycDone=="Yes"){
      return(
        <View>
          <Text>You can Withdraw or Deposit.</Text>
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
  logout = () => {
    try{
      AsyncStorage.removeItem('user_session').then((res) => this.props.navigation.navigate('Login'));
    }
    catch(error){alert(error);};
    //navigate('Login');
    alert("logging out");
    //this.props.navigation.navigate('Login');
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
