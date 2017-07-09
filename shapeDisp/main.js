
//global variables which are used by the displayTable function that populates the Handlebars template


$(document).ready(function() {

  //event listener for the button
//$("#theButton").on("click", getProps);
$("#shapeForm").on("change", getProps);
//event listener for the start over button
$('#clearButton').on('click', shapeRedo);



//end of on ready function
});

function getProps() {

var beamSize= $('#beamSize').val();


//Wshapes is a large array of objects in a separate Wshapes.js file
for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = parseFloat(Wshapes[i].tw);
			beambf = parseFloat(Wshapes[i].bf);
			beamtf = parseFloat(Wshapes[i].tf);
			beamd = parseFloat(Wshapes[i].d);
			beamarea = parseFloat(Wshapes[i].A);
			//Need to work on kdet and k1 for drawing purposes, but they're mixed fractions so not straightforward
			beamkdet = Wshapes[i].kdet;
			console.log(beamkdet);
			beamk1 = Wshapes[i].k1;
			beambf2tf = parseFloat(Wshapes[i].bf2tf);
			beamhtw = parseFloat(Wshapes[i].htw);
			beamIx = parseFloat(Wshapes[i].Ix);
			beamSx = parseFloat(Wshapes[i].Sx);
			beamZx = parseFloat(Wshapes[i].Zx);
			beamrx = parseFloat(Wshapes[i].rx);
			beamIy = parseFloat(Wshapes[i].Iy);
			beamSy = parseFloat(Wshapes[i].Sy);
			beamZy = parseFloat(Wshapes[i].Zy);
			beamry = parseFloat(Wshapes[i].ry);

		}
	}
	
beam = {
	Fy: 50,
	Fu: 65,
	tw: beamtw,
	bf: beambf,
	tf: beamtf,
	d: beamd,
	A: beamarea,
	kdet: beamkdet,
	k1: beamk1,
	bf2tf: beambf2tf,
	htw: beamhtw,
	Ix: beamIx,
	Sx: beamSx,
	Zx: beamZx,
	rx: beamrx,
	Iy: beamIy,
	Sy: beamSy,
	Zy: beamZy,
	ry: beamry
	}



	var source = $("#shapeProperties").html();
	var template = Handlebars.compile(source);
	var data = {sectionName: beamSize, 
		area: beam.A,
		depth: beam.d,
		flangeWidth: beam.bf,
		flangeThickness: beam.tf,
		webThickness: beam.tw,
		kdet: beam.kdet,
		k1: beam.k1,
		bf2tf: beam.bf2tf,
		htw: beam.htw,
		Ix: beam.Ix,
		Sx: beam.Sx,
		Zx: beam.Zx,
		rx: beam.rx,
		Iy: beam.Iy,
		Sy: beam.Sy,
		Zy: beam.Zy,
		ry: beam.ry
		 };
	var newTable = template(data);
	$('#shapeProps').prepend(newTable);
	$('#clearButton').show();


drawFig(beam);

//end of getProps
}


//
// FUNCTION TO DRAW FIGURE
//

function drawFig(beam) {
		
	var c = document.getElementById("shapeCanvas");
	var realbf = beam.bf;
	var realtf = beam.tf;
	var reald = beam.d;
	var realtw = beam.tw;

	//c.width = 500;
	//c.height = 500;
	var myScale = Math.min(400/beam.d, 300/beam.bf);
	var xtranslate = 50;
	var ytranslate = 10;
	c.width = beam.bf*myScale*2;
	c.height = beam.d*myScale*1.5;
	beam.d *= myScale;
	beam.tw *= myScale;
	beam.bf *= myScale;
	beam.tf *= myScale;
	
	var r = beam.tw;
	var ctx = c.getContext("2d");
	//ctx.scale(.8*400/beam.d,.8*400/beam.d);
	ctx.translate(xtranslate,ytranslate);
	ctx.lineWidth=0.7;
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

	//Here begins dimension lines
	//bf dimension line
	ctx.moveTo(0, beam.d+30);
	ctx.lineTo(beam.bf, beam.d+30);
	ctx.moveTo(0, beam.d+20);
	ctx.lineTo(0, beam.d+40);
	ctx.moveTo(beam.bf, beam.d+20);
	ctx.lineTo(beam.bf, beam.d+40);
	ctx.font = "15px Arial";
	ctx.fillText("bf: "+realbf,0.4*beam.bf, beam.d+25);

	//tf dimension line
	ctx.moveTo(beam.bf + 15, beam.d);
	ctx.lineTo(beam.bf + 15, beam.d-beam.tf);
	ctx.moveTo(beam.bf + 5, beam.d);
	ctx.lineTo(beam.bf + 25, beam.d);
	ctx.moveTo(beam.bf + 5, beam.d-beam.tf);
	ctx.lineTo(beam.bf + 25, beam.d-beam.tf);
	ctx.fillText("tf: "+realtf, beam.bf+28, beam.d-0.2*beam.tf);
	
	//d dimension line
	ctx.moveTo(xtranslate-70, 0);
	ctx.lineTo(xtranslate-70, beam.d);
	ctx.moveTo(xtranslate-80, 0);
	ctx.lineTo(xtranslate-60, 0);
	ctx.moveTo(xtranslate-80, beam.d);
	ctx.lineTo(xtranslate-60, beam.d);
	ctx.fillText("d: "+reald, xtranslate-60, 0.48*beam.d);

	//tw dimension line
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, 0.7*beam.d);
	ctx.lineTo(0.5*beam.bf+0.5*beam.tw, 0.7*beam.d);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, 0.7*beam.d);
	ctx.lineTo(0.5*beam.bf+0.5*beam.tw, 0.7*beam.d);
	ctx.fillText("tw: "+realtw, 0.5*beam.bf+0.5*beam.tw+5, 0.7*beam.d);

	//kdet dimension line
	/*ctx.moveTo(beam.bf+20, ytranslate-10);
	ctx.lineTo(beam.bf+20, beam.kdet);
	ctx.moveTo(beam.bf+10, ytranslate-10);
	ctx.lineTo(beam.bf+30, ytranslate-10);
	ctx.moveTo(beam.bf+10, beam.kdet);
	ctx.lineTo(beam.bf+30, beam.kdet);
	ctx.fillText("kdet: "+realkdet, beam.bf+30, beam.kdet*0.6);*/



	ctx.stroke();
}


//
// FUNCTION TO RELOAD THE PAGE ON CLICK
//

function shapeRedo() {
	location.reload();
}
