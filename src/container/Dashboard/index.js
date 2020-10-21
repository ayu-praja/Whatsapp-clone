import React, {useContext, useEffect, useLayoutEffect, useState } from 'react';
import {View,Text, Alert,FlatList} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import firebase from "../../firebase/config";
import { LOADING_STOP, LOADING_START } from "../../context/action/types";
import {clearAsyncStorage,setAsyncStorage,getAsyncStorage} from '../../asyncStorage'
import auth from '@react-native-firebase/auth';
import {color} from '../../utility';
import { uuid, smallDeviceHeight } from "../../utility/constants";
import { deviceHeight } from "../../utility/styleHelper/appStyle";
import database from '@react-native-firebase/database';
import { Store } from "../../context/store";
import {Profile,ShowUsers} from '../../components';
import ImagePicker from 'react-native-image-picker';
import StickyHeader from '../../components/stickyHeader';

const Dashboard=({navigation})=>{
    const globalState=useContext(Store);
    const {dispatchLoaderAction}=globalState;


    const [userDetail,setUserDetail] = useState({
        id:'',
        name:'',
        profileImg:''
    });

    const [allUsers,setAllUsers] = useState([]);
    const {name,profileImg}=userDetail;
    const [getScrollPosition,setScrollPosition] = useState(0);

    const imgTap = (profileImg, name) => {
      if (!profileImg) {
        navigation.navigate("ShowFullImg", {
          name,
          imgText: name.charAt(0),
        });
      } else {
        navigation.navigate("ShowFullImg", { name, img: profileImg });
      }
    };


    const selectPhotoTapped = () => {
        const options = {
          storageOptions: {
            skipBackup: true,
          },
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log("Response = ", response);
    
          if (response.didCancel) {
            console.log("User cancelled photo picker");
          } else if (response.error) {
            console.log("ImagePicker Error: ", response.error);
          } else if (response.customButton) {
            console.log("User tapped custom button: ", response.customButton);
          } else {
            // Base 64 image:
            let source = "data:image/jpeg;base64," + response.data;
            dispatchLoaderAction({
              type: LOADING_START,
            });
            database()
            .ref('users/'+uuid)
            .update({
                profileImg:source
            })
              .then(() => {
                setUserDetail({
                  ...userDetail,
                  profileImg: source,
                });
                dispatchLoaderAction({
                  type: LOADING_STOP,
                });
              })
              .catch(() => {
                alert(err);
                dispatchLoaderAction({
                  type: LOADING_STOP,
                });
              });
          }
        });
      };


      

    useEffect(()=>{
      
        try {
            database()
            .ref('users')
            .on('value',(dataSnapShot)=>{
                let users = [];
                let currentUser = {
                    id:'',
                    name:'',
                    profileImg:''
                }
                dataSnapShot.forEach((child)=>{
                    if(uuid === child.val().uuid) {
                        currentUser.id = uuid;
                        currentUser.name = child.val().name;
                        currentUser.profileImg=child.val().profileImg
                    }
                    else{
                        users.push({
                            id:child.val().uuid,
                            name:child.val().name,
                            profileImg:child.val().profileImg
                        })
                    }
                })
                setUserDetail(currentUser)
                setAllUsers(users);
                console.log(users)
                console.log(currentUser)
                dispatchLoaderAction({
                    type:LOADING_STOP
                });


            })
        }
        catch(error){
            dispatchLoaderAction({
                type:LOADING_STOP
            });
            alert(error);
        }
    },[]);

    
    useLayoutEffect(()=> {
        navigation.setOptions({
            headerRight:()=> (
                <SimpleLineIcon 
                    name='logout'
                    size={26} 
                    color='white'
                    onPress={()=>Alert.alert(
                        'Logout',
                        'Are you sure to logout',
                        [
                            {
                                text:'Yes',
                                onPress:()=>{
                                    auth()
                                        .signOut()
                                        .then(() =>clearAsyncStorage()
                                        .then(()=>{
                                            navigation.replace('Login')
                                        }) );
                                },
                            },
                            {
                                text:'No'
                            }
                    ],{
                        cancelable:false
                    }
                    
                    
                    )}
                     />
            )
        })
    }


    )

    const nameTap = (profileImg, name, guestUserId) => {
      if (!profileImg) {
        navigation.navigate("Chat", {
          name,
          imgText: name.charAt(0),
          guestUserId,
          currentUserId: uuid,
        });
      } else {
        navigation.navigate("Chat", {
          name,
          img: profileImg,
          guestUserId,
          currentUserId: uuid,
        });
      }
    };

    const getOpacity = () => {
      if(deviceHeight < smallDeviceHeight) {
        return deviceHeight / 4;
      } else {
        return deviceHeight / 6;
      }
      
    }
    return (
        <View style={{ flex: 1, backgroundColor: color.BLACK }}>
        {
            getScrollPosition > getOpacity() && (
              <StickyHeader
              name={name}
              img={profileImg}
              onImgTap={() => imgTap(profileImg, name)}
              />
            )
        }
            <FlatList
        alwaysBounceVertical={false}
        data={allUsers}
        keyExtractor={(_, index) => index.toString()}
        onScroll={(event) =>
          setScrollPosition(event.nativeEvent.contentOffset.y)
        }
        ListHeaderComponent={
          <View
            style={{
              opacity:getScrollPosition < getOpacity() ? (getOpacity()-getScrollPosition)/10:0
            }}
          >
         <Profile 
         img={profileImg}
          name={name}
          onEditImgTap={() => selectPhotoTapped()}
          onImgTap={() => imgTap(profileImg, name)}
           />
            </View>
        }
        renderItem={({ item }) => (
          <ShowUsers
            name={item.name}
            img={item.profileImg}
            onImgTap={() => imgTap(item.profileImg, item.name)}
            onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
          />
        )}
      />
        </View>
    )
}

export default Dashboard;