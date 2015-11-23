
//var pictureSource = navigator.camera.PictureSourceType;   // picture source
//var destinationType = navigator.camera.DestinationType; // sets the format of returned value

var retries = 0;


$(document).ready(function () {   
    //default div botoes upload fechados
    $("#optionsUpload").hide()
    $("#uploadArquivo").click(function() {
        //somente no editar, quando e nova foto, os botoes podem ser visualizados para escolher ou tirar nova foto.
        if(!$("#idarquivo").val()){
            $("#optionsUpload").toggle();
        }
     });
     $("#cancel_upload").click(function() {
        $("#optionsUpload").toggle();
     });     
})

function cam_clearCache() {
    navigator.camera.cleanup();
}
//obj = {prop:123}


var sendpic_win = function (r) {
    if(r.response.length > 0){
        var result = eval('('+r.response+')'); //transformando a string em objeto para acessar cada objeto
        
        $("#arquivo_md5").val(r.response);
        localStorage.setItem('foto', result.nome_arquivo_temp);
        var visu = '<div data-mini="true" data-role="controlgroup" data-type="horizontal"><img width="25%" src="' + COMMON_URL_MOBILE+'/temp_mobile/'+result.nome_arquivo_temp + '"></div>';
        $("#popup_imagem").empty().append('<br>'+visu);       

        loading('hide');
        $("#optionsUpload").toggle();
        $().toastmessage('showSuccessToast', 'Upload de foto realizado com sucesso');

    }
};

function showfoto() {
    $('#popup_imagem').html('');
    var foto = localStorage.getItem('foto');
    //alert('nome da foto:::> '+foto);
    if (foto) { 
        var picurl = COMMON_URL_MOBILE + 'view_anexo.php?foto=' + foto;
        //alert('caminhoURL: >> '+picurl);
        $('#popup_imagem').html('Anexo:<br><img width="50%" src="' + picurl + '">');
    }
}

var sendpic_fail = function (error) {
    loading('hide');
    if (retries == 0) {
        retries++
        setTimeout(function () {
            onCapturePhoto(fileURI)
        }, 1000);
    } else {
        retries = 0;
        cam_clearCache();
        alert('Oops, algo de errado aconteceu!');
    }
};

function onCapturePhoto(fileURI) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    //options.fileName = 'Andre.jpg';//fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI(COMMON_URL_MOBILE+'/upload.php'), sendpic_win, sendpic_fail, options);
}

function capturePhoto(sourceType) {
    if(!navigator.camera){
        alert('Ooops, nao foi possivel usar a camera!');
    }else{
        loading('show', 'Enviando foto, aguarde...');
        
        if (!sourceType)
            sourceType = Camera.PictureSourceType.CAMERA;

        navigator.camera.getPicture(onCapturePhoto, onFail, {
            //quality: 100,
            //destinationType: destinationType.DATA_URL,
            quality: 90,
            //destinationType:Camera.DestinationType.DATA_URL,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            targetWidth: 550,
            targetHeight: 550,
            saveToPhotoAlbum: true,
            sourceType: sourceType
        });
    }
}

function onFail(message) {
    loading('hide');
    //alert('Camera falhou ao tirar a foto: ' + message);
}
