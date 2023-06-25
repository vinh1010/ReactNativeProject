import React, {useEffect,useRef} from 'react';
import { Animated,View,StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

const LoadScreen = ()=>{
    const animationProgress = useRef(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(animationProgress.current, {
          toValue: 1,
          useNativeDriver: false
        }).start();
    }, [])

    return(
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
            <LottieView
                autoPlay
                loop
                progress={animationProgress.current}
                source={require('../../assets/v-3.json')}
            />
        </View> 
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        zIndex: 1,
        backgroundColor:'#ffffff'
    }
})

export default LoadScreen;