var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h3");
//fetching uid from url
var uid = location.hash.substring(1, location.hash.length);
// console.log(data.createdAt.toDate().toISOString().split("T")[0])

var fetchUserInfo = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    var data = userInfo.data();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// fetchUserInfo(uid)

//auth listener
auth.onAuthStateChanged(async(user) => {
    if(user) {
        var {uid} = user;
        var userInfo = await fetchUserInfo(uid);
        //setting user info
        //name
        nameDiv.textContent = userInfo.fullName;
    } else {
        console.log("user logged out")
    }
})
