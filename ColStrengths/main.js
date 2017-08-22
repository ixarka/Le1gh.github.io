var E = 29000.;
var Fy = 50.;
var G = 11200;

$(document).ready(function() {
    $('#columnBtn').on("click", getStrengths);
    });

function getStrengths() {
    //First get the column size
    var Lcx = parseFloat($('#colKLx').val());
    var Lcy = parseFloat($('#colKLy').val());
    var Lcz = parseFloat($('#colKLz').val());
    var colSize = $('#colSize').val();
 
    for (var i = 0; i < Wshapes.length; i++) {
        if (colSize === Wshapes[i].Size) {
            var column = {
                A: parseFloat(Wshapes[i].A),
                d: parseFloat(Wshapes[i].d),
                bf2tf: parseFloat(Wshapes[i].bf2tf),
                htw: parseFloat(Wshapes[i].htw),
                tw: parseFloat(Wshapes[i].tw),
                rx: parseFloat(Wshapes[i].rx),
                ry: parseFloat(Wshapes[i].ry),
                bf: parseFloat(Wshapes[i].bf),
                tf: parseFloat(Wshapes[i].tf),
                Ix: parseFloat(Wshapes[i].Ix),
                Iy: parseFloat(Wshapes[i].Iy),
                Cw: parseFloat(Wshapes[i].Cw),
                J: parseFloat(Wshapes[i].J),
        }
    }
}

var FBLimitState = phiPn_FlexuralBuckling(Lcx, Lcy, column.A, column.rx, column.ry,);
var TBLimitState = phiPn_TorsionalBuckling(column.A, column.Ix, column.Iy, column.Cw, Lcz, column.J);
var LBLimitState = phiPn_LocalBuckling(Lcx, Lcy, column.A, column.bf2tf, column.htw, column.tw, column.rx, column.ry, column.bf, column.d, column.tf);
console.log(FBLimitState);
console.log(TBLimitState);
displayTable(FBLimitState, TBLimitState, LBLimitState);
}

    
function phiPn_FlexuralBuckling(KLx, KLy, A, rx, ry)
{
    var Fcr;
    var Fe;

    //calculate Fe
    var Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx, 2);
    var Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
    Fe = Math.min(Fex, Fey);

    //calculate Fcr
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
     
     var phiPnFB = parseInt(0.9*Fcr*A);
     return phiPnFB;

}

function phiPn_LocalBuckling(KLx, KLy, A, bf2tf, htw, tw, rx, ry, bf, d, tf) {
    var Fcr;
    var Fe;
    var Ae = A;
    var lambdarFlange = 0.56*Math.sqrt(E / Fy)
    var lambdarWeb = 1.49*Math.sqrt(E / Fy)

    //calculate Fe
    var Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx, 2);
    var Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
    Fe = Math.min(Fex, Fey);

    //calculate Fcr
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
 //check for slender flanges only
    
     if (bf2tf > lambdarFlange*Math.sqrt(Fy/Fcr) && htw < lambdarWeb*Math.sqrt(Fy/Fcr)) {
        var c1 = 0.22;
        var c2 = 1.49;
        var Fel = Fy*Math.pow(c2*lambdarFlange/bf2tf, 2);
        var be = bf*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = (2*be*tf)+(tw*d-2*tf);
     }

     //check for slender webs
     if (htw >lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf < lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var c1 = 0.18;
        var c2 = 1.31;
        var h = htw*tw;
        var Fel = Fy*Math.pow(c2*lambdarWeb/htw, 2);
        var he = h*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = (2*bf*tf)+tw*he;
     }

     //check if both are slender
      if (htw >lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf > lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var c1Flange = 0.22;
        var c2Flange = 1.49;
        var c1Web = 0.18;
        var c2Web = 1.31;
        var FelFlange = Fy*Math.pow(c2Flange*lambdarFlange/bf2tf, 2);
        var FelWeb = Fy*Math.pow(c2Web*lambdarWeb/htw, 2);
        var be = bf*(1-c1Flange*Math.sqrt(FelFlange/Fcr))*Math.sqrt(FelFlange/Fcr);
        var he = h*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = he*tw+2*bf*be;
     }
     console.log(htw, bf2tf, lambdarWeb*Math.sqrt(Fy/Fcr), lambdarFlange*Math.sqrt(Fy/Fcr));
     if (htw < lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf < lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var phiPnLB = "N/A";
     }

     else {
     var phiPnLB = parseInt(0.9*Fcr*Math.min(Ae,A));
    }
     return phiPnLB;

}

function phiPn_TorsionalBuckling(A, Ix, Iy, Cw, Lcz, J) {
    var Fe = (1/(Ix+Iy))*(Math.pow(3.14159, 2)*29000*Cw/Math.pow(Lcz*12, 2)+11200*J);
    var Fcr;
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
    var phiPnTB = parseInt(0.9*Fcr*A);
    return phiPnTB;
}

function displayTable(FB, TB, LB) {
    //$('#checks').empty();
    var source = $("#colStrengths").html();
    var template = Handlebars.compile(source);
    var data = {showFB: FB,
        showTB: TB,
        showLB: LB
         };
    var newTable = template(data);
    $('#checks').html(newTable);
    //$('#theButton').hide();

    //OLD CODE FROM ATTEMPTING TO SEPARATE TEMPLATE
    //$('#startAgainBtn').show();
    /*var template = Handlebars.getTemplate('strengths');
    var data = {showFB: FB};       
    $('#checks').append(template(data))*/

};
    


