var direccionip = "http://192.168.10.134:8087/api/";
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
		muestraPerfiles();
    	//document.getElementById("addPerfil").style.display = 'block';
	});
	$("#btnModificarPerfil").on("click",function(e){
		e.preventDefault();
		$("#modPerfil").show("slow");
		$("#addPerfil").hide("slow");
		muestraPerfiles()
		muestraModulos();
		//document.getElementById("addPerfil").style.display = 'block';		
	});	
	$("#btnPerfil").on("click",function(){
		$("#secUsuario").hide("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").show("slow");
	});

	//Evento para los combobox

	$("#comboSistU").change(muestraPerfiles);



	//ESTOS DOS EVENTOS YA NO SON NECESARIOS, YA QUE SOLO HAY UN COMBO LA SECCION DE LOS PERFILES 
	$("#comboSistP").change(muestraBotones);
    //$("#comboSistPMOD").change(muestraPerfiles);	
    
	//Evento para guardar un Perfil
	$("#GuardarPerfil").on("click", guardarPerfil);
	//Evento para modificar un perfil
	$("#guardarCambiosPer").on("click",modificarPerfil);





	//Evento para agregar un input en la sección de Sistemas para ingresar un nuevo modulo

	$("#masModulo").on("click",function(e){

		e.preventDefault();

	 	$("#modulosDisponibles").append("<input class='form-control form-modulo' type='text' placeholder='Modulo' id='modulo"+(controlModulos++)+"''>");});



	$("#masSistema").on("click",agregaSistemaPerfil);

}



var muestraBotones = function(){
	$("#addBotones").show("slow");
}

var modificarPerfil = function(){
	//aquí solo voy a actualizar la información
}

var muestraPerfiles = function(){
	//cambiar esta madre por ""
	var index = $("#comboSistP").val();	//obtenemos el valor del sistema seleccionado OCUPO CHECAR BIEN ESTO
	if(0 == index){
		return; //si es 0 quiere decir ue se seleccionó "Selecciona" y no hacemos nada.
	}
	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"/perfiles/"+index,
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
		$("#modulosDispPerf").html(modulo);  //donde se introducen
		$("#modulPerfiles").show("slow");  //donde se van a mostrar
	});
	modulos.fail(function(){
		alert("No se cargaron los PERFILES disponibles");
	});
	var chbox = "";
	var indiceP=0;
	$("#perfilesUser").show("slow");		
	//console.log(JsonSistema.sistemas.sis1.perfiles); // asi me imprime hasta los perfiles:{mod1,mod2}
	chbox += "<label><input type='checkbox' id='cbox' value='checkbox'>"+ind+"</label><br>";
	var ju = JsonSistema.sistemas.ind.perfiles;
    console.log(ju);
	for(var key in ju ){	
		console.log(key)			
		console.log("here!"+key);
		chbox += "<label><input type='checkbox' id='cbox"+indiceP+"' value='checkbox"+(indiceP++)+"'>"+key+"</label><br>";
		//chbox +="<label><input type='checkbox' id='cbox1' value='first_checkbox'> Este es mi primer checkbox</label><br>";
	}
	$("#perfilesDispUser").html(chbox);
}

var muestraModulos = function(){
	//CAMBIAR EL NOMBRE DE ESTA VARIABLE
	var index = $(this).val();	//obtenemos el valor del sistema seleccionado
	if(index == 0)
		return; //si es 0 quiere decir ue se seleccionó "Selecciona" y no hacemos nada.
	//validar que el seleccionado no esté en SistemasPerfil, y si está preguntar si quiere editarlo, sino return;
	var modulos = $.ajax({
		method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"perfiles",
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
		//alert("No se cargaron los MODULOS disponibles");
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
	//que el perfil no este vaci
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


//MODIFICAR PERFIL 

/*

	SELECCIONO EL PERFIL QUE ES

	ME VA A MOSTRAR TODOS LOS MODULOS QUE TENGO

	Y YA COY A MODIFICAR

	TABLA



	AGREGAR O MODIFICAR UN PERFIL

	Modificar, obtener y mandarle los nuevos parámetros. 

*/



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
var controlModulos = 0;
var cantidadChbox = 0;
var SistemasPerfil = [];
var old_html;
$(document).ready(iniciaApp);