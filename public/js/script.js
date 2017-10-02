var post_id = "no-id";

$(document).ready(function() {

  //Makes post featured
  $('.make-featured-button').click(function(e){
    var id = $(e.target).attr('data');
    $.ajax({
    type: "PUT",
    url: "/blogs/" + id + '?featured=true',
      success: function(data){
        console.log('success');
      },
      error: function(){
        console.log('failed');
      },
    }).done(function(){
      window.location.reload();
      post_id='no-id';
    });
  });

  //delete comment button
  $('.delete-comment-button').click(function(e){
    let ids = ($(e.target).attr('data')).split(',');
    let comment_id = ids[0];
    let post_id = ids[1];

    $.ajax({
      type: "DELETE",
      url: "/comments/" + comment_id + '?postid=' + post_id,
      success: function(data){
        console.log('success');
      },
      error: function(err){
        console.log('error');
      },
    }).done(function(){
      window.location.reload();
    })
  });

  //edit comment button
  $('.edit-comment-button').click(function(e){

  });

  //delete blog is pressed.
  $('.delete-blog-button').click(function(e){
    var deletionPrompt = $('#blog-deletion-prompt');
    post_id =  $(e.target).attr('data');
    show_box(deletionPrompt);
  });

  //cancels delete prompt.
  $('#cancel-btn').click(function(e){
    hide_box('#blog-deletion-prompt');
    post_id = 'no-id'
  });

  //deletes after reprompt
  $('#delete-btn').click(function(){
    if(post_id != 'no-id'){
      $.ajax({
      type: "DELETE",
      url: "/blogs/" + post_id,
      success: function(msg){
          hide_box("#blog-deletion-prompt");
          location.reload();
      }
    });
    }
  });

  //
  $('.edit-blog-button').click(function(e){
    console.log('here');
    var $editPrompt = $('#blog-edit-prompt')
    post_id =  $(e.target).attr('data');
    if(post_id != 'no-id' && $editPrompt.hasClass('hidden')){
      $.ajax({
      type: "GET",
      url: "/blogs/" + post_id + "?json=true",
        success: function(data){
          var parsedData = JSON.parse(data);
          buildEditBox(parsedData);
          show_box('#blog-edit-prompt');
        }
      });
    }
    else{
      console.log("error");
    }
  });

  //
  $('#blog-edit-submit').click(function(e){
    var $title = $('#title-edit').val();
    var $body = $('#body-edit').val();

    $.ajax({
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({title:$title, body:$body}),
    url: "/blogs/" + post_id,
      success: function(data){
        console.log('success');
      },
      error: function(){
        console.log('failed');
      },
    }).done(function(){
      hide_box('#blog-edit-prompt');
      $('#edit-box-container').remove();
      window.location.reload();
      post_id='no-id';
    });
  });

  //creates editbox
  function buildEditBox(data){
    var $container = $("<div></div>").attr({id: 'edit-box-container'});

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
      id: "title-edit",
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
      name:"body",
      id: "body-edit"
    }).html(data.post_body).appendTo($divBody);

    $container.prepend($divBody);
    $container.prepend($divTitle);


    $('#blog-edit-prompt').append($container);
  }

  //hides prompt box.
  function hide_box(elementToHide){
    $(elementToHide).fadeOut("medium", function() {
      $(elementToHide).addClass('hidden');
    });
  }

  function show_box(elementToShow){
    $(elementToShow).fadeIn("medium", function() {
      $(elementToShow).removeClass('hidden');
    });
  }

});
