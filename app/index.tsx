import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@bg_color';

export default function App() {
    const [r, setR] = useState(255);
    const [g, setG] = useState(255);
    const [b, setB] = useState(255);

    useEffect(() => {
        loadColor();
    }, []);

    const loadColor = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                const parsed = JSON.parse(json);
                if (typeof parsed.r === 'number') setR(parsed.r);
                if (typeof parsed.g === 'number') setG(parsed.g);
                if (typeof parsed.b === 'number') setB(parsed.b);
            }
        } catch (e) {
            console.log('Error loading color', e);
        }
    };

    const saveColor = async (newR: number, newG: number, newB: number) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ r: newR, g: newG, b: newB }));
        } catch (e) {
            console.log('Error saving color', e);
        }
    };

    const bg = `rgb(${r},${g},${b})`;
    const hex = rgbToHex(r, g, b);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <View>
                <Text style={styles.text}>Current Color: {hex}</Text>
            </View>

            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={255}
                minimumTrackTintColor="#ff0000"
                maximumTrackTintColor="#000000"
                thumbTintColor="#ff0000"
                value={r}
                onValueChange={setR}
                onSlidingComplete={(val) => saveColor(val, g, b)}
            />

            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={255}
                minimumTrackTintColor="#00ff00"
                maximumTrackTintColor="#000000"
                thumbTintColor="#00ff00"
                value={g}
                onValueChange={setG}
                onSlidingComplete={(val) => saveColor(r, val, b)}
            />

            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={255}
                minimumTrackTintColor="#0000ff"
                maximumTrackTintColor="#000000"
                thumbTintColor="#0000ff"
                value={b}
                onValueChange={setB}
                onSlidingComplete={(val) => saveColor(r, g, val)}
            />
        </SafeAreaView>
    );
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number): string => Math.round(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
