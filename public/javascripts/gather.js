$(document).ready(function () {
	var selectedPet;

	getUser().then(function (userId) {
		var adoptionsApi = '/adoptions/list/' + userId;
		$.get(adoptionsApi, function (data) {
			for (var i in data) {
				renderPetData(data[i]);
			}
		});
		$('.gather-sites').click(function (event) {
			selectedPet = selectGatherLocation(event.target.alt, selectedPet, userId);
		});	
	});

	$(document).click(function (event) {
		$('.info-window').css('display', 'none');
	});

	$('.pet-list').click(function (event) {
		selectedPet = selectPet(event.target);
	});

});

function getUser () {
	return new Promise (function (resolve, reject) {
		$.get('/userId', function (user) {
			resolve(user);
		});
	});
}

function renderPetData (pet) {
	var $petList = $('.pet-list>ul');

	var listItem = document.createElement('li');
	var petImage = document.createElement('img');
	var petStats = document.createElement('ul');
	var petName = document.createElement('li');
	var petEnergy = document.createElement('li');

	petImage.src = 'images/' + pet.Pet_Id.toLowerCase() + '_' + pet.Color.toLowerCase() + '.png';
	listItem.id = pet.id; 
	petName.innerHTML = '<span class="pet-name">' + pet.Name + '</span>';
	petEnergy.innerHTML = '<span class="pet-energy">' + pet.Current_Energy + '/' + pet.Max_Energy + '</span>';

	listItem.appendChild(petImage);
	listItem.appendChild(petStats);
	petStats.appendChild(petName);
	petStats.appendChild(petEnergy);

	$petList.append(listItem);

	updatePetEnergy(pet.id);
}

function updatePetEnergy (petId, modifier) {
	var energyElement = '#' + petId + ' .pet-energy';
	var energy = $(energyElement).text().split('/');
	if (modifier) {
		energy[0] = parseInt(energy[0]) - modifier;
		energy = energy[0] + '/' + energy[1];
		$(energyElement).text(energy);
	}
	if (energy[0] === '0') {
		setInactive(petId);
		$(energyElement).addClass('empty');
	}
}

function setInactive (petId) {
	var petElement = '#' + petId;
	$(petElement).removeClass('active');
	$(petElement).addClass('inactive');
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

function selectGatherLocation (location, selectedPet, userId) {
	var searchLocation;
	if (location === "Forest") {
		searchLocation = 1;
	}
	if (selectedPet) {
		$.ajax({
			method: 'get',
			url: '/resources/gather',
			data: {
				userId: userId,
				adoptionId: selectedPet,
				locationId: searchLocation
			}
		}).done(function (results) {
			renderGatherResults(results.resource);
			deselectPet();
			updatePetEnergy(selectedPet, 1);
			return false;
		});
	}
}

function renderGatherResults (results) {
	$('.info-window').css('display', 'block');

	$('.info-window')[0].innerHTML = '<p>You found ' + results.Name + '!</p>';
}
