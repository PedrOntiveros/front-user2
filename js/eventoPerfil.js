var direccionip = "http://34.214.94.231:8088/api/";

var iniciaApp = function(){
	$("#btnNuevoPerfil").on("click",function(e){
		e.preventDefault();
		$("#addPerfil").show("slow");
		$("#modPerfil").hide("slow");
		muestraModulos();
	});
	$("#btnModificarPerfil").on("click",function(e){
		e.preventDefault();
		$("#modPerfil").show("slow");
		$("#addPerfil").hide("slow");
		muestraPerfiles();	
	});	
	$("#btnPerfil").on("click",function(){
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
			$("#comboSistP").html(option);	  //Combo de sistemas para nuevo perfil	
		});
		sistemas.fail(function(){
			alert("No se cargaron los sistemas disponibles"); //MODIFICAR PARA QUE SE HAGA ESTE ALERT
		});
		$("#secUsuario").hide("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").show("slow");
	});
	$("#comboSistP").change(muestraBotones);
	$("#GuardarPerfil").on("click", guardarPerfil);
	$("#guardarCambiosPer").on("click",modificarPerfil);
}

var muestraBotones = function(){
	$("#addBotones").show("slow");
	$("#modPerfil").hide("slow");
	$("#addPerfil").hide("slow");
	$("#modulPorPerfiles").hide("fast");
}

var modificarPerfil = function(e){
	e.preventDefault();
	// console.log(PerfilSeleccionado); 
	var NuevoNombreDePerfil = $("#newPerfilName").val(); //Nuevo Nombre para el Perfil
	//var SistemaID=$("#comboSistP").val(); //El ID del Sistema
	var NombreSistema=comboSistP.options[comboSistP.selectedIndex].text; //Nombre del Sistema 
	if(PerfilSeleccionado==NuevoNombreDePerfil){
		alert("No pueden existir dos perfiles iguales");
		return;
	}

	var moduloSeleccionados = []
	for(i=0;i<cantidadChboxPorPerfil;i++){
		var chkbox = "#checkbox"+i;
		if($(chkbox).prop("checked")){
			moduloSeleccionados.push($(chkbox).val());
		}
	}

	if(0 == moduloSeleccionados.length){
		alert("Seleccione al menos un modulo.");
		return;
	}
	var ModulosaEnviar = moduloSeleccionados.toString();
	//aquí se debe hacer lo del post
}

var muestraPerfiles = function(){
	var sistema = $("#comboSistP").val();
	if("" == sistema){
		return;
	}

	var perfiles = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
	    url:direccionip+"/sistemas/"+sistema,
        dataType: "json"
	});
	perfiles.done(function(data){
		var perfiles="";
		for(i=0;i<data.perfiles.length;i++){		
			perfiles+= "<input type='button' id='boton"+i+"' onclick='muestraModuloPorPerfil(boton"+i+"	)' value='"+data.perfiles[i].nombre+"'>";		
			console.log(data.perfiles[i].nombre);
		}
		$("#panelSistemasPerfil2").html(perfiles);
	});
	perfiles.fail(function(){
		alert("No se cargaron los PERFILES disponibles");
	});
}

var muestraModuloPorPerfil = function(boton){
	var Perfil = $(boton).val(); 	      //Obtine el nombre del Perfil.
	var sistema = $("#comboSistP").val(); //Este me regresa ID del sistema
	var moduloSeparated;
	PerfilSeleccionado=Perfil;
	$("#newPerfilName").val(Perfil);
	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"/sistemas/"+sistema,
        dataType: "json"
	});	
	modulos.done(function(data){
		var moduloSeparated = data.modulosSitema.split(",");
		var modulo="";
		var modulosdelperfil="";
		for(i=0;i<data.perfiles.length;i++){		
			if(data.perfiles[i].nombre!=Perfil){
				continue;
			}
			modulosdelperfil=data.perfiles[i].modulosSistemas;
		}

		var arregloconmodulosdelperfil = modulosdelperfil.split(",");
		var mod="";
		var moddelperfil="";
		for(i=0;i<moduloSeparated.length;i++){
			mod=moduloSeparated[i];
			if(arregloconmodulosdelperfil.includes(mod)){
					modulo += "<div class='checkbox''><label>"+
								"<input type='checkbox' id='checkbox"+(cantidadChboxPorPerfil++)+"' value='"+moduloSeparated[i]+"' checked>"+
								moduloSeparated[i]+"</label></div>";
			}	
			else{
					modulo += "<div class='checkbox''><label>"+
							"<input type='checkbox' id='checkbox"+(cantidadChboxPorPerfil++)+"' value='"+moduloSeparated[i]+"'>"+
								moduloSeparated[i]+"</label></div>";
			}
		}
		$("#modulosDelPerfil").html(modulo);
		$("#modulPorPerfiles").show("slow");
	});
	modulos.fail(function(){
		alert("No se cargaron los MODULOS disponibles");
	});
}

var muestraModulos = function(){
	var sistema = $("#comboSistP").val();
	var moduloSeparated;
	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"/sistemas/"+sistema,
        dataType: "json"
	});	
	modulos.done(function(data){
		var moduloSeparated = data.modulosSitema.split(",");
		var modulo="";
		for(i=0;i<moduloSeparated.length;i++){
			modulo += "<div class='checkbox''><label>"+
					"<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
					moduloSeparated[i]+"</label></div>";	
		}
		$("#modulosDispPerf").html(modulo);
		$("#modulPerfiles").show("slow")
	});
	modulos.fail(function(){
		alert("No se cargaron los MODULOS disponibles");
	});
}

var guardarPerfil = function(e){
	e.preventDefault();
	var NuevoPerfil = $("#perfilName").val();
	var Sistema = comboSistP.options[comboSistP.selectedIndex].text;
	var Modulos="";
	console.log(NuevoPerfil);
	if(""==NuevoPerfil){
		alert("Agregue un nombre al Perfil");
		return;
	}

	var moduloSeleccionados=[];
	for(i=0;i<cantidadChbox;i++){
		var chkbox = "#checkbox"+i;
		if($(chkbox).prop("checked")){
			moduloSeleccionados.push($(chkbox).val());
		}
	}
	Modulos = moduloSeleccionados.toString();
	if(""==Modulos){
		alert("Seleccione al menos un modulo");
		return;
	}	

	var parametros = "nombre="+NuevoPerfil+
					 "&nombreSistema="+Sistema+
					 "&modulosSistemas="+Modulos;						
	// falta peticionAjax(parametros,"");
}

//Este es variable para llevar un conteo de los modulos que se agregan al sistema
var controlModulos = 0;
var cantidadChbox = 0;
var cantidadChboxPorPerfil =0;
var SistemasPerfil = [];
var PerfilSeleccionado="";
var SistemaSeleccionado="";
var idDelPerfil="";
$(document).ready(iniciaApp);