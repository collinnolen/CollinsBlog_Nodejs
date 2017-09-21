var post_id = "no-id";

$(document).ready(function() {

  //delete blog is pressed.
  $('.delete-blog-button').click(function(e){
    var deletionPrompt = $('#blog-deletion-prompt');
    post_id =  $(e.target).attr('data');

    deletionPrompt.fadeIn('medium', function(){
      $('#blog-deletion-prompt').removeClass('hidden');
    });
    //$('body').children(':not(div#blog-deletion-prompt)').fadeTo( "medium" , 0.5);
  });

  //cancels delete prompt.
  $('#cancel-btn').click(function(e){
    hide_option_box();
    //$('body').children().not($('#blog-deletion-prompt')).fadeTo( "medium" , 1);
    post_id = 'no-id'
  });

  //deletes after reprompt
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

  //
  $('.edit-blog-button').click(function(e){
    var $editPrompt = $('#blog-edit-prompt')
    post_id =  $(e.target).attr('data');

    if(post_id != 'no-id' && $editPrompt.hasClass('hidden')){
      $.ajax({
      type: "GET",
      url: "/blogs/" + post_id + "?json=true",
        success: function(data){
          var parsedData = JSON.parse(data);
          editBox(parsedData);
          $('#blog-edit-prompt').removeClass('hidden');
        }
      });
    }
  });

  //creates editbox
  function editBox(data){
    var $form = $("<form></form>");
    $form.attr({
      action: "/blogs/"+data.post_id,
      method: "put"
    });

    var $divTitle = $("<div></div>");
    $divTitle.attr({
      class: "form-group",
      id: "edit-title"
    });

    $("<label></label>").html("Title").appendTo($divTitle);

    $("<input>").attr({
      type:"text",
      class:"form-control",
      name: "title",
      value: data.post_title
    }).appendTo($divTitle);


    var $divBody = $("<div></div>");
    $divTitle.attr({
      class: "form-group",
      id: "edit-body"
    });

    $("<label></label>").html("Body").appendTo($divBody);

    $("<textarea></textarea>").attr({
      type:"text",
      class:"form-control",
      name:"body"
    }).html(data.post_body).appendTo($divBody);

    $form.append($divTitle);
    $form.append($divBody);

    $("<button></button>").attr({
      type:"submit",
      class:"btn btn-default",
      id: "edit-submit"
    }).html("Submit").appendTo($form);

    $('#blog-edit-prompt').append($form);
  }

  //hides prompt box.
  function hide_option_box(){
    $('#blog-deletion-prompt').fadeOut("medium", function() {
      $('#blog-deletion-prompt').addClass('hidden');
    });
    //$('body').children(':not(div#dl-delete)').fadeTo( "medium" , 1, function() {
    //});
  }

});
