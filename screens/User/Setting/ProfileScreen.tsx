import { useNavigation } from "@react-navigation/native";
import React, {useEffect,useState} from "react";
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, ScrollView, PermissionsAndroid, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from "../../../contex/UserInfor";
import firebase from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from "react-native-image-picker";

const ProfileScreen = () => {

    const fb = firebase().collection('Accounts');
    
    const navigation = useNavigation();
    const {user,setUser,getUser}:any = useUser();
    const [checkChangeValue,setCheckChange] = useState(false);
    const [checkUpdateImg,setCheckUpdateImg] = useState(false);

    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [userName,setUserName] = useState('');
    const [userImage,setUserImage] = useState('');

    useEffect(()=>{
        fb.doc(user).get().then((docRef) => { 
            const data:any = docRef.data()
            setFirstName(data.firstName)
            setLastName(data.lastName)
            setUserName(data.userName)
            setUserImage(data.image)
        }); 
    },[])

    const [upload,setUpload] = useState('');
    const requestLibraryImgPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result:any = await launchImageLibrary({mediaType:'photo'})
                setUserImage(result.assets[0].uri);
                setUpload(result.assets[0].fileName);
                setCheckUpdateImg(true);
            } else {
                console.log("Image Library permission denied");
            }
        } catch (err) {
            return null;
        }
    };  

    const submitUpload = async () => {
        const fileName = upload.substring(upload.lastIndexOf('/') + 1);
        const extension = fileName.split('.').pop();
        const name = upload.split('.').slice(0,-1).join('.');
        const uploadFile:any = name + Date.now() + '.' + extension;
        const storageRef = storage().ref(uploadFile);
        const task = storageRef.putFile(userImage);
        try {
            await task;
            const url = await storageRef.getDownloadURL();
            return url;
        }catch(e){
            return null;
        }
    }
   
    const updateProfile = async ()=>{
        let img:any;
        if(checkUpdateImg){
            const imageUri = await submitUpload();
            img = imageUri;
        }
        else{
            img = userImage;
        }
        fb.doc(user).update(
            {
                'lastName' : lastName,
                'firstName' : firstName,
                'userName' : userName,
                'image' : img
            }
        )
        navigation.navigate('User',{info:'Cập nhật thông tin thành công.'});
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'}></StatusBar>
            
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconHeader}><TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.iconStyle} name="chevron-left"/></TouchableOpacity></View>
                    <View style={{alignSelf:'center',marginLeft:20}}><Text style={styles.txtHeader}>Hồ sơ công khai</Text></View>
                    {checkChangeValue 
                    ?<TouchableOpacity onPress={()=>updateProfile()}><Text style={styles.btnUpdateChange}>Xong</Text></TouchableOpacity>
                    :<Text style={styles.btnUpdate}>Xong</Text>
                    }
                </View>
                <ScrollView>
                    <View style={styles.imageUser}>
                        {userImage == null || userImage == ''
                        ? <Image style={styles.imageStyle} source={require('../../../assets/image/imageUser1.png')} />
                        : <Image style={styles.imageStyle} source={{uri:userImage}} />
                        }
                        <TouchableOpacity onPress={()=>{requestLibraryImgPermission(),setCheckChange(true)}}><Text style={styles.txtImg}>Chỉnh sửa</Text></TouchableOpacity>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.frm}>
                            <Text style={styles.userTxt}>Tên</Text>
                            <TextInput onChangeText={newText => {setFirstName(newText),setCheckChange(true)}} value={firstName} placeholderTextColor={'black'} style={styles.ipUser}></TextInput>
                        </View>
                        <View style={styles.frm}>
                            <Text style={styles.userTxt}>Họ</Text>
                            <TextInput onChangeText={newText => {setLastName(newText),setCheckChange(true)}} value={lastName} placeholderTextColor={'black'} style={styles.ipUser}></TextInput>
                        </View>
                        <View style={styles.frm}>
                            <Text style={styles.userTxt}>Tên người dùng</Text>
                            <TextInput onChangeText={newText => {setUserName(newText),setCheckChange(true)}} value={userName} placeholderTextColor={'black'} style={styles.ipUser}></TextInput>
                        </View>
                    </View>
                </ScrollView>
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#e4e6eb',
        borderRadius: 50
    },
    btnUpdateChange:{
        marginRight: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#e30020',
        borderRadius: 50,
        color:'#ffffff'
    },
    imageUser:{
        alignItems:'center',
        marginTop: 20
    },
    imageStyle:{
        padding: 20,
        borderColor: '#e4e6eb',
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor:'#e4e6eb',
        width: 150,
        height: 150,
    },
    txtImg:{
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e4e6eb',
        borderRadius: 50
    },
    frm:{
        marginTop: 20
    },
    userInfo:{
        marginHorizontal: 20
    },
    userTxt:{
        fontSize: 16
    },
    ipUser:{
        fontSize: 20
    }
})

export default ProfileScreen;