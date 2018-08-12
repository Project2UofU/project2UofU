console.log("working")
// Get references to page elements

// Signup elements
var usernameInput = $("#name");
var pswInput = $("#psw");
var signupBtn = $("#signupbtn");
// Login elements
var unameLogin = $("#uname");
var upswLogin = $("#upsw");
var loginBtn = $("#loginbtn");

// The API object contains methods for each kind of request we'll make
var API = {
  // Create new user
  saveUser: function(newUser) {
    return $.ajax({
      type: "POST",
      url: "api/user/create",
      data: newUser
    });
  },
  // Login with already created user
  getUser: function(user) {
    return $.ajax({
      url: "api/user/login",
      type: "GET",
      data: user,
      success: function(data, textStatus) {
        if (data.message) {
          window.location.href = "/user/competitions"
        }
      }
    });
  },
  // deleteUser: function(id) {
  //   return $.ajax({
  //     url: "api/user/" + id,
  //     type: "DELETE"
  //   });
  // }
};

// Login function...
function handleLogin(event) {
  event.preventDefault();

  var user = {
    username: unameLogin.val().trim(),
    password: upswLogin.val().trim(),
  };

  API.getUser(user);  

  unameLogin.val("");
  upswLogin.val("");
};


// Signup function...
function handleFormSubmit(event) {
  event.preventDefault();

  var newUser = {
    username: usernameInput.val().trim(),
    password: pswInput.val().trim(),
  };
console.log(newUser)
  
  API.saveUser(newUser)
  
  usernameInput.val("");
  pswInput.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
// function handleDeleteBtnClick() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// Add event listeners to the submit and delete buttons
signupBtn.on("click", handleFormSubmit);
loginBtn.on("click", handleLogin)
// $exampleList.on("click", ".delete", handleDeleteBtnClick);
