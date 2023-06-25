import React from "react";
import { StatusBar, TextInput, StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from "react-native";

const MessageIndexScreen = ()=>{

    const data = [
        {id:1,name:"Dũng Bùi",avata:'https://www.ldg.com.vn/media/uploads/uploads/01222845-anh-dep-gai.jpg'},
        {id:2,name:"Vinh Ng",avata:'https://www.ldg.com.vn/media/uploads/uploads/01222936-anh-co-gai-xinh.jpg'},
        {id:3,name:"Anh Trần",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:4,name:"Thảo Vi",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:5,name:"Tuyết Nhi",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:6,name:"Diep Nguyen",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:7,name:"Canh Dat",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:8,name:"Duyen Nguyen",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:9,name:"Duong ngo",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:10,name:"Dũng Bùi",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:11,name:"Anh Trần",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:12,name:"Vinh Ng",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:13,name:"Duong ngo",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-1.jpg'},
        {id:14,name:"Canh Dat",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
        {id:15,name:"Canh Dat 2",avata:'https://hinhnen4k.com/wp-content/uploads/2023/02/anh-gai-xinh-vn-2.jpg'},
    ]

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

            <View style={styles.boxHeder}>
                <TouchableOpacity><Text style={styles.boxHederTxt}>Tin nhắn</Text></TouchableOpacity>
            </View>

            <View style={styles.main}>
                <Text style={{color:'black',fontSize: 16}}>Tin nhắn</Text>
                <View style={{alignItems:'center'}}><Text style={styles.title}>Chia sẻ ý tưởng với bạn bè</Text></View>
                <View><TextInput placeholder="Tìm kiếm theo tên hoặc email" style={styles.ip}></TextInput></View>
            </View>

            <View style={styles.boxContent}>
                <FlatList data={data} renderItem={({item})=>
                    <View style={styles.items}>
                        <View style={styles.useStyle}>
                            <View style={styles.imgStyle}>
                                <Image style={styles.image} source={require('../../assets/image/imageUser1.png')}/> 
                            </View>
                            <View style={styles.name}>
                                <Text style={{fontWeight:'bold',color:'black',fontSize:16}}>{item.name}</Text>
                                <Text>Trong mạng lưới của bạn</Text>
                            </View>
                        </View>
                        <View style={{justifyContent:'center'}}>
                            <TouchableOpacity><Text style={styles.btnMess}>Tin nhắn</Text></TouchableOpacity>
                        </View>
                    </View>
                }/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
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
    main:{
        marginTop: 30
    },
    title:{
        width: '70%',
        textAlign:"center",
        fontSize: 30,
        fontWeight:'bold',
        color:'black',
        marginTop:30
    },
    ip:{
        marginTop: 30,
        padding: 15,
        backgroundColor:'#e8e8e8',
        borderRadius: 100,
        fontSize: 17
    },
    boxContent:{
        marginTop:15,
        marginBottom:'80%',
    },
    items:{
        marginBottom:15,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    useStyle:{
        flexDirection:'row'
    },
    imgStyle:{
        backgroundColor:'#e8e8e8',
        borderRadius:100,
    },
    image:{
        width: 50,
        height: 50,
        overflow: 'hidden',
    },
    name:{
        justifyContent:'center',
        marginLeft: 10
    },
    btnMess:{
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor:'#e30020',
        color:'#ffffff',
        fontWeight: 'bold',
        fontSize: 17,
        borderRadius: 100
    }
})
export default MessageIndexScreen