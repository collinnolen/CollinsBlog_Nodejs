var post_id = "no-id";

$(document).ready(function() {

  $('.delete-blog-button').click(function(e){
    var deletionPrompt = $('#blog-deletion-prompt');
    post_id =  $(e.target).attr('data');

    deletionPrompt.fadeIn('medium', function(){
      $('#blog-deletion-prompt').removeClass('hidden');
    });
    //$('body').children(':not(div#blog-deletion-prompt)').fadeTo( "medium" , 0.5);
  });

  $('#cancel-btn').click(function(e){
    hide_option_box();
    //$('body').children().not($('#blog-deletion-prompt')).fadeTo( "medium" , 1);
    post_id = 'no-id'
  });



  $('#delete-btn').click(function(){
    if(post_id != 'no-id'){
      $.ajax({
      type: "DELETE",
      url: "/blogs/" + post_id,
      success: function(msg){
          hide_option_box();
          location.reload();
      }
    });
    }
  });


  function hide_option_box(){
    $('#blog-deletion-prompt').fadeOut("medium", function() {
      $('#blog-deletion-prompt').addClass('hidden');
    });
    //$('body').children(':not(div#dl-delete)').fadeTo( "medium" , 1, function() {
    //});
  }

});
