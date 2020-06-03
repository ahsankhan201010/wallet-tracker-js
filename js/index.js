var auth = firebase.auth();
var firestore = firebase.firestore();

var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");

var singinFormSubmission =async (e) => {
  e.preventDefault();
  try {
    var email = document.querySelector(".signinEmail").value;
    var password = document.querySelector(".signinPassword").value;
    if(email && password) {
        //login user
        var {user: {uid}} = await auth.signInWithEmailAndPassword(email,password)
        //fetch user info
        var userInfo = await firestore.collection("users").doc(uid).get();
        console.log(userInfo.data())
        //redirect
        // "/dashboard.html#{uid}"
    }
  } catch (error) {
      console.log(error)
  }
};

var singupFormSubmission = async (e) => {
  e.preventDefault();
  try {
    var fullName = document.querySelector(".signupFullName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;
    if (fullName && email && password) {
        //create user in auth section
        var {user:{uid}} = await auth.createUserWithEmailAndPassword(email,password)
        console.log(uid)
        //store user data in firestore
        var userInfo = {
            fullName,
            email,
            createdAt: new Date()
        }
        console.log(userInfo)
        await firestore.collection("users").doc(uid).set(userInfo);
        console.log("done")
        //redirect to dashboard page
        // "/dashboard.html#{uid}"
    }
  } catch (error) {
    console.log(error);
  }
};

signinForm.addEventListener("submit", (e) => singinFormSubmission(e));
signupForm.addEventListener("submit", (e) => singupFormSubmission(e));
