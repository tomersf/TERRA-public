import React from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

const RentalsScreenModal = (props) => {
    return (
        <View style={props.style}>
            <Modal visible={props.modalStatus} transparent={true} >
                <ImageBackground source={{ uri: props.assetImg }} style={styles.img} borderRadius={10} >
                    <View style={styles.textContainer} borderRadius={10}>
                        <Text style={styles.text}>{props.date}</Text>
                        <Text style={styles.text}>{props.hours}</Text>
                        <Text style={styles.text}>{props.description}</Text>
                        <Text style={styles.text}>{props.price}</Text>
                        <Pressable onPress={props.onWaze}>
                            <View style={{flexDirection: 'row', alignSelf:'center', left:10}}>
                                <Text style={{ textAlign: 'center', fontSize: 17, color: '#fffacd' }}>{props.address}</Text>
                                <Ionicons name="navigate-outline" color={Colors.accent} onPress={() => { }} />
                            </View>
                        </Pressable>
                    </View>
                    <View style={styles.addressContainer}>
                        <View style={styles.address}>
                            <TouchableOpacity onPress={props.onClose} >
                                <View style={styles.button} borderRadius={10}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    img: { 
        overflow: 'hidden', 
        width: "90%", 
        height: "60%", 
        marginTop: "50%", 
         
        position: 'relative', 
        left: 37 
    },
    textContainer: { 
        marginTop: "6%", 
        width: "80%", 
        padding: 8, 
        backgroundColor: 'rgba(40, 32, 46, 0.3)', 
        alignSelf: 'center', 
        position: 'relative', 
        right: 19
    },
    text: {
        textAlign: 'center', 
        fontSize: 17, 
        color: 'white' 
    },
    addressContainer: {
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    address: {
        position: 'relative', 
        marginTop: "4%", 
        right: 34
    },
    button: {
        backgroundColor: "rgba(40, 32, 46, 0.7)", 
        width: "160%",
    },
    buttonText: {
        color: "white", 
        padding: 10, 
        textAlign: 'center'
    }

});



export default RentalsScreenModal;