(function getPetCount() {
	$.get('/adoptions/count', function(count) {
		console.log(count);
      $('.create-link');
    
    // $('.profile-link>a').attr('href', profilePath);
		// $('.username').text(user.username);
	});
})();


//route = /adoption/count
