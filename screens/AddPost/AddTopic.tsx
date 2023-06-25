import firebase from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, TextInput, PermissionsAndroid } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '@react-native-firebase/storage';
import LoadScreen  from "../AppLoad/LoadScreen";

const AddTopic = ()=>{
    const fb = firebase().collection('Topics');
    const [nameTopic,setNameTopic] = useState('');
    const [imageTopic,setImageTopic] = useState('');
    const [loading,setLoading] = useState(false);

    const navigation = useNavigation();

    const [checkValueName, setCheckValueName] = useState(false);
    const [checkValueImage, setCheckValueImage] = useState(false);
    const [checkValueImageErr, setCheckValueImageErr] = useState(false);
    const [checkNameUnique,setChekNameUnique] = useState(false);

    const [upload,setUpload] = useState('');
    const requestLibraryImgPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result:any = await launchImageLibrary({mediaType:'photo'})
                setImageTopic(result.assets[0].uri);
                setUpload(result.assets[0].fileName);
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
        const task = storageRef.putFile(imageTopic);
        try {
            await task;
            const url = await storageRef.getDownloadURL();
            return url;
        }catch(e){
            return null;
        }
    }

    const checkNameTopicUnique = ()=>{
        fb.where("nameTopic", '==', nameTopic.trim()).get()
        .then((querySnapshot) => {
            let check:any = null;
            querySnapshot.forEach((doc) => {
                check = doc.id;
            });
            check !== null ? setChekNameUnique(true) : setChekNameUnique(false) 
        });
    }

    const submitTopic = async ()=>{
        if(nameTopic == '' && imageTopic == ''){
            setCheckValueImageErr(true);
        }
        else{
            if(nameTopic == ''){
                setCheckValueName(true);
            }
            else{
                setCheckValueName(false);
                checkNameTopicUnique();
            }
            imageTopic == '' ? setCheckValueImage(true) : setCheckValueImage(false);
            setCheckValueImageErr(false);
        }

        if(checkValueImage === false && checkValueImageErr === false && checkValueName === false && checkNameUnique === false){
            setLoading(true);
            const imageUri = await submitUpload();

            fb.add(
                {
                    'nameTopic' : nameTopic,
                    'imageTopic' : imageUri,
                    'postTime': firebase.Timestamp.fromDate(new Date()),
                    'used': 0
                }
            )
            navigation.navigate('User',{info:'Tạo chủ đề thành công.'});
            setLoading(false);
        }
    }

    return(
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.header}>
                    <View style={styles.goBack}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.icon} name="chevron-left"/></TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.textHeader}>Tạo chủ đề</Text>
                    </View>
                </View>

                <View style={styles.frm}>
                    <View style={styles.title}>
                        <View style={styles.image}>
                            {imageTopic == null || imageTopic == ''
                            ? <View style={{alignSelf:'center'}}><Image style={styles.imageStyle} source={require('../../assets/image/chooseImage.png')}/>
                                <TextInput placeholderTextColor="#ffffff" placeholder="Tên chủ đề" style={styles.ipTitle} onChangeText={newText => setNameTopic(newText)} /></View>
                            : <View style={{alignSelf:'center'}}><Image style={styles.imageStyleChoose} source={{uri:imageTopic}}/>
                            <TextInput placeholderTextColor="#ffffff" placeholder="Tên chủ đề" style={styles.ipTitleChoose} onChangeText={newText => setNameTopic(newText)} /></View>
                            }
                        </View>
                        {checkValueImage ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng chọn ảnh chủ đề</Text></View>: '' }
                        {checkValueName ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng nhập tên chủ đề</Text></View>: '' }
                        {checkValueImageErr ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng nhập tên và chọn ảnh chủ đề</Text></View>: '' }
                        {checkNameUnique ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Chủ đề đã tồn tại vui lòng đặt tên chủ đề khác</Text></View>: '' }
                        <TouchableOpacity onPress={()=>requestLibraryImgPermission()}><Text style={styles.chooseImg}>Chọn ảnh</Text></TouchableOpacity>
                    </View>
                </View>
                
                <View style={styles.btn}>
                    <TouchableOpacity onPress={()=> submitTopic()}>
                        <Text style={styles.txtBtn}>Tạo chủ đề</Text>
                    </TouchableOpacity>  
                </View>
            </View>
            {loading ? <LoadScreen/>: null}
        </>
    )
    
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fffff',
    },
    header:{
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e6eb'
    },
    goBack:{
        position:'absolute',
        paddingTop: 15,
        paddingLeft: 15
    },
    icon:{
        fontSize: 30,
        fontWeight:'bold',
        color:'black'
    },
    textHeader:{
        fontSize: 16,
        color:'black',
        fontWeight:'bold',
        textAlign:'center'
    },
    frm:{
        marginTop: '50%',
        marginHorizontal: 15,
    },
    title:{
        alignItems:'center',
    },
    ipTitle:{
        fontSize: 20,
        padding: 0,
        color:'#ffffff',
        position:'absolute',
        top: '40%',
        left:'50%',
        width:150,
        fontWeight:'bold'
    },
    ipTitleChoose:{
        fontSize: 20,
        padding: 0,
        color:'#ffffff',
        position:'absolute',
        top: '40%',
        left:'20%',
        width:150,
        fontWeight:'bold'
    },
    image:{
        marginBottom: 10
    },
    imageStyle:{
        width:500,
        height:150,
        borderRadius: 20,
        opacity: 0.7,
    },
    imageStyleChoose:{
        width:300,
        height:150,
        borderRadius: 20,
        opacity: 0.7,
    },
    chooseImg:{
        textAlign:'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor:'#e30020',
        borderRadius: 50,
        color:'#ffffff',
        fontWeight:'bold',
        marginTop: 10
    },
    btn:{
        position:'absolute',
        bottom: 15,
        right: 15
    },
    txtBtn:{
        padding:15,
        backgroundColor: '#e30020',
        borderRadius: 50,
        color:'#ffffff',
        fontSize: 16,
        fontWeight:'bold'
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

export default AddTopic;