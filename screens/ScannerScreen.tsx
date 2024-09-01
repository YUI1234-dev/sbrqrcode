import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function ScannerScreen({ navigation }: { navigation: any }) {
    const [qrData, setQrData] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const loadUsername = async () => {
                const savedUsername = await AsyncStorage.getItem('username');
                if (savedUsername) {
                    setUsername(savedUsername);
                }
            };

            const onBackPress = () => false; // 阻止默認的返回行為
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            loadUsername(); // 加載用戶名

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    const handleQRCodeSubmit = () => {
        if (!qrData) {
            Alert.alert('錯誤', '請輸入 QR Code 資料');
            return;
        }

        setLoading(true);
        console.log('模擬 API 請求發送');  // 日誌：開始模擬發送請求
        // 模擬 API 請求：直接導航到確認頁面並傳遞 QR Code 數據
        navigation.navigate('Confirmation', { qrData, username });
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>處理中...</Text>
            ) : (
                <>
                    <Text style={styles.title}>手動輸入 QR Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入 QR Code 資料"
                        value={qrData}
                        onChangeText={setQrData}
                    />
                    <Button title="提交" onPress={handleQRCodeSubmit} />
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
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: '80%',
        paddingHorizontal: 10,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default ScannerScreen;
