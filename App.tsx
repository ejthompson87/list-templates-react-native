import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TemplatesScreen from './src/screens/TemplatesScreen'
import ActiveListsScreen from './src/screens/ActiveListsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditActiveListScreen from './src/screens/EditActiveListScreen';
import EditTemplateScreen from './src/screens/EditTemplateScreen';

const Tab = createBottomTabNavigator();

const ActiveListStack = createNativeStackNavigator();
const TemplatesStack = createNativeStackNavigator();

function ActiveListsStackNavigator() {
  return (
    <ActiveListStack.Navigator>
      <ActiveListStack.Screen name="Active Lists" component={ActiveListsScreen} />
      <ActiveListStack.Screen name="EditActiveListScreen" component={EditActiveListScreen} />
    </ActiveListStack.Navigator>
  );
}

function TemplatesStackNavigator() {
  return (
    <TemplatesStack.Navigator>
      <TemplatesStack.Screen name="TemplatesScreen" component={TemplatesScreen}  />
      <TemplatesStack.Screen name="EditTemplateScreen" component={EditTemplateScreen} />
    </TemplatesStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="ActiveListsTab" 
          component={ActiveListsStackNavigator} 
          options={{
            headerShown: false,
            tabBarLabel: 'Active Lists',
            tabBarIcon: (color: string, size: string) => (
              <MaterialCommunityIcons name="checkbox-marked-outline" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen 
          name="TemplatesTab" 
          component={TemplatesStackNavigator} 
          options={{
            headerShown: false,
            tabBarLabel: 'Templates',
            tabBarIcon: (color: string, size: string) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
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
