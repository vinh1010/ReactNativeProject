import React, {useState,useEffect} from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import AccountStack from "./navigation/stacks/AccountStack";
import SettingUserStack from "./navigation/stacks/SettingUserStack";
import SplashScreen from "react-native-splash-screen";
import UserInfor from "./contex/UserInfor";

const Stack = createNativeStackNavigator();

const App = ({router,navigation}:any)=>{

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <NavigationContainer >
        <UserInfor>
          <Stack.Navigator>
            <Stack.Screen name="Account" component={AccountStack} options={{headerShown:false}}/>
            <Stack.Screen name="Home" component={TabNavigator} options={{headerShown:false}}/>
            <Stack.Screen name="SettingUserStack" component={SettingUserStack} options={{headerShown:false}}/>
          </Stack.Navigator>
        </UserInfor>
      </NavigationContainer>
    </>
  )
}

export default App;