import React, { useEffect, useState } from "react";
import { StatusBar, TextInput, TouchableWithoutFeedback, ScrollView, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../contex/UserInfor";
import firebase from "@react-native-firebase/firestore";
import { locale } from "moment";
import LoadScreen from "../AppLoad/LoadScreen";
const UserScreen = ({route,navigation}:any) => {

    const { user, setUser, getUser }: any = useUser();
    const [loadData,setLoadData] = useState(false);
    const [deleted,setdeleted] = useState(false);

    if(route.params != undefined){
        const {info} = route.params;
        if(info != undefined){
            Alert.alert('Thông báo',info);
            route.params = undefined;
        }
    }

    const fb = firebase().collection('Accounts');
    const fbPost = firebase().collection('Posts');
    const fbFavourites = firebase().collection("Favourites");
    const navigationPage = useNavigation();
    
    const [loading, setLoading] = useState(false);

    const [isVisibleProfile, setIsVisibleProfile] = useState(false);
    const [isVisibleAddPost, setIsVisibleAddPost] = useState(false);
    const [isVisibleArrange, setIsVisibleArrange] = useState(false);
    const [isVisibleOption, setIsVisibleOption] = useState(false)
    const [isVisibleContent, setIsVisibleContent] = useState(false)
    const [isVisibleOptionUpdate, setIsVisibleOptionUpdate] = useState(false)
   
    const [favourites, setFavourites] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');
    const [posts, setPosts] = useState([]);
    

    const [idPostUpdate, setIdPostUpdate] = useState('');
    const openIsVisibleOptionUpdate = (idPost: any) => {
        setIsVisibleOptionUpdate(true);
        setIdPostUpdate(idPost);
    }
    const notifiDeletePost = (id:any)=>{
        Alert.alert(
            "Thông báo",
            "Bạn có muốn xóa ghim đã tạo?",
            [
                {
                    text: "Thoát",
                },
                {
                    text: "Có",
                    onPress: () => {
                        deletePost(id);
                    },
                },
              
            ]
        );
        
    }
    const deletePost = (id:any) =>{
        fbPost.doc(id).delete();
        Alert.alert('Thông báo','Đã xóa bài viết.');
        setIsVisibleOptionUpdate(false);
    }

    const [idSavePost, setIdSavePost] = useState('');
    const openOptionSavePost = (id:any)=>{
        setIdSavePost(id);
        setIsVisibleOption(true);
    }
    const notifiDeleteSavePost = (id:any)=>{
        Alert.alert(
            "Thông báo",
            "Bạn có muốn xóa ghim đã lưu?",
            [
                {
                    text: "Thoát",
                },
                {
                    text: "Có",
                    onPress: () => {
                        deleteSavePost(id);
                    },
                },
              
            ]
        );
        
    }
    const deleteSavePost = (id:any)=>{
        fbFavourites.doc(idSavePost).delete();
        Alert.alert('Thông báo','Đã xóa.');
        setIsVisibleOption(false);
        setdeleted(true);
    }

    const loadDataPostUser = async ()=>{
        await fbPost.where('userId', '==', user).onSnapshot((doc) => {
            if (doc.size > 0) {
                const post: any = []
                doc.forEach((docPost) => {
                    let data = docPost.data();
                    post.push({
                        id: docPost.id,
                        imagePost: data.imagePost,
                        titlePost: data.titlePost
                    })
                })
                setPosts(post);
            }
        }) 
    }

    const loadDataUser = async ()=>{
        await fb.doc(user).onSnapshot(documentSnapshot => {
            let data: any = documentSnapshot.data()
            setFirstName(data.firstName)
            setLastName(data.lastName)
            setUserName(data.userName)
            setUserImage(data.image)
        });  
    }

    const loadDataSavePost = async ()=>{
        setLoading(true);
        const postTitlePost: any = {};
        const postImagePost: any = {};
        const postIdPost: any = {};
        
        await fbPost.onSnapshot((post) => {
            if (post.size > 0) {
                post.forEach(data => {
                    postTitlePost[data.id] = data.data().titlePost,
                    postImagePost[data.id] = data.data().imagePost,
                    postIdPost[data.id] = data.id
                })
            }
        })
        
        await fbFavourites.where('idUser', '==', user).orderBy('date','desc').onSnapshot((doc) => {
            if (doc !== null) {
                const favourite: any = []
                doc.forEach((docPost) => {
                    favourite.push({
                        id: docPost.id,
                        imagePost: postImagePost[docPost.data().postId],
                        titlePost: postTitlePost[docPost.data().postId],
                        idPost: postIdPost[docPost.data().postId],
                    })
                })
                setFavourites(favourite);
                setLoading(false);
            };
        })

        loadDataPostUser();
        loadDataUser();
    }

    React.useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {

        });
        
        return focusHandler;
    }, [navigation]);

    useEffect(() => {  
        loadDataSavePost();   
        setLoadData(false);
    }, [loadData])

    useEffect(() => {
        loadDataSavePost();   
        setdeleted(false);
    }, [deleted])

    return (
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setIsVisibleProfile(true)}><Icon style={styles.icon} name="dots-horizontal" /></TouchableOpacity>
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
                            <TouchableOpacity onPress={() => setIsVisibleContent(true)}><Text style={isVisibleContent ? styles.postsSaved : styles.postsCreated}>Đã tạo</Text></TouchableOpacity>
                            <View style={{ marginHorizontal: 10 }}></View>
                            <TouchableOpacity onPress={() => {setIsVisibleContent(false),setLoadData(true)}}><Text style={!isVisibleContent ? styles.postsSaved : styles.postsCreated}>Đã lưu</Text></TouchableOpacity>
                        </View>
                    </View>

                    {isVisibleContent
                        ? <View style={styles.boxContent}>
                            {posts.length < 1
                                ? <View style={{ marginTop: 30 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>Lấy cảm hứng với một Ghim ý tưởng</Text>
                                    <View style={{ alignItems: 'center' }}><TouchableOpacity onPress={() => navigationPage.navigate('AddPost')}><Text style={{ marginTop: 10, padding: 10, backgroundColor: '#e30020', color: '#ffffff', fontSize: 16, borderRadius: 50 }}>Tạo</Text></TouchableOpacity></View>
                                </View>
                                : <View style={styles.boxContent}>
                                    <FlatList scrollEnabled={false} data={posts} renderItem={({ item }: any) =>
                                        <View style={styles.items}>
                                            <View>
                                                <TouchableOpacity onPress={() => { navigationPage.navigate('Detail', item.id) }}>
                                                    <Image style={styles.image} source={{ uri: item.imagePost }} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.textContent}>
                                                <Text style={styles.contentBox}>{item.titlePost}</Text>
                                                <TouchableOpacity onPress={() => openIsVisibleOptionUpdate(item.id)}><Icon style={styles.iconBox} name="dots-horizontal" /></TouchableOpacity>
                                            </View>
                                        </View>
                                    } numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    />
                                </View>
                            }
                        </View>
                        : <View style={styles.boxContent}>
                            <View style={styles.frm}>
                                <View style={styles.headerForm}>
                                    <TouchableOpacity><View style={styles.form}><Icon style={styles.iconForm} name="magnify" /><TextInput placeholder="Tìm Ghim của bạn" style={styles.ipFrom}></TextInput></View></TouchableOpacity>
                                </View>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => setIsVisibleArrange(true)}><Icon style={styles.iconForm} name="tune-variant" /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsVisibleAddPost(true)}><Icon style={styles.iconForm} name="plus-thick" /></TouchableOpacity>
                                </View>
                            </View>

                            {favourites.length < 1 
                            ? <View><Text style={{alignSelf:'center',marginTop:50,fontSize:16,color:'black'}}>Chưa có Ghim được lưu</Text></View>
                            : <FlatList scrollEnabled={false} data={favourites} renderItem={({ item }: any) =>
                                <View>
                                    {item.idPost == null 
                                    ? <View style={styles.items}>
                                        <View>
                                            <Image style={styles.image} source={require('../../assets/image/imgDeletePost.png')} />
                                        </View>
                                        <View style={styles.textContent}>
                                            <Text style={styles.contentBox}>{item.titlePost}</Text>
                                            <TouchableOpacity onPress={() => openOptionSavePost(item.id)}><Icon style={styles.iconBox} name="dots-horizontal" /></TouchableOpacity>
                                        </View>
                                    </View>
                                    : <View style={styles.items}>
                                        <TouchableOpacity onPress={() => navigationPage.navigate('Detail', item.idPost) }>
                                            <View>
                                                {item.imagePost == null 
                                                ? <Image style={styles.image} source={{uri:'https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg'}} />
                                                : <Image style={styles.image} source={{ uri: item.imagePost }} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.textContent}>
                                            <Text style={styles.contentBox}>{item.titlePost}</Text>
                                            <TouchableOpacity onPress={() => openOptionSavePost(item.id)}><Icon style={styles.iconBox} name="dots-horizontal" /></TouchableOpacity>
                                        </View>
                                    </View>
                                    }
                                </View>
                            } numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }}
                            />
                            }
                        </View>
                    }
                </ScrollView>

                <TouchableWithoutFeedback onPress={() => setIsVisibleProfile(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleProfile}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <ListItem.Content>
                                <View style={styles.headerBtn}>
                                    <View style={styles.Btnicon}><TouchableOpacity onPress={() => setIsVisibleProfile(false)}><Icon style={styles.iconHeader} name="close-thick" /></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Hồ sơ</Text></View>
                                </View>
                                <View style={styles.bottomSheet}>
                                    <TouchableOpacity onPress={() => { navigationPage.navigate('SettingUserStack'), setIsVisibleProfile(false) }}><Text style={styles.bottomSheetTxt}>Cài đặt</Text></TouchableOpacity>
                                    <TouchableOpacity><Text style={styles.bottomSheetTxt}>Sao chép liên kết hồ sơ</Text></TouchableOpacity>
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setIsVisibleArrange(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleArrange}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <ListItem.Content >
                                <View style={styles.headerBtn}>
                                    <View style={styles.Btnicon}><TouchableOpacity onPress={() => setIsVisibleArrange(false)}><Icon style={styles.iconHeader} name="close-thick" /></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Sắp xếp theo</Text></View>
                                </View>
                                <View style={styles.bottomSheet}>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.bottomSheetTxt}>Từ A đến Z</Text>
                                            <View><Icon style={styles.iconForm} name="check-bold" /></View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity><Text style={styles.bottomSheetTxt}>Tùy chỉnh</Text></TouchableOpacity> */}
                                    <TouchableOpacity><Text style={styles.bottomSheetTxt}>Lưu lại mới nhất</Text></TouchableOpacity>
                                    <Text style={styles.bottomSheetTxtTop}>Bố cục</Text>
                                    <TouchableOpacity><Text style={styles.bottomSheetTxt}>Quản lý chế độ hiển thị</Text></TouchableOpacity>
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setIsVisibleAddPost(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleAddPost}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <ListItem.Content>
                                <View style={styles.Addheader}>
                                    <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisibleAddPost(false)}><Icon style={styles.Addicon} name="close-thick" /></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Bắt đầu tạo ngay</Text></View>
                                </View>
                                <View style={styles.AddbottomSheet}>
                                    <View style={styles.boxItem}>
                                        <TouchableOpacity onPress={() => { navigationPage.navigate('AddTopic'), setIsVisibleAddPost(false) }}><Icon style={styles.iconBtn} name="checkbox-multiple-blank" /></TouchableOpacity>
                                        <Text style={styles.boxTxt}>Tạo chủ đề</Text>
                                    </View>
                                    <View style={styles.boxItem}>
                                        <TouchableOpacity onPress={() => { navigationPage.navigate('AddPost'), setIsVisibleAddPost(false) }}><Icon style={styles.iconBtn} name="pin" /></TouchableOpacity>
                                        <Text style={styles.boxTxt}>Ghim</Text>
                                    </View>
                                    {/* <View style={styles.boxItem}>
                                        <TouchableOpacity><Icon style={styles.iconBtn} name="collage"/></TouchableOpacity>
                                        <Text style={styles.boxTxt}>Bảng</Text>
                                    </View> */}
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>

                {/* BottomSheet phần tùy chọn */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleOption(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleOption}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <ListItem.Content >
                                <View style={styles.headerBtn}>
                                    <View style={styles.Btnicon}><TouchableOpacity onPress={() => setIsVisibleOption(false)}><Icon style={styles.iconHeader} name="close-thick" /></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Tùy chọn</Text></View>
                                </View>
                                <View style={styles.bottomSheet}>
                                    <TouchableOpacity onPress={() => notifiDeleteSavePost(idSavePost)}><Text style={styles.bottomSheetTxt}>Xóa</Text></TouchableOpacity>
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>

                {/* BottomSheet phần tùy chọn */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleOptionUpdate(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleOptionUpdate}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <ListItem.Content >
                                <View style={styles.headerBtn}>
                                    <View style={styles.Btnicon}><TouchableOpacity onPress={() => setIsVisibleOptionUpdate(false)}><Icon style={styles.iconHeader} name="close-thick" /></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Tùy chọn</Text></View>
                                </View>
                                <View style={styles.bottomSheet}>
                                    <TouchableOpacity onPress={() => { navigationPage.navigate('EditPost', idPostUpdate) }}><Text style={styles.bottomSheetTxt}>Chỉnh sửa</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => notifiDeletePost(idPostUpdate) }><Text style={styles.bottomSheetTxt}>Xóa</Text></TouchableOpacity>
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>
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
        alignItems: 'flex-end',
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
    textContent: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    contentBox: {
        fontSize: 12,
        color: 'black',
        width: '85%'
    },
    iconBox: {
        fontSize: 20,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        color: 'black',
    },

    //BottomSheet style
    headerBtn: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    Btnicon: {
        marginRight: 10
    },

    // style BottomSheet phần sắp xếp
    bottomSheet: {
        width: '100%',
        paddingTop: 20
    },
    bottomSheetTxtTop: {
        fontSize: 15,
        paddingBottom: 20
    },
    bottomSheetTxt: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 20
    },
    btnTool1: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#e8e8e8',
        color: 'black',
        fontSize: 15,
        borderRadius: 100,
    },
    // style BottomSheet phần thêm mới bài post
    Addheader: {
        alignItems: 'center',
        width: '100%',
    },
    Picon: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        marginRight: '0%'
    },
    iconHeader: {
        fontSize: 25,
        color: 'black',
    },
    Addicon: {
        fontSize: 25,
        color: 'black',
    },
    txtHeader: {
        fontSize: 16,
        color: 'black',
    },
    txtBootom: {
        marginLeft: '5%',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: '5%'
    },
    AddbottomSheet: {
        width: '100%',
        paddingVertical: 25,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    boxItem: {
        alignItems: 'center',
        marginHorizontal: 10
    },
    iconBtn: {
        fontSize: 25,
        color: 'black',
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#e8e8e8'
    },
    boxTxt: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 10
    }
})

export default UserScreen;