import React, { useContext, useState } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
("react-native-keyboard-aware-scroll-view");
import auth from '@react-native-firebase/auth';
import firebase from "../../firebase/config";
import { InputField, RoundCornerButton, Logo } from "../../components";
import { globalStyle, color } from "../../utility";
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/action/types";
import { setAsyncStorage, keys } from "../../asyncStorage";
import {
  setUniqueValue,
  keyboardVerticalOffset,
} from "../../utility/constants";


export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const [logo, toggleLogo] = useState(true);
  const { email, password } = credential;

  const setInitialState = () => {
    setCredential({ email: "", password: "" });
  };
  // * HANDLE ON CHANGE
  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };

  //   * ON LOGIN PRESS
  const onLoginPress = () => {
    Keyboard.dismiss();
    if (!email) {
      alert("Email is required");
    } else if (!password) {
      alert("Password is required");
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth().onAuthStateChanged((user) => {
          if (user) {
           // console.log(keys.uid);
            setAsyncStorage(keys.uuid, user.uid);
          setUniqueValue(user.uid);
          }
        });
        
        console.log('signed in!');
        dispatchLoaderAction({
          type: LOADING_STOP,
        });
        navigation.replace("Dashboard");
      })
      .catch(error => {
        
    
        console.error(error);
      });
    }
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
        <SafeAreaView
          style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
        >
          {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )}
          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            <InputField
              placeholder="Enter email"
              value={email}
              onChangeText={(text) => handleOnChange("email", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter password"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => handleOnChange("password", text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />

            <RoundCornerButton title="Login" onPress={() => onLoginPress()} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: color.LIGHT_GREEN,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate("SignUp");
              }}
            >
              Sign Up
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};