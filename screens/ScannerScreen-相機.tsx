import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // 使用 expo-camera 的 CameraView 和 useCameraPermissions
import { Audio } from 'expo-av'; // 引入音效播放模塊
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // 用於在頁面獲得焦點時進行操作

function ScannerScreen({ navigation }: { navigation: any }) {
    const [permission, requestPermission] = useCameraPermissions(); // 使用權限掛鉤
    const [scanned, setScanned] = useState(false); // 追蹤 QR Code 是否已掃描
    const [username, setUsername] = useState(''); // 用於保存當前登入的管制人員名稱

    useFocusEffect(
        React.useCallback(() => {
            const loadUsername = async () => {
                const savedUsername = await AsyncStorage.getItem('username');
                if (savedUsername) {
                    setUsername(savedUsername);
                }
            };

            setScanned(false); // 每次進入掃描頁面時重置掃描狀態
            loadUsername(); // 每次頁面獲得焦點時加載用戶名
        }, [])
    );

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        setScanned(true); // 設置已掃描標誌

        // 播放掃描音效
        const { sound } = await Audio.Sound.createAsync(require('../assets/beep.mp3'));
        await sound.playAsync();

        // 將掃描的數據和當前的用戶名傳遞給確認頁面進行處理
        navigation.navigate('Confirmation', { qrData: data, username });
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>請授權使用相機</Text>
                <Button onPress={requestPermission} title="授權" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back" // 使用後置相機
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // 設置條碼掃描處理器
            />
            {/* 在相機預覽上顯示提示文字或浮水印 */}
            <View style={styles.overlay}>
                <Text style={styles.overlayText}>請對準工作證 QR Code 進行掃描</Text>
            </View>
            {/* 添加掃描框 */}
            <View style={styles.scanBox}>
                {/* 可以在這裡添加更多視覺效果，例如邊框、陰影等 */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2', // 淡灰色背景
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    permissionText: {
        fontSize: 18,
        color: '#333', // 深灰色文字
        textAlign: 'center',
        marginBottom: 20,
    },
    overlay: {
        position: 'absolute',
        bottom: 50, // 可以調整這個值來改變文字的位置
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
        padding: 10,
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600', // 更粗的字體以提高可讀性
    },
    scanBox: {
        position: 'absolute',
        top: '30%', // 調整這些值以改變掃描框的位置
        left: '15%',
        width: '70%', // 掃描框的寬度
        height: '30%', // 掃描框的高度
        borderWidth: 2, // 邊框的寬度
        borderColor: '#00FF00', // 使用鮮明的綠色
        borderRadius: 8, // 邊框的圓角半徑
        shadowColor: '#000', // 陰影顏色
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});

export default ScannerScreen;
