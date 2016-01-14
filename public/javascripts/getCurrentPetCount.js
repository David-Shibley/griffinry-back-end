// $(document).ready(function(){

(function getPetCount() {
	$.get('/adoptions/count/', function(count) {
		console.log('count', count);
      var $createLink = $('.create-link');
			if(count >= 3){
				$createLink.hide();
			}
	});
})();

// });

//route = /adoption/count
