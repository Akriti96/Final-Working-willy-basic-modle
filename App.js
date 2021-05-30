import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createAppContainer ,createSwitchNavigator} from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Transastion from './screen/transastion'
import Search from './screen/search'
import LoginScreen  from "./screen/login"
export default class Library_App extends React.Component {
  render(){
  return (
      <AppContainer/>
  );
}
}
const TabNavigator = createBottomTabNavigator({
  
  TransastionScreen : {screen:Transastion},
  Search : {screen:Search},
},{
defaultNavigationOptions : ({navigation})=>({
  tabBarIcon : ()=>{
    const routeName = navigation.state.routeName
    console.log(routeName)
    if(routeName === "TransastionScreen"){
      return(
        <Image source={require("./assets/book.png")} style={{width:30,height:30}}></Image>
      ) 
    }
    else if (routeName === "Search"){
      return(
        <Image source={require("./assets/searchingbook.png")} style={{width:30,height:30}}></Image>
      )
    }
  }
}),
tabBarOptions : {
  activeTintColor : "blue",
  inactiveTintColor : "red"
}
}

)

const SwitchNavigator= createSwitchNavigator({
   LoginScreen:{screen:LoginScreen },
   Transction:{screen:TabNavigator},
 
 })
 const AppContainer = createAppContainer(SwitchNavigator);