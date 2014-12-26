var CHATS = [];

var temp = 
  '<li class="row msg">'+
    '<div class="col-sm-2">'+
      '<div class="username"></div>'+
      '<img class="avatar-pic" >'+
    '</div>'+
    '<div class="col-sm-6">'+
      '<p></p>'+
      '<i></i>'+
    '</div>'+
  '</li>';

var scrollBottom = function(){
  $('#chat-messages').prop({ scrollTop: $('#chat-messages').prop("scrollHeight") });
  return false;
}

var getMsg = function(message){
  var body = $('body');
  var chats = $('.chat-message-list');

  chats.empty();

  message.forEach(function(chat){
    var chatHTML = $(temp);
    console.log(chatHTML);
    chatHTML.find('.username').text(chat.user.username);
    chatHTML.find('.avatar-pic').attr('src', chat.user.avatar);
    chatHTML.find('p').text(chat.message);
    chats.append(chatHTML);
  })
  scrollBottom();  
};

var postMsg = function(data){
  getMsg([data]);
};

var url = "https://protected-harbor-3198.herokuapp.com/api"




var getChats = function(){
$.ajax({
    type: "GET",
    url: url+ "/chats",
    success: function(chats){
      if(!CHATS.length){
        CHATS = chats;  
      } else {
        if(CHATS.length === chats.length){
          return;
        }
      }
      getMsg(chats);
    },
    error: function(err){
      console.error(err);
    }
  })
};

var keepGettingChats = function(){
  return setInterval(function(){
    getChats();
  }, 1000)
};


var user = function(){
  return localStorage.getItem('username');
};

$(document).ready(function(){
  if(user()){
    $('#addUser').remove();
    $('#avatar').remove();
    $('.username').remove();
    var personal = JSON.parse(user());
    $('.welcome').prepend($('<h1></h1>').append('Welcome ' + personal.username + '!'));
  }
  getChats();
  keepGettingChats();
  $(".button").on('submit', function(){
    if(user()) {
      var person = JSON.parse(user());
      $('#addUser').remove();
      $('#avatar-input').remove();
      $('#username-input').remove();
      $.ajax({
        type: "POST",
        url: url + '/chats',
        data: {
          message: $('.input').val(),
          user: person.id
        },
        success: postMsg,
        error: function(err){
          console.error(err);
        }
      })
    }
    $('.input').val('');
  });

  $('#addUser').on('click', function() {
    $.ajax({
      type: "POST",
      url: url + '/users',
      data: {
        username: $('#username-input').val(),
        avatar: $('#avatar-input').val()
      },
      success: function(data){
        var storage = {
          username: data.username,
          avatar: data.avatar,
          id: data._id
        }
        localStorage.setItem('username', JSON.stringify(storage));
        $('.welcome').prepend($('<h1></h1>').append('Welcome ' + data.username + '!'));

      },
      error: function(err) {
        console.log(err);
        usernameTaken();
      }
    })
  });
});