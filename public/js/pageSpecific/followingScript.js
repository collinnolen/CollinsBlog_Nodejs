
$(document).ready(function() {

  $('.unfollow-user').click(function(e){
    //username to unfollow
    let username = $(e.target).attr('data');
    console.log(username);
    $.ajax({
      type: 'DELETE',
      url: "/users/follow/" + username,
      success: function(msg){
        console.log(msg);
      },
      error: function(error){
        console.log(error);
      }
    }).done(function(){
      window.location.reload();
    }).catch(function(error){
      console.log(error);
    });
  });
});
