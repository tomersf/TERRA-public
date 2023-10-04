import React from 'react';
import { StyleSheet, Button, TextInput, View, Text, FlatList } from 'react-native';
import { Formik } from 'formik';


export default function BookingForm() {

    return (

        <Formik
            initialValues={{ title: '', body: '', rating: '' }}
            onSubmit={(values) => { }}>

            <View >
                <View style={{ flexDirection: 'row'}}>
                    <View style={{ padding: 10}}>
                        <Button title="0800-0900" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="0900-1000" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <Button title="1000-1100" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="1100-1200" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <Button title="1200-1300" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="1300-1400" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <Button title="1400-1500" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="1500-1600" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <Button title="1600-1700" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="1700-1800" />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10 }}>
                        <Button title="1800-1900" />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button title="1900-2000" />
                    </View>
                </View>

            </View>


        </Formik>
    )
}