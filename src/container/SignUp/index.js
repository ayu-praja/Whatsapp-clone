import React, { useState, useContext } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "../../firebase/config";
import database from '@react-native-firebase/database';

import { InputField, RoundCornerButton, Logo } from "../../components";
import { globalStyle, color } from "../../utility";
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/action/types";
import { setAsyncStorage, keys } from "../../asyncStorage";
import auth from '@react-native-firebase/auth';

import {
  setUniqueValue,
  keyboardVerticalOffset,
} from "../../utility/constants";
import AddUser from "../../network/user";

export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [logo, toggleLogo] = useState(true);
  const { email, password, confirmPassword, name } = credential;

  const setInitialState = () => {
    setCredential({ email: "", password: "", confirmPassword: "" });
  };

  //   * ON SIGN UP PRESS
  
  const onSignUpPress = async() => {
    Keyboard.dismiss();
    if (!name) {
      alert("Name is required");
    } else if (!email) {
      alert("Email is required");
    } else if (!password) {
      alert("Password is required");
    } else if (password !== confirmPassword) {
      alert("Password did not match");
    } else {
    

  
     
      auth()
  .createUserWithEmailAndPassword(email, password)
  .then(() => {
    dispatchLoaderAction({
      type: LOADING_START,
    });
    console.log('User account created & signed in!');
    auth().onAuthStateChanged((user) => {
      if (user) {
        let uid=user.uid;
        let profileImg="";
        database()
         .ref('users/'+uid)
          .set({
            name:name,
            email:email,
            uuid:uid,
            profileImg:profileImg
          })
  
        .then(() => {
          setAsyncStorage(keys.uuid, uid);
          setUniqueValue(uid);
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          navigation.replace("Dashboard");
        })
        
      } 
    });
   
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      dispatchLoaderAction({
        type: LOADING_STOP,
      });
      console.log('That email address is invalid!');
    }

    dispatchLoaderAction({
      type: LOADING_STOP,
    });
    console.error(error);
  });
    }
  };
  // * HANDLE ON CHANGE
  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };
  // * ON INPUT FOCUS

  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };
  // * ON INPUT BLUR

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
          {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}

          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            <InputField
              placeholder="Enter name"
              value={name}
              onChangeText={(text) => handleOnChange("name", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter email"
              value={email}
              onChangeText={(text) => handleOnChange("email", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => handleOnChange("password", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(text) => handleOnChange("confirmPassword", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />

            <RoundCornerButton
              title="Sign Up"
              onPress={() => onSignUpPress()}
            />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: color.LIGHT_GREEN,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("Login");
              }}
            >
              Login
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};