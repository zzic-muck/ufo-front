import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const MoveImageOnPress = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handlePress = (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setPosition({ x: locationX, y: locationY });
    };

    return (
        <View style={styles.container} onStartShouldSetResponder={() => true} onResponderGrant={handlePress}>
            <Image
                source={{ uri: 'https://pbs.twimg.com/profile_images/1307493321086885890/imnSHVjO_400x400.jpg' }} // 이미지 주소 변경
                style={[styles.image, { top: position.y, left: position.x }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        position: 'absolute',
    },
});

export default MoveImageOnPress;
