var inicia = function(){
    $("#btnSistema").on("click",cargaPaginaSistema);
    $("#masModulo").on("click",agregaModulo);
    $("#agregaPerfil").on("click",muestraFormPerfil);
    $("#regresaSistema").on("click",regresaSistema);
    $("#guardarPerfil").on("click",guardarPerfil);
}

var guardarSistema = function(){

}

var regresaSistema = function(e){
    e.preventDefault();
    $("#secSistema").slideDown("slow");
    $("#panelAddPerfil").slideToggle("slow");
}

var muestraFormPerfil = function(e){
    e.preventDefault();
    if(!confirm("¿Seguro que desea continuar?")){
        return;
    }else{
        var modulosDisp = obtenModulos();
        if(0 == modulosDisp.length){
            alert("Agrege al menos un modulo.")
        }else{
            insertaModulos(modulosDisp);
            $("#secSistema").slideUp("slow",)
            $("#panelAddPerfil").show("slow");
        }
    }
}

var insertaModulos = function(modulDisponibles){
    var modulo ="";
    for(i=0;i<controlModulos;i++){
        modulo += "<label class='panel panel-default'>"+
        "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+modulDisponibles[i]+"'>"+
        modulDisponibles[i]+"</label>";
   }
    
    $("#modulDisponibles").html(modulo);
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

var agregaModulo = function(e){
    e.preventDefault();
    $("#modulosDisponibles").append("<input class='form-control form-modulo' type='text' placeholder='Modulo' id='modulo"+(controlModulos++)+"''>");
}

var cargaPaginaSistema = function(){
    $("#secUsuario").hide("slow");
    $("#secPerfil").hide("slow");
    $("#secSistema").show("slow");
}

var cantidadChbox = 0;
var controlModulos = 1;
var controlPerifles = 0;
$(document).ready(inicia);