import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler, Alert } from 'react-native'; // 引入 BackHandler 和 Alert 模組
import LoginScreen from './screens/LoginScreen';
import ScannerScreen from './screens/ScannerScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        // 設定硬件返回按鈕的事件監聽器
        const backAction = () => {
            Alert.alert('退出應用', '你確定要退出應用嗎？', [
                {
                    text: '取消',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: '確定', onPress: () => BackHandler.exitApp() }, // 確認退出
            ]);
            return true; // 阻止默認的返回行為
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // 清除監聽器
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} // 隱藏標題
                />
                <Stack.Screen 
                    name="Scanner" 
                    component={ScannerScreen} 
                    options={{ headerShown: false }} // 隱藏標題
                />
                <Stack.Screen 
                    name="Confirmation" 
                    component={ConfirmationScreen} 
                    options={{ headerShown: false }} // 隱藏標題
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
