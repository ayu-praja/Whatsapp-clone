import firebase from '../../firebase/config';

export const AddUser = async(name,uid,profileImg,email)=>{
    try{
        return await 
        firebase.database()
            .ref('users/'+uid)
            .set({
                name:name,
                email:email,
                uuid:uid,
                profileImg:profileImg
            }).then((data)=>{
                console.log(data)
            })
            .catch(error=>
                {
                    console.log(error)
                })}
            
    
    catch(error){
        return error;
    }
}

