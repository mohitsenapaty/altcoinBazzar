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

export default class Registerarea extends React.Component{
  
  render() {

    return (
      <ScrollView style={styles.Container}>
        <ImageBackground source={require('../img/background_cc.jpg')} style={styles.BackgroundImage}>
          <View style={styles.Content}>
            <Text style={styles.Logo}> -ALTCOINBAZZAR-
            </Text>
            <View style={styles.InputContainer}>
              <TextInput style={styles.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
              <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
              <TextInput secureTextEntry={true} onChangeText={(confPassword)=>this.setState({confPassword})} value={this.state.confPassword} style={styles.Input} placeholder='Confirm Password'></TextInput>
              <TextInput style={styles.Input} onChangeText={(name)=>this.setState({name})} value={this.state.name}  placeholder='Name'></TextInput>
              <TextInput style={styles.Input} onChangeText={(surname)=>this.setState({surname})} value={this.state.surname}  placeholder='Surname'></TextInput>
              <TextInput style={styles.Input} onChangeText={(email)=>this.setState({email})} value={this.state.email}  placeholder='Email'></TextInput>
              <TextInput style={styles.Input} onChangeText={(phone)=>this.setState({phone})} value={this.state.phone}  placeholder='Phone'></TextInput>
              <TouchableOpacity onPress={this.registerUser} style={styles.ButtonContainer}>
                <Text>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }

  constructor(props){
    super(props);
    this.state = {username:'', password:'', confPassword:'', email:'', phone:'', name:'', surname:''};
  }

  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
    var value = await AsyncStorage.getItem('user_session');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      this.props.navigation.navigate('Memberarea');
    }
  }

  registerUser = () => {
    //alert('login' + this.state.username + this.state.password);
    alert("registerUser");

    if (this.state.password === this.state.confPassword){

      try{ 
        fetch('http://52.27.104.46/registerUser/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            confPassword: this.state.confPassword,
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            phone: this.state.phone
          }),
        })
        .then((response) => response.json())
        .then((res) => {
          //console.log(res);
          //alert(res.success);
          //alert("a");
          if (res.success === 1){
            //alert("Login Success");
            alert("User Registered. You will be redirected to the login page.")
            this.props.navigation.navigate('Login');
          }
          else{alert("Invalid details");}
        })
        .done();
      }
      catch(error){
        alert(error);
      }

    }
    else{
      alert("Passwords dont match");
    }
    
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
