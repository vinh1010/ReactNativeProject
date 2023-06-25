import React from 'react';
import HomeScreen from '../../screens/Home/HomeScreen';
import DetailScreen from '../../screens/Detail/DetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../../screens/Welcome/WelcomeScreen';
import LoginScreen from '../../screens/Login/LoginScreen';
import SignUpScreen from '../../screens/SignUp/SignUpScreen';

const Stack = createNativeStackNavigator();

export const AccountStack = ()=>{
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='Welcome' component={WelcomeScreen}></Stack.Screen> 
            <Stack.Screen name='Login' component={LoginScreen}></Stack.Screen>
            <Stack.Screen name='SingUp' component={SignUpScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AccountStack;
