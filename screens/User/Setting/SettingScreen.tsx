import { useNavigation } from "@react-navigation/native";
import { Text } from "@rneui/base";
import React, { useState } from "react";
import { View, StatusBar, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from "../../../contex/UserInfor";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingScreen = ({route}:any) =>{
    const [infro,setInfo] = useState(true);
    const navigation = useNavigation();
    const {user,setUser,getUser}:any = useUser();
    
    if(route.params != undefined && infro ){
        const {info} = route.params;
        if(info !== ''){
            Alert.alert('Thông báo tài khoản',info);
            setInfo(false);
        }
    }

    const logOut = ()=>{
        setUser('');
        AsyncStorage.removeItem('idUser');
        navigation.navigate('Welcome');
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'}></StatusBar>
            
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconHeader}><TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.iconStyle} name="chevron-left"/></TouchableOpacity></View>
                    <View><Text style={styles.txtHeader}>Cài đặt</Text></View>
                </View>

                <View style={styles.tools}>
                    <Text style={styles.txtContent}>Thông tin tài khoản</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
                        <View style={styles.contentTools}>
                            <Text style={styles.txtTool}>Hồ sơ công khai</Text>
                            <Icon style={styles.iconStyle} name="chevron-right"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate('Information')}>
                        <View style={styles.contentTools}>
                            <Text style={styles.txtTool}>Quản lý tài khoản</Text>
                            <Icon style={styles.iconStyle} name="chevron-right"/>
                        </View>
                    </TouchableOpacity>

                    <View style={{marginTop: 20}}>
                        <Text style={styles.txtContent}>Hành động</Text>
                        <TouchableOpacity onPress={()=>logOut()}>
                            <View style={styles.contentTools}>
                                <Text style={styles.txtTool}>Đăng xuất</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'grey',
    },
    content:{
        marginTop: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
    },
    header:{
        alignItems:'center',
        marginTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#e4e6eb'
    },
    iconHeader:{
        width:'100%',
        position:'absolute',
        top:'0%',
        marginRight: '0%',
        paddingLeft: 10
    },
    iconStyle:{
        fontSize: 30,
        color:'black',
    },
    txtHeader:{
        fontSize: 16,
        color:'black',
    },
    tools:{
        paddingHorizontal: 10
    },
    txtContent:{
        marginTop: 20,
        fontSize: 16,
        color:'black',
    },
    contentTools:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 20
    },
    txtTool:{
        fontSize: 20,
        color:'black',
    }
})

export default SettingScreen;

