var inicia = function(){
    $("#btnSistema").on("click",cargaPaginaSistema);
    $("#masModulo").on("click",agregaModulo);
    $("#agregaPerfil").on("click",muestraFormPerfil);
    $("#regresaSistema").on("click",regresaSistema);
    $("#guardaPS").on("click",guardarPerfil);
    $("#guardarSistema").on("click",guardaSistema);
    $("#PerfilABuscar").on("keyup",buscaPerfil);
}

var buscaPerfil = function(tecla){
    var likePerfil = $("#PerfilABuscar").val();
    if("" == likePerfil || 8==tecla.keyCode){
        var temp = perfilesGuardados.length;
        for(i=temp;i>0;i--){
            PerfilesCreados.push(perfilesGuardados.pop());
        }
        muestraPerfilGuardado();
        return;
    }
    var numPerfil = PerfilesCreados.length;
    var perfil;
    for (i=numPerfil; i>0; i--){            //Cuando hago backspace no realiza la busqueda
        perfil = PerfilesCreados.pop();
        var nombrePerfil = perfil[0];
        if(nombrePerfil.includes(likePerfil)){
            perfilCoincide.push(perfil);
        }
        else{
            perfilesGuardados.push(perfil);
        }
    }
    numPerfil = perfilCoincide.length;
    for(i=numPerfil;i>0;i--){
        PerfilesCreados.push(perfilCoincide.pop());
    }
    muestraPerfilGuardado();
 }

//la mas importante
//Aquí vamos a mandar toda la wea esa por ajax al endpoint

var eliminaModulo = function(id){
    var idText = $(id).attr("id");
    var value = $(id).val();
    var index;
    for (i=0; i<PerfilesCreados.length;i++){
        index = PerfilesCreados[i][1].indexOf(value);
        if(-1==index){
            continue;
        }
        else if(1==PerfilesCreados[i][1].length){
            alert("El modulo que intenta eliminar es el único modulo de un perfil");
            muestraPerfilGuardado();
            return;
        }
        var modulos = PerfilesCreados[i][1];
        console.log("modulos: "+modulos);
        console.log("en la posicion: "+index);
        console.log("entonces deberia elimirnar: "+modulos[index]);
        modulos.splice(index,1);
        console.log("asi queda: "+modulos)
    }
    $("#panel"+idText).remove();
    modulosActuales--;
    muestraPerfilGuardado();
    //con el splice elimino el modulo
    //y tengo que quitarlo de los modulos que lo tengan
}

var guardaSistema = function(){
    if(!confirm("¿Desea guardar el sistema?")){
        return;
    }
    var nombre = $("#systemName").val();
    var modulos = obtenModulos().toString();
    var perfiles = "Perfiles {\n";
    for(let perfil of PerfilesCreados){
        perfiles +="\nNombre: "+perfil[0]+
                   "\nmodulos: "+perfil[1];
    }
    alert("Sistema: "+nombre+"\nModulos: "+modulos+"\nPerfiles: "+perfiles);
}

var eliminaPerfil = function(idPerfil){
    if(!confirm("¿Desea eliminar el perfil?")){
        return;
    }
    PerfilesCreados.splice(idPerfil,1);
    muestraPerfilGuardado();
}

//Ejecutado al hacer click en algún modificar
//Deberá mostrar la página de agrega Perfil pero con los datos de ese perfil
var modificaPerfil = function(idPerfil){
    if(!confirm("¿Desea modificar el perfil?")){
        return;
    }
    for(i=PerfilesCreados.length-1;i>=0;i--){
        if(idPerfil==i){
            perfilaModificar = PerfilesCreados.pop();
            break;
        }else{
            arrayTemp.push(PerfilesCreados.pop());
        }
    }
    var nombrePerfil = perfilaModificar[0];
    var modulosPerfil= perfilaModificar[1];
    muestraFormPerfil();
    $("#SistemaPerfilName").val(nombrePerfil);
    var checkbox ="";
    var modulo = "";
    for(i=0;i<=controlModulos;i++){
        checkbox = "#checkbox"+i;
        modulo = $(checkbox).val();
        if(modulosPerfil.includes(modulo)){
            $(checkbox).prop('checked', true);
        }else{
            $(checkbox).prop('checked', false);
        }
    }
    modifica = true;
    $("#secSistema").slideUp("slow",)
    $("#panelAddPerfil").show("slow");
}

//Ejecuta desde la función guardarPerfil
//Mostrará los datos del perfil que se guardó en la sección
var muestraPerfilGuardado = function(){
    var htmlPerfil = "";
    PerfilesCreados.sort();
    for(i=0; i<PerfilesCreados.length;i++){
        var perfili = PerfilesCreados[i].slice();
        var modPerfil = perfili.pop();
        var nomPerfil = perfili.pop();
        htmlPerfil += "<div class='panel panel-info'>"+
                     "<b>Perfil: </b>"+nomPerfil+"<br>"+
                     "<b>Modulos: </b>"+modPerfil+"<br>"+
                     "<button class='btn btn-primary btn-xs' onclick=modificaPerfil("+i+")>Modifica</button>"+
                     "<button class='btn btn-danger btn-xs' onclick=eliminaPerfil("+i+")>Borra</button>"+                     
                     "</div>";
    }
    $("#perfilesCreados").html(htmlPerfil);
    $("#secSistema").show("slow");
    if(0<PerfilesCreados.length){
        $("#guardarSistema").prop("disabled", false);
    }
    else{
        $("#guardarSistema").prop("disabled", true);
    }
}

//Ejecutada al hacer clic en Guardar Perfil
//obtiene los datos del perifil, y los guarda en un arreglo.
var guardarPerfil = function(){
    if(!confirm("¿Esta seguro de quere guardar así las cosas?")){
        return;
    }
    var nombrePerfil = $("#SistemaPerfilName").val();
    if(""==nombrePerfil){
        alert("El perfil debe tener nombre");
        return;
    }
    var moduloSeleccionados = []
    for(i=0;i<cantidadChbox;i++){
        var chkbox = "#checkbox"+i;
        if($(chkbox).prop("checked")){
            moduloSeleccionados.push($(chkbox).val());
        }
    }
    if(0 == moduloSeleccionados.length){
        alert("Seleccione al menos un modulo.");
        return;
    }
    var perfilCreado = [];
    perfilCreado.push(nombrePerfil);
    perfilCreado.push(moduloSeleccionados);
    PerfilesCreados.push(perfilCreado);
    var tamañoArregloTemporal = arrayTemp.length;
    for(i=0;i<tamañoArregloTemporal;i++){
        PerfilesCreados.push(arrayTemp.pop());
    }
    $("#panelAddPerfil").hide("slow");
    muestraPerfilGuardado();
}

//Ejecutada al hacer clic en el botón Regresa.
//función para regresar de la sección de agregar perfil a la de sistema
var regresaSistema = function(){
    if(modifica){
        PerfilesCreados.push(perfilaModificar);
        var tamañoTemporal = arrayTemp.length;
        for(i=0;i<tamañoTemporal;i++){
            PerfilesCreados.push(arrayTemp.pop());
        }
        modifica=false;
    }
    muestraPerfilGuardado();
    $("#secSistema").slideDown("slow");
    $("#panelAddPerfil").slideToggle("slow");
}

//Ejecutada al hacer clic en el botón Agregar Perfil.
//función para mostrar la sección de agregar el perfil para el sistema
var muestraFormPerfil = function(){
    if(!confirm("¿Seguro que desea continuar?")){
        return;
    }else{
        var nombreSistema =  $("#systemName").val();
        if("" == nombreSistema){
            alert("Dé al sistema un nombre.");
            return;
        }
        var modulosDisp = obtenModulos();
        if(0 == modulosDisp.length){
            alert("Agrege al menos un modulo.");
            return;
        }
        if(0 >= modulosActuales){
            alert("No puede dejar el sistema sin modulos");
            return;
        }else{
            insertaModulos(modulosDisp);
            $("#SistemaPerfilName").val("");
            $("#headingPerfil").html("Agrega un perfil para: "+nombreSistema);
            $("#secSistema").slideUp("slow",)
            $("#panelAddPerfil").show("slow");
        }
    }
}

//ejecutada desde la funcion muestraFormPerfil}
//recorre el Array obtenido en obtenModulo para crear Checkbox en la sección de AgregarPerfil
var insertaModulos = function(modulDisponibles){
    var modulo ="";
    cantidadChbox = 0;
    for(i=0;i<modulDisponibles.length;i++){
        modulo +=   "<div class='col-lg-6'>"+
                    "<div class='input-group'>"+
                    "<span class='input-group-addon'>"+
                    "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+modulDisponibles[i]+"'>"+
                    "</span>"+
                    "<label class='form-control' aria-label=''>"+modulDisponibles[i]+"</label>"+
                    "</div></div>";
        // modulo += "<div class='checkbox''>"+
        // "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+modulDisponibles[i]+"'><label>"+
        // modulDisponibles[i]+"</label></div>";
   }
    $("#modulDisponibles").html(modulo);
}

//ejecutada desde la funcion muestraFormPerfil
//obtinene todos los textos escritos en los inputs para modulos y los guarda en un Array
var obtenModulos = function(){
    var NumImputModulo;
    var temp;
    var arrayModulo = [];
    for(i=0;i<=controlModulos;i++){
        NumImputModulo ="#modulo"+i;
        temp = $(NumImputModulo).val();
        if("" != temp && undefined != temp){
            arrayModulo.push(temp);
        }
    }
    return arrayModulo; 
}

//Ejecutada al hacer clic en el botón "+" en la sección de sistema.
//agrega un campo más para un modulo
var agregaModulo = function(){
    controlModulos++;
    modulosActuales ++;
    $("#modulosDisponibles").append(
        "<div class='col-lg-6' id='panelmodulo"+controlModulos+"'>"+
        "<div class='input-group' style='margin-bottom:5px;'>"+
            "<span class='input-group-btn'>"+
                "<button class='btn btn-danger' type='button' onclick='eliminaModulo(modulo"+controlModulos+")'>-</button>"+
            "</span><input type='text' class='form-control' id='modulo"+controlModulos+
            "' placeholder='Modulo'></div></div>");
}

//Ejecutada al hacer clic en Sistema, en la barra de nav
//Solo oculta todo y muestra la sección de Sistema.
var cargaPaginaSistema = function(){
    $("#secUsuario").hide("slow");
    $("#secPerfil").hide("slow");
    $("#secSistema").show("slow");
    $("#panelAddPerfil").hide("slow");
}

var perfilaModificar;
var arrayTemp = [];
var perfilesGuardados = [];
var perfilCoincide = [];
var modifica = false;
var PerfilesCreados = [];
var cantidadChbox = 0;
var controlModulos = 0;
var modulosActuales = 1;
$(document).ready(inicia);