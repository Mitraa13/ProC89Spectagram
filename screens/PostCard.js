import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase';

let customFonts = {
  'Bubblegum-Sans': require('../assets/font/BubblegumSans-Regular.ttf'),
};

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      profile_image: '',
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('/posts/')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({
        likes: (this.state.likes -= 1),
        is_liked: false,
      });
    } else {
      firebase
        .database()
        .ref('/posts/')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({
        likes: (this.state.likes += 1),
        is_liked: true,
      });
    }
  };

  fetchUser = () => {
    let theme, image;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        image = snapshot.val().profile_picture;
        this.setState({ light_theme: theme === 'light', profile_image: image });
      });
  };

  render() {
    let story = this.state.story_data;
    if (!this.state.fontsLoaded) {
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
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate('PostScreen', {
              story: story,
            })
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }>
            <View style={styles.titleContainer}>
              <View style={styles.titleTextContainer}>
                <View style={styles.authorContainer}>
                  <View style={styles.authorImageContainer}>
                    <Image
                      source={{ uri: story.profile_picture }}
                      style={styles.profileImage}></Image>
                  </View>
                  <View style={styles.authorNameContainer}>
                    <Text
                      style={
                        this.state.light_theme
                          ? styles.storyTitleTextLight
                          : styles.storyTitleText
                      }>
                      {story.author}
                    </Text>
                  </View>
                </View>

                <Image
                  source={images[story.preview_images]}
                  style={styles.storyImage}></Image>

                <View style={styles.descriptionContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.descriptionTextLight
                        : styles.descriptionText
                    }>
                    {story.caption}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }
                onPress={() => this.likeAction()}>
                <Ionicons
                  name={'heart'}
                  size={RFValue(30)}
                  color={this.state.light_theme ? 'black' : 'white'}
                />

                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }>
                  {this.state.likes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(20),
  },
  cardContainerLight: {
    margin: RFValue(13),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: RFValue(0.5),
    shadowRadius: RFValue(5),
    elevation: RFValue(2),
  },
  storyImage: {
    resizeMode: 'contain',
    width: '95%',
    alignSelf: 'center',
    height: RFValue(250),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: 'center',
  },
  titleTextContainer: {
    flex: 0.8,
  },
  authorContainer: {
    flex: 0.1,
    flexDirection: 'row',
    paddingTop: RFValue(5),
  },
  authorImageContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: RFValue(100),
  },
  authorNameContainer: {
    flex: 0.85,
    justifyContent: 'center',
  },
  storyTitleText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'white',
    paddingTop: RFValue(10),
    paddingLeft: RFValue(5),
  },
  storyTitleTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
    paddingTop: RFValue(10),
    paddingLeft: RFValue(5),
  },
  descriptionContainer: {
    marginTop: RFValue(-5),
  },
  descriptionText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(17),
    color: 'white',
  },
  descriptionTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(17),
    color: 'black',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#eb3948',
    borderWidth: 2,
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6,
  },
  likeTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6,
  },
});
