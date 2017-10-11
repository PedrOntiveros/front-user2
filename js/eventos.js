var iniciaApp = function(){
	//Hacer solicitud de los sistemas que hay con sus respectivos modulos, para poder llenar el combo
	//y los modulos usarlos para la sección de creación de perfiles.
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

	//Botones del Menu
	$("#btnUsuario").on("click",function(){
		$("#secUsuario").show("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").hide("slow");});
	$("#btnSistema").on("click",function(){
		$("#secUsuario").hide("slow");
		$("#secSistema").show("slow");
		$("#secPerfil").hide("slow");});
	$("#btnPerfil").on("click",function(){
		$("#secUsuario").hide("slow");
		$("#secSistema").hide("slow");
		$("#secPerfil").show("slow");});

	//Evento para los dropbox
	$("#comboSistU").change(muestraPerfiles);
	$("#comboSistP").change(muestraModulos);

	//Evento para guardar un Sistema
	$("#GuardarSistema").on("click", guardarSistema);
	//Evento para guardar un Perfil
	$("#GuardarPerfil").on("click", guardarPerfil);

	//Evento para agregar un input en la sección de Sistemas para ingresar un nuevo modulo
	$("#masModulo").on("click",function(e){
		e.preventDefault();
	 	$("#modulosDisponibles").append("<input class='form-control form-modulo' type='text' placeholder='Modulo' id='modulo"+(controlModulos++)+"''>");});
}

var muestraPerfiles = function(){
	var ind = $(this).val(); //Aquí estoy consiguiendo el valor del 
							 //sistema que es al que quiero sacarle los perfiles
	//console.log(ind);
	var chbox = "";
	var indiceP=0;
	
	$("#perfilesUser").show("slow");		
	
	//console.log(JsonSistema.sistemas.sis1.perfiles); // asi me imprime hasta los perfiles:{mod1,mod2}
	chbox += "<label><input type='checkbox' id='cbox' value='checkbox'>"+ind+"</label><br>";

	var ju = JsonSistema.sistemas.ind.perfiles;

	console.log(ju);
	for(var key in ju ){	
		console.log(key)			
		console.log("here!"+key);															//EL IND HACE RUIDO, NO PUEDO USARLO POR QUE NO ESTA EN LA ESTRUCTURA DEL JSON												
		chbox += "<label><input type='checkbox' id='cbox"+indiceP+"' value='checkbox"+(indiceP++)+"'>"+key+"</label><br>";
		//chbox +="<label><input type='checkbox' id='cbox1' value='first_checkbox'> Este es mi primer checkbox</label><br>";
	}
	$("#perfilesDispUser").html(chbox);
}

var muestraModulos = function(){
	var index = $(this).val();	//obtenemos el valor del sistema seleccionado
	if(index == 0)
		return; //si es 0 quiere decir ue se seleccionó "Selecciona y no hacemos nada."
	var modulos = $.ajax({
		method: "GET",
		url:"api/sistemas",
		dataType: "json"
	});
	modulos.done(function(data){
		var numeroModulos = 0;
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
					  "<input type='checkbox' id='checkbox"+(numeroModulos++)+"' value='"+moduloSeparated[i]+"'>"+
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
	var nombrePerfil = $("#perfilName").val();
	if(nombrePerfil == ""){
        alert("Agregue un nombre al perfil");
        e.preventDefault();
        return;
    }
    //obtenemos los perfiles seleccionados para este usuario.
 
    var modulos = "";

}

var peticionAjax = function(parametros, url){
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

$(document).ready(iniciaApp);

