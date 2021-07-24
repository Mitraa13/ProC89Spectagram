import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

let Light_theme_img = require('../assets/logo2.png');
let Dark_theme_img = require('../assets/logo.png');

let customFonts = {
  'Bubblegum-Sans': require('../assets/font/BubblegumSans-Regular.ttf'),
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      story_data: this.props.route.params.story.value,
      light_theme: true,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  render() {
    let story = this.state.story_data;
    if (!this.props.route.params) {
      this.props.navigation.navigate('Home');
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let images = {
        image_1: require('../assets/image_1.jpg'),
        image_2: require('../assets/image_2.jpg'),
        image_3: require('../assets/image_3.jpg'),
        image_4: require('../assets/image_4.jpg'),
        image_5: require('../assets/image_5.jpg'),
        image_6: require('../assets/image_6.jpg'),
        image_7: require('../assets/image_7.jpg'),
      };
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={
                  this.state.light_theme ? Light_theme_img : Dark_theme_img
                }
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                Spectagram
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardLight
                  : styles.storyCard
              }>
              <View style={styles.authorContainer}>
                <View style={styles.authorImageContainer}>
                  <Image
                    source={{
                      uri: this.props.route.params.story.profile_picture,
                    }}
                    style={styles.profileImage}></Image>
                </View>
                <View style={styles.authorNameContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.authorNameTextLight
                        : styles.authorNameText
                    }>
                    {this.props.route.params.story.author}
                  </Text>
                </View>
              </View>

              <View style={styles.postImageContainer}>
                <Image
                  source={images[this.props.route.params.story.preview_images]}
                  style={styles.postImage}
                />
              </View>

              <View style={styles.captionContainer}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.captionTextLight
                      : styles.captionText
                  }>
                  {this.props.route.params.story.caption}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#fff',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(20),
  },
  storyCardLight: {
    margin: RFValue(20),
    backgroundColor: '#fff',
    borderRadius: RFValue(20),
    borderColor:'#000',
    borderWidth:1,
  },
  authorContainer: {
    height: RFValue(10),
    padding: RFValue(10),
    flexDirection: 'row',
    marginBottom: RFValue(30),
  },
  authorImageContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginTop: RFValue(20),
  },
  authorNameContainer: {
    flex: 0.85,
    padding: RFValue(10),
    justifyContent: 'center',
  },
  authorNameText: {
    color: 'white',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
  },
  authorNameTextLight: {
    color: 'black',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
  },
  postImageContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImage: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  captionContainer: {
    padding: RFValue(10),
  },
  captionText: {
    fontSize: RFValue(20),
    color: 'white',
    paddingTop: RFValue(10),
    fontFamily: 'Bubblegum-Sans',
  },
  captionTextLight: {
    fontSize: RFValue(20),
    color: 'black',
    paddingTop: RFValue(10),
    fontFamily: 'Bubblegum-Sans',
  },
});
