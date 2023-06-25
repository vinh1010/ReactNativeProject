import { useNavigation } from "@react-navigation/native";
import React, {useEffect} from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from "react-native";
import { useUser } from "../../contex/UserInfor";

const WelcomeScreen = ()=>{

    const navigation = useNavigation();
    const {user,setUser,getUser}:any = useUser();

    useEffect(()=>{
        if(user !== ''){
            navigation.navigate("Home");
        }
    });

    return (
        <View style={styles.container}>
            <View>
                <StatusBar backgroundColor={'#F2F2F2'} barStyle={'dark-content'}></StatusBar>
                
                <View style={styles.welcome}>
                    <Image source={require('../../assets/image/welcome.jpg')} style={{width:'100%',height:'100%'}}/>
                </View>

                <View style={{alignItems:'center'}}>
                    <View style={styles.icon}>
                        <Image source={require('../../assets/image/icon.png')} style={{width:80,height:80}}/>
                    </View>
                </View>
                
                <View style={styles.buttonFun}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Login')}} style={styles.signUp}><Text style={{color:'#ffffff',fontWeight:'bold',fontSize:15}}>Đăng Nhập</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.navigate('SingUp')}} style={styles.logIn}><Text style={{color:'#e40020',fontWeight:'bold',fontSize:15}}>Đăng Ký</Text></TouchableOpacity>
                </View>

                <View style={styles.texts}>
                    <Text style={{fontWeight:'bold',fontSize:11,textAlign:'center',width:'85%'}}>Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với Điều khoản dịch vụ của Printerest và xác nhận rằng bạn đã đọc chính sách quyền riêng tư của chúng tôi.</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        backgroundColor:'#ffffff',
        flex:1
    },
    welcome:{
        overflow:'hidden',
        borderBottomWidth: 1,
        borderColor: '#f4f4f4',
        borderBottomStartRadius: 50,
        borderBottomEndRadius: 50,
        height:'52%'
    },
    icon:{
        marginVertical: 20
    },
    buttonFun:{
        alignItems:'center',
    },
    signUp:{
        width:'80%',
        borderWidth:1,
        borderRadius: 100,
        backgroundColor: '#e40020',
        borderColor: '#e40020',
        alignItems:'center',
        paddingVertical: 20
    },
    logIn:{
        width:'80%',
        borderWidth:1,
        borderRadius: 100,
        backgroundColor: '#ffffff',
        borderColor: '#e40020',
        alignItems:'center',
        paddingVertical: 20,
        marginVertical:20
    },
    texts:{
        alignItems:'center',
    }
});

export default WelcomeScreen;