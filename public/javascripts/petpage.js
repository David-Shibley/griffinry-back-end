$(document).ready(function () {
	var selectedPet;

	getUser().then(function (user) {
		renderUserData(user);
		var adoptionsApi = '/adoptions/list/' + user.id;
		$.get(adoptionsApi, function (data) {
			for (var i in data) {
				renderPetData(data[i]);
			}
		});
	});

	$('.pet-list').click(function (event) {
		selectedPet = selectPet(event.target);
	});

	$('.hamburger').click(function () {
		$('.user-dropdown').toggle('fast');
	});
});

function getUser () {
	return new Promise (function (resolve, reject) {
		$.get('/userId', function (user) {
			resolve(user);
		});
	});
}

function renderUserData(user) {
 var profilePath = '/users/' + user.id;
	$('.username').text(user.username);
	$('.profile-link>a').attr('href', profilePath);
}

function renderPetData (pet) {
	var $petList = $('.pet-list>ul');

	var listItem = document.createElement('li');
	var petImage = document.createElement('img');
	var petName = document.createElement('p');

	petImage.src = 'images/' + pet.Pet_Id.toLowerCase() + '_' + pet.Color.toLowerCase() + '_tn.png';
	listItem.id = pet.id;
	petName.innerText = pet.Name;

	listItem.appendChild(petImage);
	listItem.appendChild(petName);

	$petList.append(listItem);

}

function selectPet (target) {
	if (target.parentNode.className !== 'inactive') {
		if (target.parentNode.className !== 'active') {
			$('li').removeClass('active');
			$(target.parentNode).addClass('active');
			return target.parentNode.id;
		} else {
			return deselectPet();
		}
	}
}

function deselectPet () {
	$('li').removeClass('active');
	return false;
}
