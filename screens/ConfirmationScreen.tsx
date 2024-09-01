import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, BackHandler, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 用於存取本地存儲

const APP_URL = 'https://script.google.com/macros/s/AKfycbxyQQpJVY4af9fz1IwY-oeiq6dKDKzieDGy2Rzpy-iCCdiyBF2rGC_hER7ItgGRfFs47g/exec';

function ConfirmationScreen({ route, navigation }: { route: any; navigation: any }) {
    const { qrData, username } = route.params || {};
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => false;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            const loadUsername = async () => {
                const savedUsername = await AsyncStorage.getItem('username');
                if (savedUsername) {
                    setCurrentUsername(savedUsername);
                } else {
                    Alert.alert('錯誤', '未找到登入的用戶名，請重新登入');
                    navigation.navigate('Login');
                }
            };

            loadUsername();

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUsername || !username) {
                console.log('未找到用戶名，跳過 API 請求');
                return;
            }

            // 檢查 `username` 中是否包含當前帳號
            if (!username.includes(currentUsername)) {
                console.log('用戶名不匹配，跳過 API 請求');
                Alert.alert('錯誤', '當前登入帳號與掃描數據中的用戶名不匹配');
                navigation.navigate('Login');
                return;
            }

            try {
                console.log('開始發送 API 請求');
                const params = new URLSearchParams();
                params.append('action', 'scan');
                params.append('userId', qrData);
                params.append('username', username); // 確保包含用戶名

                console.log('API 請求參數:', params.toString());

                const response = await axios.post(APP_URL, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                console.log('API 回應資料:', response.data);
                const [namePermissionPart] = response.data.split("\n");
                setResult(namePermissionPart);

                if (!namePermissionPart.includes('工作證未註冊')) {
                    Speech.speak(namePermissionPart + ' 登記成功');
                } else {
                    Speech.speak(namePermissionPart);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('錯誤', '無法連接到伺服器');
                setResult('數據請求失敗');
            }
            setLoading(false);
        };

        fetchData();
    }, [qrData, username, currentUsername]);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>確認中...</Text>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.resultTitle}>掃描結果</Text>
                    <Text style={styles.resultText}>{result}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
                        <Text style={styles.buttonText}>返回掃描</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#F2F2F2',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 20,
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
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
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default ConfirmationScreen;
