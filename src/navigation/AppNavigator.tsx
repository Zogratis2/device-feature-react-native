import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import HomeScreen from '../screens/Home/HomeScreen';
import AddEntryScreen from '../screens/AddEntry/AddEntryScreen';

type RootTabParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<RootTabParamList> }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') {
            iconName = focused ? 'book' : 'book-outline';
          } else {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddEntry" component={AddEntryScreen} />
    </Tab.Navigator>
  );
}