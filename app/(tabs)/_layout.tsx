import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen/Home';
import ExploreScreen from '../screens/ExploreScreen/Explore';
import ProfileScreen from '../screens/ProfileScreen/Profile';
import { Text } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:false
    }}>
      <Tab.Screen name="home" component={HomeScreen} 
      options={{
        tabBarLabel:({color})=>(
<Text style={{color:'#5D3FD3',fontSize:12,marginTop:-3,fontWeight:'bold'}}>Home</Text>
        ),tabBarIcon:({color,size})=>(
          <FontAwesome5 name="home" size={24} color='#5D3FD3'  />
        )

        
      }}
      />
      <Tab.Screen name="explore" component={ExploreScreen} 
       options={{
        tabBarLabel:({color})=>(
<Text style={{color:'#5D3FD3',fontSize:12,marginTop:-3,fontWeight:'bold'}}>Explore</Text>
        ),tabBarIcon:({color,size})=>(
         
          <FontAwesome name="search" size={24} color='#5D3FD3' />
        )

        
      }}/>
      <Tab.Screen name="profile" component={ProfileScreen} 
       options={{
        tabBarLabel:({color})=>(
<Text style={{color:'#5D3FD3',fontSize:12,marginTop:-3,fontWeight:'bold'}}>About</Text>
        ),tabBarIcon:({color,size})=>(
          <FontAwesome name="user" size={26} color='#5D3FD3' />
        )

        
      }}/>
    </Tab.Navigator>
  );
}