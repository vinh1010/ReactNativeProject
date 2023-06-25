import React, { useEffect, useRef, useState } from "react";
import { StatusBar, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Animated, Easing } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import firebase from "@react-native-firebase/firestore";
import LoadScreen from "../AppLoad/LoadScreen";

const HomeScreen = ()=>{
    
    const navigation = useNavigation();
    let listViewRef:any;
    const fb = firebase().collection('Posts');
    const [isVisible, setIsVisible] = useState(false);
    const [loading,setLoading] = useState(false);
    const [loadingData,setLoadingData] = useState(false);

    const toTop = () => {
        listViewRef.scrollToOffset({ offset: 0, animated: true });
    }

    const [posts, setPosts] = useState([]);

    const loadData = ()=>{
        setLoading(true);
        fb.orderBy('postTime','desc').onSnapshot((querySnapshot) => {
            const post:any = [];
            querySnapshot.forEach((doc) => {
                post.push({
                    key: doc.id,
                    titlePost: doc.data().titlePost,
                    imagePost: doc.data().imagePost,
                    userId: doc.data().userId
                });
            });
            setPosts(post);
            setLoading(false);
        });
    }

    useEffect(() => {
        loadData();
    },[])

    useEffect(()=>{
        loadData();
        setLoadingData(false);
    },[loadingData])

    return (
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.boxHeder}>
                    <TouchableOpacity onPress={()=>{toTop(),setLoadingData(true)}}><Text style={styles.boxHederTxt}>Dành cho bạn</Text></TouchableOpacity>
                </View>

                <View style={styles.boxContent}>
                    <FlatList data={posts} ref={(ref) => {listViewRef = ref}} renderItem={({item}:any)=>
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

                <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisible}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                            <ListItem.Content >
                                <View style={styles.header}>
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
                                <TouchableOpacity><Text style={styles.txtBootom}>Tải ảnh xuống</Text></TouchableOpacity>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>
            </View>

            {loading ? <LoadScreen/>: null}
        </>
    )
};

const width = Dimensions.get('window').width - 30;

const styles = StyleSheet.create({
    container:{
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom:50,
        flex: 1,
        backgroundColor: '#ffffff'
    },
    boxHeder:{
        alignItems:'center'
    },
    boxHederTxt:{
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor:'black',
        color:'#ffffff',
        fontWeight: 'bold',
        fontSize: 17,
        borderRadius: 100
    },
    boxContent:{
        marginTop:15,
    },
    items:{
        marginBottom: 20,
        width: width / 2,
    },
    image:{
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 20,
        overflow: "hidden",
        width: '100%',
        height: 300,
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
    icon:{
        fontSize: 20,
        alignSelf:'flex-start',
        fontWeight: 'bold',
        color: 'black',
    },
    
    header:{
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

export default HomeScreen;