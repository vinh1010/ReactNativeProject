import React from 'react';
import HomeScreen from '../../screens/Home/HomeScreen';
import DetailScreen from '../../screens/Detail/DetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../../screens/User/UserScreen';
import AddPost from '../../screens/AddPost/AddPost';
import AddTopic from '../../screens/AddPost/AddTopic';
import EditPost from '../../screens/AddPost/EditPost';

const Stack = createNativeStackNavigator();

export const UserStack = ()=>{
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='User' component={UserScreen}></Stack.Screen>
            <Stack.Screen name="AddPost" component={AddPost} options={{headerShown:false}}/>
            <Stack.Screen name="AddTopic" component={AddTopic} options={{headerShown:false}}/>
            <Stack.Screen name="EditPost" component={EditPost} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

export default UserStack;
