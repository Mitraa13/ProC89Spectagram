import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

let Light_theme_img = require('../assets/logo2.png');
let Dark_theme_img = require('../assets/logo.png');

export default class CustomisedSideBarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
    };
  }

  componentDidMount() {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
      });
    this.setState({ light_theme: theme === 'light' ? true : false });
  }

  render() {
    let props = this.props;
    return (
      <View
        style={
          this.state.light_theme ? styles.containerLight : styles.container
        }>
        <SafeAreaView style={styles.droidSafeArea} />
        <Image
          source={this.state.light_theme ? Light_theme_img : Dark_theme_img}
          style={styles.iconImage}
        />
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#fff',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  iconImage: {
    width: RFValue(140),
    height: RFValue(140),
    resizeMode: 'contain',
    borderRadius: RFValue(70),
    alignSelf: 'center',
    marginTop: RFValue(60),
  },
});
