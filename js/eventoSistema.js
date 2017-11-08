var inicia = function(){    
    $("#btnNuevoSistema").on("click",nuevoSistema);
    $("#btnModificarPerfil").on('click',modificaSistema);
    $("#guardarSistema").on("click",guardaSistema);
}

var nuevoSistema = function(){
    $("#secModificaSistema").hide();
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
            var htmlDeSistemas = "";
            for(i=0;i<cantidadSistemas;i++){
                var idSistemas =  data[i].id;
                var nombreSistema = data[i].nombre;
                htmlDeSistemas+= "<div class='col-lg-6'>"+
                                 "<div class='input-group' style='margin-bottom:5px;'>"+
                                 "<span class='input-group-btn'>"+
                                     "<button class='btn btn-success' type='button' onclick='edita(\""+idSistemas+"\");'>Editar</button>"+
                                "</span><input type='text' class='form-control' id='"+idSistemas+"'"+
                                "placeholder='Modulo' value='"+nombreSistema+"' disabled></div></div>"; 
            }
            $("#sistemasDisponiblles").html(htmlDeSistemas);
            $("#secModificaSistema").show("slow");
        }
    });      
    sistemasDisponibles.fail(function(damcnDelta){
        alert("No cargaron los modulos");
    });
    $("#secNuevoSistema").hide();
    $("#secModificaSistema").show();
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

var direcionIp = "http://192.168.10.103:8087/api/";
$(document).ready(inicia);