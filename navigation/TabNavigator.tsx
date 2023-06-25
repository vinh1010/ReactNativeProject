import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import SearchScreen from "../screens/Search/SearchScreen";
import MessageIndexScreen from "../screens/Message/MessageIndexScreen";
import UserScreen from "../screens/User/UserScreen";
import HomeStack from "./stacks/HomeStack";
import UserStack from "./stacks/UserStack";
import SearchStack from "./stacks/SearchStack";


const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            let iconName:any;
    
            if (route.name === 'HomeStack') {
                iconName = focused ? 'home' : 'home';
            } else if (route.name === 'SearchStack') {
                iconName = focused ? 'search' : 'search';
            // } else if (route.name === 'Message') {
            //     iconName = focused ? 'comment-dots' : 'comment-dots';
            } else if (route.name === 'UserStack') {
                iconName = focused ? 'user-alt' : 'user-alt';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#e8e8e8',
            tabBarStyle:{paddingHorizontal:'10%'},
            headerShown:false,
            tabBarLabelStyle: {display: "none"},
            
            })}>
            <Tab.Screen name="HomeStack" component={HomeStack} />
            <Tab.Screen name="SearchStack" component={SearchStack} />
            {/* <Tab.Screen name="Message" component={MessageIndexScreen} /> */}
            <Tab.Screen name="UserStack" component={UserStack} />
        </Tab.Navigator>
    )
}

export default TabNavigator;