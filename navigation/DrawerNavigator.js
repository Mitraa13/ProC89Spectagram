import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import Logout from '../screens/LogOutScreen';
import firebase from 'firebase';
import CustomisedSideBarScreen from '../screens/CustomisedSideBarScreen';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends React.Component {
  constructor(props){
    super(props);
    this.state={
      light_theme:true,
    }
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
    return (
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 5 },
          inactiveTintColor: this.state.light_theme ? 'black' : 'white',
        }}
        drawerContent={(props) => <CustomisedSideBarScreen {...props} />}>
        <Drawer.Screen
          name="Home"
          component={StackNavigator}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{ unmountOnBlur: true }}
        />
      </Drawer.Navigator>
    );
  }
}
