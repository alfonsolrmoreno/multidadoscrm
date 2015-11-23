var Objeto_real = localStorage['mobile_login'];

var Objeto_json = JSON.parse(Objeto_real)
var COMMON_URL_MOBILE = Objeto_json.url + '/mobile/';
var COMMON_URL = Objeto_json.url;

$.ajax({
    type: 'POST',
    url: COMMON_URL_MOBILE + '/getFeedbacks.php',
    dataType: "jsonp",
    timeout: 5000,
    crossDomain: true,
    data: {
        param1:'param1',
        param2:'param2'
    },
    error: function () {
        loading('hide');
        $().toastmessage('showErrorToast', 'MENSAGEM DE ERRO');
    },
    success: function (data) {
        if (data) {
            $().toastmessage('showSuccessToast', 'MENSAGEM DE SUCESSO');
            $("#feedback_sd").html(data);
        }
    }
});