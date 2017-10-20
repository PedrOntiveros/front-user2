var inicia = function(){
    $("#btnSistema").on("click",cargaPaginaSistema);
    $("#masModulo").on("click",agregaModulo);
    $("#agregaPerfil").on("click",muestraFormPerfil);
    $("#regresaSistema").on("click",regresaSistema);
    $("#guardaPS").on("click",guardarPerfil);
}
//Ejecuta desde la función guardarPerfil
//Mostrará los datos del perfil que se guardó en la sección
var muestraPerfilGuardado = function(){
    var htmlPerfil = "";
    for(i=0; i<PerfilesCreados.length;i++){
        htmlPerfil = "<div class='panel panel-info'>"+
                     "<b>Perfil: </b>"+PerfilesCreados.pop+"<br>"+
        // <b>Modulos: </b>Aquí van los modulos <br>
        // <button class="btn btn-primary btn-xs">Modifica</button>	
        //</div>
        //hacer el desmadre para que se creen los perfiles que ya he guardado.
   
    }
    $("#secSistema").show("slow");  
}

//Ejecutada al hacer clic en Guardar Perfil
//obtiene los datos del perifil, y los guarda en un arreglo.
var guardarPerfil = function(e){
    e.preventDefault();
    if(!confirm("¿Esta seguro de quere guardar así las cosas?")){
        return;
    }
    var nombrePerfil = $("#SistemaPerfilName").val();
    var moduloSeleccionados = []
    var perfilCreado = [];
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
    perfilCreado.push(nombrePerfil);
    perfilCreado.push(moduloSeleccionados.toString());
    PerfilesCreados.push(perfilCreado);
    $("#panelAddPerfil").hide("slow");
    muestraPerfilGuardado();
}

//Ejecutada al hacer clic en el botón Guardar. Desahabilitada hasta que se agregue un perfil.
//función para guardar el sistema, este solo debe funcionar ya que todo esté llenado
var guardarSistema = function(){
}

//Ejecutada al hacer clic en el botón Regresa.
//función para regresar de la sección de agregar perfil a la de sistema
var regresaSistema = function(e){
    e.preventDefault();
    $("#secSistema").slideDown("slow");
    $("#panelAddPerfil").slideToggle("slow");
}

//Ejecutada al hacer clic en el botón Agregar Perfil.
//función para mostrar la sección de agregar el perfil para el sistema
var muestraFormPerfil = function(e){
    e.preventDefault();
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
        }else{
            insertaModulos(modulosDisp);
            $("#headingPerfil").append(nombreSistema);
            $("#secSistema").slideUp("slow",)
            $("#panelAddPerfil").show("slow");
        }
    }
}

//ejecutada desde la funcion muestraFormPerfil}
//recorre el Array obtenido en obtenModulo para crear Checkbox en la sección de AgregarPerfil
var insertaModulos = function(modulDisponibles){
    var modulo ="";
    for(i=0;i<modulDisponibles.length;i++){
        modulo += "<div class='checkbox''><label>"+
        "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+modulDisponibles[i]+"'>"+
        modulDisponibles[i]+"</label></div>";
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
        if("" != temp){
            arrayModulo.push(temp);
        }
    }
    return arrayModulo; 
}

//Ejecutada al hacer clic en el botón "+" en la sección de sistema.
//agrega un campo más para un modulo
var agregaModulo = function(e){
    e.preventDefault();
    controlModulos++;
    $("#modulosDisponibles").append(
        "<input class='form-control form-modulo' type='text' placeholder='Modulo' id='modulo"+
        controlModulos+"'>");
}

//Ejecutada al hacer clic en Sistema, en la barra de nav
//Solo oculta todo y muestra la sección de Sistema.
var cargaPaginaSistema = function(){
    $("#secUsuario").hide("slow");
    $("#secPerfil").hide("slow");
    $("#secSistema").show("slow");
    $("#panelAddPerfil").hide("slow");
}

var PerfilesCreados = [];
var cantidadChbox = 0;
var controlModulos = 0;
$(document).ready(inicia);