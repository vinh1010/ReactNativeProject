import React from 'react';
import { useState,useEffect } from 'react';
import { StatusBar, Dimensions, TextInput, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/firestore';
import LoadScreen from '../AppLoad/LoadScreen';

const SearchScreen = ()=>{
    
    const navigation = useNavigation();
    const [loading,setLoading] = useState(false);
    const fbTopic = firebase().collection('Topics');

    const [checkOnPress,setCheckOnPress] = useState(false);
    const [text, setText] = useState('')
    const [topics, setTopics] = useState([]);
    const [hotTopics, setHotTopics] = useState([]);


    const submitKey = (key:any)=>{
        navigation.navigate('DataSearch',key)
    }

    useEffect(()=>{
        setLoading(true)
        fbTopic.orderBy('postTime','desc').limit(4).get()
        .then((querySnapshot) => {
            let topics:any = [];
            querySnapshot.forEach((doc) => {
                topics.push({
                    key: doc.id,
                    nameTopic: doc.data().nameTopic,
                    imageTopic: doc.data().imageTopic
                });
                setLoading(false);
            });
            setTopics(topics);
        });

        fbTopic.orderBy('used','desc').limit(6).get()
        .then((querySnapshot) => {
            let topics:any = [];
            querySnapshot.forEach((doc) => {
                topics.push({
                    key: doc.id,
                    nameTopic: doc.data().nameTopic,
                    imageTopic: doc.data().imageTopic
                });
                setLoading(false);
            });
            setHotTopics(topics);
        });
        
    },[])

    return (
        <>
            <View style={styles.container}> 
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.header}>
                    
                    <View style={checkOnPress ? {width:'85%'} : {width:'100%'}}>
                        <View style={styles.form}>
                            <View style={{alignSelf:'center'}}><Icon style={styles.icon} name="magnify"/></View>
                            <View><TextInput onSubmitEditing={()=>submitKey(text)} onPressIn={()=>setCheckOnPress(true)} onChangeText={newText => setText(newText)} defaultValue={text} placeholder="Tìm kiếm trên Pinterest" style={styles.ip}/></View>
                        </View>
                    </View>
                    
                    {checkOnPress 
                    ? <View style={{width:'10%',alignSelf:'center'}}><TouchableOpacity onPress={()=>setCheckOnPress(false)}><Text style={{fontSize:15,color:'black',fontWeight:'bold'}}>Hủy</Text></TouchableOpacity></View>
                    : null
                    }
                </View>

                {!checkOnPress 
                ? <View>    
                    <ScrollView> 
                        <View>
                            <View style={styles.idea}>
                                <Text style={{color:'black',fontWeight:'bold',fontSize:15,alignSelf:'center'}}>Chủ đề mới dành cho bạn</Text>
                                <View style={styles.tables}>
                                    <FlatList scrollEnabled={false} data={topics} renderItem={({item}:any)=>
                                        <TouchableOpacity onPress={()=>submitKey(item.nameTopic)}>
                                            <View style={styles.items}>
                                                <Image style={styles.image} source={{uri:item.imageTopic}}></Image>
                                                <Text style={styles.name}>{item.nameTopic}</Text>
                                            </View>   
                                        </TouchableOpacity>   
                                    } numColumns={2} columnWrapperStyle={{justifyContent:'space-between'}}
                                    />
                                </View>
                            </View>

                            <View style={styles.idea}>
                                <Text style={{color:'black',fontWeight:'bold',fontSize:15,alignSelf:'center'}}>Phổ biến trên Pinterest</Text>
                                <View style={styles.tables}>
                                <FlatList scrollEnabled={false} data={hotTopics} renderItem={({item}:any)=>
                                        <TouchableOpacity onPress={()=>submitKey(item.nameTopic)}>
                                            <View style={styles.items}>
                                                <Image style={styles.image} source={{uri:item.imageTopic}}></Image>
                                                <Text style={styles.name}>{item.nameTopic}</Text>
                                            </View>   
                                        </TouchableOpacity>   
                                    } numColumns={2} columnWrapperStyle={{justifyContent:'space-between'}}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                : <View>
                    
                </View>
                }
            </View>
            {loading ? <LoadScreen/> : null}
        </>
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
        height: width / 4,
        opacity: 0.7,
        backgroundColor: 'black'
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

export default SearchScreen;