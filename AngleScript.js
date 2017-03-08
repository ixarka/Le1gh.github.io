//fire base https://steel-design.firebaseio.com/

$(document).ready(function() {
	//("theButton").addEventListener("click", boltShear);
	//document.getElementById("theButton").addEventListener("click", boltBearing);
	$("#theButton").on("click", boltShear).on("click", boltBearing).on('click', createTable);

//declare global variables
var boltGrade;
var numBolts;
var boltSize


//function to calculate bolt shear
function boltShear() {
	boltGrade = $("#boltGrade").val();
	boltSize = $('#boltSize').val();
	numBolts = parseInt($('#numBolts').val());
	var boltStrength;
	if (boltGrade === "A325") {
		boltStrength = 400;
	} else if (boltGrade === "A490") {
		boltStrength = 500;
	} 

phiPnBS = .75*boltStrength*.25*3.14159*boltSize*boltSize*numBolts;
	}


//function for bolt bearing and tearout
function boltBearing() {
	boltSize = $('#boltSize').val();
	numBolts = parseInt($('#numBolts').val());
	boltSpacing = $('#boltSpacing').val();
}

// function to create table of results. Each row of the table is on its own row below. Delete inputs when verified.
function createTable() {
	$('#checks1').html('<table><tr><td>Bolt Spacing</td><td>'+boltSpacing+ ' in.</td></tr>'+
						'<tr><td>json test</td><td>'+Wshapes[0].tf+' in.</td></tr>'+
						'<tr><td>Bolt Diameter</td><td>'+boltSize+' in.</td></tr>'+
						'<tr><td>Number of Bolts</td><td>'+numBolts+'</td></tr>'+
						'<tr><td>Bolt Shear</td><td>'+phiPnBS+' kips</td></tr>'+
						'<tr><td>Bolt Bearing and Tearout</td><td>result</td></tr></table>');
};

	
	
});