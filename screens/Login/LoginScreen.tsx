import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Text, StatusBar, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import firebase from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../contex/UserInfor";

const LoginScreen = ({route}:any)=>{
    const [infro,setInfo] = useState(true);
    if(route.params != undefined && infro ){
        const {info} = route.params;
        if(info !== ''){
            Alert.alert('Thông báo tài khoản',info);
            setInfo(false);
        }
    }

    const navigation = useNavigation();

    const [hidenPass,setCheck] = useState(true);
    const setPassVisibility = ()=>{
        hidenPass ? setCheck(false) : setCheck(true);
    }

    const [checkEmail, setCheckEmail] = useState(false);
    const [checkPass, setCheckPass] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fb = firebase().collection('Accounts');
    
    const {user,setUser,getUser}:any = useUser();

    const loginfrm = () =>{
        if(email == ''){
            setCheckEmail(true);
        }
        if(password == ''){
            setCheckPass(true);
        }
        else{ 
            fb.where('email','==',email).where('password','==',password).get().then(querySnapshot => {
                let check:any = null;
                querySnapshot.forEach((doc) => {
                    check = doc.id
                    try{
                        setUser(check);
                        AsyncStorage.setItem('idUser',JSON.stringify(check));   
                    }catch{

                    }
                });
                if(check != null){
                    navigation.navigate('Home');
                }else{
                    Alert.alert('Thông báo đăng nhập','Sai email hoặc mật khẩu vui lòng đăng nhập lại !');
                }
            });
            setCheckEmail(false);
            setCheckPass(false);
        }
    }
    
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#e30020'} barStyle={'light-content'}></StatusBar>
            <View style={styles.form}>
                <View style={styles.group}>
                    <View style={styles.title}>
                        <Text style={{fontWeight:'bold',fontSize:30,color:'#ffffff',alignSelf:'flex-end'}}>Đăng nhập</Text>
                        <Image source={require('../../assets/image/login.png')} style={{width:150,height:150}}/>
                    </View>
                    
                    <TextInput onChangeText={newText => setEmail(newText)} defaultValue={email} placeholderTextColor={'#ffffff'} placeholder="Email" style={styles.ip}></TextInput>
                    {checkEmail ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập email</Text></View>: '' }
                    <View style={styles.frmPass}>
                        <TextInput onChangeText={newText => setPassword(newText)} defaultValue={password} placeholderTextColor={'#ffffff'} placeholder="Mật khẩu" style={styles.ipPass} secureTextEntry={hidenPass}></TextInput>
                        <TouchableOpacity style={{alignSelf:'center'}} onPress={setPassVisibility}><Icon style={styles.icon} name={hidenPass? 'eye': 'eye-slash'}/></TouchableOpacity>
                    </View>
                    {checkPass ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập mật khẩu</Text></View>: '' }
                    <TouchableOpacity onPress={()=> loginfrm()}>
                        <View style={styles.button}>
                            <Text style={{color:'#e40020',fontWeight:'bold',fontSize:15}}>Đăng nhập</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.back}><TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={{paddingVertical:6,paddingHorizontal:10,backgroundColor:'#ffffff',color:'#e30020',borderRadius:50,fontSize:20}} name='chevron-left'/></TouchableOpacity></View>
            </View>

            <View style={styles.orLogin}>
                <Text style={{fontWeight:'bold',fontSize:15,color:'#838383'}}>HOẶC</Text>
                <View style={styles.group}>
                    <TouchableOpacity style={styles.fb}><Text style={{color:'#ffffff',fontWeight:'bold',fontSize:15}}>Tiếp tục bằng Facebook</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.google}><Text style={{color:'#ffffff',fontWeight:'bold',fontSize:15}}>Tiếp tục bằng Google</Text></TouchableOpacity>
                </View>
                <TouchableOpacity><Text style={{color:'#838383',fontWeight:'bold',fontSize:12,marginTop:20}}>Quên mật khẩu?</Text></TouchableOpacity>
                <View style={{flexDirection:'row'}}><Text style={{color:'#838383',fontWeight:'bold',fontSize:12}}>Bạn chưa có có tài khoản? </Text><TouchableOpacity onPress={()=>{navigation.navigate('SingUp')}}><Text style={{color:'#4285f2',fontWeight:'bold',fontSize:12,textDecorationLine:'underline'}}>Đăng ký ngay</Text></TouchableOpacity></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        backgroundColor:'#ffffff',
        flex: 1    
    },
    form:{
        alignItems:'center',
        backgroundColor: '#e30020',
        borderBottomColor: '#e30020',
        borderBottomWidth: 1,
        borderBottomStartRadius: 50,
        borderBottomEndRadius: 50,
    },
    group:{
        width: '80%',
    },
    title:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10,
    },
    ip:{
        marginTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor:'#e64966',
        color:'#ffffff',
    },
    button:{
        borderWidth:1,
        borderRadius: 100,
        backgroundColor: '#ffffff',
        borderColor: '#e40020',
        alignItems:'center',
        paddingVertical: 15,
        marginVertical:20,
        marginTop:40,
        marginBottom:40
    },
    back:{
        position:'absolute',
        top: '10%',
        left: '10%'
    },
    orLogin:{
        alignItems:'center',
        marginTop:20
    },
    fb:{
        borderWidth:1,
        borderRadius: 100,
        backgroundColor: '#395897',
        borderColor: '#395897',
        alignItems:'center',
        paddingVertical: 15,
        marginTop: 20
    },
    google:{
        borderWidth:1,
        borderRadius: 100,
        backgroundColor:'#4285f2',
        borderColor: '#4285f2',
        alignItems:'center',
        paddingVertical: 15,
        marginTop: 20
    },
    icon:{
        fontSize: 30,
        color:'#ffffff',
    },
    frmPass:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomWidth: 1,
        borderColor:'#e64966',
        marginTop: 20,
        paddingBottom: 20,
    },
    ipPass:{
        color:'#ffffff',
    },
    boxErr:{
        flexDirection:'row',
        marginTop: 10
    },
    iconErr:{
        fontSize: 20,
        color:'#f8d7da',
    },
    textErr:{
        marginLeft: 10,
        color:'#f8d7da'
    }
});

export default LoginScreen;