$(document).ready( function(){
	$("#btnUsuario").on("click",function(e){
		$("#divContenido").load("html/usuario.html");
	});
	$("#btnSistema").on("click",function(e){
		$("#divContenido").load("html/sistema.html");
	});
	$("#btnPerfil").on("click",function(e){
		$("#divContenido").load("html/perfil.html");
	});
	$("#btnModulos").on("click",function(e){
		$("#divContenido").load("html/modulos.html");
	});
});

