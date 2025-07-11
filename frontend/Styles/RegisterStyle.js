import { StyleSheet, TextInput } from 'react-native';


const styles = StyleSheet.create({
    container: { // Container de toda la pantalla
        flex: 2,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: { // Titulo de la pantalla
        fontSize: 25,
        fontWeight: '',
        marginBottom: 90,
        marginTop: -250,
        textAlign: 'center',
        fontFamily: 'PoppinsRegular',
    },
    dropdown: { // Estilo del dropdown
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
    dropdownText: { // Estilo del texto del dropdown
        fontSize: 13,
        color: '#6b6e6c',
        textAlign: 'left',
        paddingHorizontal: 10,
        fontWeight: 'normal',
        fontFamily: 'PoppinsRegular',
    },
    dropdownContainer: { // Estilo del contenedor del dropdown
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: '',
        marginTop: 10,
        zIndex: 100,
    },
    label: {  // Etiqueta/'titulo' del input
        fontSize: 14,
        color: 'gray',
        fontWeight: '',
        marginBottom: -5,
        marginTop: 8,
        fontFamily: 'PoppinsRegular',
    },
    input: { // Input de texto (cuadros de "documento" y "contraseña")
        height: 45,
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 20,
        borderRadius: 15,
        backgroundColor: 'white', 
        fontSize: 13,
        color: 'gray',
        fontFamily: 'PoppinsRegular',
    },
    inputContainer: { // Contenedor del input de contraseña y el icono
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingRight: -30,
        marginTop: 10,
        marginBottom: 5,
    },
    inputWithIcon: {
    flex: 1,
    fontSize: 13,
    color: 'gray',
    paddingHorizontal: 10,
    },
    eyeIcon: { // Estilo del icono de ojo
        fontSize: 20,
        color: 'gray',
        marginHorizontal: 10,
        paddingRight: 10,
        paddingLeft: 20,
    },
    button: { // Estilo del boton de "ingresar"
        backgroundColor: '#1fC16B',
        height: 40,
        width:130,
        borderRadius: 17,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
        marginTop: 70,
        marginBottom: -300,
        marginRight: 25,
        marginLeft: 25,
        alignSelf: 'center'
    },
    buttonText: { // Estilo del texto del boton de "ingresar"
        color: 'white',
        fontSize: 14.2,
        fontWeight: '',
        paddingHorizontal: 4,
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