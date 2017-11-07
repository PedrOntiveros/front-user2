var inicia = function(){    
     $("#btnNuevoSistema").on("click",nuevoSistema)
    $("#guardarSistema").on("click",guardaSistema);
}

var nuevoSistema = function(){

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
            url:direcionIp+"sistemas",data,
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

var direcionIp = "http://192.168.10.103:8087/api/"
$(document).ready(inicia);