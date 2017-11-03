var direccionip = "http://34.214.94.231:8088/api/";

//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS
//NOTAAAAAAAAAAAAAAAAAS

//CHECA EL GUARDA MODULO 
//Y EL MUESTRA MODULOS 

var iniciaApp = function(){
    $("#btnModulos").on("click",function(){
        $("body section").hide();
        $("#secModulos").show("slow");
        combosistemas();
    });

    $("#comboSistM").change(function(){
        console.log("Deberías quitar todo y el otro combo resetearlo")
        $("#opciones").prop('selectedIndex',0);
        $("#agregarModuloASistema").hide("slow");
        $("#modificarModulo").hide("slow");
        $("#opciones").show("slow");
    })

    $("#ComboOpMOD").change(function(){
        var opcomboSistM = $("#ComboOpMOD").val();
        console.log(opcomboSistM);
        if(opcomboSistM =="op1"){
            obtenModulos();
            $("#agregarModuloASistema").show("slow");
            $("#modificarModulo").hide("slow");
        }else if(opcomboSistM=="op3"){
            $("#modificarModulo").show("slow");        
            $("#agregarModuloASistema").hide("slow");
            
        }else{
            $("#agregarModuloASistema").hide("slow");
            $("#modificarModulo").hide("slow");
            alert("Seleccione una opción");
        }
    });
}

var combosistemas = function(){
    var sistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"sistemas",
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

var obtenModulos = function(){
    var idDelSistema = $("#comboSistM").val();
    var mdoulosEnSistemas = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direccionip+"sistemas/"+idDelSistema,
        dataType: "json"
    });
    mdoulosEnSistemas.done(function(data){
        console.log(data);
        if(null == data.modulos){
            alert("El sistema no tiene modulos, por favor agregue alguno");
        }else{
            var cantidadModulos = data.modulos.length;
            var htmlDeModulos = "";
            for(i=0;i<cantidadModulos;i++){
                var nombreModulo = data.modulos[i].nombreModulo;
                htmlDeModulos+= "<div class='col-lg-6' id='panelmodulo"+i+"'>"+
                                "<div class='input-group' style='margin-bottom:5px;'>"+
                                "<span class='input-group-btn'>"+
                                      "<button class='btn btn-danger' type='button' onclick='eliminaModulo(modulo"+i+")'>-</button>"+
                                "</span><input type='text' class='form-control' id='modulo"+i+
                                "' placeholder='Modulo' value='"+nombreModulo+"'></div></div>"; 
                controlDeMOdulos++;
            }
            $("#modulosDisponibles").html(htmlDeModulos);
        }
    });
    mdoulosEnSistemas.fail(function(data){
        alert("No cargaron los modulos");
    });
}

var agregaModulo = function(){   
    var htmlDeModulos = "<div class='col-lg-6' id='panelmodulo"+controlDeMOdulos+"'>"+
                    "<div class='input-group' style='margin-bottom:5px;'>"+
                    "<span class='input-group-btn'>"+
                        "<button class='btn btn-danger' type='button' onclick='eliminaModulo(modulo"+controlDeMOdulos+")'>-</button>"+
                    "</span><input type='text' class='form-control' id='modulo"+i+
                    "' placeholder='Modulo'></div></div>"; 
    console.log(htmlDeModulos);
    controlDeMOdulos++;
    $("#modulosDisponibles").append(htmlDeModulos);
}

var eliminaModulo = function(idModulo){
    var moduloAEliminar = "panel"+$(idModulo).prop("id");
    console.log(moduloAEliminar);
}

var controlDeMOdulos = 0;
$(document).ready(iniciaApp);