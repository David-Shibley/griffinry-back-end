$(document).ready(function () {
	$.get('/adoptions/list/1', function (data) {
		for (var i in data) {
			renderPetData(data[i]);
		}
	});

	$('.pet-list>ul>li').click(function (event) {
		selectPet(event.target);
	});

	$('.gather-sites').click(function (event) {
		selectGatherLocation(event.target);
	});
});

function renderPetData (pet) {
	var $petList = $('.pet-list>ul');

	var listItem = document.createElement('li');
	var petImage = document.createElement('img');
	var petStats = document.createElement('ul');
	var petName = document.createElement('li');
	var petEnergy = document.createElement('li');

	petImage.src = 'images/' + pet.Pet_Id.toLowerCase() + '_' + pet.Color.toLowerCase() + '.png';
	petName.innerHtml = '<span>' + pet.Name + '</span>';
	petEnergy.innerHtml = '<span>' + pet.Current_Energy + '/' + pet.Max_Energy + '</span>';

	petStats.appendChild(petName);
	petStats.appendChild(petEnergy);
	listItem.appendChild(petImage);
	listItem.appendChild(petStats);

	$petList.append(listItem);
}

function selectPet (target) {
	console.log(target);
}

function selectGatherLocation (target) {
	console.log(target.alt);
}
