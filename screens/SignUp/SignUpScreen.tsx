import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, TouchableOpacity, Text, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "@react-native-firebase/firestore";
import { ValidateAccount } from "../../validate/ValidateAccount";

const SignUpScreen = ()=>{

    const navigation = useNavigation();
    const VlAccount = ValidateAccount();

    const fb = firebase().collection('Accounts');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [hidenPass,setCheck] = useState(true);
    const setPassVisibility = ()=>{
        hidenPass ? setCheck(false) : setCheck(true);
    }

    const [selectDate,setSelectDate] = useState('DD/MM/YYYY');
    const [lastName, setLastName] = useState('');
    const [firstName, setfirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [checkLastName, setCheckLastName] = useState(false);
    const [checkFirstName, setCheckFirstName] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkEmailType, setCheckEmailType] = useState(false);
    const [checkEmailUnique, setCheckEmailUnique] = useState(false);
    const [checkPass, setCheckPass] = useState(false);
    // const [checkDate, setCheckDate] = useState(false);
    
    // const handleConfirm = (date:any) => {
    //     const dt = new Date(date);
    //     const x = dt.toISOString().split('T');
    //     const  x1 = x[0].split('-');
    //     setSelectDate(x1[2] + '/' + x1[1] + '/' + x1[0]);
    //     setDatePickerVisibility(false);
    // };

    const singUp = ()=>{
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        const checkEmailUniquefn = ()=>{
            fb.where("email", '==', email.trim()).get()
            .then((querySnapshot) => {
                let check:any = null;
                querySnapshot.forEach((doc) => {
                    check = doc.id;
                });
                check !== null ? setCheckEmailUnique(true) : setCheckEmailUnique(false) 
            });
        }
        

        lastName == '' ? setCheckLastName(true) : setCheckLastName(false);
        firstName == '' ? setCheckFirstName(true) : setCheckFirstName(false);
        if(email == '' ){
            setCheckEmail(true);
        }
        else{
            setCheckEmail(false);
            if(regEmail.test(email) === false){
                setCheckEmailType(true);
            }
            else{
                setCheckEmailType(false);
                checkEmailUniquefn();
            }
        }
        password == '' ? setCheckPass(true) : setCheckPass(false);
        // if(selectDate == 'DD/MM/YYYY'){
        //     setCheckDate(true);
        // }
  
        if(checkEmail === false && checkPass === false && checkEmailType === false && checkEmailUnique === false && checkFirstName === false && checkLastName === false){
            const e = email.split('@');
            const userName = e[0];

            fb.add(
                {
                    'lastName' : lastName,
                    'firstName' : firstName,
                    'email' : email,
                    'password' : password,
                    'userName' : userName,
                    'image' : ''
                }
            )

            navigation.navigate('Login',{info:'Đăng ký tài khoản thành công hãy đăng nhập để khám phá những dịch vụ của chúng tôi'});
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#e30020'} barStyle={'light-content'}></StatusBar>
            <View style={styles.form}>
                <View style={styles.group}>
                    <View style={styles.title}>
                        <Text style={{fontWeight:'bold',fontSize:30,color:'#ffffff',alignSelf:'flex-end'}}>Đăng ký</Text>
                        <Image source={require('../../assets/image/singUp.png')} style={{width:130,height:130}}/>
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'45%'}}>
                            <TextInput placeholderTextColor={'#ffffff'} placeholder="Họ" style={styles.ip} onChangeText={newText => setLastName(newText)} defaultValue={lastName}></TextInput>
                            {checkLastName ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập họ</Text></View>: '' }
                        </View>
                        <View style={{width:'45%',marginLeft:'10%'}}>
                            <TextInput placeholderTextColor={'#ffffff'} placeholder="Tên" style={styles.ip} onChangeText={newText => setfirstName(newText)} defaultValue={firstName}></TextInput>
                            {checkFirstName ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập tên</Text></View>: '' }
                        </View>
                    </View>
                    <TextInput placeholderTextColor={'#ffffff'} placeholder="Email" style={styles.ip} onChangeText={newText => setEmail(newText)} defaultValue={email}></TextInput>
                    {checkEmail ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập email</Text></View>: '' }
                    {checkEmailType ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Sai định dạng email</Text></View>: '' }
                    {checkEmailUnique ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Email đã được đăng ký</Text></View>: '' }
                    <View style={styles.frmPass}>
                        <TouchableOpacity><TextInput placeholderTextColor={'#ffffff'} placeholder="Mật khẩu" style={styles.ipPass} secureTextEntry={hidenPass} onChangeText={newText => setPassword(newText)} defaultValue={password}></TextInput></TouchableOpacity>
                        <TouchableOpacity style={{alignSelf:'center'}} onPress={setPassVisibility}><Icon style={styles.icon} name={hidenPass? 'eye': 'eye-slash'}/></TouchableOpacity>
                    </View>
                    {checkPass ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng nhập mật khẩu</Text></View>: '' }
                    {/* <View style={{marginTop: 30}}>
                        <Text style={{color:'#ffffff',fontSize:15,textAlign:'center'}}>Thông tin này sẽ không hiển thị công khai</Text>
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}><Text style={{color:'#ffffff',fontSize:30,textAlign:'center',marginTop:20}}>{selectDate}</Text></TouchableOpacity>
                        {checkDate ? <View style={[styles.boxErr,{alignSelf:'center'}]}><Icon style={styles.iconErr} name='info-circle'/><Text style={styles.textErr}>Vui lòng chọn ngày sinh</Text></View>: '' }
                        <Text style={{color:'#ffffff',fontSize:15,textAlign:'center',marginTop:30}}>Hãy sử dụng chính tuổi của bạn</Text>
                    </View> */}
                    <TouchableOpacity onPress={()=>singUp()}>
                        <View style={styles.button}>
                            <Text style={{color:'#e40020',fontWeight:'bold',fontSize:15}}>Đăng ký</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.back}><TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={{paddingVertical:6,paddingHorizontal:10,backgroundColor:'#ffffff',color:'#e30020',borderRadius:50,fontSize:20}} name='chevron-left'/></TouchableOpacity></View>
            </View>

            {/* <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={()=>setDatePickerVisibility(false)}
            /> */}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        backgroundColor:'#e30020',
        flex: 1    
    },
    form:{
        alignItems:'center',
    },
    group:{
        width: '80%',
    },
    title:{
        flexDirection:'row',
        justifyContent:'space-between',
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
    },
    back:{
        position:'absolute',
        top: '5%',
        left: '10%'
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
    dateTimePicker: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: '#C5C5C5',
        borderWidth: 1,
        marginVertical: 10,
        height: 43,
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

export default SignUpScreen;