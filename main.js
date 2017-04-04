$(document).ready(function() {
 
 //event listener for the button
$("#theButton").on("click", getProps);

//event listener for the start over button
$('#startAgainBtn').on('click', startOver);

//event listener to ask for additional user input only if beam is coped
$('#beamCopeForm').one('change', function() {
	var copeCondition = $('#beamCope').val();
	
	if (copeCondition === "toponly") {
		console.log(copeCondition);
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(11);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Edge Distance to Beam Cope";
    	cell2.innerHTML = "<input id='copeEdgeDist'></input>";
	} else if (copeCondition ==="both") {
		console.log(copeCondition);
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(11);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Least Edge Distance to Beam Cope";
    	cell2.innerHTML = "<input id='copeEdgeDist'></input>";
	}
});

//global variables which get passed to the runCalcs function
var beam;
var angle;
var bolt;

//global variables which are used by the displayTable function that populates the Handlebars template
var phiPnBS;
var phiPnBearing;
var phiPnTearout;
var phiPnSC;

function getProps() {

var beamSize= $('#beamSize').val();
var angleSize= $('#angleSize').val();

//Wshapes is a large array of objects in a separate Wshapes.js file
for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = parseFloat(Wshapes[i].tw);
			beambf = parseFloat(Wshapes[i].bf);
			beamtf = parseFloat(Wshapes[i].tf);
			beamd = parseFloat(Wshapes[i].d);
		}
	}
//angles is a large array of objects in a separate angles.js file
for (var i = 0; i < angles.length; i++) {
		if (angleSize === angles[i].Size) {
			anglet = parseFloat(angles[i].t);
			angleb = parseFloat(angles[i].b);
		}
	}

beam = {
	Fy: 50,
	Fu: 65,
	tw: beamtw,
	bf: beambf,
	tf: beamtf,
	d: beamd,
	cope: $('#beamCope').val(),
	Lev: parseFloat($('#edgeDistBeam').val())
}

angle = {
	Fy: 36,
	Fu: 58,
	Lev: parseFloat($('#edgeDistAngles').val()),
	t: anglet,
	b: angleb,
	Lev: $('#edgeDistAngles').val()
};

bolt = {
	size: parseFloat($('#boltSize').val()),
	defCond: $('#defCond').val(),
	n: parseInt($('#numBolts').val()),
	s: parseFloat($('#boltSpacing').val()),
	hole: $('#holeType').val(),
	thread: $('#threadCond').val(),
	grade: $("#boltGrade").val(),
	type: $('#jointType').val()
};

//inside this funtion we call the function that does several mathematical operations
runCalcs(angle, beam, bolt);
drawFig(angle, beam, bolt);
displayTable();

};


function runCalcs(anAngle, aBeam, aBolt) {

//
//BOLT SHEAR
//
var boltStrength;
if (bolt.grade === "groupA") {
		if (bolt.thread === "N") {
			boltStrength = 54;
		}
		if (bolt.thread === "X") {
			boltStrength = 68;
		}
} else if (bolt.grade === "groupB") {
		if (bolt.thread === "N") {
			boltStrength = 68;
		}
		if (bolt.thread === "X") {
			boltStrength = 84;
		}
}  

phiPnBS = 0.75*boltStrength*0.25*3.14159*bolt.size*bolt.size*bolt.n;
phiPnBS = Math.round(phiPnBS, 1);
//
//SLIP CRITICAL STRENGTH
//	
	var Tb;

	//if not SC, no need to report this limit state	
	if (bolt.type = "noSC") {
		phiPnSC = "N/A";
	}
	if (bolt.grade == "groupA") {
			switch (bolt.size) {
				case 0.5: 
					Tb = 12;
					break;
				case 0.625:
					Tb =19;
					break;
				case 0.75:
					Tb =28;
					break;
				case 0.875:
					Tb =39;
					break;
				case 1:
					Tb =51;
					break;
				case 1.125:
					Tb =64;
					break;
				case 1.25:
					Tb =81;
					break;
				case 1.375:
					Tb =97;
					break;
				case 1.5:
					Tb =118;
					break;
				default:
					Tb = 0;
			}

	}
	else if (bolt.grade == "groupB") {
			switch (bolt.size) {
				case 0.5: 
					Tb = 15;
					break;
				case 0.625:
					Tb =24;
					break;
				case 0.75:
					Tb =35;
					break;
				case 0.875:
					Tb =49;
					break;
				case 1:
					Tb =64;
					break;
				case 1.125:
					Tb =80;
					break;
				case 1.25:
					Tb =102;
					break;
				case 1.375:
					Tb =121;
					break;
				case 1.5:
					Tb =148;
					break;
				default:
					Tb = 0;
			}

	}
	if (bolt.hole === "STD" || bolt.hole === "SSLT") {
		phiPnSC = 100;
	}
	else if (bolt.hole === "OVS") {
		phiPnSC = 200;
	}
console.log(phiPnSC);
//
//BOLT BEARING ON BEAM
//
phiPnBearing;

	if (bolt.defCond === "Yes") {
		phiPnBearing = 0.75*2.4*bolt.n*bolt.size*beam.tw*beam.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnBearing = 0.75*3*bolt.n*bolt.size*beam.tw*beam.Fu;
	}
	phiPnBearing = Math.round(phiPnBearing,1);


//
//BOLT TEAROUT ON BEAM
//
phiPnTearout;
	var holeDiameter;
	if (bolt.hole === "STD" && bolt.size < 1) {
		holeDiameter = bolt.size + 1/16;
	}
	else if (hole === "STD" && bolt.size >= 1) {
		holeDiameter = bolt.size + 0.125;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size === 0.5) {
		holeDiameter = 0.625;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size >= 0.625 && bolt.size < 1) {
		holeDiameter = bolt.size + 3/16;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size === 1) {
		holeDiameter = bolt.size + 0.25;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size > 1) {
		holeDiameter = bolt.size + 0.3125;
	}
	else if (hole === "SSLT" || hole === "SSLT" && bolt.size > 1) {
		holeDiameter = bolt.size + 0.3125;
	}
	var Lc = bolt.s - holeDiameter;
	if (bolt.defCond === "Yes") {
		phiPnTearout = 0.75*1.2*((bolt.n-1)*Lc+beam.Lev)*beam.tw*beam.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnTearout = 0.75*2.4*((bolt.n-1)*Lc+beam.Lev)*beam.tw*beam.Fu;
	}
	
	phiPnTearout = Math.round(phiPnTearout, 1);
};

//
// FUNCTION TO DRAW FIGURE
//
function drawFig(anAngle, aBeam, aBolt) {
	
	var angleLength = (bolt.n-1)*bolt.s + 2*beam.Lev;
	var r = beam.tw;	
	var c = document.getElementById("myCanvas");
	c.width = beam.bf*1.2*7;
	c.height = beam.d*1.2*7;
	var ctx = c.getContext("2d");
	ctx.scale(7,7);
	ctx.translate(1,1);
	ctx.lineWidth=0.1;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(beam.bf,0);
	ctx.moveTo(beam.bf,0);
	ctx.lineTo(beam.bf,beam.tf);
	ctx.moveTo(beam.bf,beam.tf);
	ctx.lineTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw,beam.tf);
	ctx.moveTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw,beam.tf);
	ctx.arc(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.tf+r,r, 1.5*Math.PI, Math.PI, true);
	ctx.moveTo(beam.bf*0.5+beam.tw*.5, beam.tf+r);
	ctx.lineTo(beam.bf*0.5+beam.tw*.5, beam.d-(beam.tf+r));
	ctx.moveTo(beam.bf*0.5+beam.tw*.5, beam.d-(beam.tf+r));
	ctx.arc(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.d-beam.tf-r, r, 1.0*Math.PI, 0.5*Math.PI, true);
	ctx.moveTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.d-beam.tf);
	ctx.lineTo(beam.bf, beam.d-beam.tf);
	ctx.moveTo(beam.bf, beam.d-beam.tf);
	ctx.lineTo(beam.bf, beam.d);
	ctx.lineTo(0, beam.d);
	ctx.moveTo(0, beam.d);
	ctx.lineTo(0, beam.d-beam.tf);
	ctx.moveTo(0, beam.d-beam.tf);
	ctx.lineTo(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf);
	ctx.moveTo(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf);	
	ctx.arc(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf-r, r, 0.5*Math.PI, 0, true);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, beam.d-beam.tf-r);
	ctx.lineTo(0.5*beam.bf-0.5*beam.tw, beam.tf+r);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, beam.tf+r);
	ctx.arc(0.5*beam.bf-0.5*beam.tw-r, beam.tf+r, r, 0, 1.5*Math.PI, true);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw-r, beam.tf);
	ctx.lineTo(0, beam.tf);
	ctx.moveTo(0, beam.tf);
	ctx.lineTo(0,0);
	//draw the left angle
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw, 2*beam.tf);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf+angleLength);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.t, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw - angle.t, 2*beam.tf+angleLength);
	//draw the right angle
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf+angleLength);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.t, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.t, 2*beam.tf+angleLength);
	ctx.stroke();
	//draw bolts on left angle
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beam.bf - 0.5*beam.tw - angle.b*0.6;
		var ctry = 2*beam.tf+beam.Lev+i*bolt.s;
		ctx.arc(ctrx, ctry, bolt.size*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	};
	//draw bolts on right angle
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beam.bf + 0.5*beam.tw + angle.b*0.6;
		var ctry = 2*beam.tf+beam.Lev+i*bolt.s;
		ctx.arc(ctrx, ctry, bolt.size*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	};

	//draw bolts through beam web
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ycoord = 2*beam.tf+beam.Lev-0.5*bolt.size+i*bolt.s;
		ctx.rect(0.5*beam.bf - 0.5*beam.tw-angle.t, ycoord, 2*angle.t+beam.tw, bolt.size);
		ctx.fill();
		ctx.stroke();
	};
}

//
//FUNCTION TO POPULATE HANDLEBARS TEMPLATE
//

function displayTable() {
	var source = $("#limit-states").html();
	var template = Handlebars.compile(source);
	var data = {phiPnBS: phiPnBS, bearing: phiPnBearing, tearout: phiPnTearout, slipCritStrength: phiPnSC };
	var newTable = template(data);
	$('#checks').html(newTable);
	$('#theButton').hide();
	$('#startAgainBtn').show();
};

//
// FUNCTION TO RELOAD THE PAGE ON CLICK
//

function startOver() {
	location.reload();
};
	

});
