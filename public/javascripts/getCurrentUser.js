(function getUser () {
	$.get('/userId', function(user) {
		console.log(user);
    var profilePath = '/users/' + user.id;
    $('.profile-link>a').attr('href', profilePath);
	});
})();
