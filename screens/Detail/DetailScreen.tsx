import React, { useState, useEffect } from 'react';
import { StatusBar, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomSheet, ListItem } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import firebase from "@react-native-firebase/firestore";
import LoadScreen from '../AppLoad/LoadScreen';
import { useUser } from '../../contex/UserInfor';
import moment from 'moment';

const DetailScreen = ({route}:any)=>{

    const id = route.params;
    const fb = firebase().collection('Posts');
    const fbUser = firebase().collection('Accounts');
    const fbComments = firebase().collection("Comments");
    const fbLikePost = firebase().collection("LikePosts");
    const fbLikeComment = firebase().collection("LikeComments");
    const fbFavourites = firebase().collection("Favourites");
    const [loading,setLoading] = useState(false);
    const {user,setUser,getUser}:any = useUser();

    const navigation = useNavigation();
    const [isVisibleOption, setIsVisibleOption] = useState(false);
    const [isVisibleShare, setIsVisibleShare] = useState(false);
    const [isVisibleShareRLE, setIsVisibleShareRLT] = useState(false);
    const [isVisibleComment, setIsVisibleComment] = useState(false);
    const [isVisibleOptionCmt, setIsVisibleOptionCmt] = useState(false);
    const [isVisibleIpCmt, setIsVisibleIpCmt] = useState(false);
    const [isVisibleEditIpCmt, setIsVisibleEditIpCmt] = useState(false);
    const [checkSavePost, setCheckSavePost] = useState(false);

    const [text, setText] = useState('');
    const [textEdit, setTextEdit] = useState('');

    const [showReplyCmt,setCheck] = useState(false);
    const setShowVisibility = ()=>{
        showReplyCmt ? setCheck(false) : setCheck(true);
    }

    const [idUserPost,setIdUserPost] = useState('');
    const [titlePost,setTitlePost] = useState('');
    const [descriptionPost,setDescriptionPost] = useState('');
    const [tagTopic,setTagTopic] = useState('');
    const [imagePost,setImagePost] = useState('https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg');

    const [imageUser, setImageUser] = useState('https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg');
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [comments,setComments] = useState([]);
    const [likePosts,setLikePosts] = useState([]);
    const [relatedPosts,setRelatedPosts] = useState([]);
    const [checkAccountLike,setCheckAccountLike] = useState(false);
    const [loadCmt,setLoadCmt] = useState(false);
    const [loadDataRelatedPosts,setDataLoadRelatedPosts] = useState(false);
    
    const [likes,setLike]:any = useState()

    const loadDataComment = async () =>{
        const imageUserCmt:any = {};
        const firstNameCmt:any = {};
        const lastNameCmt:any = {};

        const comment:any = [] 

        await fbUser.get().then((doc) => {
            doc.forEach((data)=>{
                imageUserCmt[data.id] = data.data().image,
                firstNameCmt[data.id] = data.data().firstName,
                lastNameCmt[data.id] = data.data().lastName
            });
        })

        fbComments.where('postId','==',id).orderBy('date','desc').onSnapshot((doc) => {
            if(doc != null){
                doc.forEach((data) => {
                    let dataCmt:any = data.data();
                    comment.push({
                        id: data.id,
                        content: dataCmt.content,
                        date: dataCmt.date,
                        likeComment: dataCmt.likeComment,
                        idUser: dataCmt.idUser,
                        firstName: firstNameCmt[data.data().idUser],
                        lastName: lastNameCmt[data.data().idUser],
                        imageUser: imageUserCmt[data.data().idUser]
                    });
                });
                setComments(comment);
            }
        });

        const likePost:any = [];
        await fbLikePost.where('postId','==',id).onSnapshot((docSnap) => {
            setLike(docSnap.size)
            docSnap.forEach((doc) => {
                likePost.push({
                    id: doc.id,
                    postId: doc.data().postId,
                    userId: doc.data().userId,
                });
                if(doc.data().userId === user){
                    setCheckAccountLike(true);
                }
            });
            
            setLikePosts(likePost);
        });
    }

    const likePost = async ()=>{
        await fbLikePost.add({
            'postId': id,
            'userId': user
        })
        
        let countLike:any = likes;
        setLike(countLike + 1);

        setCheckAccountLike(true);
    }
    const deleteLike = async ()=>{
        await fbLikePost.where('postId', '==', id).where('userId','==',user).get()
        .then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                fbLikePost.doc(doc.id).delete();
            });
        });

        let countLike:any = likes;
        setLike(countLike - 1);
        setCheckAccountLike(false);
    }

    const submitComment = ()=>{
        fbComments.add({
            'postId': id,
            'idUser': user,
            'date' : firebase.Timestamp.fromDate(new Date()),
            'content' : text
        })
        setIsVisibleIpCmt(false);
        setText('');
        setLoadCmt(true);
    }
    const [idComment, setIdComment] = useState('')
    const openOptionCmt = (id:any)=>{
        setIsVisibleOptionCmt(true);
        setIdComment(id);
    }
    const deleteComment = ()=>{
        if(idComment !== ''){
            fbComments.doc(idComment).delete();
            setIsVisibleOptionCmt(false);
            Alert.alert('Thông báo','Xóa nhận xét thành công!')
            setLoadCmt(true);
        }
    }
    const editComment = ()=>{
        setIsVisibleEditIpCmt(true);
        if(idComment !== ''){
            fbComments.doc(idComment).get().then(data => {
                let doc:any = data.data();
                setTextEdit(doc.content);
            });
            
        }
    }
    const submitEditComment = ()=>{
        if(idComment !== ''){
            fbComments.doc(idComment).update({
                'content': textEdit
            });
            setIsVisibleEditIpCmt(false);
            setIsVisibleOptionCmt(false);
            Alert.alert('Thông báo','Chỉnh sửa nhận xét thành công')
            setLoadCmt(true);
        }
    }

    const savePost = ()=>{
        fbFavourites.add({
            'postId': id,
            'idUser' : user,
            'date': firebase.Timestamp.fromDate(new Date()),
        })
        Alert.alert("Thông báo",'Lưu ghim thành công.');
    }
    const deleteSavePost = ()=>{
        fbFavourites.where('postId','==',id).where('idUser','==',user).get().then((doc)=>{
            doc.forEach((data) =>{
                fbFavourites.doc(data.id).delete();
            })
            Alert.alert("Thông báo",'Đã xóa ghim khỏi dang sách lưu.');
        })
    }

    const [imgUserLogin,setImgUserLogin] = useState('');

    const loadrelatedPosts = async ()=>{
        await fb.where('tagTopic','==',tagTopic).where('statusPost','==',true).onSnapshot((doc)=>{
            let relatedPost:any = [];
            doc.forEach((data) =>{
                if(data.id !== id){
                    relatedPost.push({
                        key: data.id,
                        titlePost: data.data().titlePost,
                        imagePost: data.data().imagePost,
                        userId: data.data().userId
                    })
                }
            })
            setRelatedPosts(relatedPost);
        })
    }

    const loadPost = ()=>{
        setLoading(true);
        fb.doc(id).get().then((querySnapshot) => {
            let data:any = querySnapshot.data();
            setTitlePost(data.titlePost);
            setDescriptionPost(data.descriptionPost);
            setImagePost(data.imagePost);
            setTagTopic(data.tagTopic);
            if(data.userId !== ''){
                fbUser.doc(data.userId).get().then((querySnapshot) => {
                    let data:any = querySnapshot.data();
                    setImageUser(data.image);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setIdUserPost(querySnapshot.id);
                });
            }
            loadrelatedPosts();
            setLoading(false);
        });
    }

    useEffect(() =>{
        
        fbUser.doc(user).get().then((querySnapshot) => {
            let data:any = querySnapshot.data();
            setImgUserLogin(data.image);
            
        });

        fbFavourites.where('postId','==',id).where('idUser','==',user).onSnapshot((doc)=>{
            if(doc.size > 0){
                setCheckSavePost(true);
            }
            else{
                setCheckSavePost(false);
            }
        })

        loadPost();
        
    },[id]);

    useEffect(() =>{
        loadDataComment();
        setLoadCmt(false);
    },[loadCmt])

    useEffect(()=>{
        loadrelatedPosts();
        setDataLoadRelatedPosts(false);
    },[loadDataRelatedPosts])

    return (
        <>
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'}></StatusBar>
        
                <ScrollView>
                    <View style={styles.detail}>
                        <View style={styles.boxImage}>
                            <TouchableOpacity onPress={()=>navigation.goBack()}><Icon style={styles.icon} name="chevron-left"/></TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsVisibleOption(true)}><Icon style={styles.icon2} name="dots-horizontal"/></TouchableOpacity>
                            <Image style={styles.image} source={{uri:imagePost}}/>
                        </View>
                        
                        <View style={styles.useStyle}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={styles.imgStyle}>
                                        <Image style={styles.imageUs} source={{uri:imageUser}}/> 
                                    </View>
                                    <View style={styles.name}>
                                        {idUserPost == user 
                                        ?<View>
                                            <Text style={{fontWeight:'bold',color:'black',fontSize:16}}>{lastName} {firstName}</Text>
                                            <Text>Tác giả</Text>
                                        </View>
                                            
                                        :<TouchableOpacity onPress={()=>{navigation.navigate('UserWall',idUserPost)}}>
                                            <Text style={{fontWeight:'bold',color:'black',fontSize:16}}>{lastName} {firstName}</Text>
                                            <Text>Tìm hiểu về {firstName}</Text>
                                        </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                {/* <View style={{justifyContent:'center'}}>
                                    <TouchableOpacity><Text style={styles.btnMess}>Theo dõi</Text></TouchableOpacity>
                                </View> */}
                            </View>

                            {titlePost == '' ? null : <View style={styles.dess}><Text style={styles.txtDess}>{titlePost}</Text></View>}
                            
                            {descriptionPost == '' ? null : <View style={{marginTop: 10}}><Text style={{fontSize: 16,color:'black'}}>{descriptionPost}</Text></View>}

                            <View style={styles.tools}>
                                <TouchableOpacity onPress={() => {loadDataComment(),setIsVisibleComment(true)}}><Icon style={styles.iconTool1} name="comment-processing-outline"/></TouchableOpacity>
                                {idUserPost == user 
                                ? <View></View>
                                : <>
                                    {checkSavePost 
                                    ?   <TouchableOpacity onPress={()=> deleteSavePost()}><Text style={styles.btnTool2}>Bỏ lưu</Text></TouchableOpacity> 
                                    :   <TouchableOpacity onPress={()=> savePost()}><Text style={styles.btnTool2}>Lưu</Text></TouchableOpacity>
                                    }
                                </>
                                }
                                <TouchableOpacity onPress={() => setIsVisibleShare(true)}><Icon style={styles.iconTool2} name="upload"/></TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.related}>
                        <View style={styles.txtRelate}>
                            <TouchableOpacity onPress={()=> setDataLoadRelatedPosts(true)}><Text style={styles.txt}>Các Ghim khác tương tự</Text></TouchableOpacity>
                        </View>
                        <FlatList scrollEnabled={false} data={relatedPosts} renderItem={({item}:any)=>
                            <TouchableOpacity onPress={()=>{navigation.navigate('Detail',item.key)}}>
                                <View style={styles.items}>
                                    <View>
                                        <Image style={styles.imageRle} source={{uri:item.imagePost}}/>
                                    </View>
                                    <View style={styles.textContentRle}>
                                        <Text style={styles.contentRle}>{item.titlePost}</Text>
                                        <TouchableOpacity onPress={() => setIsVisibleShareRLT(true)}><Icon style={styles.iconRle} name="dots-horizontal"/></TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>   
                        } numColumns={2} columnWrapperStyle={{justifyContent:'space-between'}}
                        />
                    </View>
                </ScrollView>
                
                {/* BottomSheet phần tùy chọn */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleOption(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleOption}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                            <ListItem.Content >
                                <View style={styles.header}>
                                    <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisibleOption(false)}><Icon style={styles.iconHeader} name="close-thick"/></TouchableOpacity></View>
                                    <View><Text style={styles.txtHeader}>Tùy chọn</Text></View>
                                </View>
                                <TouchableOpacity><Text style={styles.txtBootom}>Theo giõi tác giả</Text></TouchableOpacity>
                                <TouchableOpacity><Text style={styles.txtBootom}>Sao chép liên kết</Text></TouchableOpacity>
                                <TouchableOpacity><Text style={styles.txtBootom}>Tải ảnh xuống</Text></TouchableOpacity>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>
                {/* BottomSheet phần chia sẻ bài viết */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleShare(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleShare}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                            <ListItem.Content >
                                <View style={styles.header}>
                                    <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisibleShare(false)}><Icon style={styles.iconHeader} name="close-thick"/></TouchableOpacity></View>
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
                {/* BottomSheet phần chia sẻ bài viết liên quan    */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleShareRLT(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleShareRLE}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                            <ListItem.Content >
                                <View style={styles.header}>
                                    <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisibleShareRLT(false)}><Icon style={styles.iconHeader} name="close-thick"/></TouchableOpacity></View>
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
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>
                {/* BottomSheet phần danh sách nhận xét */}
                <BottomSheet modalProps={{}} isVisible={isVisibleComment}>
                    <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                        <ListItem.Content>
                            {/* <LoadScreen/> */}
                            <View style={{width:'100%'}}>
                                <View style={styles.headerBsCmt}>
                                    <View style={[styles.headerL,{alignSelf:'center'}]}>
                                        <View><TouchableOpacity onPress={() => setIsVisibleComment(false)}><Icon style={styles.iconBsCmt} name="chevron-left"/></TouchableOpacity></View>
                                        {comments.length < 1
                                        ? <View style={{alignSelf:'center'}}><Text style={styles.countCmt}> Chưa có nhận xét</Text></View>
                                        : <View style={{alignSelf:'center'}}><Text style={styles.countCmt}> {comments.length} nhận xét</Text></View>
                                        }
                                    </View>

                                    <View style={styles.headerL}>
                                        {likes < 1
                                        ? <View>
                                            
                                        </View>
                                        : <View style={{flexDirection:'row',alignItems:'center'}}><Icon style={styles.iconBsHeart} name="cards-heart"/><Text style={[styles.countCmt]}>{likes}</Text></View>
                                        }
                                        
                                        {checkAccountLike 
                                        ? <View><TouchableOpacity onPress={()=>deleteLike()}><Icon style={styles.iconBsLikeActive} name="heart-outline"/></TouchableOpacity></View>
                                        : <View><TouchableOpacity onPress={()=>likePost()}><Icon style={styles.iconBsLike} name="heart-outline"/></TouchableOpacity></View>
                                        }
                                        
                                    </View>
                                </View>
                                
                                <View style={styles.listComent}>
                                    {comments.length < 1 
                                    ? <View style={{alignItems:'center',marginTop: 30}}>
                                        <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Khởi xướng tương tác</Text>
                                        <Text>Chia sẻ phản hồi hoặc đặt câu hỏi cho tác giả</Text>
                                    </View>
                                    : <ScrollView>
                                        <FlatList scrollEnabled={false} data={comments} renderItem={({item}:any)=>
                                            <View style={styles.itemCmt}>
                                                <View style={[styles.imgStyleBs,{alignSelf:'flex-start'}]}>
                                                    {item.imageUser == '' 
                                                    ? <TouchableOpacity><Image style={styles.imageUs} source={require('../../assets/image/imageUser1.png')}/></TouchableOpacity>
                                                    : <View>
                                                        {item.imageUser == null 
                                                        ? <TouchableOpacity><Image style={styles.imageUs} source={{uri:'https://top10hoabinh.com/wp-content/uploads/2022/10/anh-dang-load-2.jpg'}}/></TouchableOpacity>
                                                        : <TouchableOpacity><Image style={styles.imageUs} source={{uri:item.imageUser}}/></TouchableOpacity>
                                                        }
                                                    </View> 
                                                    }
                                                    
                                                </View>
                                                <View style={{width: '85%'}}>
                                                    <View style={{flexDirection:'row'}}>
                                                        <Text style={{color:'black',fontSize: 16,fontWeight:'bold'}}>{item.lastName} {item.firstName}</Text>
                                                        <Text style={{fontSize: 16,marginLeft: 10,color:'gray'}}>{moment(item.date.toDate()).fromNow()}</Text>
                                                    </View>
                                                    <View style={{marginTop:5}}>
                                                        <Text style={{color:'black'}}>{item.content}</Text>
                                                    </View>
                                                    <View style={{flexDirection:'row',marginTop:5}}>
                                                        {/* <TouchableOpacity><Text style={{color:'black',fontWeight:'bold'}}>Trả lời</Text></TouchableOpacity> */}
                                                        {/* <TouchableOpacity><Icon style={{color:'black',fontSize: 20,fontWeight:'bold' }} name="heart-outline"/></TouchableOpacity> */}
                                                        {/* <Text style={{color:'black',marginLeft: 10,fontWeight:'bold'}}>{item.likeComment} phản ứng</Text> */}
                                                        {item.idUser == user ? <TouchableOpacity onPress={() => openOptionCmt(item.id)}><Icon style={{color:'black',fontSize: 25,fontWeight:'bold' }} name="dots-horizontal"/></TouchableOpacity> : null} 
                                                    </View>
                                                    
                                                    {/* {showReplyCmt
                                                    ? <View>
                                                        <TouchableOpacity onPress={() => setShowVisibility()}>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Icon style={{color:'black',fontSize: 20}} name="arrow-right-bottom"/>
                                                                <Text style={{color:'black',marginLeft: 10}}>Ẩn câu trả lời</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <View>
                                                            <FlatList scrollEnabled={false} data={replyCmt} renderItem={({item})=>
                                                                <View style={styles.itemCmt}>
                                                                    <View style={[styles.imgStyleBs,{alignSelf:'flex-start'}]}>
                                                                        <TouchableOpacity><Image style={styles.imageUs} source={require('../../assets/image/imageUser1.png')}/></TouchableOpacity>
                                                                    </View>
                                                                    <View style={{width: '80%'}}>
                                                                        <View style={{flexDirection:'row'}}>
                                                                            <Text style={{color:'black',fontSize: 16,fontWeight:'bold'}}>{item.nameUser}</Text>
                                                                            <Text style={{fontSize: 16,marginLeft: 10,color:'gray'}}>tháng 04, 23</Text>
                                                                        </View>
                                                                        <View style={{marginTop:5}}>
                                                                            <Text style={{color:'black'}}>{item.comeent}</Text>
                                                                        </View>
                                                                        <View style={{flexDirection:'row',marginTop:5}}>
                                                                            <TouchableOpacity><Text style={{color:'black',fontWeight:'bold'}}>Trả lời</Text></TouchableOpacity>
                                                                            <TouchableOpacity><Icon style={{color:'black',marginLeft: 10,fontSize: 20,fontWeight:'bold' }} name="heart-outline"/></TouchableOpacity>
                                                                            <Text style={{color:'black',marginLeft: 10,fontWeight:'bold'}}>13 phản ứng</Text>
                                                                            <TouchableOpacity onPress={() => setIsVisibleOptionCmt(true)}><Icon style={{color:'black',marginLeft: 10,fontSize: 25,fontWeight:'bold' }} name="dots-horizontal"/></TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            }/>
                                                        </View>
                                                    </View>

                                                    :<TouchableOpacity onPress={() => setShowVisibility()}>
                                                        <View style={{flexDirection:'row'}}>
                                                            <Icon style={{color:'black',fontSize: 20}} name="arrow-right-bottom"/>
                                                            <Text style={{color:'black',marginLeft: 10}}>Xem {countReplyCmt} câu trả lời</Text>
                                                        </View>
                                                    </TouchableOpacity>         
                                                    } */}
                                                </View>
                                            </View>
                                        }/>
                                    </ScrollView>
                                    }
                                    
                                </View>
                            </View>

                            <View style={styles.bootomBs}>
                                <View style={styles.imgStyleBs}>
                                    {imgUserLogin == '' 
                                    ? <Image style={styles.imageUsBs} source={require('../../assets/image/imageUser1.png')}/> 
                                    : <Image style={styles.imageUsBs} source={{uri:imgUserLogin}}/> 
                                    }
                                </View>
                                <TouchableOpacity onPress={()=>setIsVisibleIpCmt(true)} style={styles.BottomCmt}>
                                    <View>
                                        <Text style={styles.txtCmtBs}>Thêm nhận xét</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>                                      
                        </ListItem.Content>
                    </ListItem>
                </BottomSheet>
                {/* BottomSheet phần tùy chọn nhận xét */}
                <TouchableWithoutFeedback onPress={() => setIsVisibleOptionCmt(false)}>
                    <BottomSheet modalProps={{}} isVisible={isVisibleOptionCmt}>
                        <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                            <ListItem.Content >
                                <View style={styles.header}>
                                    <View style={styles.Picon}><TouchableOpacity onPress={() => setIsVisibleOptionCmt(false)}><Icon style={styles.iconHeader} name="close-thick"/></TouchableOpacity></View>
                                </View>
                                <TouchableOpacity onPress={() => editComment()}><Text style={styles.txtBootom}>Chỉnh sửa</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteComment()}><Text style={styles.txtBootom}>Xóa</Text></TouchableOpacity>
                            </ListItem.Content>
                        </ListItem>
                    </BottomSheet>
                </TouchableWithoutFeedback>
                {/* BottomSheet phần thêm mới nhận xét */}
                <BottomSheet modalProps={{}} isVisible={isVisibleIpCmt}>
                    <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                        <ListItem.Content>
                            <View style={styles.Addheader}>
                                <View style={styles.PiconCmt}><TouchableOpacity onPress={() => setIsVisibleIpCmt(false)}><Icon style={styles.Addicon} name="close-thick"/></TouchableOpacity></View>
                                <View style={{alignSelf:'center'}}><Text style={styles.txtHeader}>Thêm nhận xét</Text></View>
                            </View>
                            <TextInput defaultValue={text} onChangeText={newText => setText(newText)} placeholder='Chia sẻ điều bạn thích về Ghim này, cách Ghim truyền cảm hứng cho bạn hoặc đơn giản là đưa ra lời khen' style={styles.txtIpCmt} multiline={true}/>
                            <View style={{flexDirection:'row-reverse',width:'100%'}}>
                                {text.length != 0 && text.length < 500 ? 
                                <TouchableOpacity onPress={()=> submitComment()}><Text style={{fontSize: 16,color:'#e40020',marginLeft: 20}}>Đăng</Text></TouchableOpacity>
                                : <Text style={{fontSize: 16,color:'gray',marginLeft: 20}}>Đăng</Text>}
                                <Text style={{fontSize: 16,color:'gray'}}>{text.length}/500</Text>
                            </View>
                        </ListItem.Content>
                    </ListItem>   
                </BottomSheet>
                {/* BottomSheet phần chỉnh sửa nhận xét */}               
                <BottomSheet modalProps={{}} isVisible={isVisibleEditIpCmt}>
                    <ListItem containerStyle={{ borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                        <ListItem.Content>
                            <View style={styles.Addheader}>
                                <View style={styles.PiconCmt}><TouchableOpacity onPress={() => setIsVisibleEditIpCmt(false)}><Icon style={styles.Addicon} name="close-thick"/></TouchableOpacity></View>
                                <View style={{alignSelf:'center'}}><Text style={styles.txtHeader}>Chỉnh sửa nhận xét</Text></View>
                            </View>
                            <TextInput defaultValue={textEdit} onChangeText={newText => setTextEdit(newText)} placeholder='Chia sẻ điều bạn thích về Ghim này, cách Ghim truyền cảm hứng cho bạn hoặc đơn giản là đưa ra lời khen' style={styles.txtIpCmt} multiline={true}/>
                            <View style={{flexDirection:'row-reverse',width:'100%'}}>
                                {textEdit.length != 0 && textEdit.length < 500 ? 
                                <TouchableOpacity onPress={()=>submitEditComment()}><Text style={{fontSize: 16,color:'#e40020',marginLeft: 20}}>Đăng</Text></TouchableOpacity>
                                : <Text style={{fontSize: 16,color:'gray',marginLeft: 20}}>Đăng</Text>}
                                <Text style={{fontSize: 16,color:'gray'}}>{textEdit.length}/500</Text>
                            </View>
                        </ListItem.Content>
                    </ListItem>   
                </BottomSheet>
            </View>
            {loading ? <LoadScreen/>: null}
        </>
    )
}

const width = Dimensions.get('window').width - 30;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
    },
    
    detail:{
        marginTop: '10%',
    },
    icon:{
        fontSize: 30,
        fontWeight:'bold',
        color:'#ffffff',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius: 50,
        backgroundColor:'black',
        left: '5%',
        position:'absolute',
        opacity: 0.7,
        top: 10,
        zIndex:1000
    },
    icon2:{
        fontSize: 30,
        fontWeight:'bold',
        color:'#ffffff',
        paddingVertical:20,
        right: 25,
        position:'absolute',
        zIndex:1000
    },
    image:{
        width: '100%',
        height: 500,
        overflow:'hidden',
        zIndex: -1000,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    useStyle:{
        backgroundColor: '#ffffff',
        paddingTop: '5%',
        paddingHorizontal: '5%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    imgStyle:{
        marginRight: '5%'
    },
    imageUs:{
        width: 50,
        height: 50,
        borderRadius:100,
    },
    name:{
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
    dess:{
        marginTop:'5%',
    },
    txtDess:{
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
    tools:{
        marginTop:'10%',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: '5%',
        width:'100%'
    },
    iconTool1:{
        fontSize: 30,
        fontWeight:'bold',
        color:'black',
        paddingVertical: 10,
    },
    iconTool2:{
        fontSize: 25,
        fontWeight:'bold',
        color:'black',
        paddingVertical: 10,
    },
    btnTool1:{
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor:'#e8e8e8',
        color:'black',
        fontSize: 15,
        borderRadius: 100,
    },
    btnTool2:{
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor:'#e30020',
        color:'#ffffff',
        fontSize: 15,
        borderRadius: 100,
    },
    related:{
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginVertical: 5
    },
    txtRelate:{
        alignItems:'center',
        marginVertical:'5%'
    },
    txt:{
        color: 'black',
        fontWeight:'bold',
        fontSize: 17
    },
    items:{
        marginBottom: 20,
        width: width / 2,
    },
    imageRle:{
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 20,
        overflow: "hidden",
        width: '100%',
        height: 300,
    },
    textContentRle:{
        marginTop: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal: 5  
    },
    contentRle:{
        fontSize: 12,
        color: 'black',
        width: '85%'
    },
    iconRle:{
        fontSize: 20,
        alignSelf:'flex-start',
        fontWeight: 'bold',
        color: 'black',
    },
    boxImage:{
        overflow:'hidden'
    },

    //BoottSheet style phần chia sẻ hình ảnh
    header:{
        alignItems:'center',
        width:'100%',
        flexDirection:'row',
        marginBottom: '5%'
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
    txtBootom:{
        marginLeft:'5%',
        fontSize: 20,
        fontWeight:'bold',
        marginBottom:'5%'
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

    //BoottSheet style phần coment
    headerBsCmt:{
        flexDirection:'row',
        justifyContent: 'space-between',
        width:'100%',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#e8e8e8'
    },
    headerL:{
        flexDirection: 'row'
    },
    iconBsCmt:{
        fontSize: 35,
        color:'black'
    },
    countCmt:{
        fontSize: 16,
        color:'black'
    },
    iconBsHeart:{
        fontSize: 20,
        color: '#e30020'
    },
    iconBsLike:{
        fontSize: 30,
        padding: 5,
        backgroundColor: '#e8e8e8',
        borderRadius: 50,
        marginLeft: 10
    },
    iconBsLikeActive:{
        fontSize: 30,
        padding: 5,
        backgroundColor: '#e30020',
        borderRadius: 50,
        marginLeft: 10,
        color:'#ffffff'
    },
    listComent:{
        width: '100%',
        height: 530
    },
    itemCmt:{
        flexDirection:'row',
        paddingBottom: 10,
        paddingTop: 10
    },
    bootomBs:{
        width: '100%',
        flexDirection: 'row',
        paddingTop: 15,
        borderTopWidth: 1,
        borderColor: '#e8e8e8'
    },
    BottomCmt:{
        paddingVertical: 10,
        paddingRight: '55%',
        paddingLeft: 10,
        alignSelf:'center',
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 30
    },
    txtCmtBs:{
        color: 'gray',
        fontSize: 16
    },
    imgStyleBs:{     
        marginRight: 10,
        alignSelf:'center'
    },
    imageUsBs:{
        width: 35,
        height: 35,
        borderRadius:50,
        backgroundColor:'#e8e8e8',
    },

    // style BottomSheet phần thêm text ip cmt
    Addheader:{
        alignItems:'center',
        width:'100%',
    },
    PiconCmt:{
        width:'100%',
        position:'absolute',
        top:'0%',
        marginRight: '0%'
    },
    Addicon:{
        fontSize: 25,
        color:'black',
    },
    txtHeaderCmt:{
        fontSize: 16,
        color:'black',
    },
    txtIpCmt:{
        marginTop: 20,
        fontSize: 16,
        marginBottom: 140,
        textAlign:'justify',
    }
})

export default DetailScreen;