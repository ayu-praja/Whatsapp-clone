import firebase from '../../firebase/config';

const signUpRequest = async(email,password)=>{
    try{
        return await firebase.auth().createUserWithEmailAndPassword(email,password)
    }
    catch(error){
        return error;
    }
}

export default signUpRequest;