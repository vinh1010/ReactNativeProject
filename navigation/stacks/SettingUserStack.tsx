import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from '../../screens/User/Setting/SettingScreen';
import ProfileScreen from '../../screens/User/Setting/ProfileScreen';
import InformationScreen from '../../screens/User/Setting/InformationScreen';
import AddPost from '../../screens/AddPost/AddPost';
import AddTopic from '../../screens/AddPost/AddTopic';
import EditPost from '../../screens/AddPost/EditPost';

const Stack = createNativeStackNavigator();

export const SettingUserStack = ()=>{
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='Setting' component={SettingScreen} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name='Information' component={InformationScreen} options={{headerShown:false}}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default SettingUserStack;
