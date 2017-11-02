var direccionip = "http://34.214.94.231:8088/api/";

var iniciaApp = function(){

    $("#btnModulos").on("click",function(){
        $("#secModulos").show("slow");
        $("#secPerfil").hide("slow");
        combosistemas();
    });

}

var combosistemas = function(){

    var sistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"sistemas",
        dataType: "json"
    });

    sistemas.done(function(data){
        var option = "<option value='0'>Selecciona</option>"; 
        for(i=0;i<data.length;i++){
            option += "<option value='"+data[i].id+"' id='"+data[i].nombre+"' >"+data[i].nombre+"</option><br>"
        }
        $("#comboSistM").html(option);	  //Combo de sistemas para nuevo perfil	
    });

    sistemas.fail(function(){
        alert("No se cargaron los sistemas disponibles"); //MODIFICAR PARA QUE SE HAGA ESTE ALERT
    });
}

$(document).ready(iniciaApp);