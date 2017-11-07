var direccionIp2 = "http://192.168.10.103:8087/api/";

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
        url:direccionIp2+"sistemas",
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
    var idSistema = $("#comboSistM").val();
    var nombreModulo =$("#moduloagregar").val();
    //aquí va lo del post
    if(nombreModulo != ''){    
        let data = JSON.stringify({
            idSistema : idSistema,
            nombreModulo: nombreModulo
        });
        console.log("datos a mandanombreSistemar: "+data)
        var modulos = $.ajax({
            method: "POST",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direccionIp2+"modulos/",data,
            dataType: "json"
        });
        modulos.done(function(data){
            alert("Se registró correctamente");
        });
        modulos.fail(function(data){
            alert("Falló");
        });
    }  else{
        console.log('nel');
    } 
    console.log("Id del sistema: "+idSistema);
    console.log("Modulos a agregar: "+nombreModulo);
}

var obtenModulos = function(){
    var idDelSistema = $("#comboSistM").val();
    console.log(idDelSistema);
    var modulosEnSistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionIp2+"modulos/"+idDelSistema,
        dataType: "json"
    });
    modulosEnSistemas.done(function(data){
        if(null == data){
            alert("El sistema no tiene modulos, por favor agregue alguno");
            return;
        }else{
            var cantidadModulos = data.length;
            var htmlDeModulos = "";
            for(i=0;i<cantidadModulos;i++){
                var datos =[];
                datos.push("modulo"+i);
                datos.push(data[i].id)
                var nombreModulo = data[i].nombreModulo;
                htmlDeModulos+= "<div class='col-lg-6' id='panelmodulo"+i+"'>"+
                                "<div class='input-group' style='margin-bottom:5px;'>"+
                                "<span class='input-group-btn'>"+
                                      "<button class='btn btn-success' type='button' onclick='edita("+datos+");'>Editar</button>"+
                                "</span><input type='text' class='form-control' id='modulo"+i+
                                "' placeholder='Modulo' value='"+nombreModulo+"' disabled></div></div>"; 
            }
            $("#modulosDelSistema").html(htmlDeModulos);
            $("#modificarModulo").show("slow");
            $("#agregarModuloASistema").hide("slow");
        }
    });                                      "<button class='btn btn-success' type='button' onclick='edita(modulo"+i+"\',\'"+data+"\');'>Editar</button>"+
    
    modulosEnSistemas.fail(function(data){
        alert("No cargaron los modulos");
    });
}

var edita = function(datos){
    var nombreModulo = $(datos[0]).val();
    console.log(nombreModulo+"asdf");
    idModuloActual = datos[1];
    console.log(idModuloActual);
    $("#moduloACambiar").val(nombreModulo);
    $("#modificarModulo").hide();
    $("#agregarModuloASistema").hide();
    $("#modificaUnModulo").show("slow");
}

var eliminaModulo = function(idModulo){
    var moduloAEliminar = "#panel"+$(idModulo).prop("id");
    $(moduloAEliminar).remove();
}

var guardaredicion = function(){
    var idSistema = $("#comboSistM").val();
    var moduloACambiar =$("#moduloACambiar").val();
    if(moduloACambiar != ''){    
        let data = JSON.stringify({
            id : idModuloActual,
            nombreModulo: moduloACambiar
        });
        console.log("datos a mandar: "+data)
        var modulos = $.ajax({
            method: "PUT",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direccionIp2+"modulos/",data,
            dataType: "json"
        });
        modulos.done(function(data){
            alert("Se registró correctamente");
        });
        modulos.fail(function(data){
            alert("Falló");
        });
    }  else{
        console.log('nel');
    } 
}

var idModulos = [];
var idModuloActual="";
$(document).ready(iniciaApp);