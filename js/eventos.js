var iniciaApp = function(){
	//Hacer solicitud de los sistemas que hay con sus respectivos modulos, para poder llenar el combo
	//y los modulos usarlos para la sección de creación de perfiles.
	//Botones del Menu

	$("#btnUsuario").on("click",function(){
		$("#secUsuario").show("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").hide("slow");});
	
	//Evento para los dropbox
}


var muestraModulos = function(){
	var index = $(this).val();	//obtenemos el valor del sistema seleccionado
	if(index == 0)
		return; //si es 0 quiere decir ue se seleccionó "Selecciona" y no hacemos nada.
	//validar que el seleccionado no esté en SistemasPerfil, y si está preguntar si quiere editarlo, sino return;
	var modulos = $.ajax({
		method: "GET",
		url:"api/sistemas",
		dataType: "json"
	});
	modulos.done(function(data){
		//var numeroModulos = 0;
		var modulo = "";
		for(i=0;data.length;i++){
			if(data[i].nombre != index){
				continue;
			}
			var nombreModulo = data[i].modulos;
			break;
		}
		var moduloSeparated = nombreModulo.split(",");
		for(i=0;i<moduloSeparated.length;i++){
			modulo += "<label>"+
					  "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
					  moduloSeparated[i]+"</label><br>";
		}
		
		$("#modulosDispPerf").html(modulo);
		$("#modulPerfiles").show("slow");
	});
	modulos.fail(function(){
		alert("No se cargaron los sistemas disponibles");
	});	
}

var guardarSistema = function(e){
	var nombreSistema = $("#systemName").val();
	if(nombreSistema == ""){
        alert("El sistema no cuenta con nombre");
        e.preventDefault();
        return;
    }
	var modulos; 
	for (i=0;i<controlModulos; i++){
		var mod=$("#modulo"+i).val();
		if(mod == "")
			continue;
		if(i == (controlModulos-1)){
			modulos +=mod;
			continue;
		}
		modulos += mod+",";
	}
	var parametros = "nombre="+nombreSistema+
					 "&modulos="+modulos;
	peticionAjax(parametros,"api/sistemas")
}

var guardarPerfil = function(e){
	//que el perfil no este vacio
	var nombrePerfil = $("#perfilName").val();
	if(nombrePerfil == ""){
        alert("Agregue un nombre al perfil");
        e.preventDefault();
        return;
    }
    agregaSistemaPerfil();
    //obtenemos los perfiles seleccionados para este usuario. 
    //Tenemos que mandarle el nombre del sistema y los modulos que tendra disponible ese perfil, para el sistema
    if(SistemasPerfil.length == 0){
    	//no se ha seleccionado sistema ni modulos
    	//preguntar si debemos validar si a fuerzas debe seleccionarse al menos 1 modulo
    	alert("No ha seleccionado nada, ¡Inútil!");
    	e.preventDefault();
    	return;
    }
    
    var parametros = "nombre="+nombrePerfil+
    				 "&sistemas="+SistemasPerfil; //COMO MANDAR UN ARRAY POR AJAX COMO PARAMETRO
    peticionAjax(parametros,"");  //no sabemos la url
}

var agregaSistemaPerfil = function(e){
    //Del sistema que seleccione deben aparecer todos los modulos con los que cuenta, y despues seleccionar los que queremos
    //que el perfil que estamos creando podra manejar
    if(confirm("¿Está completa la seleccion de modulos?")){
	    //ciclo para recorrer los modulos y saber si esta seleccionados
	    e.preventDefault();
		var modulosSeleccionados="";
		for (i=0;i<cantidadChbox; i++){ 
	    	if(i==(cantidadChbox-1)){
		    	if($("#checkbox"+i).prop('checked')){
		    		modulosSeleccionados+=$("#checkbox"+i).val();
		    	}
		    	continue;
		    }	
		    if($("#checkbox"+i).prop('checked')){
		    	modulosSeleccionados+=$("#checkbox"+i).val();
		    	modulosSeleccionados+=",";
		    }
		}

		//sacar el value de la etiqueta select para saber que sistema es y mandarla por ajax
		var nombreSistema = $("#comboSistP").val(); //estamos geteando el nombre del sistema
		var relacionSistemaModulo = "nombreSistema="+nombreSistema+
						 			"&modulosPermitidos="+modulosSeleccionados;
		SistemasPerfil.push(relacionSistemaModulo);
		$("#panelSistemasPerfil").html(old_html);
		return;
    }
    //validar que la info este correcta
    e.preventDefault();
}

var peticionAjax = function(paramectros, url){
	if(confirm("¿Están todos los datos correctos?")){
		var sistguardado = $.ajax({
			method: "POST",
			url: url, //aquí va la url donde se guardará el sistema
			data: parametros,
			dataType: "json"
		});
		sistguardado.done(function(){
			alert("¡Sistema agregado!");
		});
		sistguardado.fail(function(){
			alert("Error, no se agregó el sistema.");
		});
	}else{e.preventDefault();}
}

//Este es variable para llevar un conteo de los modulos que se agregan al sistema

var cantidadChbox = 0;
var SistemasPerfil = [];
var old_html;

$(document).ready(iniciaApp);

