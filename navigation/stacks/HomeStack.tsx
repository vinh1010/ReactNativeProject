import React from 'react';
import HomeScreen from '../../screens/Home/HomeScreen';
import DetailScreen from '../../screens/Detail/DetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../../screens/Search/SearchScreen';
import UserWallScreen from '../../screens/User/UserWallScreen';
import DataSearchScreen from '../../screens/Search/DataSearchScreen';

const Stack = createNativeStackNavigator();

export const HomeStack = ()=>{
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
            <Stack.Screen name='Detail' component={DetailScreen}></Stack.Screen>
            <Stack.Screen name='UserWall' component={UserWallScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default HomeStack;
