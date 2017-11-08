var direccionIp2 = "http://192.168.1.56:8087/api/";

var iniciaApp = function(){
    $("#btnModulos").on("click",function(){
        $("body section").hide();
        $("#secModulos").show("slow");
        combosistemas();
    });

    $("#comboSistM").change(function(){
        $("select#ComboOpMOD").attr('selectedIndex', 0);
        $("#agregarModuloASistema").hide("slow");
        $("#modificarModulo").hide("slow");
        $("#modificaUnModulo").hide("slow");
        $("#opciones").show("slow");
    })

    $("#ComboOpMOD").change(function(){
        $("#modificaUnModulo").hide("slow");
        $("#modificarModulo").hide("slow");
        $("#agregarModuloASistema").hide("slow");
        var opcomboSistM = $("#ComboOpMOD").val();
        if(opcomboSistM =="op1"){
            $("#agregarModuloASistema").show("slow");
        }else if(opcomboSistM=="op3"){
            obtenModulos();           
         }else{
            alert("Seleccione una opción");
        }
    });
    $("#guardaModulosAgregados").on('click',guardarModulos)
    $("#guardaMod").on("click",guardaredicion);
    $("#regresarAModificar").on('click',function(){
        $("#modificaUnModulo").hide("slow");
        obtenModulos();
    })
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
            $("#moduloagregar").val("");
            $("#moduloagregar").focus();     
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
        console.log(data);
        if(null == data || 0 == data.length){
            alert("El sistema no tiene modulos, por favor agregue alguno");
            return;
        }else{
            var cantidadModulos = data.length;
            var htmlDeModulos = "";
            for(i=0;i<cantidadModulos;i++){
                var idModulo =  data[i].id;
                var nombreModulo = data[i].nombreModulo;
                htmlDeModulos+= "<div class='col-lg-6' id='panelmodulo"+i+"'>"+
                                "<div class='input-group' style='margin-bottom:5px;'>"+
                                "<span class='input-group-btn'>"+
                                      "<button class='btn btn-success' type='button' onclick='edita(\""+idModulo+"\");'>Editar</button>"+
                                "</span><input type='text' class='form-control' id='"+idModulo+"'"+
                                "placeholder='Modulo' value='"+nombreModulo+"' disabled></div></div>"; 
            }
            $("#modulosDelSistema").html(htmlDeModulos);
            $("#modificarModulo").show("slow");
        }
    });      
    modulosEnSistemas.fail(function(damcnDelta){
        alert("No cargaron los modulos");
    });
}

var edita = function(modulo){
    var nombreModulo = $("#"+modulo).val();
    idModuloActual = $("#"+modulo).prop("id")
    $("#moduloACambiar").val(nombreModulo);
    $("#modificarModulo").hide();
    $("#agregarModuloASistema").hide();
    $("#modificaUnModulo").show("slow");
    $("#moduloACambiar").focus();  
}

var eliminaModulo = function(idModulo){
    var moduloAEliminar = "#panel"+$(idModulo).prop("id");
    $(moduloAEliminar).remove();
}

var guardaredicion = function(){
    var moduloACambiar =$("#moduloACambiar").val();
    var idDelSistema = $("#comboSistM").val();
    if(moduloACambiar != ''){    
        let data = JSON.stringify({
            id : idModuloActual,
            idSistema : idDelSistema,
            nombreModulo: moduloACambiar
        });
        console.log("datos a mandar: "+data)
        var modulos = $.ajax({
            method: "PUT",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direccionIp2+"modulos/",data
        });
        modulos.done(function(){
            alert("Se registró correctamente");
            $("#modificaUnModulo").hide("slow");
            obtenModulos();
        });
        modulos.fail(function(){
            console.log(status);
            alert("Falló");
        });
    }  else{
        console.log('nel');
    }
    
}

var idModuloActual="";
$(document).ready(iniciaApp);