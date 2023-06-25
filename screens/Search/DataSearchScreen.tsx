import React, { useEffect, useState } from "react";
import { StatusBar, Dimensions, TextInput, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/firestore';
import LoadScreen from '../AppLoad/LoadScreen';
import { useUser } from "../../contex/UserInfor";
const DataSearchScreen = ({route}:any)=>{
    const navigation = useNavigation();
    const fbPost = firebase().collection('Posts');
    const fbUser = firebase().collection('Accounts');
    const {user,setUser,getUser}:any = useUser();
    const [loading,setLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const [chooseFind, setChooseFind] = useState(true);
    const [checkOnPress,setCheckOnPress] = useState(false);
    const key:any = route.params;
    const [textChange, setTextChange] = useState(key)

    const [posts,setPosts] = useState([]);
    const [users,setUsers] = useState([]);

    useEffect(()=>{
        setLoading(true);
        if(key == ''){
            fbPost.where('tagTopic','==','ALL').get().then((doc)=>{
                if(doc !== null){
                    const post:any = []
                    doc.forEach((data) =>{
                        post.push({
                            id: data.id,
                            titlePost: data.data().titlePost,
                            imagePost: data.data().imagePost,
                            userId: data.data().userId
                        })
                    })
                    setPosts(post);
                    setLoading(false);
                }
                else{
                    setPosts([]);
                }
            })

            fbUser.get().then((doc)=>{
                if(doc !== null){
                    const userData:any = []
                    doc.forEach((data)=>{
                        if(data.id !== user){
                            userData.push({
                                id: data.id,
                                image: data.data().image,
                                firstName: data.data().firstName,
                                lastName: data.data().lastName,
                                userName:data.data().userName,
                            })
                        }
                    })
                    setUsers(userData);
                }
                else{
                    setUsers([]);
                }
            })
        }
        else{
            fbPost.where('tagTopic','==',key).get().then((doc)=>{
                if(doc !== null){
                    const post:any = []
                    doc.forEach((data) =>{
                        post.push({
                            id: data.id,
                            titlePost: data.data().titlePost,
                            imagePost: data.data().imagePost,
                            userId: data.data().userId
                        })
                    })
                    setPosts(post);
                    setLoading(false);
                }
                else{
                    setPosts([]);
                }
            })

            fbUser.where('userName','==',key).get().then((doc)=>{
                if(doc !== null){
                    const userData:any = []
                    doc.forEach((data)=>{
                        if(data.id !== user){
                            userData.push({
                                id: data.id,
                                image: data.data().image,
                                firstName: data.data().firstName,
                                lastName: data.data().lastName,
                                userName:data.data().userName,
                            })
                        }
                    })
                    setUsers(userData);
                }
                else{
                    setUsers([]);
                }
            })
        }
        
    },[])

    return(
        <View style={styles.container}> 
            <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.header}>
                    <View style={checkOnPress ? {width:'85%'} : {width:'100%'}}>
                        <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <View style={styles.form}>
                            <View style={{alignSelf:'center'}}><Icon style={styles.icon} name="magnify"/></View>
                            <View><TextInput onPressIn={()=>setCheckOnPress(true)} onChangeText={newText => setTextChange(newText)} defaultValue={textChange} placeholder="Tìm kiếm trên Pinterest" style={styles.ip}/></View>
                        </View>
                        </TouchableOpacity>
                    </View>
                    
                    {checkOnPress 
                    ? <View style={{width:'10%',alignSelf:'center'}}><TouchableOpacity onPress={()=>{setCheckOnPress(false),setTextChange(key)}}><Text style={{fontSize:15,color:'black',fontWeight:'bold'}}>Hủy</Text></TouchableOpacity></View>
                    : null
                    }
                </View>
            </TouchableWithoutFeedback>

            {!checkOnPress 
            ? <View>
                <View style={styles.headerFind}>
                    <TouchableOpacity onPress={()=> {setChooseFind(true)}}><Text style={chooseFind ? styles.txtHeaActive : styles.txtHea}>Khám phá</Text></TouchableOpacity>
                    <View style={{marginHorizontal:20}}></View>
                    <TouchableOpacity onPress={()=> {setChooseFind(false)}}><Text style={chooseFind ? styles.txtHea : styles.txtHeaActive}>Hồ sơ</Text></TouchableOpacity>
                </View>

                {chooseFind

                    ?<View>
                        {loading ? <LoadScreen/>: null}
                        <View>
                            {posts.length < 1 
                            ?<View style={{marginTop: 50}}>
                                <Text>Chúng tôi không thể tim thấy Ghim nào cho "{key}".</Text> 
                                <Text>Có lẽ bạn nên thử một trong những chủ đề này?</Text>
                                <View style={{flexDirection:"row",marginTop:10}}>
                                    <Icon style={{fontSize:20,color:'black',fontWeight:'bold'}} name="magnify"/>
                                    <Text> Các tìm kiếm khác được đề cử</Text>
                                </View>
                            </View>
                            :<View style={styles.boxContent}>
                                <FlatList data={posts} renderItem={({item}:any)=>
                                    <TouchableOpacity onPress={()=>{navigation.navigate('Detail',item.key)}}>
                                        <View style={styles.items}>
                                            <View>
                                                <Image style={styles.image} source={{uri:item.imagePost}}/>
                                            </View>
                                            <View style={styles.textContent}>
                                                <Text style={styles.content}>{item.titlePost}</Text>
                                                <TouchableOpacity onPress={() => setIsVisible(true)}><Icon style={styles.icon} name="dots-horizontal"/></TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>   
                                } numColumns={2} columnWrapperStyle={{justifyContent:'space-between'}}
                                />
                            </View>
                            }
                        </View> 
                    </View> 

                    :
                    <View>
                        {users.length < 1 
                        ? <View style={{marginTop: 50,alignItems:'center'}}>
                            <Text>Chúng tôi không thể tim thấy hồ sơ của "{key}".</Text> 
                        </View>
                        : <View>
                            {loading ? <LoadScreen/>: null}
                            <View>
                                <View style={styles.boxContent}>
                                    <FlatList data={users} renderItem={({item}:any)=>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom: 15}}>
                                            <View style={{flexDirection:'row'}}>
                                                <View style={styles.imgStyle}>
                                                    {item.image == null || item.image == ''
                                                    ? <Image style={styles.imageUs} source={require('../../assets/image/imageUser1.png')}/>
                                                    : <Image style={styles.imageUs} source={{uri:item.image}}/> 
                                                    }
                                                </View>
                                                <View style={styles.nameBox}>
                                                    <TouchableOpacity onPress={()=>{navigation.navigate('UserWall',item.id)}}>
                                                        <Text style={{fontWeight:'bold',color:'black',fontSize:16}}>{item.lastName} {item.firstName}</Text>
                                                        <Text>{item.userName}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{justifyContent:'center'}}>
                                                <TouchableOpacity onPress={()=>{navigation.navigate('UserWall',item.id)}}><Text style={styles.btnMess}>Xem Tường</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    }/>
                                </View>
                            </View>
                        </View>
                        }
                    </View> 
                }
            </View>

            : <View>
                    
            </View>
            }

            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                        <ListItem.Content >
                            <View style={styles.headerBs}>
                                <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisible(false)}><Icon style={styles.iconHeader} name="close-thick"/></TouchableOpacity></View>
                                <View><Text style={styles.txtHeader}>Chia sẻ với</Text></View>
                            </View>
                            <View style={styles.shareChoose}>
                                <View style={styles.itemsChoose}>
                                    <View><TouchableOpacity><Icon style={styles.iconChoose} name="send"/></TouchableOpacity></View>
                                    <Text style={styles.txtChoose}>Gửi</Text>
                                </View>
                                <View style={styles.itemsChoose}>
                                    <View><TouchableOpacity><Icon style={styles.iconChoose} name="facebook"/></TouchableOpacity></View>
                                    <Text style={styles.txtChoose}>Facebook</Text>
                                </View>
                                <View style={styles.itemsChoose}>
                                    <View><TouchableOpacity><Icon style={styles.iconChoose} name="facebook-messenger"/></TouchableOpacity></View>
                                    <Text style={styles.txtChoose}>Messenger</Text>
                                </View>
                                <View style={styles.itemsChoose}>
                                    <View><TouchableOpacity><Icon style={styles.iconChoose} name="gmail"/></TouchableOpacity></View>
                                    <Text style={styles.txtChoose}>Gmail</Text>
                                </View>
                                <View style={styles.itemsChoose}>
                                    <View><TouchableOpacity><Icon style={styles.iconChoose} name="link-variant"/></TouchableOpacity></View>
                                    <Text style={styles.txtChoose}>Sao chép</Text>
                                </View>
                            </View>
                            <TouchableOpacity><Text style={styles.txtBootom}>Lưu</Text></TouchableOpacity>
                            <TouchableOpacity><Text style={styles.txtBootom}>Tải ảnh xuống</Text></TouchableOpacity>
                        </ListItem.Content>
                    </ListItem>
                </BottomSheet>
            </TouchableWithoutFeedback>
        </View>
    )
}

const width = Dimensions.get('window').width - 30;

const styles = StyleSheet.create({
    container:{
        paddingTop: 10,
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header:{
        marginTop: 15,
        marginBottom:15,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    form:{
        flexDirection:'row',
        backgroundColor:'#e8e8e8',
        borderRadius: 100,
    },
    icon:{
        fontSize: 17,
        alignSelf:'center',
        paddingLeft: 15
    },
    ip:{
        fontSize: 17,
        paddingLeft: 10
    },
    headerFind:{
        paddingBottom: 10,
        flexDirection:'row',
        justifyContent:'center',
    },
    txtHeaActive:{
        borderBottomColor:'black',
        borderBottomWidth:5,
        fontSize: 16,
        color:'black'
    },
    txtHea:{
        fontSize: 16,
        color:'black'
    },
    idea:{
        paddingTop: 20,
    },
    tables:{
        marginTop: 20,
    },
    items:{
        width: width / 2,
        marginBottom: 10,
    },
    image:{
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 20,
        overflow: "hidden",
        width: '100%',
        height: 300,
    },
    name:{
        position: 'absolute',
        color: '#ffffff',
        fontSize:16,
        alignSelf:'center',
        top: "35%",
        fontWeight:'bold'
    },

    boxContent:{
        marginTop:15,
        marginBottom: "40%"
    },
    itemsBox:{
        marginBottom: 20,
        width: width / 2,
    },
    imageBox:{
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 20,
        overflow: "hidden",
        width: '100%',
        height: width / 2,
    },
    textContent:{
        marginTop: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal: 5  
    },
    content:{
        fontSize: 12,
        color: 'black',
        width: '85%'
    },
    iconBox:{
        fontSize: 20,
        alignSelf:'flex-start',
        fontWeight: 'bold',
        color: 'black',
    },
    imgStyle:{
        marginRight: '5%'
    },
    imageUs:{
        width: 50,
        height: 50,
        borderRadius: 50
    },
    nameBox:{
        justifyContent:'center',
    },
    btnMess:{
        padding: 15,
        backgroundColor:'#e8e8e8',
        color:'black',
        fontWeight: 'bold',
        fontSize: 15,
        borderRadius: 100,
    },

    headerBs:{
        alignItems:'center',
        width:'100%',
        flexDirection:'row',
    },
    Picon:{
        marginRight:10
    },
    iconHeader:{
        fontSize: 25,
        color:'black',
    },
    txtHeader:{
        fontSize: 16,
        color:'black',
    },
    shareChoose:{
        marginTop: 20,
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
        marginBottom: '10%'
    },
    itemsChoose:{
        alignItems:'center',
        width: '20%'
    },
    imgChoose:{
        width: 60,
        height: 60,
        overflow:'hidden',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius:100
    },
    txtChoose:{
        fontSize: 10,
        color:'black',
    },
    iconChoose:{
        fontSize: 30,
        padding: 10,
        borderColor: '#ffffff',
        borderWidth:1,
        borderRadius:100,
        color:'black',
        backgroundColor:'#e8e8e8'
    },
    txtBootom:{
        marginLeft:'5%',
        fontSize: 20,
        fontWeight:'bold',
        marginBottom:'5%'
    }
})

export default DataSearchScreen;