$(document).ready(function(){
  getPetCount();
});

function getPetCount() {
	$.get('/adoptions/count/', function(count) {
		console.log('count', count);
      var $createLink = $('.create-link');
			if(count >= 3){
				$createLink.hide();
			}
	});
}
