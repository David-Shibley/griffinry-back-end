$(document).ready(function() {
	var petApi = '/pets/list';
	
	getUser();

	$.get(petApi, function (data) {
		populateDropdowns(data.species, "petId");
		populateDropdowns(data.colors, "color");
	});

	$('select').on('change', function (event) {
		selectionChange(event);
	});
});

function getUser () {
	$.get('/userId', function(user) {
		$('#userId').val(user);	
	});
}

function populateDropdowns (optionArray, nameString) {
	var dropdownSelector = 'select[name=' + nameString + ']';
	var $select = $(dropdownSelector);
	for (var i in optionArray) {
		$select.append(formatOptions(optionArray[i]));
	}
}

function formatOptions (option) {
	var newOption = document.createElement('option');
	newOption.value = option;
	newOption.innerText = option;
	return newOption;
}

function selectionChange (event) {
	var imgPath = $('.pet-image>img')[0].src.split('/');
	imgPath = imgPath[imgPath.length - 1].replace('.png', '').split('_');

	console.log(event.target.name);
	if (event.target.name == "petId") {
		imgPath[0] = event.target.value.toLowerCase();
	}
	else if (event.target.name == "color") {
		imgPath[1] = event.target.value.toLowerCase();
	}

	var newImg = '/images/' + imgPath.join('_') + '.png';

	$('.pet-image>img')[0].src = newImg;
}
