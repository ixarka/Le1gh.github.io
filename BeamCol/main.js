
$(document).ready(function() {
    $('#runFunc').on("click", showMnPn);

    });
    
function phiPn(KLx, KLy, A, bf2tf, htw, tw, rx, ry)
{
    var E = 29000.;
    var Fy = 50.;
    var Qs;
    var Fcrx;
    var Fcry;
    var Qa;
	

    //calculate Fe
    Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx,2);
    Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
     //check for slender flanges
    if(bf2tf < 0.56 * Math.sqrt(E / Fy))
    {
        Qs = 1;
    }
    else if(bf2tf < 1.03 * Math.sqrt(E / Fy) && bf2tf > 0.56 * Math.sqrt(E / Fy))
    {
        Qs = 1.415 - 0.75 * bf2tf * Math.sqrt(Fy / E);
    }
    else 
    {
        Qs = 0.69 * E / (Fy * Math.pow(bf2tf,2));
    }
    //x direction Fcrx
    if(Qs * Fy / Fex < 2.25)
        Fcrx = Qs * Fy * Math.pow(0.658, (Qs * Fy / Fex));
    else 
    {
        Fcrx = 0.877 * Fex;
    }

    //x direction check for slender webs
    if(htw > 1.49 * Math.sqrt(E / Fy))
    {
        var be = 1.92 * tw * Math.sqrt(E / Fy) * (1 - (0.34 / htw) * Math.sqrt(E / Fy));
        var Ae = A - (htw * tw - be) * tw;
        Qa = Ae / A;
    }   
    else 
    {
        Qa = 1;
    }

    //x direction account for both slender webs and flanges
    Q = Qs * Qa;
    if(Q * Fy / Fex < 2.25)
    {
        Fcrx = Q * Fy * Math.pow(0.658, (Q * Fy / Fex));
    }
    else 
    {
        Fcrx = 0.877 * Fex;
    }

    //x direction calculate final Pn
    var Pnx = Fcrx * A;
    //y direction Fcry
    if(Qs * Fy / Fey < 2.25)
    {
        Fcry = Q * Fy * Math.pow(0.658, (Q * Fy / Fey))
    }
    else
    {
        Fcry = 0.877 * Fey;
    }

  
    //y direction account for both slender webs and flanges
    Q = Qs * Qa;
    if(Q * Fy / Fey < 2.25)
    {
        Fcry = Q * Fy * Math.pow(0.658, (Q * Fy / Fey));
    }
    else 
    {
        Fcry = 0.877 * Fey;
    }

    //y direction calculate final Pn
    var Pny = Fcry * A;

    var Pn = Math.min(Pny, Pnx);
    var phiPn = Pn * 0.9;

    return phiPn;
}


function phiMn(L, Cb, Z, S, rts, J, h0, ry, Iy, bf2tf, htw)
{
    var E = 29000.;
    var Fy = 50.;
    var Mp = Z * Fy;
	var MnFLB;
	var MnLTB;
	var Lpprime;
	var Mpprime;
    var Lp = (1. / 12) * 1.76 * ry * Math.sqrt(E / Fy);
    var d = J / (S * h0);
    var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((0.7 * Fy / E), 2));
    var Lr = (1. / 12) * 1.95 * rts * (E / (0.7 * Fy)) * Math.sqrt(d + g);
	var lambdap = 0.38 * Math.sqrt(E / Fy);
	var	lambdar = Math.sqrt(E / Fy);
	
//calc Mn_LTB
    if(L < Lp)
        {
            MnLTB = Mp;
        }
    else if(L > Lp && L < Lr)
        {
            MnLTB = Cb * (Mp - (Mp - 0.7 * Fy * S) * (L - Lp) / (Lr - Lp));
            MnLTB = Math.min(MnLTB, Mp);
        }
	else 
		{
			Fcr = (Cb*E*3.14159*3.14159/(Math.pow(L*12/rts, 2)))*Math.sqrt(1+0.078*d*Math.pow(L*12/rts, 2));
			MnLTB = S*Fcr;
			MnLTB = Math.min(MnLTB, Mp);
		}
    //address noncompact and slender flanges (webs are always compact)
	if(bf2tf > lambdap && bf2tf < lambdar)
    {
        MnFLB = Mp - (Mp - 0.7 * Fy * S) * (bf2tf - lambdap) / (lambdar - lambdap);
		//Mpprime = Mp-(Mp-0.7*Fy*S)*(bf2tf-lambdap)/(lambdar-lambdap);
		//Lpprime = Lp+(Lr-Lp);
	}
    else if(bf2tf > lambdar)
    {
        MnFLB = 0.9*E*S*4/(Math.sqrt(htw)*Math.pow(bf2tf,2));
    }
	else 
	{
		MnFLB = Mp;
	}
	Mn = Math.min(MnFLB, MnLTB);
    var phiMn = 0.9 * Mn / 12;
    return phiMn;
}

function getMnPn(L, KLx, KLy, Cb)
{
    var mnpn = [];
    for(var i = 0; i < Wshapes.length; i++) {
       // r = Wshapes[shape];
        var shape = Wshapes[i];   
        var pn = phiPn(KLx, KLy, shape.A, shape.bf2tf, shape.htw, shape.tw, shape.rx, shape.ry);
        var rts = Math.sqrt(Math.sqrt(shape.Iy*shape.Cw)/shape.Sx);
        var h0 = shape.d - shape.tf;
        var mn = phiMn(L, Cb, shape.Zx, shape.Sx, rts, shape.J, h0, shape.ry, shape.Iy, shape.bf2tf, shape.htw);
  
        mnpn[i] = {
            "size": shape["Size"],
            "weight": parseInt(shape["W"]),
            "phiMn": mn,
            "phiPn": pn,
            "depthSeries": parseInt(shape["Size"].slice(1).split("X")[0])
        }
       
    }
     return mnpn;
}

function getShape(Pu, Mu, maxDepth, mnpn) {
   
    for (var i = 0; i < mnpn.length; i++) {
        var shape = mnpn[i];
        
        if(Pu/shape["phiPn"] >= 0.2)
        {
            shape["result"] = (Pu/shape["phiPn"]) + (8./9)*(Mu/shape["phiMn"]);
        }
        else
        {
            shape["result"] = (Pu/(2*shape["phiPn"])) + (Mu/shape["phiMn"]);
        }
        
    }
    
    var minWeight = Infinity;
    var minShape = "No W" + maxDepth + " shape satisfies the criteria.";
   
    for (var j = 0; j < mnpn.length; j++) {
        var shape = mnpn[j];
        if (shape["result"] <= 1 && shape["weight"] < minWeight && shape["depthSeries"] <= maxDepth)
            {
            minWeight = shape["weight"];
            minShape = shape["size"];
            }   
    }
   
    return minShape;
}


function showMnPn() {
console.log(5);
 var L=parseInt($('#flexL').val());
 console.log(L);
 var KLx=parseInt($("#colKLx").val());
 var KLy=parseInt($("#colKLy").val());
var Cb=parseInt($("#Cb").val());
var Pu=parseInt($("#Pu").val());
var Mu=parseInt($("#Mu").val());
var maxDepth=parseInt($("#maximumDepth").val());
 //var Cb=parseInt(document.forms["beamShapeSelector"]["Cb"].value);
 //var Pu=parseInt(document.forms["beamShapeSelector"]["Pu"].value);
 //var Mu=parseInt(document.forms["beamShapeSelector"]["Mu"].value);
 //var maxDepth=parseInt(document.forms["beamShapeSelector"]["MaxDepth"].value);
 
mnpn = getMnPn(L, KLx, KLy, Cb);
var theAnswer = getShape(Pu, Mu, maxDepth, mnpn);
console.log(L, KLx, KLy, Cb, Pu, Mu, maxDepth);
$('#result').html(theAnswer);
 
 //$("#result").innerHTML=getShape(Pu, Mu, maxDepth, mnpn);
 }

