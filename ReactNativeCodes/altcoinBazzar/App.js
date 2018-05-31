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
  ActivityIndicator,
} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import Login from './app/components/Login';
import Memberarea from './app/components/Memberarea';
import Registerarea from './app/components/Registerarea';
import KYCarea from './app/components/KYCarea';
import {StackNavigator} from 'react-navigation';

const NavigationApp = StackNavigator(
  {
    Login:{screen: Login},
    Memberarea:{screen: Memberarea},
    Registerarea:{screen: Registerarea},
    KYCarea:{screen:KYCarea},
  },
  
);

/*
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
*/

//type Props = {};

export default class App extends React.Component {
  /*
  constructor() {
    super();
    this.state = { isUserLoggedIn: false, isLoaded: false };
  }
  componentDidMount() {
    AsyncStorage.getItem('user_session').then((token) => {
      this.setState({ isUserLoggedIn: token !== null, isLoaded: true });
      //if (token !== null){
        //this.props.navigator.push({
          //id: 'Memberarea'
        //});
      //}
      
    });
  }
  */
  render() {
    //const { navigate } = this.props.navigation;
    /*
    if (!this.state.isLoaded){
      return(
        <ActivityIndicator />
      );
    }
    else{
      if (!this.state.isUserLoggedIn){
        return (
          <Navigator initialRoute={{id: 'Login'}} renderScene={this.navigatorRenderScene} />
        );  
      }
      else{
        return (
          <Navigator initialRoute={{id: 'Memberarea'}} renderScene={this.navigatorRenderScene} />
        );
      }

    }*/
    return(
      <NavigationApp/>
    );
  }

  /*
  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id){
      case 'Login':
        return (
          <Login navigator={navigator}/>
        );
      case 'Memberarea':
        return (
          <Memberarea navigator={navigator}/>
        );
    }
  }*/
}

const styles = StyleSheet.create({

});

//export default App;
