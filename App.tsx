import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TemplatesScreen from './src/screens/TemplatesScreen'
import ActiveListsScreen from './src/screens/ActiveListsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Templates" 
          component={TemplatesScreen} 
          options={{
            tabBarLabel: 'Templates',
            tabBarIcon: (color: string, size: string) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen 
          name="Active Lists" 
          component={ActiveListsScreen} 
          options={{
          tabBarLabel: 'Active Lists',
            tabBarIcon: (color: string, size: string) => (
              <MaterialCommunityIcons name="format-list-checks" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>

    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Templates" component={TemplatesScreen} />
    //     <Stack.Screen name="ActiveLists" component={ActiveListsScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
