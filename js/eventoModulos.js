var direccionip = "http://34.214.94.231:8088/api/";
var direccionIp2 = "http://192.168.10.103:8087/api/"

var iniciaApp = function(){
    $("#btnModulos").on("click",function(){
        $("body section").hide();
        $("#secModulos").show("slow");
        combosistemas();
    });

    $("#comboSistM").change(function(){
        $("#opciones").prop('selectedIndex',0);
        $("#agregarModuloASistema").hide("slow");
        $("#modificarModulo").hide("slow");
        $("#opciones").show("slow");
    })

    $("#ComboOpMOD").change(function(){
        var opcomboSistM = $("#ComboOpMOD").val();
        if(opcomboSistM =="op1"){
            $("#agregarModuloASistema").show("slow");
            $("#modificarModulo").hide("slow");
        }else if(opcomboSistM=="op3"){
            obtenModulos();            
         }else{
            $("#agregarModuloASistema").hide("slow");
            $("#modificarModulo").hide("slow");
            alert("Seleccione una opción");
        }
    });
    $("#guardaModulosAgregados").on('click',guardarModulos)

    $("#guardaMod").on("click",guardaredicion);
}

var combosistemas = function(){
    var sistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip2+"sistemas",
        dataType: "json"
    });
    sistemas.done(function(data){
        var option = "<option value='0'>Seleccione un Sistema</option>"; 
        for(i=0;i<data.length;i++){
            option += "<option value='"+data[i].id+"' id='"+data[i].nombre+"' >"+data[i].nombre+"</option><br>"
        }
        $("#comboSistM").html(option);	  //Combo de sistemas para nuevo perfil	
    });
    sistemas.fail(function(){
        alert("No se cargaron los sistemas disponibles"); //MODIFICAR PARA QUE SE HAGA ESTE ALERT
    });
}
var guardarModulos = function(){
    var idSi

var obtenModulos = function(){
    var idDelSistema = $("#comboSistM").val();
    var modulosEnSistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"sistemas/"+idDelSistema,
        dataType: "json"
    });
    modulosEnSistemas.done(function(data){
        if(null == data.modulos){
            alert("El sistema no tiene modulos, por favor agregue alguno");
            return;
        }else{
            var cantidadModulos = data.modulos.length;
            var htmlDeModulos = "";
            for(i=0;i<cantidadModulos;i++){
                var nombreModulo = data.modulos[i].nombreModulo;
                htmlDeModulos+= "<div class='col-lg-6' id='panelmodulo"+i+"'>"+
                                "<div class='input-group' style='margin-bottom:5px;'>"+
                                "<span class='input-group-btn'>"+
                                      "<button class='btn btn-success' type='button' onclick='edita(modulo"+i+")'>Editar</button>"+
                                "</span><input type='text' class='form-control' id='modulo"+i+
                                "' placeholder='Modulo' value='"+nombreModulo+"' disabled></div></div>"; 
                modulosExistentes++;
            }
            $("#modulosDelSistema").html(htmlDeModulos);
            $("#modificarModulo").show("slow");        
            $("#agregarModuloASistema").hide("slow");
        }
    });
    modulosEnSistemas.fail(function(data){
        alert("No cargaron los modulos");
    });
}

var edita = function(modulo){
    console.log(modulo);
    $(modulo).prop('disabled',false);
}

var agregaModulo = function(){   
    var htmlDeModulos = 
    contadorDeModulos++;
    controlDeModulos++;
    $("#artAddModulosAlSistem").append(htmlDeModulos);
}

var eliminaModulo = function(idModulo){
    var moduloAEliminar = "#panel"+$(idModulo).prop("id");
    controlDeModulos--;
    $(moduloAEliminar).remove();
}
stema = $("#comboSistM").val();
    var nombreModulo =$("#moduloagregar").val();
    //aquí va lo del post
    if(nombreModulo != ''){    
        let data = JSON.stringify({
            idSistema : idSistema,
            nombre: nombreModulo
        });
        console.log("datos a mandanombreSistemar: "+data)
        var modulos = $.ajax({
            method: "POST",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url:direcionIp2+"sistemas",data,
            dataType: "json"
        });
        modulos.done(function(data){
            alert("Se registró correctamente");
        });
        modulos.fail(function(data){
            alert(data.responseJSON.message);
        });
    }  else{
        console.log('nel');
    } 
    
    console.log("Id del sistema: "+idSistema);
    console.log("Modulos a agregar: "+modulosEnSistema);
}

var guardaredicion = function(){
    var moduloseditados =[];
    for(i=0; i<modulosExistentes;i++){
        var modulo = "#modulo"+i;
        var nombreModulo =$(modulo).val();
        if(undefined == nombreModulo){
            continue;
        }else if("" == nombreModulo){
            continue;
        }else{
            moduloseditados.push(nombreModulo)
        } 
    }


}

var modulosExistentes = 0;
var controlDeModulos = 1;
var contadorDeModulos = 1;
$(document).ready(iniciaApp);