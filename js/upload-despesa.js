//#############################################################################################
//###################################### TODO - 2016-04-20 ####################################
//########## TODAS AS FUNCOES DO MOBILE DEVEM SER SETADAS NO ARQUIVO main-funcs.js,       #####
//########## QUE SERA INCLUIDO DINAMICAMENTE E PODERA SER ACESSADA EXTERNAMENTE           #####
//#############################################################################################
//#############################################################################################

function upload() {
    var data = new FormData();
    var files = $('#arq_despesa')[0].files;
    data.append('arquivo', files[0]);
    loading('show','Arquivo sendo enviado...');
    
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
        loading('hide');
        
    });
}