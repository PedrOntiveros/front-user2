var inicia = function(){
    $("#guardarSistema").on("click",guardaSistema);
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
        console.log("asdas "+data)
        var sistemas = $.ajax({
            method: "POST",
            headers: { 'Accept': 'application/json',
            'Content-Type': 'application/json'},
            url:'http://localhost:8087/api/sistemas/',data,
            dataType: "json"
        });
        sistemas.done(function(data){
            console.log('smn ' + data)
        })
    }  else{
        console.log('nel')
    } 
}     

$(document).ready(inicia);