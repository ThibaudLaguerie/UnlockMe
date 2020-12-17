import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

// Navigation 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './src/screens/AuthScreen';
import PasswordScreen from './src/screens/PasswordScreen';
import { AuthContextProvider } from './src/contexts/AuthContext';

// Screens
const AppStack = createStackNavigator()
function MyAppStack() {
  return (
    <AppStack.Navigator headerMode="none" initialRouteName="Auth">
      <AppStack.Screen name="Auth" component={AuthScreen} />
      <AppStack.Screen name="PasswordList" component={PasswordScreen} />
    </AppStack.Navigator>
  )
}

const App = () => {
  return (
    <AuthContextProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <NavigationContainer>
          <MyAppStack />
        </NavigationContainer>
      </SafeAreaView>
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({

});

export default App;
