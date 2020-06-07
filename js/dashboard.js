var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h3");
var signoutBtn = document.querySelector(".signoutBtn");
var transactionList = document.querySelector(".transactionList");
//fetching uid from url
var uid = null;
// console.log(data.createdAt.toDate().toISOString().split("T")[0])

var transactionForm = document.querySelector(".transactionForm");

var renderTransactions = (transactionArr) => {
  transactionList.innerHTML = ""
  transactionArr.forEach((transaction, index) => {
    var { title, cost, transactionAt, transactionId } = transaction;
    transactionList.insertAdjacentHTML(
      "beforeend",
      ` <div class="transactionListItem">
    <div class="renderIndex listItem">
      <h3>${++index}</h3>
    </div>
    <div class="renderTitle listItem">
      <h3>${title}</h3>
    </div>
    <div class="renderCost listItem">
      <h3>${cost}</h3>
    </div>
    <div class="renderTransactionAt listItem">
      <h3>${transactionAt.toDate().toISOString().split("T")[0]}</h3>
    </div>
    <div class="renderTransactionAt listItem">
      <a href="./transaction.html#${transactionId}"><button type="button">view</button></a>
    </div>
  </div>`
    );
  });
};

var userSignout = async () => {
  await auth.signOut();
};

var fetchUserInfo = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    var data = userInfo.data();
    return data;
  } catch (error) {
    console.log(error);
  }
};

var transacionFormSubmission = async (e) => {
  e.preventDefault();
  try {
    var title = document.querySelector(".title").value;
    var cost = document.querySelector(".cost").value;
    var transactionType = document.querySelector(".transactionType").value;
    var transactionAt = document.querySelector(".transactionAt").value;
    if (title && cost && transactionType && transactionAt) {
      var transactionObj = {
        title,
        cost,
        transactionType,
        transactionAt: new Date(transactionAt),
        transactionBy: uid,
      };
      await firestore.collection("transactions").add(transactionObj);
      //render fresh transactions
      //fetch users transactions
      var transactions = await fetchTransactions(uid);
      //render process
      renderTransactions(transactions);
    }
  } catch (error) {
    console.log(error);
  }
};

var fetchTransactions = async (uid) => {
  var transactions = [];
  var query = await firestore
    .collection("transactions")
    .where("transactionBy", "==", uid)
    .orderBy("transactionAt","desc")
    .get();
  query.forEach((doc) => {
    transactions.push({ ...doc.data(), transactionId: doc.id });
  });
  return transactions;
};
// fetchUserInfo(uid)

signoutBtn.addEventListener("click", userSignout);

transactionForm.addEventListener("submit", (e) => transacionFormSubmission(e));

//auth listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    uid = user.uid;
    var userInfo = await fetchUserInfo(uid);
    //setting user info
    nameDiv.textContent = userInfo.fullName;
    //render transactions
    //fetch users transactions
    var transactions = await fetchTransactions(uid);
    //render process
    // console.log(transactions)
    renderTransactions(transactions);
  } else {
    location.assign("./index.html");
  }
});
