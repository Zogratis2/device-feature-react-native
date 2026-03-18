import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import HomeScreen from '../screens/Home/HomeScreen';
import AddEntryScreen from '../screens/AddEntry/AddEntryScreen';
import { ThemeContext } from '../context/ThemeContext';

type RootTabParamList = {
  Home: undefined;
  AddEntry: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  const { darkMode } = useContext(ThemeContext);

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
        tabBarInactiveTintColor: darkMode ? '#666' : '#aaa',
        tabBarStyle: {
          backgroundColor: darkMode ? '#16213E' : '#fff',
          borderTopWidth: 0,
          elevation: 10,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          color: darkMode ? '#aaa' : '#555',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddEntry" component={AddEntryScreen} />
    </Tab.Navigator>
  );
}