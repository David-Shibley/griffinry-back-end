$(document).ready(function() {
	var petApi = '/pets/list';
	$.get(petApi, function (data) {
		populateDropdowns(data.species, "species");
		populateDropdowns(data.colors, "colors");
	});
});

function populateDropdowns (optionArray, nameString) {
	var $select = $(select[name=nameString]);
	for (var i in optionArray) {
		$select.append(formatOptions(optionArray[i]));
	}
}

function formatOptions (option) {
	for (var i in option) {
		var newOption = document.createElement('option');
		newOption.value = option[i].name;
	}
}
