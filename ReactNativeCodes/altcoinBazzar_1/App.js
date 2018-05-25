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

} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import Login from './app/components/Login';

/*
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
*/

//type Props = {};
export default class App extends Component {
  render() {
    return (
      <Navigator initialRoute={{id: 'Login'}} renderScene={this.navigatorRenderScene} />
    );  
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id){
      case 'Login':
        return (
          <Login navigator={navigator}/>
        );
    }
  }
}

const styles = StyleSheet.create({

});
