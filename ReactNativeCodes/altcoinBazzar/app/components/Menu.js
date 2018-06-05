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

export default class Menu extends Component {
  constructor(props){
    super(props);
  }
  goToProfilePage = () =>{
    this.props._goToProfilePage();
  }
  goToBankPage = () =>{
    this.props._goToBankPage();
  }
  goToMarketPage = () =>{
    this.props._goToMarketPage();
  }
  goToWalletPage = () =>{
    this.props._goToWalletPage();
  }
  goToTradePage = () =>{
    this.props._goToTradePage();
  }
  logout = () =>{
    this.props._logout();
  }
  render() {
    return (
      <View style={{ flex:1, backgroundColor: '#33cc33'}}>
        <ScrollView>
          <TouchableOpacity onPress={()=>this.goToProfilePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToBankPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Payment details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToMarketPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToWalletPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToTradePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Trade</Text>
          </TouchableOpacity> 
          <TouchableOpacity onPress={()=>this.logout()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}