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

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
//import Login from './Login';



/*
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
*/

//type Props = {};
export default class Memberarea extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{}
    };
  }
  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
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
  }
  render() {

    return (
      <View style={styles.Container}>
        <Text>Welcome {this.state.user_session.user_name}</Text>
        <Text>Welcome {this.state.user_session.name}</Text>
        <Text>Welcome {this.state.user_session.email}</Text>
        <Text>Welcome {this.state.user_session.phone}</Text>
        <TouchableOpacity onPress={this.logout} style={styles.ButtonContainer}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
      </View>
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
