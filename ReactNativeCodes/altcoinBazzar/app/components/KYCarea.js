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
var ImagePicker = require('react-native-image-picker');

export default class KYCarea extends React.Component{
  
  render() {

    return (
      <ScrollView style={styles.Container}>
        <ImageBackground source={require('../img/background_cc.jpg')} style={styles.BackgroundImage}>
          <View style={styles.Content}>
            <Text style={styles.Logo}> -ALTCOINBAZZAR-
            </Text>
            <View style={styles.InputContainer}>
              
              <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
              <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({panNumber})} value={this.state.panNumber}  placeholder='PAN Number'></TextInput>
              <TextInput style={styles.Input} onChangeText={(adhaarNumber)=>this.setState({adhaarNumber})} value={this.state.adhaarNumber}  placeholder='Adhaar Number'></TextInput>
              <TouchableOpacity onPress={this.selectPANImage} style={styles.ButtonContainer}>
                <Text>PAN Image {this.state.panImageName}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectAdhaarFrontImage} style={styles.ButtonContainer}>
                <Text>Adhaar Front Image {this.state.adhaarImageFrontName}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectAdhaarBackImage} style={styles.ButtonContainer}>
                <Text>Adhaar Back Image {this.state.adhaarImageBackName}</Text>
              </TouchableOpacity>              
              <TouchableOpacity onPress={this.updateKYC} style={styles.ButtonContainer}>
                <Text>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }

  constructor(props){
    super(props);
    this.state = {username:'', password:'', panNumber:'', adhaarNumber:'', panImage:'', adhaarImageFront:'', adhaarImageBack:'',
      panImageName:'', adhaarImageFrontName:'', adhaarImageBackName:''
    };
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
  }
  updateKYC = () =>{
    alert("KYC updated");
  }
  selectPANImage = () => {
    //alert("PAN Image");

    ImagePicker.showImagePicker({quality: 1.0, storageOptions: {skipBackup: true}}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.fileSize > 5242880){
        alert("too big file.");
      }
      else {
        let source = { uri: response.uri };
        let source_img = response.fileName;
        // You can also display the image using data:
        //let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          panImage: source
        });
        this.setState({
          panImageName: source_img
        });
      }
    });
  }
  selectAdhaarFrontImage = () => {
    //alert("Adhaar front Image");

    ImagePicker.showImagePicker({quality: 1.0, storageOptions: {skipBackup: true}}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.fileSize > 5242880){
        alert("too big file.");
      }
      else {
        let source = { uri: response.uri };
        let source_img = response.fileName;
        // You can also display the image using data:
        //let source = { uri: 'data:image/jpeg;base64,' + response.data };
        //alert(response.fileSize);
        this.setState({
          adhaarImageFront: source
        });
        this.setState({
          adhaarImageFrontName: source_img
        });
      }
    });
  }
  selectAdhaarBackImage = () => {
    //alert("Adhaar back Image");

    ImagePicker.showImagePicker({quality: 1.0, storageOptions: {skipBackup: true}}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.fileSize > 5242880){
        alert("too big file.");
      }
      else {
        let source = { uri: response.uri };
        let source_img = response.fileName;
        // You can also display the image using data:
        //let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          adhaarImageBack: source
        });
        this.setState({
          adhaarImageBackName: source_img
        });
      }
    });
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
