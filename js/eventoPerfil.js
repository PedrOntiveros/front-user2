var direccionip = "http://34.214.94.231:8088/api/";

var iniciaApp = function(){

	//Hacer solicitud de los sistemas que hay con sus respectivos modulos, para poder llenar el combo

	//y los modulos usarlos para la sección de creación de perfiles

	//8087/api/sistemas

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
			option += "<option value='"+data[i].nombre+"'>"+data[i].nombre+"</option><br>"
		}
		$("#comboSistU").html(option);    //Combo de sistemas para nuevo usuario
		$("#comboSistP").html(option);	  //Combo de sistemas para nuevo perfil	
	});

	sistemas.fail(function(){
		alert("No se cargaron los sistemas disponibles ASDASDSA"); //MODIFICAR PARA QUE SE HAGA ESTE ALERT
	});

	old_html = $("#panelSistemasPerfil").html();

	//Botones del Menu

	$("#btnNuevoPerfil").on("click",function(e){
		e.preventDefault();
		$("#addPerfil").show("slow");
		$("#modPerfil").hide("slow");
		muestraModulos();
    	//document.getElementById("addPerfil").style.display = 'block';
	});

	$("#btnModificarPerfil").on("click",function(e){
		e.preventDefault();
		$("#modPerfil").show("slow");
		$("#addPerfil").hide("slow");
		muestraPerfiles();
		//muestraModulos();
		//document.getElementById("addPerfil").style.display = 'block';		
	});	

	$("#btnPerfil").on("click",function(){
		$("#secUsuario").hide("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").show("slow");
	});

	$("#comboSistU").change(muestraPerfiles);
	
	$("#comboSistP").change(muestraBotones);
	$("#GuardarPerfil").on("click", guardarPerfil);
	$("#guardarCambiosPer").on("click",modificarPerfil);

}

var muestraBotones = function(){
	$("#addBotones").show("slow");
}

var modificarPerfil = function(){
	//aquí solo voy a actualizar la información
}
var muestraPerfiles = function(){
	var sistema = $("#comboSistP").val();	//obtenemos el valor del sistema seleccionado OCUPO CHECAR BIEN ESTO

	if(null == sistema){
		return; //si es nukl quiere decir que no hay sistemas
	}

	var perfiles = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"/perfiles",
        dataType: "json"
	});

	perfiles.done(function(data){

		var modulo = "";
		var nombrePerfiles = [];

		for(i=0;i<data.length;i++){
			if(data[i].nombreSistema != sistema){
				continue;
			};
			nombrePerfiles.push(data[i].nombre);
		}
		var perfiles="";
		for(i=0;i<nombrePerfiles.length;i++){
			perfiles+= "<input type='button' id='boton"+i+"' onclick='muestraModuloPorPerfil(boton"+i+"	)' value='"+nombrePerfiles[i]+"'>";		
		}
		$("#panelSistemasPerfil2").html(perfiles);

		// var moduloSeparated = nombreModulo.split(",");
		// for(i=0;i<moduloSeparated.length;i++){
		// 	modulo += "<label>"+
		// 			  "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
		// 			  moduloSeparated[i]+"</label><br>";
        // }
		// $("#modulosDispPerf").html(modulo);  //donde se introducen
		// $("#modulPerfiles").show("slow");  //donde se van a mostrar
	});
	perfiles.fail(function(){
		alert("No se cargaron los PERFILES disponibles");
	});
}

var muestraModuloPorPerfil = function(boton){
	//te mando el sistema y me regresa todos los perfiles que tiene ese sistema y por ende estan ahi todos los modulos
	//DEBO MANDARLE EL ID UNICO DEL SISTEMA
	console.log("dfsdgasdf");
	var Perfil = $(boton).val();
	var sistema = $("#comboSistP").val();

	console.log(Perfil);

	$("#newPerfilName").val(Perfil);
	//alert("ESTOY ENTRANDO AL MODULOPORPERFIL");

	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"/sistemas",
        dataType: "json"
	});	
	modulos.done(function(data){
		var modulo = "";
		var nombreModulo;

		console.log("im here");
		for(i=0;i<data.length;i++){
			if(data[i].nombre != sistema){
				continue;
			}

			nombreModulo = data[i].modulos;
			console.log(nombreModulo);
			break;
		}

		var moduloSeparated = nombreModulo.split(",");

		for(i=0;i<moduloSeparated.length;i++){
			modulo += "<div class='checkbox''><label>"+
					  "<input type='checkbox' id='checkbox"+(cantidadChboxPorPerfil++)+"' value='"+moduloSeparated[i]+"'>"+
					  moduloSeparated[i]+"</label></div>";
		}
		console.log(modulo);

		//CON EL PERFIL QUE TRAES, DEBES SACAR SUS MODULOS Y HACER LOS CHECKS

		//CONSUMIR UN END POINT HACIENDO UN POST CON LOS DATOS NUEVOS 

    	$("#modulosDelPerfil").html(modulo);
		$("#modulPorPerfiles").show("slow");

	
	});
	modulos.fail(function(){
		alert("No se cargaron los MODULOS disponibles");
	});

}

var muestraModulos = function(){

	var sistema = $("#comboSistP").val();	//obtenemos el valor del sistema seleccionado
	if(null==sistema){
		return; //si es 0 quiere decir ue se seleccionó "Selecciona" y no hacemos nada.
	}
	//validar que el seleccionado no esté en SistemasPerfil, y si está preguntar si quiere editarlo, sino return;

	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"sistemas",
        dataType: "json"		
	});

	modulos.done(function(data){

		var modulo = "";
		var nombreModulo;

		for(i=0;i<data.length;i++){
			if(data[i].nombre != sistema){
				continue;
			}

			nombreModulo = data[i].modulos;
			break;
		}

		var moduloSeparated = nombreModulo.split(",");

		for(i=0;i<moduloSeparated.length;i++){
			modulo += "<div class='checkbox''><label>"+
					  "<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
					  moduloSeparated[i]+"</label></div>";
		}

    	$("#modulosDispPerf").html(modulo);
		$("#modulPerfiles").show("slow");
	});
	modulos.fail(function(){
		//alert("No se cargaron los MODULOS disponibles");
	});	
}

var guardarPerfil = function(e){

	//que el perfil no este vacio
	alert("ENTRE");

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

		});agregan

		sistguardado.fail(function(){

			alert("Error, no se agregó el sistema.");

		});

	}else{e.preventDefault();}

}

//Este es variable para llevar un conteo de los modulos que se agregan al sistema
var controlModulos = 0;
var cantidadChbox = 0;
var cantidadChboxPorPerfil =0;
var SistemasPerfil = [];
var old_html;

$(document).ready(iniciaApp);
