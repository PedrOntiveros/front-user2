var inicia = function(){    
    $("#btnNuevoSistema").on("click",nuevoSistema);
    $("#btnModificaSistema").on('click',modificaSistema);
    $("#guardarSistema").on("click",guardaSistema);
    $("#regresaAModificar").on('click',function(){
        $("#modificaSistema").hide();
        $("#secModificaSistema").show();
    });
    $("#GuardaSistMod").on('click',guardaSistemaMod);
    $("#buscarSistema").on("keyup",buscaSistemas);
    $("#btnEliminaSistema").on('click',eliminaSistema);
}

var nuevoSistema = function(){
    $("#secModificaSistema").hide();
    $("#secEliminaSistema").hide();
    $("#secNuevoSistema").show();
}

var modificaSistema = function(){
    var sistemasDisponibles = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direcionIp+"sistemas",
    });
    sistemasDisponibles.done(function(data){
        if(null == data || 0 == data.length){
            alert("No hay sistemas.");
            return;
        }else{
            var cantidadSistemas = data.length;
            sistemas.length=0;
            for(i=0;i<cantidadSistemas;i++){
                sistemas.push(data[i]);
            }
            muestraSistemas();
        }
    });      
    sistemasDisponibles.fail(function(damcnDelta){
        alert("No cargaron los modulos");
    });
    $("#secEliminaSistema").hide();
    $("#secNuevoSistema").hide();
    $("#secModificaSistema").show();
}

var muestraSistemas = function(){
    var htmlDeSistemas = "";
    for(i=0;i<sistemas.length;i++){
        sistemas.sort(function (a, b) {
            if (a.nombre > b.nombre) {
              return 1;
            }
            if (a.nombre < b.nombre) {
              return -1;
            }
            // a must be equal to b
            return 0;
        });
        var idSistemas =  sistemas[i].id;
        var nombreSistema = sistemas[i].nombre;
        htmlDeSistemas+= "<div class='col-lg-6'>"+
                         "<div class='input-group' style='margin-bottom:5px;'>"+
                         "<span class='input-group-btn'>"+
                             "<button class='btn btn-success' type='button' onclick='edita(\""+idSistemas+"\");'>Editar</button>"+
                        "</span><input type='text' class='form-control' id='"+idSistemas+"'"+
                        "placeholder='Modulo' value='"+nombreSistema+"' disabled></div></div>"; 
    }
    $("#sistemasDisponibles1").html(htmlDeSistemas);
    $("#secModificaSistema").show("slow");
}

var buscaSistemas = function(tecla){
    var sistemaABuscar = $("#buscarSistema").val();
    console.log("Sistemas totales: "+sistemas.length)
    if("" == sistemaABuscar || 8==tecla.keyCode){
        console.log("entró a regresar los guardados")
        var temp = sistemasAux.length;
        for(i=temp;i>0;i--){
            sistemas.push(sistemasAux.pop());
        }
        console.log(sistemas)
        muestraSistemas();
        return;
    }
    var numeroSistemas = sistemas.length;
    var sistema;
    for (i=numeroSistemas; i>0; i--){
        sistema = sistemas.pop();
        var nombreDelSistema = sistema.nombre;
        if(nombreDelSistema.includes(sistemaABuscar)){
            sistemaEncontrado.push(sistema);
        }
        else{
            sistemasAux.push(sistema);
        }
    }
    numSist = sistemaEncontrado.length;
    for(i=numSist;i>0;i--){
        sistemas.push(sistemaEncontrado.pop());
    }
    console.log("Sistemas que coinciden: "+sistemas.length);
    console.log("Sistemas guardados: "+sistemasAux.length);
    muestraSistemas();
}

var edita = function(id){
    $("#secModificaSistema").hide();
    var nombreSistema = $("#"+id).val();
    idSistemaAcutal = $("#"+id).prop('id');
    $("#nombreSistemaCambiar").val(nombreSistema);
    $("#modificaSistema").show();
}

var guardaSistemaMod  = function(){
    if(!confirm("¿Desea modificar el nombre del sistema?")){
        return;
    }
    var nuevoNombreSistema = $("#nombreSistemaCambiar").val(); 
    if(nuevoNombreSistema !== ''){    
        let data = JSON.stringify({
            id : idSistemaAcutal,
            nombre: nuevoNombreSistema
        })
        console.log("datos a mandar: "+data)
        var sistemas = $.ajax({
            method: "PUT",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direcionIp+"sistemas",data,
        });
        sistemas.done(function(){
            alert("Se registró correctamente el cambio.");
            $("#modificaSistema").hide();
            modificaSistema();

        });
        sistemas.fail(function(data){
            alert(data.responseJSON.message);
        })
    }  else{
        console.log('nel')
    } 
}     

var guardaSistema = function(){
    if(!confirm("¿Desea guardar el sistema?")){
        return;
    }
    var nombreSistema = $("#systemName").val(); 
    if(nombreSistema !== ''){    
        let data = JSON.stringify({
            nombre: nombreSistema
        })
        console.log("datos a mandar: "+data)
        var sistemas = $.ajax({
            method: "POST",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url: direcionIp+"sistemas",data,
            dataType: "json"
        });
        sistemas.done(function(data){
            alert("Se registró correctamente");
        });
        sistemas.fail(function(data){
            alert(data.responseJSON.message);
        })
    }  else{
        console.log('nel')
    } 
}     

var eliminaSistema = function(){
    var sistemasDisponibles = $.ajax({
        method: "GET",
        headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json'},
        url:direcionIp+"sistemas",
    });
    sistemasDisponibles.done(function(data){
        if(null == data || 0 == data.length){
            alert("No hay sistemas.");
            return;
        }else{
            var cantidadSistemas = data.length;
            var htmlDeSistemas = "";
            for(i=0;i<cantidadSistemas;i++){
                var idSistemas = data[i].id;
                var nombreSistema = data[i].nombre
                htmlDeSistemas+= "<div class='col-lg-6'>"+
                "<div class='input-group' style='margin-bottom:5px;'>"+
                "<span class='input-group-btn'>"+
                    "<button class='btn btn-danger' type='button' onclick='elimina(\""+idSistemas+"\");'>-</button>"+
               "</span><input type='text' class='form-control' id='"+idSistemas+"'"+
               "placeholder='Modulo' value='"+nombreSistema+"' disabled></div></div>"; 
            }
            $("#sistemasDisponibles2").html(htmlDeSistemas)
        }
    });      
    sistemasDisponibles.fail(function(damcnDelta){
        alert("No cargaron los modulos");
    });
    $("#secNuevoSistema").hide();
    $("#secModificaSistema").hide();
    $("#secEliminaSistema").show();
}

var elimina = function(id){
    if(!confirm("¿Desea eliminar el sistema?")){
        return;
    }
    var idSistema = $("#"+id).prop('id');
    let data = JSON.stringify({
        id : idSistema
    })
    console.log("Elemento a eliminar: "+data);
    var sistemas = $.ajax({
        method: 'DELETE',        
        contentType: 'application/json',
        url: direcionIp+"sistemas/",data,
    });
    sistemas.done(function(){
        alert("Se elimnió el sistema.");
        eliminaSistema();
    });
    sistemas.fail(function(){
         alert("No se eliminó el sistema.");
    })
}

var sistemaEncontrado = [];
var sistemasAux = [];
var sistemas = [];
var idSistemaAcutal = "";
var direcionIp = "http://192.168.1.56:8087/api/";
$(document).ready(inicia);