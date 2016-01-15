$(document).ready(function() {
  $('.signup-form').submit(function(event){
    var password = $('#password').val();
    if (password.length < 8) {
      event.preventDefault();
      $('.password-error').text('Your password must be at least 8 characters');
    }
  });
});
