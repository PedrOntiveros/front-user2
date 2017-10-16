var inicia = function(){
    $("#btnSistema").on("click",cargaPaginaSistema);
    $("#masModulo").on("click",agregaModulo);
    $("#agregaPerfil").on("click",muestraFormPerfil);
    $("#guardarPerfil").on("click",guardarPerfil)
}

var guardarSistema = function(){

}

var muestraFormPerfil = function(){
    //Aquí tenía un e.preventDefault();
    var modulosDisp = obtenModulos();
    if(0 == modulosDisp.length){ //
        alert("Agrege al menos un modulo.")
    }else{
        insertaModulos(modulosDisp);
        $("#panelAddPerfil").show("fast");
    }
}

var insertaModulos = function(modulDisponibles){
    modulDisponibles.array.forEach(function(element) {
        
    }, this);
    modulo += "<label>"+
            "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
    moduloSeparated[i]+"</label><br>";
    $("#modulDisponibles").append("");
}

var obtenModulos = function(){
    var NumImputModulo = "";
    var temp;
    var arrayModulo = [];
    for(i=0;i<controlModulos;i++){
        NumImputModulo ="#modulo"+i;
        temp = $(NumImputModulo).val();
        if("" != temp){
            arrayModulo.push(temp);
        }
    }
    return arrayModulo; 
}

var agregaModulo = function(){
    $("#modulosDisponibles").append("<input class='form-control form-modulo' type='text' placeholder='Modulo' id='modulo"+(controlModulos++)+"''>");
}

var cargaPaginaSistema = function(){
    var sistemas = $.ajax({
        method: "GET",
        url:"api/sistemas",
        dataType: "json"
    });
    sistemas.done(function(data){
        var option = "<option value='0'>Selecciona</option>";
        for(i=0;data.length;i++){
            option += "<option value='"+data[i].nombre+"'>"+data[i].nombre+"</option><br>"
        }
        $("#comboSistU").html(option);
        $("#comboSistP").html(option);
    });
    sistemas.fail(function(){
        alert("No se cargaron los sistemas disponibles");
    });
    $("#secUsuario").hide("slow");
    $("#secPerfil").hide("slow");
    $("#secSistema").show("slow");
}


var controlModulos = 1;
var controlPerifles = 0;
$(document).ready(inicia);