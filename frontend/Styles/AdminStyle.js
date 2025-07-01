import { Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
        backgroundColor: '#fff',
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 180,
        marginBottom: 130,
        textAlign: 'center',
        fontFamily: 'PoppinsRegular',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'PoppinsRegular',
    },
    dropdown: {
        height: 45,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 4,
    },
    dropdownContainer: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'white',
        marginTop: 10,
        zIndex: 100,
    },
    dropdownText: {
        fontSize: 13,
        color: '#6b6e6c',
        textAlign: 'left',
        paddingHorizontal: 10,
        fontFamily: 'PoppinsRegular',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 30,
        width: '40%',
        alignSelf: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PoppinsRegular',
    },

    backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    },

});

export default styles;