import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_URL = 'https://script.google.com/macros/s/AKfycbxyQQpJVY4af9fz1IwY-oeiq6dKDKzieDGy2Rzpy-iCCdiyBF2rGC_hER7ItgGRfFs47g/exec'; // 替換為您的 Google Apps Script 網址

function LoginScreen({ navigation }: { navigation: any }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // 加入加載狀態

    const handleLogin = async () => {
        setLoading(true); // 設置加載狀態為真，顯示加載指示器
        console.log('開始登入 API 請求'); // 日誌：開始登入請求
        try {
            const params = new URLSearchParams();
            params.append('action', 'login');
            params.append('username', username);
            params.append('password', password);

            console.log('登入 API 請求參數:', params.toString()); // 日誌：顯示登入請求參數

            const response = await axios.post(APP_URL, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            console.log('登入 API 回應資料:', response.data); // 日誌：顯示 API 回應資料

            if (response.data.startsWith('登入成功')) {
                await AsyncStorage.setItem('username', username); // 保存用戶名
                navigation.navigate('Scanner', { username });
            } else {
                Alert.alert('登入失敗', '請檢查帳號和密碼');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('錯誤', '無法連接到伺服器');
        } finally {
            setLoading(false); // 請求完成後重置加載狀態
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <>
                    {/* iOS 標準藍色 */}
                    <ActivityIndicator size="large" color="#007AFF" />
                </>
            ) : (
                <>
                    <Text style={styles.title}>SBR門禁管制系統</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="帳號"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="密碼"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>登入</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F2F2F2', // iOS風格背景
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#C0C0C0', // iOS 淡灰色邊框
        borderWidth: 1,
        borderRadius: 8, // 圓角
        marginBottom: 20,
        width: '80%',
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF', // 白色背景
    },
    button: {
        backgroundColor: '#007AFF', // iOS 標準藍色
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default LoginScreen;
