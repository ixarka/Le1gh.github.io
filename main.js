


$(document).ready(function() {
   var config = {
    apiKey: "AIzaSyCKn2GS1dSRVd0e6tTLFu-iLVQrQTAEByo",
    authDomain: "steel-design.firebaseapp.com",
    databaseURL: "https://steel-design.firebaseio.com",
    projectId: "steel-design",
    storageBucket: "steel-design.appspot.com",
    messagingSenderId: "519166628563"
  };
  firebase.initializeApp(config);

  var database = firebase.database;
	console.log(database[0].A);
 

	$("#theButton").on("click", boltShear).on("click", boltBearingOnBeam).on("click", boltSC).on("click", boltTearoutOnBeam).on('click', drawFig).on('click', testFunc);
	$('#startAgainBtn').on('click', startOver);
//declare global variables
var boltGrade;
var numBolts;
var boltSize;
var threadCond;
var beamSize;
var angleSize;
var beamtw;
var beamtf;
var beamd;
var beamb;
var anglet;
var angleb;
var angleLength;
var boltStrength;
var deformationCond;
var hole;
var FyBeam = 50;
var FyAngle = 36;
var FuBeam = 65;
var FuAngle = 58;
var phiPnBS;
var phiPnBearing;
var phiPnTearout;
var jointType;
var Le;
var Tb;

//function to calculate bolt shear
function boltShear() {
	boltGrade = $("#boltGrade").val();
	boltSize = parseFloat($('#boltSize').val());
	numBolts = parseInt($('#numBolts').val());
	threadCond = $('#threadCond').val();

	//if statement to determine bolt strength per AISC Specificatino Table J3.2
	if (boltGrade === "groupA") {
		if (threadCond === "N") {
			boltStrength = 54;
		}
		if (threadCond === "X") {
			boltStrength = 68;
		}
	} else if (boltGrade === "groupB") {
		if (threadCond === "N") {
			boltStrength = 68;
		}
		if (threadCond === "X") {
			boltStrength = 84;
		}
	}  
	phiPnBS = 0.75*boltStrength*0.25*3.14159*boltSize*boltSize*numBolts;
	phiPnBS = Math.round(phiPnBS, 1);
}

function boltSC() {
	boltGrade = $("#boltGrade").val();
	boltSize = parseFloat($('#boltSize').val());
	numBolts = parseInt($('#numBolts').val());
	jointType = $('#jointType').val();
	hole = $('#holeType').val();
	var phi;
	//if not SC, no need to report this limit state	
	if (jointType = "noSC") {
		phiPnSC = "N/A"
	}
	if (boltGrade == "groupA") {
			switch (boltSize) {
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
	else if (boltGrade == "groupB") {
			switch (boltSize) {
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
	if (hole === "STD" || hole === "SSLT") {
		
	}
	else if (hole === "OVS") {

	}
	
		}
		


//function for bolt bearing and tearout
function boltBearingOnAngle() {
	
	
}

function boltBearingOnBeam() {
	boltSize = parseFloat($('#boltSize').val());
	deformationCond = $('#defCond').val();
	numBolts = parseInt($('#numBolts').val());
//get beam web thickness
	beamSize = $('#beamSize').val();
	for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = Wshapes[i].tw;
		}
	}
//calculate bearing strengths
	if (deformationCond === "Yes") {
		phiPnBearing = 0.75*2.4*numBolts*boltSize*beamtw*FuBeam;
	}
	else if (deformationCond === "No") {
		phiPnBearing = 0.75*3*numBolts*boltSize*beamtw*FuBeam;
	}
	phiPnBearing = Math.round(phiPnBearing,1);
}

function boltTearoutOnBeam() {
	boltSize = parseFloat($('#boltSize').val());
	deformationCond = $('#defCond').val();
	numBolts = parseInt($('#numBolts').val());
	boltSpacing = parseFloat($('#boltSpacing').val());
	Le = parseFloat($('#edgeDist').val());
	hole = $('#holeType').val();
	var holeDiameter;
//calculate Lc
	if (hole === "STD" && boltSize < 1) {
		holeDiameter = boltSize + 1/16;
	}
	else if (hole === "STD" && boltSize >= 1) {
		holeDiameter = boltSize + 0.125;
	}
	else if (hole === "OVS" || hole === "SSLT" && boltSize === 0.5) {
		holeDiameter = 0.625;
	}
	else if (hole === "OVS" || hole === "SSLT" && boltSize >= 0.625 && boltSize < 1) {
		holeDiameter = boltSize + 3/16;
	}
	else if (hole === "OVS" || hole === "SSLT" && boltSize === 1) {
		holeDiameter = boltSize + 0.25;
	}
	else if (hole === "OVS" || hole === "SSLT" && boltSize > 1) {
		holeDiameter = boltSize + 0.3125;
	}
	else if (hole === "SSLT" || hole === "SSLT" && boltSize > 1) {
		holeDiameter = boltSize + 0.3125;
	}
	var Lc = boltSpacing - holeDiameter;
	if (deformationCond === "Yes") {
		phiPnTearout = 0.75*1.2*((numBolts-1)*Lc+Le)*beamtw*FuBeam;
	}
	else if (deformationCond === "No") {
		phiPnTearout = 0.75*2.4*((numBolts-1)*Lc+Le)*beamtw*FuBeam;
	}
	
	phiPnTearout = Math.round(phiPnTearout, 1);
}

function drawFig() {
	numBolts = parseInt($('#numBolts').val());
	boltSpacing = parseFloat($('#boltSpacing').val());
	angleSize = $('#angleSize').val();
	beamSize = $('#beamSize').val();
	boltSize = $('#boltSize').val();
	Le = parseFloat($('#edgeDist').val())
	angleLength = (numBolts-1)*boltSpacing + 2*Le;
	
	for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = parseFloat(Wshapes[i].tw);
			beambf = parseFloat(Wshapes[i].bf);
			beamtf = parseFloat(Wshapes[i].tf);
			beamd = parseFloat(Wshapes[i].d);
		}
	}
	
	for (var i = 0; i < angles.length; i++) {
		if (angleSize === angles[i].Size) {
			anglet = parseFloat(angles[i].t);
			angleb = parseFloat(angles[i].b);
		}
	}
	
	var r = beamtw;	
	var c = document.getElementById("myCanvas");
	c.width = beambf*1.2*7;
	c.height = beamd*1.2*7;
	var ctx = c.getContext("2d");
	ctx.scale(7,7);
	ctx.translate(1,1);
	ctx.lineWidth=0.1;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(beambf,0);
	ctx.moveTo(beambf,0);
	ctx.lineTo(beambf,beamtf);
	ctx.moveTo(beambf,beamtf);
	ctx.lineTo(beambf-0.5*beambf+r+0.5*beamtw,beamtf);
	ctx.moveTo(beambf-0.5*beambf+r+0.5*beamtw,beamtf);
	ctx.arc(beambf-0.5*beambf+r+0.5*beamtw, beamtf+r,r, 1.5*Math.PI, Math.PI, true);
	ctx.moveTo(beambf*0.5+beamtw*.5, beamtf+r);
	ctx.lineTo(beambf*0.5+beamtw*.5, beamd-(beamtf+r));
	ctx.moveTo(beambf*0.5+beamtw*.5, beamd-(beamtf+r));
	ctx.arc(beambf-0.5*beambf+r+0.5*beamtw, beamd-beamtf-r, r, 1.0*Math.PI, 0.5*Math.PI, true);
	ctx.moveTo(beambf-0.5*beambf+r+0.5*beamtw, beamd-beamtf);
	ctx.lineTo(beambf, beamd-beamtf);
	ctx.moveTo(beambf, beamd-beamtf);
	ctx.lineTo(beambf, beamd);
	ctx.lineTo(0, beamd);
	ctx.moveTo(0, beamd);
	ctx.lineTo(0, beamd-beamtf);
	ctx.moveTo(0, beamd-beamtf);
	ctx.lineTo(beambf*0.5-beamtw*0.5-r, beamd-beamtf);
	ctx.moveTo(beambf*0.5-beamtw*0.5-r, beamd-beamtf);	
	ctx.arc(beambf*0.5-beamtw*0.5-r, beamd-beamtf-r, r, 0.5*Math.PI, 0, true);
	ctx.moveTo(0.5*beambf-0.5*beamtw, beamd-beamtf-r);
	ctx.lineTo(0.5*beambf-0.5*beamtw, beamtf+r);
	ctx.moveTo(0.5*beambf-0.5*beamtw, beamtf+r);
	ctx.arc(0.5*beambf-0.5*beamtw-r, beamtf+r, r, 0, 1.5*Math.PI, true);
	ctx.moveTo(0.5*beambf-0.5*beamtw-r, beamtf);
	ctx.lineTo(0, beamtf);
	ctx.moveTo(0, beamtf);
	ctx.lineTo(0,0);
	//draw the left angle
	ctx.moveTo(0.5*beambf - 0.5*beamtw - angleb, 2*beamtf);
	ctx.lineTo(0.5*beambf - 0.5*beamtw, 2*beamtf);
	ctx.moveTo(0.5*beambf - 0.5*beamtw - angleb, 2*beamtf);
	ctx.lineTo(0.5*beambf - 0.5*beamtw - angleb, 2*beamtf+angleLength);
	ctx.moveTo(0.5*beambf - 0.5*beamtw - angleb, 2*beamtf+angleLength);
	ctx.lineTo(0.5*beambf - 0.5*beamtw, 2*beamtf+angleLength);
	ctx.moveTo(0.5*beambf - 0.5*beamtw - anglet, 2*beamtf);
	ctx.lineTo(0.5*beambf - 0.5*beamtw - anglet, 2*beamtf+angleLength);
	//draw the right angle
	ctx.moveTo(0.5*beambf + 0.5*beamtw, 2*beamtf);
	ctx.lineTo(0.5*beambf + 0.5*beamtw + angleb, 2*beamtf);
	ctx.moveTo(0.5*beambf + 0.5*beamtw + angleb, 2*beamtf);
	ctx.lineTo(0.5*beambf + 0.5*beamtw + angleb, 2*beamtf+angleLength);
	ctx.moveTo(0.5*beambf + 0.5*beamtw + angleb, 2*beamtf+angleLength);
	ctx.lineTo(0.5*beambf + 0.5*beamtw, 2*beamtf+angleLength);
	ctx.moveTo(0.5*beambf + 0.5*beamtw + anglet, 2*beamtf);
	ctx.lineTo(0.5*beambf + 0.5*beamtw + anglet, 2*beamtf+angleLength);
	ctx.stroke();
	//draw bolts on left angle
	for (var i = 0; i<numBolts; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beambf - 0.5*beamtw - angleb*0.6;
		var ctry = 2*beamtf+Le+i*boltSpacing;
		ctx.arc(ctrx, ctry, boltSize*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	}
	//draw bolts on right angle
	for (var i = 0; i<numBolts; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beambf + 0.5*beamtw + angleb*0.6;
		var ctry = 2*beamtf+Le+i*boltSpacing;
		ctx.arc(ctrx, ctry, boltSize*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	}

	//draw bolts through beam web
	for (var i = 0; i<numBolts; i++) {
		ctx.beginPath();
		var ycoord = 2*beamtf+Le-0.5*boltSize+i*boltSpacing;
		ctx.rect(0.5*beambf - 0.5*beamtw-anglet, ycoord, 2*anglet+beamtw, boltSize);
		ctx.fill();
		ctx.stroke();
	}
}

function testFunc() {
	var source = $("#limit-states").html();
	var template = Handlebars.compile(source);
	var data = {phiPnBS: phiPnBS, bearing: phiPnBearing, tearout: phiPnTearout, tw: beamtw };
	var newTable = template(data);
	$('#checks').html(newTable);
	$('#theButton').hide();
	$('#startAgainBtn').show();
}

function startOver() {
	location.reload();
}
	
});

