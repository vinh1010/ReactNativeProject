import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import firebase from "@react-native-firebase/firestore";
import { useUser } from "../../../contex/UserInfor";

const InformationScreen = () => {
    const fb = firebase().collection('Accounts');

    const navigation = useNavigation();
    
    const {user,setUser,getUser}:any = useUser();

    const [checkChangeValue,setCheckChange] = useState(false);

    const [isVisibleChangePass, setIsVisibleChangePass] = useState(false);
    const [hidenPass,setCheck] = useState(true);
    const setPassVisibility = ()=>{
        hidenPass ? setCheck(false) : setCheck(true);
    }

    const [hidenPassConfirm,setCheckPassConfirm] = useState(true);
    const setPassConfirm = ()=>{
        hidenPassConfirm ? setCheckPassConfirm(false) : setCheckPassConfirm(true);
    }

    const [hidenPassNew,setCheckPassNew] = useState(true);
    const setPassNew = ()=>{
        hidenPassNew ? setCheckPassNew(false) : setCheckPassNew(true);
    }

    const [password,setPass] = useState('');
    const [newValuePass,setNewValuePass] = useState('');
    const [newValueCfPass,setNewValueCfPass] = useState('');
    const [email,setEmail] = useState('');
    useEffect(()=>{
        fb.doc(user).get().then((docRef) => { 
            const data:any = docRef.data()
            setPass(data.password)
            setEmail(data.email)
        }); 
    },[])

    const [checkValueNewPass, setCheckValueNewPass] = useState(false);
    const [checkValueCfPass, setCheckValueCfPass] = useState(false);
    const [checkPassOldAndNew, setCheckPassOldAndNew] = useState(false);
    const [checkCfPassError, setCheckCfPassError] = useState(false);
    const updatePass = ()=>{
        if(newValuePass == ''){
            setCheckValueNewPass(true);
        }
        else{
            setCheckValueNewPass(false);
            newValuePass === password ? setCheckPassOldAndNew(true) : setCheckPassOldAndNew(false);
        }
        if(newValueCfPass == ''){
            setCheckValueCfPass(true);
        }
        else{
            setCheckValueCfPass(false);
            newValueCfPass !== newValuePass ? setCheckCfPassError(true) : setCheckCfPassError(false);
        }

        if(checkValueNewPass === false && checkValueCfPass === false && checkCfPassError === false && checkPassOldAndNew === false){
            fb.doc(user).update(
                {
                    'password' : newValuePass,
                }
            )
            navigation.navigate('Setting',{info:'Cập nhật mật khẩu thành công'});
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'}></StatusBar>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconHeader}><TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.iconStyle} name="chevron-left"/></TouchableOpacity></View>
                    <View style={{alignSelf:'center'}}><Text style={styles.txtHeader}>Quản lý tài khoản</Text></View>
                    <TouchableOpacity><Text style={styles.btnUpdate}></Text></TouchableOpacity>
                </View>
                
                <ScrollView>
                    <View style={styles.text}>
                        <Text style={styles.ntxt}>Thực hiện thay đổi với email, mật khẩu và loại tài khoản của bạn. Thông tin này là riêng tư và sẽ không hiển thị trong hồ sơ công khai của bạn.</Text>
                    </View>

                    <View style={styles.from}>
                        <View style={styles.item}>
                            <View style={{alignSelf:'center'}}><Text style={styles.txtTitle}>Email</Text></View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.txtFrm,{marginRight: 10}]}>{email}</Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity onPress={() => setIsVisibleChangePass(true)}>
                            <View style={styles.item}>
                                <View style={{alignSelf:'center'}}><Text style={styles.txtTitle}>Mật khẩu</Text></View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.txtFrm}>Thay đổi mật khẩu</Text>
                                    <Icon style={styles.iconStyle} name="chevron-right"/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <BottomSheet modalProps={{}} isVisible={isVisibleChangePass}>
                <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                    <ListItem.Content>
                        <View style={[styles.headerBs,{width:'100%'}]}>
                            <View><TouchableOpacity onPress={()=>setIsVisibleChangePass(false)}><Icon style={styles.iconStyle} name="chevron-left"/></TouchableOpacity></View>
                            <View style={{alignSelf:'center'}}><Text style={styles.txtHeader}>Mật khẩu</Text></View>
                            <View style={{alignSelf:'center'}}>
                                {checkChangeValue 
                                ? <TouchableOpacity onPress={()=>updatePass()}><Text style={styles.btnUpdateChange}>Xong</Text></TouchableOpacity>
                                : <Text style={styles.btnUpdateBs}>Xong</Text>
                                }
                            </View>
                        </View>

                        <View style={styles.bottomSheet}>
                            <View>
                                <View style={styles.itemBs}>
                                    <View><Text style={styles.txtFrmBs}>Mật khẩu</Text></View>
                                    <View style={styles.ipFrmBs}>
                                        <TouchableOpacity><TextInput style={styles.styleTxtIp} value={password} secureTextEntry={hidenPass}></TextInput></TouchableOpacity>
                                        <TouchableOpacity style={{alignSelf:'center'}} onPress={setPassVisibility}><Icon style={styles.icon} name={hidenPass? 'eye': 'eye-off'}/></TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.itemBs}>
                                    <View><Text style={styles.txtFrmBs}>Mật khẩu mới</Text></View>
                                    <View style={styles.ipFrmBs}>
                                        <TouchableOpacity><TextInput style={styles.styleTxtIp} placeholder="Thêm" secureTextEntry={hidenPassNew} onChangeText={newText => {setNewValuePass(newText),setCheckChange(true)}}></TextInput></TouchableOpacity>
                                        <TouchableOpacity style={{alignSelf:'center'}} onPress={setPassNew}><Icon style={styles.icon} name={hidenPassNew? 'eye': 'eye-off'}/></TouchableOpacity>
                                    </View>
                                    {checkValueNewPass ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng nhập mật khẩu mới</Text></View>: '' }
                                    {checkPassOldAndNew ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Hãy sử dụng mật khẩu khác với mật khẩu cũ</Text></View>: '' }
                                </View>

                                <View style={styles.itemBs}>
                                    <View><Text style={styles.txtFrmBs}>Xác nhận mật khẩu mới</Text></View>
                                    <View style={styles.ipFrmBs}>
                                        <TouchableOpacity><TextInput style={styles.styleTxtIp} placeholder="Thêm" secureTextEntry={hidenPassConfirm} onChangeText={newText => {setNewValueCfPass(newText),setCheckChange(true)}}></TextInput></TouchableOpacity>
                                        <TouchableOpacity style={{alignSelf:'center'}} onPress={setPassConfirm}><Icon style={styles.icon} name={hidenPassConfirm? 'eye': 'eye-off'}/></TouchableOpacity>
                                    </View>
                                    {checkValueCfPass ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng xác nhận lại mật khẩu</Text></View>: '' }
                                    {checkCfPassError ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Mật khẩu của bạn không khớp</Text></View>: '' }
                                </View>
                            </View>
                        </View>
                    </ListItem.Content>
                </ListItem>
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'gray',
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
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#e4e6eb'
    },
    iconHeader:{
        marginLeft: 10
    },
    iconStyle:{
        fontSize: 30,
        color:'black',
    },
    txtHeader:{
        fontSize: 16,
        color:'black',
    },
    btnUpdate:{
        marginRight: 20,
    },
    text:{
        paddingHorizontal: 10
    },
    ntxt:{
        fontSize: 16,
        marginTop: 10
    },
    from:{
        paddingHorizontal: 10,
    },
    item:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 10
    },
    txtTitle:{
        fontSize: 20,
        color:'black',
    },
    txtFrm:{
        alignSelf:'center'
    },

    // Style bottomSheet phần cài đặt mật khẩu
    headerBs:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#e4e6eb',
    },
    btnUpdateBs:{
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#e4e6eb',
        borderRadius: 50
    },
    btnUpdateChange:{
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#e30020',
        borderRadius: 50,
        color:'#ffffff'
    },
    bottomSheet:{
        width:'100%',
        paddingTop: 20,
        paddingBottom: '95%'
    },
    iconHeaderB:{
        fontSize: 30
    },
    itemBs:{
        marginTop: 10
    },
    txtFrmBs:{
        fontSize: 16,
        color: 'black'
    },
    styleTxtIp:{
        fontSize: 20
    },
    ipFrmBs:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    icon:{
        fontSize: 30
    },

    boxErr:{
        flexDirection:'row',
        marginTop: 10
    },
    iconErr:{
        fontSize: 20,
        color:'red',
    },
    textErr:{
        marginLeft: 10,
        color:'red'
    }
})

export default InformationScreen;