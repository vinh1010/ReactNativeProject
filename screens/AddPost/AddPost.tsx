import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Image, TextInput, Switch, FlatList, PermissionsAndroid } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import firebase from "@react-native-firebase/firestore";
import { launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import LoadScreen  from "../AppLoad/LoadScreen";
import { useUser } from "../../contex/UserInfor";

const AddPost = ()=>{
    const fb = firebase().collection('Posts');
    const fbTopic = firebase().collection('Topics');
    const navigation = useNavigation();
    const {user,setUser,getUser}:any = useUser();
    const [loading,setLoading] = useState(false);

    const [topics, setTopics] = useState([]);
    const [checkChooseTopic,setCheckChooseTopic] = useState(false);
    const [key, setKey] = useState('');
    
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    
    const [isEnabledShow, setIsEnabledShow] = useState(true);
    const toggleSwitchShowPost = () => setIsEnabledShow(previousState => !previousState);

    const [isVisibleChooseTopic, setIsVisibleChooseTopic] = useState(false);
    const findTopic = (key:string)=>{
        setKey(key);
        fbTopic.where("nameTopic", '==', key).get().then((querySnapshot) => {
            if(querySnapshot.size > 0){
                const topic:any = [];
                querySnapshot.forEach((doc) => {
                    topic.push({
                        key: doc.id,
                        nameTopic: doc.data().nameTopic
                    });
                    setTopics(topic);
                });
            }
            else{
                setTopics([])
            }
        });
    }

    const [nameTopicUse,setNameTopicUse] = useState('')
    const [countUseTopic,setCountUseTopic] = useState(0);
    const [idTopic,setIdTopic] = useState('');
    const tagTopicUse = (id:any,name:any)=>{
        setCheckChooseTopic(true);
        if(nameTopicUse !== name || nameTopicUse == '' ){
            setNameTopicUse(name);
            fbTopic.doc(id).get().then((data)=>{
                setCountUseTopic(data.data().used);
                setIdTopic(id);
            })
        }
        else{
            setNameTopicUse('');
        }
    }   

    const [titlePost,setTitlePost] = useState('');
    const [descPost,setDescPost] = useState('');
    const [imagePost,setImagePost] = useState('');

    const [upload,setUpload] = useState('');
    const requestLibraryImgPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result:any = await launchImageLibrary({mediaType:'photo'})
                setImagePost(result.assets[0].uri);
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
        const task = storageRef.putFile(imagePost);
        try {
            await task;
            const url = await storageRef.getDownloadURL();
            return url;
        }catch(e){
            return null;
        }
    }

    const [checkImage,setCheckImage] = useState(false);
    const submitPost = async ()=>{
        if(imagePost == ''){
            setCheckImage(true);
        }
        else{
            setCheckImage(false);
            setLoading(true);
            const imageUri = await submitUpload();

            let topName:any = 'ALL';
            if(nameTopicUse !== ''){
                topName = nameTopicUse;
                let used:number = (countUseTopic + 1);
                fbTopic.doc(idTopic).update({
                    'used':used
                })
            }

            fb.add(
                {
                    'titlePost' : titlePost,
                    'descriptionPost': descPost,
                    'imagePost' : imageUri,
                    'tagTopic' : topName,
                    'statusComent': isEnabled,
                    'statusPost': isEnabledShow,
                    'postTime': firebase.Timestamp.fromDate(new Date()),
                    'userId' : user
                }
            )
            navigation.navigate('User',{info:'Tạo ghim thành công.'});
            setLoading(false);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.header}>
                    <View style={styles.goBack}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.icon} name="chevron-left"/></TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.textHeader}>Ghim ý tưởng</Text>
                    </View>
                </View>

                <View style={styles.frm}>
                    <View style={styles.title}>
                        <View style={{width:'70%'}}>
                            <Text style={styles.txtTitle}>Thêm tiêu đề (tùy chọn)</Text>
                            <TextInput onChangeText={newText => setTitlePost(newText)} placeholder="Viết tiêu đề" style={styles.ipTitle} multiline={true}/>
                        </View>
                        <View style={styles.image}>
                            {imagePost == null || imagePost == ''
                            ? <View style={{alignSelf:'center'}}><Image style={{width:100,height:100,borderRadius:20}} source={require('../../assets/image/chooseImage.png')}/></View>
                
                            : <View style={{alignSelf:'center'}}><Image style={{width:100,height:100,borderRadius:20}} source={{uri:imagePost}}/></View>
                            }
                            <TouchableOpacity onPress={()=>requestLibraryImgPermission()}><Text style={styles.chooseImg}>Chọn ảnh</Text></TouchableOpacity>
                        </View>
                    </View>
                    {checkImage ? <View style={styles.boxErr}><Icon style={styles.iconErr} name='information'/><Text style={styles.textErr}>Vui lòng chọn ảnh</Text></View>: '' }
                    <View style={styles.dess}>
                        <View>
                            <Text style={styles.txtTitle}>Thêm chi tiết</Text>
                            <TextInput onChangeText={newText => setDescPost(newText)} placeholder="Viết mô tả cho Ghim của bạn ở đây" style={styles.ipTitle} multiline={true}/>
                        </View>
                    </View>
                    {/* <View style={styles.dess}>
                        <View>
                            <Text style={styles.txtTitle}>Thêm liên kết</Text>
                            <TextInput placeholder="Thêm liên kết của bạn ở đây" style={styles.ipTitle} multiline={true}/>
                        </View>
                    </View> */}
                </View>

                <TouchableOpacity onPress={()=>setIsVisibleChooseTopic(true)}>
                    <View style={styles.chooseTopic}>
                        <View><Text style={{color:'black',fontSize:16}}>Gắn thẻ chủ đề liên quan</Text></View>
                        <View style={{flexDirection:'row'}}>
                            {nameTopicUse == '' 
                            ? null
                            : <View style={{alignSelf:'center'}}><Text style={{color:'black',fontSize:16}}>1 thẻ</Text></View>}
                            <Icon style={styles.icon} name="chevron-right"/>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.chooseTopic}>
                    <View><Text style={{color:'black',fontSize:16}}>Cho phép nhận xét</Text></View>
                    <View>
                        <Switch
                            trackColor={{false: '#767577', true: '#e30020'}}
                            thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>

                <View style={styles.chooseTopic}>
                    <View style={{alignSelf:'center'}}><Text style={{color:'black',fontSize:16}}>Chế độ hiển thị</Text></View>
                    <View style={{flexDirection:'row'}}>
                        <View><Icon style={styles.iconShow} name="lock"/></View>
                        <View style={{paddingHorizontal:5,alignSelf:'center'}}>
                            <Switch
                                trackColor={{false: '#767577', true: '#e30020'}}
                                thumbColor={isEnabledShow ? '#ffffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchShowPost}
                                value={isEnabledShow}
                            />
                        </View>
                        <View><Icon style={styles.iconShow} name="earth"/></View>
                    </View>
                </View>
                
                <View style={styles.btn}>
                    <TouchableOpacity onPress={()=> submitPost()}>
                        <Text style={styles.txtBtn}>Xuất bản</Text>
                    </TouchableOpacity>  
                </View>

                {/* BottomSheet phần gắn thẻ chủ đề */}               
                <BottomSheet modalProps={{}} isVisible={isVisibleChooseTopic}>
                    <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                        <ListItem.Content>
                            <View style={{marginBottom:'20%',backgroundColor:'#ffffff',width:'100%'}}>
                                <View style={styles.Addheader}>
                                    <View style={styles.PiconCmt}><TouchableOpacity onPress={() => setIsVisibleChooseTopic(false)}><Icon style={styles.Addicon} name="chevron-left"/></TouchableOpacity></View>
                                    <View style={{alignSelf:'center'}}><Text style={styles.txtHeader}>Gắn thẻ chủ đề</Text></View>
                                    {checkChooseTopic 
                                    ? <View><TouchableOpacity onPress={()=> setIsVisibleChooseTopic(false)}><Text style={styles.btnSuccessActive}>Xong</Text></TouchableOpacity></View>
                                    : <View><Text style={styles.btnSuccess}>Xong</Text></View>
                                    }
                                </View>
                                <View style={styles.frmBs}>
                                    <View>
                                        <TextInput value={key} placeholder="Tìm kiếm chủ đề" style={[styles.ipTitle,{fontWeight:'bold'}]} onChangeText={newText => findTopic(newText)}/>
                                    </View>
                                    {topics.length < 1 
                                    ?   <View>
                                            <Text style={styles.txtFrmBs}>Gắn thẻ các chủ đề liên quan để tiếp cận những người quan tâm đến các Ghim như của bạn. Mọi người sẽ không thấy bạn đã gắn thẻ chủ đề nào.</Text>
                                        </View>
                                    :   
                                        <FlatList
                                            data={topics}
                                            scrollEnabled={false}
                                            style={{flexDirection:'row'}}
                                            renderItem={({ item }:any) => (
                                                <TouchableOpacity onPress={()=>tagTopicUse(item.key,item.nameTopic)}>
                                                    <View style={item.nameTopic !== nameTopicUse 
                                                    ? {marginTop: 50,paddingHorizontal:20,paddingVertical:5,backgroundColor: '#e4e6eb',marginRight: 20,borderRadius: 50 }
                                                    : {marginTop: 50,paddingHorizontal:20,paddingVertical:5,backgroundColor: 'black',marginRight: 20,borderRadius: 50 }
                                                    }>
                                                        <Text style={item.nameTopic !== nameTopicUse ?{color:'black'}:{color:'#ffffff'}}>{item.nameTopic}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )} numColumns={4}
                                        />
                                    }
                                </View>
                            </View>
                        </ListItem.Content>
                    </ListItem>   
                </BottomSheet>
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
        marginTop: 10,
        marginHorizontal: 15,
        marginBottom: 30
    },
    title:{
        borderBottomColor:'#e4e6eb',
        borderBottomWidth: 1,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    txtTitle:{
        color: 'black'
    },
    ipTitle:{
        fontSize: 20,
        padding: 0,
        marginTop: 10
    },
    image:{
        marginBottom: 10
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
    dess:{
        borderBottomColor:'#e4e6eb',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 20
    },
    chooseTopic:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal: 15,
        marginBottom: 20
    },
    iconShow:{
        fontSize: 30,
        fontWeight:'bold',
        color:'black'
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

    // BottomSheet phần gắn thẻ chủ đề
    Addheader:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
    },
    PiconCmt:{
        alignSelf:'center'
    },
    Addicon:{
        fontSize: 25,
        color:'black',
    },
    txtHeader:{
        fontSize: 16,
        color:'black',
    },
    btnSuccess:{
        padding: 10,
        backgroundColor: '#e4e6eb',
        fontSize: 16,
        borderRadius: 50
    },
    btnSuccessActive:{
        padding: 10,
        backgroundColor: '#e30020',
        fontSize: 16,
        borderRadius: 50,
        color:'#ffffff'
    },
    frmBs:{
        marginTop:20
    },
    txtFrmBs:{
        marginTop: 20,
        fontSize: 16,
        textAlign:'justify'
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

export default AddPost;