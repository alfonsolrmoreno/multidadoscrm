$(document).ready(function () {
	//Andre Renovato - 11/04/2016
	//Gambi para remover attr de onclick do menu dashboards, por algum motivo existe chamadas para carregar
	//os dashboards antes de logar, e neste caso o menu inclui um alert no botao dashboards e em outro momento
	//inclui a lista de dashboards.
    if($("#menu_dashboards").html().length > 0){
        setTimeout(function(){
            $("#menu_dashboards").removeAttr("onclick");            
			//popMenuDash();    
        },6000);
    }
});

function upload() {
    var data = new FormData();
    var files = $('#arq_despesa')[0].files;
    data.append('arquivo', files[0]);
    //loading('show');
    $.ajax({
        type: 'POST',
        url: COMMON_URL_MOBILE + '/upload.php',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        crossdomain: true
    })
    .then(function (data) {
        if (data == "Arquivo inválido!" || data == "Erro no arquivo") {
            $("#arquivo_md5").val('');
            $().toastmessage('showErrorToast', data);
        } else {
            $("#arquivo_md5").val(data);
        }
        //loading('hide');
    });
}