console.log("working")
// Get references to page elements
var usernameInput = $("#name");
// var emailInput = $("#email");
var pswInput = $("#psw");
// var pswRepeatInput = $("#psw-repeat");
var signupBtn = $("#signupbtn");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveUser: function(newUser) {
    return $.ajax({
      type: "POST",
      url: "api/user/create",
      data: newUser
    });
  },
  // getUsers: function() {
  //   return $.ajax({
  //     url: "api/user",
  //     type: "GET"
  //   });
  // },
  // deleteUser: function(id) {
  //   return $.ajax({
  //     url: "api/user/" + id,
  //     type: "DELETE"
  //   });
  // }
};

// refreshExamples gets new examples from the db and repopulates the list
// function refreshUsers() {
//   API.getUsers().then(function(data) {
//     var users = data.map(function(user) {
//       var $a = $("<a>")
//         .text(user.name)
//         .attr("href", "/user/" + user.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": user.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     userList.empty();
//     userList.append(users);
//   });
// };

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
function handleFormSubmit(event) {
  event.preventDefault();

  var newUser = {
    username: usernameInput.val().trim(),
    // email: emailInput.val().trim(),
    password: pswInput.val().trim(),
    // pswRepeat: pswRepeatInput.val().trim()
  };
console.log(newUser)
  // if (!(newUser.name && newUser.email && newUser.password && newUser.pswRepeat)) {
  //   alert("You must complete all fields!");
  //   return;
  // }

  API.saveUser(newUser)
  // .then(function() {
  //   refreshUsers();
  // });

  usernameInput.val("");
  // emailInput.val("");
  pswInput.val("");
  // pswRepeatInput.val("");
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
// $exampleList.on("click", ".delete", handleDeleteBtnClick);
