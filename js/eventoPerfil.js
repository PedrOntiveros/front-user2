var direccionIp =  "http://192.168.1.56:8087/api/";
var iniciaApp = function(){
	$("#btnNuevoPerfil").on("click",function(e){
		e.preventDefault();
		if($("#comboSistP").val()=='0'){
			alert("Seleccione un Sistema");
			return;
		}
		$("#addPerfil").show("slow");
		$("#modPerfil").hide("slow");
		muestraModulos();
	});
	$("#btnModificarPerfil").on("click",function(e){
		e.preventDefault();
		if($("#comboSistP").val()=='0'){
			alert("Seleccione un Sistema");
			return;
		}
		$("#modPerfil").show("slow");
		$("#addPerfil").hide("slow");
		muestraPerfiles();
	});	
	$("#btnPerfil").on("click",function(){
		var sistemas = $.ajax({
			method: "GET",
			headers: { 'Accept': 'application/json',
			'Content-Type': 'application/json'},
			url:direccionIp+"sistemas",
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
	
		old_html = $("#panelSistemasPerfil").html();

		$("#secUsuario").hide("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").show("slow");
	});

	//BOTON ENVIAR
	//$("#btnEnviar").on("click",muestraModuloPorPerfil);
	$("#comboPerfiles").on("keyup",function(tecla){
		if(tecla.keyCode==13){
			muestraModuloPorPerfil();
			return;
		}
		//muestraModuloPorPerfil();
		
	});

	$("#comboSistP").change(muestraBotones);
	$("#comboSistPerfiles").change(muestraModuloPorPerfil);
	$("#GuardarPerfil").on("click", guardarPerfil);
	$("#guardarCambiosPer").on("click",function(e){

		e.preventDefault();
		modificarPerfil();
});

}

var muestraBotones = function(){
	$("#addBotones").show("slow");
	$("#modPerfil").hide("slow");
	$("#addPerfil").hide("slow");
	$("#modulPorPerfiles").hide("fast");
}

var modificarPerfil = function(e){
		
	console.log(PerfilSeleccionado); 
	var NuevoNombreDePerfil = $("#nuevonombre").val(); //Nuevo Nombre para el Perfil
	var NombreSistema=comboSistP.options[comboSistP.selectedIndex].text; //Nombre del Sistema 
	
	if(PerfilSeleccionado==NuevoNombreDePerfil){
		alert("No pueden existir dos perfiles iguales");
		return;
	}

	//ocupo obtener cuales son los nuevos modulos selecciones
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

	//Aquí estan como string
	var ModulosaEnviar = moduloSeleccionados.toString();

}

var muestraPerfiles = function(){
	var sistema = $("#comboSistP").val();
	var nombreSistema = comboSistP.options[comboSistP.selectedIndex].text; //Obtengo el nombre del "Option" seleccionado
	//var perfilaBuscar=$("#perfilABuscar").val();
	//console.log("El perfil que quieres ubscar es "+perfilaBuscar);

	//console.log(sistema)
	if("" == sistema || nombreSistema=="Selecciona"){
		alert("Selecciona un Sistema");
		return false; //si es "" quiere decir que no hay sistemas
	}

	var perfiles = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionIp+"/sistemas/"+sistema,
        dataType: "json"
	});

	perfiles.done(function(data){
		
		var perfiles="";
		for(i=0;i<data.perfiles.length;i++){
			console.log("entre al for");
			perfiles += "<option value='"+data.perfiles[i].nombre+"' id='boton"+i+"'>"+data.perfiles[i].nombre+"</option><br>"
			console.log("estoyentrandoalfor");
		};

		$("#comboSistPerfiles").html(perfiles);
		console.log(perfiles);
	});

	perfiles.fail(function(){
		alert("No se cargaron los PERFILES disponibles");
	});

}

var muestraModuloPorPerfil = function(){
	var Perfil=$("#comboPerfiles").val(); //NOMBRE DEL PERFIL

	$("#nuevonombre").val(Perfil)

	var sistema = $("#comboSistP").val();
	PerfilSeleccionado=Perfil;

	$("#newPerfilName").val(Perfil);

	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionIp+"perfiles",
        dataType: "json"
	});	

	modulos.done(function(data){
		 var modulo="";
		 var modulosdelperfil=[];
		 var modulosdelsistema=[];
		 var perfilesdelsistema=[];
	
		//Guardo los perfiles existentes
		for(i=0;i<data.perfiles.length;i++){
			perfilesdelsistema.push(data.perfiles[i].nombre);
			console.log(data.perfiles[i].nombre);
		}

		//Guardo todos los modulos del sistema
		for(i=0;i<data.modulos.length;i++){
			modulosdelsistema.push(data.modulos[i].nombreModulo);
		}
		//Guardo todos los modulos que tiene un perfil
		for(i=0;i<data.perfiles.length;i++){		
			if(data.perfiles[i].nombre!=Perfil){
				continue;
			}
			for(j=0;j<data.perfiles[i].modulosSistemas.length;j++){
				//console.log(data.perfiles[i].modulosSistemas[j].nombreModulo);
				modulosdelperfil.push(data.perfiles[i].modulosSistemas[j].nombreModulo);
			}
		} 

		for(i=0;i<modulosdelsistema.length;i++){
			if(modulosdelperfil.includes(modulosdelsistema[i])){
				modulo += "<div class='checkbox''><label>"+
				"<input type='checkbox' id='checkbox"+(cantidadChboxPorPerfil++)+"' value='"+modulosdelsistema[i]+"' checked>"+
				modulosdelsistema[i]+"</label></div>";
			}
			else{
				modulo += "<div class='checkbox''><label>"+
				"<input type='checkbox' id='checkbox"+(cantidadChboxPorPerfil++)+"' value='"+modulosdelsistema[i]+"'>"+
				modulosdelsistema[i]+"</label></div>";
			}

		}
		console.log(modulosdelsistema.length+"YOU PRINTED THIS");
	
		if(perfilesdelsistema.includes(Perfil)){
			$("#modulosDelPerfil").html(modulo);
			$("#modulPorPerfiles").show("slow");	
		}
		else{
			alert("El perfil que seleccionó no existe")
			$("#modulPorPerfiles").hide("slow");
		}
	});
	modulos.fail(function(){
		alert("No se cargaron los MODULOS disponibles");
	});
}

var muestraModulos = function(){

	//var Perfil = $(boton).val();
	var sistema = $("#comboSistP").val();
	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
		url:direccionIp+"modulos/"+sistema,
	    dataType: "json"
	});	
	modulos.done(function(data){
		//var moduloSeparated = data.modulosSitema.split(",");
		var modulo="";
		for(i=0;i<data.length;i++){
			console.log("llegue aqui "+data[i].nombreModulo);
			modulo += "<div class='checkbox''><label>"+
					"<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+data[i].nombreModulo+"'>"+
					data[i].nombreModulo+"</label></div>";
		}
		// for(i=0;i<moduloSeparated.length;i++){
		// 	modulo += "<div class='checkbox''><label>"+
		// 			"<input type='checkbox' id='checkbox"+(cantidadChbox++)+"' value='"+moduloSeparated[i]+"'>"+
		// 			moduloSeparated[i]+"</label></div>";	
		// }
	
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
	var idSistema=$("#comboSistP").val();
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
	//console.log(moduloSeleccionados);
	Modulos = moduloSeleccionados.toString();

	// var Mods =  JSON.stringify(moduloSeleccionados); //["uno","dos"] 
	// alert(Mods);

	var jsonObj = {};
	var xd=[];
	
	for (i = 0; i<moduloSeleccionados.length;i++) {
	 xd[i]=  [jsonObj['nombreModulo'] = moduloSeleccionados[i]];
	};
	
	console.log(xd);

	//console.log(Modulos);

	if(""==Modulos){
		alert("Seleccione al menos un modulo");
		return;
	}	

	//nombre
	//nombreSistema
	//modulos

 	//	[{nombreModulo = "uno" },{nombreModulo = "dos"}]

    if(NuevoPerfil != ''){    
        let data = JSON.stringify({
            nombre : NuevoPerfil,
			nombreSistema: Sistema,
			modulos: moduloSeleccionados
        });
        console.log("datos a mandar: "+data)
        var perfiles = $.ajax({
            method: "POST",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direccionIp+"perfiles",data,
			dataType: "json",

        });
        perfiles.done(function(data){
            alert("Se registró correctamente");
        });
        perfiles.fail(function(data){
            alert(data.responseJSON.message);
        });
    }  else{
        console.log('nel');
    } 




	
}

//Este es variable para llevar un conteo de los modulos que se agregan al sistema
var controlModulos = 0;
var cantidadChbox = 0;
var cantidadChboxPorPerfil =0;
var SistemasPerfil = [];
var old_html;
// var idSistema="";
var PerfilSeleccionado="";
var SistemaSeleccionado="";
var idDelPerfil="";


$(document).ready(iniciaApp);