import { View, Text, Image } from 'react-native';

export default function Landing(){
    return(
        <View className='flex-1 justify-center items-center bg-[#121212]'>
            <Image source={require('../assets/logo-with-text.png')} />
        </View>
    )
}