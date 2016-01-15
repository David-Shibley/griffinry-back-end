$(document).ready(function () {
	var selectedPet;
	var selectedResource;

	getUser().then(function (user) {
		renderUserData(user);
		// get and render user's pets
		var adoptionsApi = '/adoptions/list/' + user.id;
		$.get(adoptionsApi, function (data) {
			for (var i in data) {
				renderPetList(data[i]);
			}

			selectedPet = data[0];
			selectPet(selectedPet);
			renderActivePet(selectedPet);

			//pet selection listener
			$('.pet-list').click(function (event) {
				for (var i in data) {
					var petId = event.target.parentNode.id.substr(0, event.target.parentNode.id.length - 3);
					if (petId == data[i].id) {
						selectedPet = data[i];
						selectPet(selectedPet);
						renderActivePet(selectedPet);
						break;
					}
				}
			});

			$('.feed-button').click(function() {
				if (!$('.feed-button').hasClass('disabled')) {
					selectedPet.Current_Health = Math.round(feedPet(selectedPet, selectedResource, user.id));
					renderActivePet(selectedPet);
				}
			});

		});
		//get and render user's resources
		var resourcesApi = '/resources/list/' + user.id;
		$.get(resourcesApi, function (data) {
			for (var i in data) {
				renderResourceList(data[i]);
			}

			//item selection listener
			$('.resource-list').click(function (event) {
				selectedResource = event.target.id;
				selectResource(selectedResource);
			});
		});
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

function renderPetList (pet) {
	var $petList = $('.pet-list>ul');

	var listItem = document.createElement('li');
	var petImage = document.createElement('img');
	var petName = document.createElement('p');

	petImage.src = 'images/' + pet.Pet_Id.toLowerCase() + '_' + pet.Color.toLowerCase() + '_tn.png';
	listItem.id = pet.id + 'pet';
	petName.innerText = pet.Name;

	listItem.appendChild(petImage);
	listItem.appendChild(petName);

	$petList.append(listItem);
}

function renderResourceList (resource) {
	var $resourceList = $('.resource-list');

	var newResource = document.createElement('li');
	newResource.innerHTML = '<span class="item-quantity">' + resource.Quantity + '</span> <img id="' + resource.Resource_Id + '" src="images/' + resource.Name.toLowerCase() + '.png" alt="' + resource.Rarity + '" class="' + resource.Rarity + '"> <span class="resource-name">' + resource.Name + '</span>';

	$resourceList.append(newResource);
}

function renderActivePet (pet) {
	var healthPercent = Math.round(pet.Current_Health / pet.Max_Health * 100) + '%';
	var energyPercent = Math.round(pet.Current_Energy / pet.Max_Energy * 100) + '%';

	$('#current-name').text(pet.Name);
	$('#current-species').text(pet.Color + ' ' + pet.Pet_Id);

	$('#current-health').css('width', healthPercent);
	$('#current-health').text(Math.round(pet.Current_Health) + '/' + Math.round(pet.Max_Health));

	$('#current-energy').css('width', energyPercent);
	$('#current-energy').text(Math.round(pet.Current_Energy) + '/' + Math.round(pet.Max_Energy));
	$('#current-pet')[0].src = 'images/' + pet.Pet_Id.toLowerCase() + '_' + pet.Color.toLowerCase() + '.png';
}

function selectPet (pet) {
	var petSelector = '#' + pet.id + 'pet';
	$('li').removeClass('active');
	$(petSelector).addClass('active');
	if (Math.round(pet.Current_Health) === Math.round(pet.Max_Health)) {
		$('.feed-button').addClass('disabled');
	} else {
		$('.feed-button').removeClass('disabled');
	}
}

function selectResource (resource) {
	var resourceSelector = '#' + resource;
	if ($(resourceSelector).hasClass('selected')) {
		$('img').removeClass('selected');
		$('.feed-button').css('display', 'none');
	} else {
		$('img').removeClass('selected');
		$(resourceSelector).addClass('selected');
		$('.feed-button').css('display', 'block');
	}
}

function feedPet (pet, resourceId, userId) {
	if (pet && resourceId && Math.round(pet.Current_Health) < Math.round(pet.Max_Health)) {
		var queryString = 'adoptions/feed/?userId=' + userId + '&adoptionId=' + pet.id + '&resourceId=' + resourceId;
		$.ajax({
			method: 'get',
			url: queryString
		}).done(function (results) {
			var listItemSelector = $('.selected')[0].parentElement;
			var quantitySelector = $(listItemSelector).children()[0];
			var itemQuantity = parseInt($(quantitySelector).text()) - 1;
			$(quantitySelector).text(itemQuantity);
			if (itemQuantity === 0) {
				listItemSelector.remove();
				$('.feed-button').css('display', 'none');
			}
			console.log(results);
			return results;
		});
	}
	return pet.Current_Health;
}
