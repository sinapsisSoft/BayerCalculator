/****************
Author: DIEGO CASALLAS
Date: 23/05/2018
Description:Functions of the Bayes theorem
****************/
/*Start function*/
function constructCause() {
    var selectCause = document.getElementById('selCausas');
    var count = parseInt(selectCause.options[selectCause.selectedIndex].text);
    var div = "<div style='margin-top:5px;' class='form-group col-xs-12 col-sm-12 col-md-4 col-lg-12 col-xl-12'>";
    var divSub = "<div  style='margin-top:5px;'class='form-group col-xs-6 col-sm-6 col-md-4 col-lg-6 col-xl-6'>";
    var textContainer = "";
    var content = document.getElementById('newComponents');
    var componentsHTML = [];
    content.innerHTML = textContainer;
    var tableResult = document.getElementById("tableResult");
    componentsHTML.push("<form id='formData'><div class='form-inline'>");
    for (var i = 0; i < count; i++) {

        var title = "A" + i;
        componentsHTML.push("<div class='row col-12 componets'>");
        componentsHTML.push(div);
        componentsHTML.push("<label for='" + title + "'>Causa A" + i + ": </label>");
        componentsHTML.push("<input type='number' onkeypress='return isNumberKey(event)' class='form-control text-center numeric' id='" + title + "'>");
        componentsHTML.push("</div>");
        componentsHTML.push(divSub);
        componentsHTML.push("<label for='" + title + "B1'>Efecto B1: </label>");
        componentsHTML.push("<input type='number' onkeypress='return isNumberKey(event)'class='form-control text-center numeric' id='" + title + "B1'>");
        componentsHTML.push("</div>");
        componentsHTML.push(divSub);
        componentsHTML.push("<label for='" + title + "B2'>Efecto B2: </label>");
        componentsHTML.push("<input type='number'onkeypress='return isNumberKey(event)' class='form-control text-center numeric' id='" + title + "B2'>");
        componentsHTML.push("</div>");
        componentsHTML.push("</div>");

    }
    componentsHTML.push("<button type='button'class='btn btn-danger btn_send' onclick='calculate()' >Calcular</button>");
    componentsHTML.push("</form></div>");

    for (var j = 0; j < componentsHTML.length; j++) {
        textContainer += componentsHTML[j];
    }
    content.innerHTML = textContainer;
    tableResult.innerHTML = "";
    anchorcall(0);
}
/*End function*/
/*Start function*/
function calculate() {
    var fomrData = document.getElementById('formData');
    var lengthForm = fomrData.length;
    var dataId = [];
    var sumValidate = 0;
    var sumValidateSub = 0;
    var contEvent = 0;
    var dataCause = [];
    var contSection = 0;
    var cont = 0;
    for (var i = 0; i < lengthForm; i++) {
        cont++;
        var elementsForm = fomrData.elements[i];
        var textValue = elementsForm.value.trim();
        if (cont == 3) {
            cont = 0;
            contSection++;
        }
        if (elementsForm.type == "number") {
            if (textValue == "" || textValue.length == 0 || /^\s+|\s+$/.test(textValue)) {
                elementsForm.focus();
                return false;
            } else {

                var textId = elementsForm.id;
         
                dataCause.push(textValue);
                if (textId.length == 2) {
                    sumValidate += parseFloat(textValue);

                } else {
                    sumValidateSub += parseFloat(textValue);

                    contEvent++;

                    if (contEvent == 2) {

                        if (sumValidateSub != 1) {
                            alert("La suma de las probabilidades de los efectos debe dar 1, verifique los datos suministrados.");
                            elementsForm.value = "";
                            elementsForm.classList.add("is-invalid");
                            return false;
                        } else {
                            contEvent = 0;
                            sumValidateSub = 0;
                            elementsForm.classList.remove("is-invalid");
                        }
                    }

                }
            }

        }


    }
    if (sumValidate != 1) {
        alert("La suma de las probabilidades de las causas debe dar 1, verifique los datos suministrados.");
        clearForm(fomrData, 0);
    }
    else {
        elementsForm.classList.remove("is-invalid");
        bayer(dataCause);
        anchorcall(1);
    }
}
/*End function*/
/*Start function*/
function bayer(data) {
    var table = "";
    var lengData = data.length;
    var lengDataProbability = lengData / 3;
    var MatrixData = new Array(lengDataProbability);
    var cont = 0;
    var start = 0;
    var end = 3;
    for (var i = 0; i < lengDataProbability; i++) {
        var myArray = [];
        for (start; start < end; start++) {
            myArray.push(data[start]);
        }
        MatrixData[i] = myArray;
        var a = MatrixData[i][0];
        var b = MatrixData[i][1];
        var c = MatrixData[i][2];
        MatrixData[i][3] = a * b;
        MatrixData[i][4] = a * c;
        start = end;
        end += 3;
    }
    var lengMatrix = MatrixData.length;
    var resultP = 0;
    var resultN = 0;
    var a = 0;
    var ba = 0;
    var c = 0;
    var bc = 0;
    for (var i = 0; i < lengMatrix; i++) {
        resultP = 0;
        resultN = 0;
        a = 0;
        ba = 0;
        c = 0;
        bc = 0;
        a = MatrixData[i][3];
        c = MatrixData[i][4];
        for (var j = 0; j < lengMatrix; j++) {
            ba += MatrixData[j][3];
            bc += MatrixData[j][4];
        }
        resultP = a / ba;
        MatrixData[i][5] = resultP;
        resultN = c / bc;
        MatrixData[i][6] = resultN;
    }
    var table = "<table class='table table-sm table-hover table-dark'><thead class='thead-dark'><tr><th>CAUSA (A<sub>n</sub>|B)</th><th>EFECTO (B1|A<sub>n</sub>)</th><th>RESULTADO</th></th></tr></thead><tbody>";
    var tr = "<tr>";
    var trEnd = "</tr>";
    var htmlText = "";

    var tableResult = document.getElementById("tableResult");
    htmlText += table;
    for (var i = 0; i < lengMatrix; i++) {

        var row = "<th rowspan='2' class='cellcondition'>" + MatrixData[i][0] + "</th><td>" + MatrixData[i][1] + "</td><td class='cellresult'>" + MatrixData[i][5].toFixed(4) + "</td>";
        row += "<tr><td>" + MatrixData[i][2] + "</td><td class='cellresult'>" + MatrixData[i][6].toFixed(4) + "</td></tr>";
        htmlText += tr + row + trEnd + "</tbody>";
    }
    htmlText += trEnd;
    tableResult.innerHTML = htmlText;
}
/*End function*/
/*Start function*/
function clearForm(fomr, type) {

    var lengthForm = fomr.length;
    for (var i = 0; i < lengthForm; i++) {
        var elementsForm = fomr.elements[i];
        var textValue = elementsForm.value.trim();
        if (elementsForm.type == "number") {
            var textId = elementsForm.id;

            if (textId.length == 2) {
                elementsForm.value = "";
                elementsForm.classList.add("is-invalid");
            }
        }
    }
}
/*End function*/
/*Start function*/
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
/*End function*/
/*Start function*/
function anchorcall(data){
    document.location.href = "#"+data;
    }