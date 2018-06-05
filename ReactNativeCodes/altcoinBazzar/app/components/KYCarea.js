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

var ImagePicker = require('react-native-image-picker');

var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'


export default class KYCarea extends React.Component{
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
  classRender(){
    if (this.state.kycDone == 'No'){
      return(
        <View style={styles.InputContainer}>
                
          <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={styles.Input} placeholder='Password'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({panNumber})} value={this.state.panNumber}  placeholder='PAN Number'></TextInput>
          <TextInput style={styles.Input} onChangeText={(adhaarNumber)=>this.setState({adhaarNumber})} value={this.state.adhaarNumber}  placeholder='Adhaar Number'></TextInput>
          <TextInput style={styles.Input} onChangeText={(adhaarDOB)=>this.setState({adhaarDOB})} value={this.state.adhaarDOB}  placeholder='DDMMYYYY (Date of birth as on AadharCard)'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({address})} value={this.state.address}  placeholder='Flat/Building/Lane Details'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({cityName})} value={this.state.cityName}  placeholder='City Name'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({stateName})} value={this.state.stateName}  placeholder='State'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({pincode})} value={this.state.pincode}  placeholder='pincode'></TextInput>
          <TextInput style={styles.Input} onChangeText={(panNumber)=>this.setState({residentialStatus})} value={this.state.residentialStatus}  placeholder='Abroad/Local'></TextInput>
          <TouchableOpacity onPress={this.selectPANImage} style={styles.ButtonContainer}>
            <Text>PAN Image {this.state.panImageName}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.selectAdhaarFrontImage} style={styles.ButtonContainer}>
            <Text>Adhaar Front Image {this.state.adhaarImageFrontName}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.selectPassportImage} style={styles.ButtonContainer}>
            <Text>Passport Photo Image {this.state.passportImageName}</Text>
          </TouchableOpacity>              
          <TouchableOpacity onPress={this.updateKYC} style={styles.ButtonContainer}>
            <Text>Update</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else{
      return(
        <View style={styles.InputContainer}>
                
          <Text>
            KYC has been completed. You can start buying and selling coins.
          </Text>
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
        <ScrollView style={styles.Container}>
          <ImageBackground source={require('../img/background_cc.jpg')} style={styles.BackgroundImage}>
            <View style={styles.Content}>
              <Text style={styles.Logo}> -ALTCOINBAZZAR-
              </Text>
              <Text>Welcome {this.state.username} {this.state.user_id}</Text>
              {this.classRender()}
            </View>
          </ImageBackground>
        </ScrollView>
      </DrawerLayout>
    );
  }

  constructor(props){
    super(props);
    this.state = {username:'', user_id:'', password:'', 
      panNumber:'', adhaarNumber:'', panImage:'', adhaarImageFront:'', passportImage:'',
      panImageName:'', adhaarImageFrontName:'', passportImageName:'', kycDone:'No', 
      adhaarDOB:'', address:'', cityName:'', stateName:'', pincode:'', residentialStatus:''
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
    //search for KYC status using API
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
    }
    
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
            this.state.kycDone = 'No';
          }
          else{
            //kyc status done
            this.state.kycDone = 'Yes';
          }
          //alert(this.state.kycDone);
        }
        else{alert("Error fetching details.");}
      })
      .done();
    }
    catch(error){
      alert(error);
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
  selectPassportImage = () => {
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
          passportImage: source
        });
        this.setState({
          passportImageName: source_img
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
