import Firebase from 'firebase';

const fireBaseConfig = {
    apiKey:'AIzaSyBhGj4YITU7TtlBckPZxqneAzgR0NNFY2Y',
    databaseUrl:'https://chat-af146.firebaseio.com/',
    projectId:'chat-af146',
    appId:'1:318425828948:android:c93ba2f063f90fa5f327c1'
};

export default Firebase.initializeApp(fireBaseConfig);