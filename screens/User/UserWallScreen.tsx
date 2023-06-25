import React, { useEffect, useState } from "react";
import { StatusBar, TextInput, TouchableWithoutFeedback, ScrollView, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadScreen from "../AppLoad/LoadScreen";
import { useNavigation } from "@react-navigation/native";
import firebase from "@react-native-firebase/firestore";

const UserWallScreen = ({route}:any)=>{
    const id = route.params;
    const navigation = useNavigation();
    const fb = firebase().collection('Accounts');
    const fbPost = firebase().collection('Posts');
    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setLoading(true);
        
        fbPost.where('userId', '==', id).where('statusPost','==',true).get().then((doc) => {
            if (doc.size > 0) {
                const post: any = []
                doc.forEach((docPost) => {
                    let data = docPost.data();
                    post.push({
                        id: docPost.id,
                        imagePost: data.imagePost,
                    })
                })
                setPosts(post);
            }
        })

        fb.doc(id).get().then(documentSnapshot => {
            let data: any = documentSnapshot.data()
            setFirstName(data.firstName)
            setLastName(data.lastName)
            setUserName(data.userName)
            setUserImage(data.image)
            setLoading(false);
        }); 
    }, [])

    return(
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.icon} name="chevron-left" /></TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        {userImage == null || userImage == ''
                            ? <Image style={styles.imageUser} source={require('../../assets/image/imageUser1.png')} />
                            : <Image style={styles.imageUser} source={{ uri: userImage }} />
                        }
                        <View style={styles.textConten}>
                            <Text style={styles.nameUs}>{lastName} {firstName}</Text>
                            <Text style={{ fontSize: 16, color: 'black' }}>@{userName}</Text>
                            {/* <View style={{flexDirection:'row',marginTop: 10}}>
                                <Text style={styles.followers}>0 người theo dõi</Text>
                                <Text style={{fontSize: 17,fontWeight:'bold'}}>-</Text>
                                <TouchableOpacity><Text style={styles.arefollowing}>0 đang theo dõi</Text></TouchableOpacity>
                            </View> */}
                        </View>
                        <View style={styles.postsUser}>
                           <Text style={styles.postsSaved}>Đã tạo</Text>
                        </View>
                    </View>


                    <View style={styles.boxContent}>
                        <FlatList scrollEnabled={false} data={posts} renderItem={({ item }: any) =>
                            <TouchableOpacity onPress={() => { navigation.navigate('Detail', item.id) }}>
                                <View style={styles.items}>
                                    <View>
                                        <Image style={styles.image} source={{ uri: item.imagePost }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        } numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
                        />
                    </View>
                </ScrollView>
            </View>
            {loading ? <LoadScreen /> : null}
        </>
    )
}

const width = Dimensions.get('window').width - 30;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: '5%'
    },
    header: {
        alignItems: 'flex-start',
    },
    icon: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: '5%',
    },
    content: {
        alignItems: 'center',
        marginTop: 10
    },
    imageUser: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    textConten: {
        alignItems: 'center',
        marginTop: 10
    },
    nameUs: {
        fontSize: 40,
        color: 'black',
        fontWeight: 'bold'
    },
    followers: {
        marginRight: 5,
        fontSize: 17,
        fontWeight: 'bold'
    },
    arefollowing: {
        marginLeft: 5,
        fontSize: 17,
        color: 'black'
    },
    postsUser: {
        marginTop: 20,
        flexDirection: 'row'
    },
    postsCreated: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold'
    },
    postsSaved: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
        paddingBottom: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 5
    },
    frm: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerForm: {
        backgroundColor: '#e8e8e8',
        borderRadius: 100,
        width: '80%'
    },
    form: {
        flexDirection: 'row'
    },
    iconForm: {
        fontSize: 25,
        alignSelf: 'center',
        paddingLeft: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    ipFrom: {
        fontSize: 15,
        paddingLeft: 10
    },
    frmTool: {
        fontSize: 25,
        alignSelf: 'center',
        paddingLeft: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    boxContent: {
        marginTop: 20,
    },
    items: {
        marginBottom: 10,
        width: width / 2,
    },
    image: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 20,
        overflow: "hidden",
        width: '100%',
        height: 300
    },
})

export default UserWallScreen;