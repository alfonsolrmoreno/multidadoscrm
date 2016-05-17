var app_multi = 'ts'; // isso ser para separar os storage
//var app_multi = 'crm';
var version_system = '2016.01';
//versao do mobile para mostrar no footer
var vs_mobile = 'v.3.0.7';
var debug_mode = false;
var debug_js_errors = false;
var StatusMobiscroll = false;
var Objeto_real = localStorage[app_multi+'mobile_login'];
var session_id = false;

var arrayDia = new construirArray(7);
arrayDia[0] = "Domingo";
arrayDia[1] = "Segunda-Feira";
arrayDia[2] = "Ter&ccedil;a-Feira";
arrayDia[3] = "Quarta-Feira";
arrayDia[4] = "Quinta-Feira";
arrayDia[5] = "Sexta-Feira";
arrayDia[6] = "Sabado";

var arrayMes = new construirArray(12);
arrayMes[0] = "Janeiro";
arrayMes[1] = "Fevereiro";
arrayMes[2] = "Mar&ccedil;o";
arrayMes[3] = "Abril";
arrayMes[4] = "Maio";
arrayMes[5] = "Junho";
arrayMes[6] = "Julho";
arrayMes[7] = "Agosto";
arrayMes[8] = "Setembro";
arrayMes[9] = "Outubro";
arrayMes[10] = "Novembro";
arrayMes[11] = "Dezembro";


if (typeof Objeto_real != 'undefined' && Objeto_real != '' && Objeto_real) {
    var Objeto_json = JSON.parse(Objeto_real)
    var COMMON_URL_MOBILE = Objeto_json.url + '/mobile/';
    var COMMON_URL = Objeto_json.url;

    //definindo pagina padrao Home
    if (Objeto_json.page_home && Objeto_json.page_home != 'undefined') {
        var pageHome = Objeto_json.page_home + '.html';
    } else {
        var pageHome = "mobile_home.html";
    }
    
    //Andre Renovato - 26-02-2016
    //Mantendo dados no formulario de login
    $(function(){
        $("#url").val(COMMON_URL);
        $("#usuario").val(Objeto_json.user_bd);
        if(typeof Objeto_json.senha != 'undefined'){
            $("#senha").val(Objeto_json.senha);
        }
    })    
} else {
    if (typeof getUrlVal() != 'undefined') {
        var COMMON_URL_MOBILE = getUrlVal() + '/mobile/';
        var COMMON_URL = getUrlVal() + '/';
    } else {
        var COMMON_URL_MOBILE = '';
        var COMMON_URL = '';
        var Objeto_json = {};
    }
}

function irPara_mobile() {
    var numero = $("#numero").val().trim();
    var url = COMMON_URL + '/?display=portal&m=servicedesk/ocorrencias&a=oco_detalhes&modal=false&numero=' + numero;

    //Andre Renovato - 25/11/2015
    //caso nao tenha permissao visualizar ocorrencias, retorna para sem acesso ao modulo
    if (Objeto_json['perms_menu']['Ocorrencias']['pesquisa_go'] == 'F') {
        var link = Objeto_json['url'] + '/timesheet/multidados/module/';
        window.location.href = link;
    }

    $("#go_form").attr('action', url);

    if (numero != '') {
        $.ajax({
            url: COMMON_URL + "/mobile/call_funcs.php",
            method: "POST",
            dataType: "jsonp",
            crossDomain: true,
            data: {val: numero, sel: 'oco', func: 'ir_para'},
        }).done(function (result) {
            if (result == '1') {
                $("#go_form").submit();
            } else {
                //alert('Registro não encontrado, ou você não tem permissão para visualizá-lo');
                alert(result);
            }
        });
    }
}

function send_js_error(errorMsg, url, lineNumber, column, errorObj) {
//erro de NPObject é muito comum quando o client tem extensoes instaladas como guard de bancos online e outros
    if (typeof errorMsg != 'undefined' && typeof errorMsg.indexOf != 'undefined' && errorMsg.indexOf('Error calling method on NPObject') != -1)
        return;
    var window_location = {};
    for (var i in window.location) {
        if (typeof window.location[i] != "function")
            window_location[i] = window.location[i];
    }

    var jsdata = {
        errorMsg: errorMsg
        , url: url
        , lineNumber: lineNumber
        , column: column
        , errorObj: errorObj
                //, browser: get_browser()
                //, browser_version: get_browser_version()
                //, trace: printStackTrace()
    };

    var msg = "erro js : \n";

    for (var i in jsdata)
        msg += "\n" + i + " : " + jsdata[i];

    alert(msg);

    return;

    //nao podemos passar o objeto window.location inteiro, da pau
    for (var p in window.location)
        if (typeof window.location[p] == 'string')
            jsdata['window_location_' + p] = window.location[p];
    var args = {cm: "System_Common->write_log_js_errors", jsdata: jsdata};
    jpost(args, false, 'json', true);
}

if (debug_js_errors) {
    window.onerror = send_js_error;
}


function objIsEmpty(obj) {
    if (typeof obj != 'object')
        return true;
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

function print_r(arr, level) {
    var dumped_text = "";
    if (!level)
        level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++)
        level_padding += "    ";

    if (typeof (arr) == 'object') {
        //Array/Hashes/Objects 
        for (var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += print_r(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}

//rudi 07/20/2015 criando codigos para url
function getUrlVal() {
    var url = $("#url").val();

    if (typeof url == 'string' && url.toLowerCase() == 'ultra')
        url = 'http://h2.multidadosti.com.br/ultra';

    return url;
}
function construirArray(qtdElementos) {
    this.length = qtdElementos
}

function getMesExtenso(mes) {
    return this.arrayMes[mes];
}

function getDiaExtenso(dia) {
    return this.arrayDia[dia];
}

pesq_autocomplete = '';

function clearInputs(op) {
    $(":input").each(function () {
        value = '';
        if(this.name == 'data_trabalhada' || this.name == 'data_lcto') {
            value = data_hoje;
        }
        
        $(this).val(value);
    });
    
    $("#selecione_cliente .ui-btn-text").text('Buscar Cliente');
    $("#selecione_projeto .ui-btn-text").text('Buscar Projeto');

    $("#popup_imagem").html('');

    if(typeof op == 'undefined' || op != 'ts') {
        geraDespesa(0, 0);
    }
}

//Verifica se suporta web storage
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

//retirado do sugar_3.js, forms.js (utilizado em get_Form_lanctos,  ajax_funcs.js):
function unformatNumber(n, num_grp_sep, dec_sep)
{
    var x = unformatNumberNoParse(n, num_grp_sep, dec_sep);
    x = x.toString();
    if (x.length > 0)
    {
        return parseFloat(x);
    }
    return '';
}


//Data de dd/mm/yyyy para yyyy-mm-dd
function dateFormatDisplayToTimestamp(date) {
    if (date == "" || typeof date == "undefined")
        return "";
    if (date.indexOf(' ') != -1) {
        var data_hora = date.split(' ');
        var ex = data_hora[0].split("/");
        return ex[2] + "-" + ex[1] + "-" + ex[0] + " " + data_hora[1];
    } else {
        var ex = date.split("/");
        return ex[2] + "-" + ex[1] + "-" + ex[0];
    }
}

function dateFormatTimestampToDisplay(date, cfg) {
    if (date == "" || typeof date == "undefined")
        return "";
    if (date.indexOf(' ') != -1) {
        var data_hora = date.split(' ');
        if (cfg && cfg.strip_seconds) {
            var dh = data_hora[1].substring(0, 5);
        } else {
            var dh = data_hora[1];
        }

        if (data_hora[0].indexOf('-') != -1) {
            var ex = data_hora[0].split("-");
            var ret = ex[2] + "/" + ex[1] + "/" + ex[0] + " " + dh;
        } else {
            var ret = data_hora[0] + " " + dh;
        }

    } else {

        if (date.indexOf('-') != -1) {
            var ex = date.split("-");
            var ret = ex[2] + "/" + ex[1] + "/" + ex[0];
        } else {
            var ret = date;
        }
    }

    return ret;
}
//################# FORMATAR VALOR ############################################
VR_DECIMAIS = 2;
function unformatNumberNoParse(n, num_grp_sep, dec_sep) {
    if (typeof num_grp_sep == 'undefined' || typeof dec_sep == 'undefined')
        return n;
    n = n.toString();
    if (n.length > 0)
    {
        n = n.replace(new RegExp(RegExp.escape(num_grp_sep), 'g'), '').replace(new RegExp(RegExp.escape(dec_sep)), '.');
        return n;
    }
    return '';
}
//retirado do sugar_3.js, forms.js (utilizado em get_Form_lanctos,  ajax_funcs.js):
RegExp.escape = function (text) {
    if (!arguments.callee.sRE)
    {
        var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
        arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

function formatNumber(n, dec_sep, round, precision) {
    precision = Math.round(VR_DECIMAIS);
    if (typeof dec_sep == 'undefined')
        return n;
    n = n.toString();
    if (n.split)
        n = n.split('.');
    else
        return n;
    if (n.length > 2)
        return n.join('.');
    if (typeof round != 'undefined')
    {
        if (round > 0 && n.length > 1)
        {
            n[1] = parseFloat('0.' + n[1]);
            n[1] = Math.round(n[1] * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = n[1].toString().split('.')[1];
        }

        if (round <= 0)
        {
            n[0] = Math.round(parseInt(n[0]) * Math.pow(10, round)) / Math.pow(10, round);
            n[1] = '';
        }
    }

    if (typeof precision != 'undefined' && precision >= 0)
    {
        if (n.length > 1 && typeof n[1] != 'undefined')
            n[1] = n[1].substring(0, precision);
        else
            n[1] = '';
        if (n[1].length < precision)
        {
            for (var wp = n[1].length; wp < precision; wp++)
                n[1] += '0';
        }
    }
    regex = /(\d+)(\d{3})/;
    return n[0] + (n.length > 1 && n[1] != '' ? dec_sep + n[1] : '');
}
//############# FIM FORMATAR VALOR ############################################


//############## INICIO LOGIN #################################################
//#############################################################################
function loading(showOrHide,texto) {
    
    if(typeof texto == 'undefined') texto = 'Carregando...';
    
    if (typeof $.mobile != 'undefined' && typeof $.mobile.loading != 'undefined') {
        $.mobile.loading(showOrHide, {
            text: texto,
            textVisible: true,
            theme: 'b'
        });
    }
}

function notNull(valor) {
    if (valor != "" && !(valor.match(/^\s+$/))) {
        return true;
    } else {
        return false;
    }
}

//Controle de login
function mobile_login(obj) {
    loading('show');

    var dados = new Object();

    //Retorno do object no valida login
    if (obj) {
        var dadosArray = JSON.parse(obj);
        dados['USUARIO'] = dadosArray.user_bd;
        dados['SENHA'] = dadosArray.senha;
        dados['URL'] = dadosArray.url;
    } else {
        dados['USUARIO'] = $("#usuario").val();
        dados['SENHA'] = $("#senha").val();
        dados['URL'] = getUrlVal();

        //valida se todos os campos de login estao preechidos
        if (!notNull(getUrlVal()) || !notNull($("#usuario").val()) || !notNull($("#senha").val())) {
            loading('hide');
            $().toastmessage('showErrorToast', 'Para acessar o sistema Multidados entre com todas as informa&ccedil;&odblac;es');
            return false;
        }
    }

    if (dados['URL'] != "") {
        
        loading('show','Verificando a URL');
        
        var ajax_file_url = 'verifica_url.php';
        //Trata URL sem http://
        if ((dados['URL'].substr(0, 7)) != 'http://') {
            //AQUI VALIDAMOS A URL PELA SEGUNDA (/) PARA RECUPERAR O ENDERECO CORRETO
            var b1 = dados['URL'].search('/'); //localiza a posicao da primeira (/)
            var url_new = dados['URL'].slice(0, b1 + 1); //recupera apenas o localhost sem (/)
            var dados2 = dados['URL'].substr(b1 + 1); //recupera o que vem depois do localhost(/) para recuperar o resto depois da proxima (/)
            var b2 = dados2.search('/'); //recupera a posicao da segunda (/)
            if (b2 > 0) {
                url_new += dados2.slice(0, b2); //recupera apenas o conteundo antes do (/)
            } else {
                url_new += dados2; //nao tem barra no final entao junta a segunda parte da url
            }
            dados['URL'] = 'http://' + url_new;
        } else {
            //ENDERECO COM HTTP://
            //Remove http:// da URL
            var url_old = dados['URL'].slice(7);

            //AQUI VALIDAMOS A URL PELA SEGUNDA (/) PARA RECUPERAR O ENDERECO CORRETO
            var b1 = url_old.search('/'); //localiza a posicao da primeira (/)
            var url_new = url_old.slice(0, b1 + 1); //recupera apenas o localhost sem (/)
            var dados2 = url_old.substr(b1 + 1); //recupera o que vem depois do localhost(/) para recuperar o resto depois da proxima (/)           
            var b2 = dados2.search('/'); //recupera a posicao da segunda (/)         

            //caso nao encontre a segunda (/) o valor é -1 neste caso false, entao nao podemos realizar o slice
            if (b2 > 0) {
                url_new += dados2.slice(0, b2); //recupera apenas o conteundo antes do (/)           
            } else {
                url_new += dados2;
            }

            dados['URL'] = 'http://' + url_new;
        }
        
        //VERIFICA SE EXISTE (/) NO FIM DA URL E REMOVE CASO EXISTA
        if ((dados['URL'].substr(dados['URL'].length - 1, 1)) == '/') {
            dados['URL'] = dados['URL'].substr(0, dados['URL'].length - 1);
        }

        //Remove "/login.php" caso enviado no campo URL
        if ((dados['URL'].substr(-10)) == '/login.php') {
            var count_url = dados['URL'].length;
            count_url = count_url - 10;
            dados['URL'] = dados['URL'].substr(0, count_url);
        }

        if (debug_mode)
            alert('efetuar login');

        var ajax_file = dados['URL'] + '/mobile/login_mobile.php';
        COMMON_URL_MOBILE = dados['URL'] + '/mobile';

        if (debug_mode) {
            alert('COMMON_URL_MOBILE: ' + COMMON_URL_MOBILE);
            alert(dados['URL'] + '/mobile/' + ajax_file_url);
        }

        $.ajax({
            type: 'POST',
            url: dados['URL'] + '/mobile/' + ajax_file_url,
            dataType: "jsonp",
            timeout: 15000,
            crossDomain: true,
            data: {
                url: COMMON_URL_MOBILE
            },
            error: function () {
                loading('hide');
                $().toastmessage('showErrorToast', 'Falha de comunica&ccedil;&atilde;o com o servidor. Verifique sua conex&atilde;o e se a URL est&aacute; correta');
                return false;
            },
            success: function (data) {

                if (debug_mode) {
                    alert('SUCCESS');
                }
                
                loading('show','Autenticando o Usuario');

                $.ajax({
                    type: 'POST',
                    url: ajax_file,
                    dataType: "jsonp",
                    timeout: 15000, // aguarda 15s 
                    crossDomain: true,
                    data: {
                        usuario: dados['USUARIO'],
                        senha: dados['SENHA'],
                        url: dados['URL']
                    },
                    error: function (jqXHR, statusText, error) {
                        loading('hide');
                        //Andre Renovato - 03/03/2016
                        //Tentando identificar pq as vezes nao faz login na primeira tentativa
                        //$().toastmessage('showErrorToast', 'URL incorreta ou vers&atilde;o incompat&iacute;vel' + statusText + ' - ' + error);
                        $().toastmessage('showErrorToast', '15 segundos se passaram sem resposta, verifique a URL informada');

                        console.log('mobile_login error : ');
                        console.log('statusText = ');
                        console.dir(statusText);
                        console.log('error = ');
                        console.dir(error);
                        console.log('ajax_file = ');
                        console.dir(ajax_file);
                        console.log('jqXHR = ');
                        console.dir(jqXHR);

                        window.location.href = 'pages.html#page_login';
                        return false;
                    },
                    success: function (data) {
                        if (data['erro']) {
                            loading('hide');
                            $().toastmessage('showErrorToast', data['erro']);
                            window.location.href = 'pages.html#page_login'; 
                            return false;
                        }else if (version_system != data['version']) {
                            loading('hide');
                            $().toastmessage('showErrorToast', 'Aplica&ccedil;&atilde;o web incompat&iacute;vel com o Aplicativo. Entre em contato com o suporte! ' + version_system + ' -> ' + data['version']);
                            window.location.href = 'pages.html#page_login'; 
                            return false;
                        } else {
                            var Objeto = {
                                'db': data['db'],
                                'nome_senha': data['nome_senha'],
                                'user_bd': data['user_bd'],
                                'usuario_id': data['idsenha'],
                                'usuario_nome': data['usuario'],
                                'senha': data['senha'],
                                'url': data['url'],
                                'idempresa_vendedor': data ['idempresa_vendedor'],
                                'codigo_auxiliar': data['codigo_auxiliar'],
                                'url_foto_user': data['url_foto_user'],
                                'url_logo_cliente': data['url_logo_cliente'],
                                'cnpj': data['cnpj'],
                                'perms_menu': data['perms_menu'],
                                'version': data['version'],
                                'session_id': data['session_id'],
                                'codigo_db': data['codigo_db'],
                                'page_home': data['page_home']};
							
							session_id = data['session_id'];
							
                            localStorage.setItem(app_multi+'mobile_login', JSON.stringify(Objeto));

                            Objeto_real = localStorage.getItem(app_multi+'mobile_login')
                            Objeto_json = JSON.parse(Objeto_real);

                            loading('hide');
                            
                            if (obj) {
                                $().toastmessage('showSuccessToast', 'Login realizado com sucesso');
								setDadosIniciais();
                            } else {
                                window.location.href = 'index.html';
                            }                            
                            return true;
                        }
                    }
                });
            }
        });
    } else {
        return false;
    }
}

//inacio 5/5/2016 so para saber se a sessao no server esta OK
function verifica_sessao() {
    
    
        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + '/session.php',
            dataType: "jsonp",
            timeout: 1000,
            crossDomain: true,
            async: false,
            error: function () {
                    alert('erro');

            },
            success: function (data) {
                
                 console.log(data);
                
            }
        });
    
}
    
//rudi 7/10/2015 retornando true tambem, e soh seguindo se for true na index.html
/*
function verifica_logado_OLD() {
    
    if (debug_mode)
        alert('verifica_logado');

    var Objeto_real = localStorage.getItem(app_multi+'mobile_login')

    if (typeof Objeto_real == "undefined" || !Objeto_real || Objeto_real === null) {
        if (debug_mode)
            alert('redirecionar para a tela pages.html#page_login');

        window.location.href = 'pages.html#page_login';
        return false;
    } else {
        if (debug_mode)
            alert('tem Objeto real');

        if (debug_mode)
            alert('URL Atual = ' + COMMON_URL_MOBILE);

        var redirecting = false;

        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + 'checkServerOnlineNew.php',
            dataType: "jsonp", // aqui estava json e isso não pega a sessão corretamente. //inacio 06-05-2016
            timeout: 1000,
            crossDomain: true,
            //async: false, // comentei isso, pois se a URL estivesse incorreta nao caia no error simplesmente trava. //inacio 06-05-2016
            success: function (data) {
                if (typeof data.idvendedor == 'undefined' || data.idvendedor == '') {
                    mobile_login(Objeto_real);
                }
            
                $("#conteudo").attr("src", pageHome); //Carregando home padrao
                setSaudacao(); //inclui saudacao (nome user, dia ano e mes)  
                popMenuDash(); //recupera menu dashboards
                
                //Andre Renovato - 11/11/2015
                //Incluindo nome do banco e user no menu desconectar
                var namedb = Objeto_json['db'];
                var nomeuser = Objeto_json['user_bd'];
                $('.banco-nome').html(namedb.toLowerCase());
                $('.exibe_user').html(nomeuser.toLowerCase());
                
                permissaoMenu(); //recupera permissao de menu e atalhos
                
            },
            error: function () {
                if (debug_mode)
                    alert('erro no verifica_logado');

                //CASO A URL ESTEJA INATIVA RETORNA PARA TELA DE LOGIN
                window.location.href = 'pages.html#page_login';                
                return false;
            }
        });
    }
}
*/

function Storagelogout(){
    if(localStorage.getItem(app_multi+'mobile_login')){
        var Objeto_json = JSON.parse(localStorage.getItem(app_multi+'mobile_login'));
        
        // inacio 04-05-2016
        // limpa todos caches e só deixa a URL e o nome usuario
        url_cache = Objeto_json.url;
        user_bd_cache = Objeto_json.user_bd;
        
        localStorage.clear();
        
        var Objeto = {
            'url': url_cache,
            'user_bd': user_bd_cache};
        
        localStorage.setItem(app_multi+'mobile_login', JSON.stringify(Objeto));
    }
}

function ajusteUrl(url) {
//Verifica se existe http:// e se existe "/" no final
    if ((url.substr(0, 7)) != 'http://') {
        //AQUI VALIDAMOS A URL PELA SEGUNDA (/) PARA RECUPERAR O ENDERECO CORRETO
        var b1 = url.search('/'); //localiza a posicao da primeira (/)
        var url_new = url.slice(0, b1 + 1); //recupera apenas o localhost sem (/)
        var dados2 = url.substr(b1 + 1); //recupera o que vem depois do localhost(/) para recuperar o resto depois da proxima (/)
        var b2 = dados2.search('/'); //recupera a posicao da segunda (/)
        url_new += dados2.slice(0, b2); //recupera apenas o conteundo antes do (/)              

        url = 'http://' + url_new;

        //Endereco nao possui http
    } else {
        //Recupera URL sem http://
        var url_old = url.slice(7);

        //AQUI VALIDAMOS A URL PELA SEGUNDA (/) PARA RECUPERAR O ENDERECO CORRETO
        var b1 = url_old.search('/'); //localiza a posicao da primeira (/)
        var url_new = url_old.slice(0, b1 + 1); //recupera apenas o localhost sem (/)
        var dados2 = url_old.substr(b1 + 1); //recupera o que vem depois do localhost(/) para recuperar o resto depois da proxima (/)           
        var b2 = dados2.search('/'); //recupera a posicao da segunda (/)         

        //caso nao encontre a segunda (/) o valor é -1 neste caso false, entao nao podemos realizar o slice
        if (b2 > 0) {
            url_new += dados2.slice(0, b2); //recupera apenas o conteundo antes do (/)           
        } else {
            url_new += dados2;
        }

        url = 'http://' + url_new;

        return url;
    }
}

function mobile_logout() {
    if (debug_mode)
        alert('mobile_logout');

    var dados = new Object();
    var ajax_file = COMMON_URL_MOBILE + '/login_mobile.php?logout=1';

    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        timeout: 5000,
        crossDomain: true,
        data: {
            usuario: Objeto_json.user_bd,
            url: Objeto_json.url
        },
        error: function () {
            loading('hide');
            //caso servidor nao esteja disponivel vamos apenas limpar os dados de conexao e redirecionar para pagina de login
            //localStorage.clear();
            Storagelogout();
            window.location.href = 'pages.html#page_login';
        },
        success: function (data) {
            if (data) {
                //localStorage.clear();
                Storagelogout();
                window.location.href = 'pages.html#page_login';
            }
        }
    });
}

function setSaudacao() {
    var saudacao = '';
    var saudacao_data = '';

    var dados = JSON.parse(localStorage[app_multi+'mobile_login']);
    var nome_user = dados['nome_senha'];

    var d = new Date();
    var hora = d.getHours();
    var ano = d.getFullYear();
    var dia = d.getDate();
    var mes = d.getMonth();

    if (hora < 12) {
        saudacao = 'Bom Dia, ' + nome_user;
    } else if (hora >= 19) {
        saudacao = 'Boa Noite, ' + nome_user;
    } else {
        saudacao = 'Boa Tarde, ' + nome_user;
    }

    saudacao_data = getDiaExtenso(d.getDay()) + ', ' + dia + ' de ' + getMesExtenso(mes) + ' de ' + ano;

    $('.saudacao').html(saudacao);
    $('.saudacao-data').html(saudacao_data);
    $('#foto_user').attr('src', dados['url_foto_user']);

    //$('#banco-nome').html(dados['db']);
}

//Valida array
function isArray(o) {
    return(typeof (o.length) == "undefined") ? false : true;
}
//####################### FIM LOGIN ###########################################
//#############################################################################


//############################# MENU ##########################################
//#############################################################################
function popMenuDash() {
    if ($("#lista_dashboard").length > 0 && $("#lista_dashboard").html() == '') {

        var dados = new Object();
        var ajax_file = COMMON_URL_MOBILE + '/getDashboards.php';
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                tipo: 'menu'
            }
        }).then(function (data) {
            if (data['erro']) {
                $("#menu_dashboards").attr("onclick", "alert('" + data['erro'] + "')");
            } else {
                $("#lista_dashboard").html(data);
            }
        });
    }
}

function attrSrcIframe(url) {
    preloadIframe();
    $("#conteudo").attr("src", COMMON_URL + url);
}

//Andre Renovato - 11/11/2015
//Funcao que valida cada item do menu de acordo com o perfil de usuario. Caso nao tenha acesso
//ao item de menu, vamos abrir uma pagina generica com a msg "SEM ACESSO AO MODULO"
function permissaoMenu() {
    Obj = JSON.parse(Objeto_real)
    var permMenu = Obj['perms_menu'];

    //alert($("#page_timesheet").attr("class"));
    //console.dir(Obj['perms_menu']);

    //============ TIMESHEET ===============//
    if (Obj['page_home'] == 'mobile_crm_home') {
        $("#menu_timesheet").css("display", "none");
        $("#menu_despesas").css("display", "none");
    }else{
        if (permMenu['Timesheet']['novo'] == 'F') {
            $("#page_timesheet").removeAttr("mobile");
            $("#page_timesheet").attr("id", "sem_acesso");
        }

        if (permMenu['Timesheet']['listar'] == 'F') {
            $("#page_relatorio").removeAttr("mobile");
            $("#page_relatorio").attr("id", "sem_acesso");
        }

        if (permMenu['Timesheet']['aprovacao'] == 'F') {
            $("#aprovar_horas").removeAttr("mobile");
            $("#aprovar_horas").attr("id", "sem_acesso");
        }

        if (permMenu['Timesheet']['portal'] == 'F') {
            $("#portal_horas").removeAttr("mobile");
            $("#portal_horas").attr("id", "sem_acesso");
        }
        //=============== FIM TIMESHEET ===============//

        //============ DESPESAS ===============//
        if (permMenu['Despesas']['novo'] == 'F') {
            $("#page_despesa").removeAttr("mobile");
            $("#page_despesa").attr("id", "sem_acesso");
        }

        if (permMenu['Despesas']['listar'] == 'F') {
            $("#relatorio_despesa").removeAttr("mobile");
            $("#relatorio_despesa").attr("id", "sem_acesso");
        }

        if (permMenu['Despesas']['aprovacao'] == 'F') {
            $("#aprovar_despesas").removeAttr("mobile");
            $("#aprovar_despesas").attr("id", "sem_acesso");
        }

        if (permMenu['Despesas']['portal'] == 'F') {
            $("#portal_despesas").removeAttr("mobile");
            $("#portal_despesas").attr("id", "sem_acesso");
        }
        //=============== FIM DESPESAS ===============//
    }

    //============ OCORRENCIA ===============//
    if (permMenu['Ocorrencias']['novo'] == 'F') {
        $("#add_ocorrencia").removeAttr("mobile");
        $("#add_ocorrencia").attr("id", "sem_acesso");
    }

    if (permMenu['Ocorrencias']['listar'] == 'F') {
        $("#listar_ocorrencia").removeAttr("mobile");
        $("#listar_ocorrencia").attr("id", "sem_acesso");

        $("#listar_ocorrencia_p").removeAttr("mobile");
        $("#listar_ocorrencia_p").attr("id", "sem_acesso");
    }

    if (permMenu['Ocorrencias']['aprovacao'] == 'F') {
        $("#aprovar_ocorrencia").removeAttr("mobile");
        $("#aprovar_ocorrencia").attr("id", "sem_acesso");
    }

    if (permMenu['Ocorrencias']['portal'] == 'F') {
        $("#portal_ocorrencia").removeAttr("mobile");
        $("#portal_ocorrencia").attr("id", "sem_acesso");
    }

    //Verifica se possui dashboard padrao definido, marca sem acesso ou o link do dash
    if (permMenu['Ocorrencias']['dashboard_padrao'] == 'F' || permMenu['Ocorrencias']['dashboard_padrao'] == undefined) {
        $("#dashboard_padrao").attr("id", "sem_acesso");
    } else {
        var idDash = permMenu['Ocorrencias']['dashboard_padrao'];
        var lnk = "?display=portal&m=dashboards&a=view_dashboard_portal&iddashboards=" + idDash + "&nomenu=1&menuItem=1";
        $("#dashboard_padrao").attr("link", lnk);
    }
    //=============== FIM OCORRENCIA ===============//
}

//############################# FIM MENU ######################################
//#############################################################################

//######################## TIMESHEET ##########################################
//#############################################################################

//Salva dados do timesheet
function salvar_timesheet(){
    loading('show');
    var dados = new Object();
    dados['idvendedor'] = Objeto_json.usuario_id;
    dados['idvendedor_dig'] = Objeto_json.usuario_id;
    dados['idtimecard'] = $("#idtimecard").val();
    //dados['USUARIO_WS'] = Objeto_json.usuario_nome;
    //dados['SENHA_WS'] = Objeto_json.senha;
    //dados['CNPJ_EMPRESA'] = Objeto_json.cnpj;
    //dados['CODIGO_AUXILIAR_PREST'] = Objeto_json.codigo_auxiliar;
    dados['data'] = dateFormatDisplayToTimestamp($("#data_trabalhada").val());
    dados['idcliente'] = $("#codigo_auxiliar").val();
    dados['idclienteprojeto'] = $("#codigo").val();
    dados['hora'] = $("#hora_inicial").val();
    dados['hora_fim'] = $("#hora_final").val();
    dados['intervalo_ini'] = $("#intervalo_hr_inicial").val();
    dados['intervalo_fim'] = $("#intervalo_hr_final").val();
    dados['idtarefa_utbms'] = $("#codigo_fase").val();
    dados['idatividade_utbms'] = $("#codigo_atividade").val();
    dados['idtask_parent'] = $("#task_parent").val();
    dados['idtask'] = $("#task").val();
    dados['porc_conclusao_atividade'] = $("#porc_conclusao_atividade").val();
    dados['narrativa_principal'] = $("#narrativa_principal").val();

    var ajax_file = COMMON_URL_MOBILE + '/save_lanctos.php';
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            dados: dados,
            tipo: 'timesheet'
        }
    }).then(function (data)
    {

        loading('hide');
        if (data == 'Timesheet salvo com sucesso') {
            $().toastmessage('showSuccessToast', data);
            $("#filtro_data_trabalhada").val($("#data_trabalhada").val());
            $('#filtro_data_trabalhada').trigger('change');
            $('#filtro_data_trabalhada').trigger('blur');
            window.location.href = "#page_relatorio";
        } else {
            $().toastmessage('showErrorToast', data);
        }

    });
}

function selecionaValor(valor, tipo, id, id2, nome2, tipo_projeto) {
    //$(".ui-body-" + tipo).val(valor);

    if (tipo == 'c')
    {
        //$('#busca_cliente_timesheet').show();
        //$("#busca_cliente_timesheet").val(valor);
        $("#page_timesheet #selecione_cliente .ui-btn-text").text(valor);
        $("#codigo_auxiliar").val(id);
        $("#codigo").val('');
        $("#page_timesheet #selecione_projeto .ui-btn-text").text('Buscar Projeto');
    }
    else if (tipo == 'p')
    {
        $("#codigo").val(id);
        $("#page_timesheet #selecione_projeto .ui-btn-text").text(valor);
        //$('#busca_projeto_timesheet').show();
        //$("#busca_projeto_timesheet").val(valor);
        if ($("#codigo_auxiliar").val() == '')
        {
            $("#codigo_auxiliar").val(id2);
            $("#page_timesheet #selecione_cliente .ui-btn-text").text(nome2);

            if($(location).attr('hash') == '#page_timesheet') {
                if (tipo_projeto == 'P') {
                    seleciona_task_parent($("#codigo_auxiliar").val(), id, 0);
                } else {
                    seleciona_fase($("#codigo_auxiliar").val(), id, 0, 0);
                }
            }
        } else {
            if($(location).attr('hash') == '#page_timesheet') {
                if (tipo_projeto == 'P') {
                    seleciona_task_parent($("#codigo_auxiliar").val(), id, 0);
                } else {
                    seleciona_fase($("#codigo_auxiliar").val(), id, 0, 0);
                }
            }
        }
    }
    else if (tipo == 't')
    {
        $("#codigo_fase").val(id);
    }
    else if (tipo == 'atividade')
    {
        $("#codigo_atividade").val(id);
    }

    $("ul").empty();
}

//############# DESPESA #####################################################
//###########################################################################
function upload_OLD() {
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

//Salva dados dA DESPESA
function salvar_despesa() {
    var dados = new Object();
    loading('show');
    dados['idvendedor'] = Objeto_json.usuario_id;
    dados['idvendedor_dig'] = Objeto_json.usuario_id;
    dados['idempresa'] = Objeto_json.idempresa_vendedor;
    dados['idlctodespesa'] = $("#idlctodespesa").val();
    dados['idtabpreco'] = $("#idtabpreco").val();
    dados['data_lcto'] = dateFormatDisplayToTimestamp($("#data_lcto").val());
    dados['idcliente'] = $("#idcliente_despesa").val();
    dados['idclienteprojeto'] = $("#idclienteprojeto_despesa").val();
    dados['idservicos'] = $("#codigo_despesa").val();
    dados['valor_despesa_digitado'] = $("#vlr_unitario").val();
    dados['qtde_despesa'] = $("#qtde_despesa").val();
    dados['valor_total'] = $("#valor_total").val();
    dados['local_despesa'] = $("#local_despesa").val();
    dados['num_despesa'] = $("#num_documento").val();
    dados['arq_despesa'] = $("#arq_despesa").val();
    dados['narrativa_principal'] = $("#narrativa_principal_despesa").val();
    arquivo_md5 = $("#arquivo_md5").val();
    var ajax_file = COMMON_URL_MOBILE + '/save_lanctos.php';
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            dados: dados,
            arquivo_md5: arquivo_md5,
            tipo: 'despesa',
            idsenha: Objeto_json.usuario_id
        }
    }).then(function (data)
    {
        loading('hide');
        if (data == 'T') {
            $("#dateinput2").val($("#data_lcto").val());
            $('#dateinput2').trigger('change');
            $('#dateinput2').trigger('blur');
            $().toastmessage('showSuccessToast', 'Despesa salva com sucesso!');
            window.location.href = "#relatorio_despesa";
        } else {
            $().toastmessage('showErrorToast', data);
        }
    });
}

//Buscar DESPESA conforme as datas
function buscar_despesa(data) {
    //clearInputs();
    //if (data) {
    var ajax_file = COMMON_URL_MOBILE + '/busca_despesa.php';
    loading('show');
    if (data) {
        data = dateFormatDisplayToTimestamp(data);
    }
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            data: data,
            idsenha: Objeto_json.usuario_id,
            idempresa_vendedor: Objeto_json.idempresa_vendedor
        }
    }).then(function (data)
    {
        $("#list_despesa").html(data);
        //$("#list_despesa").listview("refresh");
        $("#list_despesa").listview().listview('refresh');
        loading('hide');
    });
    //}
}

dados_servicos = new Object();
//Pega valores para editar despesa
$(document).delegate('#list_despesa .btn-despesa', 'click', function () {
    $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
        loading('show');
    });

    //zerando campo de foto anterior
    $("#popup_imagem").html('');

    idlctosdespesa = $(this).attr('id');
    var ajax_file = COMMON_URL_MOBILE + '/retorna_despesa.php';
    $.when(
            $.ajax({
                type: 'POST',
                url: ajax_file,
                dataType: "jsonp",
                crossDomain: true,
                async: false,
                afterSend: function () {
                },
                success: function (data) {
                    if (data.idlctodespesa != '') {
                        $("#idlctodespesa").val(data.idlctodespesa);
                    }

                    $("#idtabpreco").val(data.idtabpreco);
                    $("#data_lcto").val(dateFormatTimestampToDisplay(data.data_lcto));
                    $("#vlr_unitario").val(data.valor_despesa_digitado);
                    $("#qtde_despesa").val(data.qtde_despesa);
                    $("#valor_total").val(formatNumber(data.valor_total_digitado, '.', 2, 2));
                    $("#local_despesa").val(data.local_despesa);
                    $("#num_documento").val(data.num_despesa);
                    $("#narrativa_principal_despesa").val(data.narrativa_principal);
                    $("#idcliente_despesa").val(data.idcliente);
                    $("#page_despesa #selecione_cliente .ui-btn-text").text(data.nome_cliente);
                    $("#idclienteprojeto_despesa").val(data.idclienteprojeto);
                    $("#page_despesa #selecione_projeto .ui-btn-text").text(data.nome_projeto);
                    var COMMON_URL = COMMON_URL_MOBILE.substr(0, COMMON_URL_MOBILE.length - 7);

                    if (data.id_arquivo > 0) {
                        arquivo_edit = "<input type='hidden' name='idarquivo' id='idarquivo' value='" + data.id_arquivo + "' >";
                        var filename = COMMON_URL_MOBILE + "open_files_mobile.php?ss=arq_despesas&id=" + data.id_arquivo + "&dw=F";
                        var imagem = '<div><img width="25%" src="' + filename + '"></div>';
                        var apagar = '<a href="javascript:;" onclick="deletaArquivo();" id="del_arquivo" data-icon="delete"  data-role="button" data-iconpos="notext" data-inline="true" ></a>';
                        $("#popup_imagem").html('<br>' + imagem + apagar + arquivo_edit);
                        if(filename){
                            //ocultando input de upload
                            $("#upload_arquivos").css('display','none');
                        }
                        
                        $("#page_despesa").trigger('create');
                    }
                    geraDespesa(data.idclienteprojeto, data.idservicos);
                    $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
                        loading('hide');
                    });
                },
                data: {
                    idlctosdespesa: idlctosdespesa,
                    tipo: 'despesa'
                }
            })).then(function () {

    });
});

$(document).on("pagecreate", function () {
    $(".photopopup").on({
        popupbeforeposition: function () {
            var maxHeight = $(window).height() - 60 + "px";
            $(".photopopup img").css("max-height", maxHeight);
        }
    });
});

//Deletar Arquivo
function deletaArquivo() {
    //ok = confirm('Ao confirmar, o arquivo ser&aacute exclu&iacutedo e desvinculado da despesa. Deseja realmente apagar esse arquivo?');
    ok = confirm('Deseja realmente apagar esse arquivo?');
    if (ok == true) {
        var ajax_file = COMMON_URL_MOBILE + '/arquivo_despesa.php';
        idarquivo = $("#idarquivo").val();
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idarquivo: idarquivo,
                tipo: 'deletar'
            }
        }).then(function (data)
        {
            $("#arquivo_md5").val('');
            $("#popup_imagem").html('');
            $("#upload_arquivos").css('display','block');
            //$("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" class="ui-input-text ui-body-c">');
        });
    }
}

//Lista Serviços da Despesa
function geraDespesa(idclienteprojeto, selecionado) {
    /*if (selecionado == 0 && idclienteprojeto == 0) {
     return false;
     }*/
    var ajax_file = COMMON_URL_MOBILE + '/retorna_despesa.php';
    if (selecionado == 0 || typeof selecionado == 'undefined') {
        selecionado = "";
        var selected_first = "selected='selected'";
    }
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idclienteprojeto: idclienteprojeto,
            tipo: 'despesaServico'
        }
    }).then(function (data)
    {
        //console.dir(data);

        dados_servicos = data.data;
        var options = '<option value="" ' + selected_first + '>Selecione uma despesa</option>';
        $("#idtabpreco").val(data['idtabpreco']);
        jQuery.each(data.select, function (i, val) {
            selected = '';
            if (i == selecionado)
                selected = 'selected="selected"';
            options += '<option value="' + i + '" ' + selected + '>' + val + '</option>';
        });
        $("#codigo_despesa").html(options);
        loading('hide');
        
        $(document).on("pageinit", "#page_despesa", function () {
        //$(document).bind('pageinit', function () {
            $('#codigo_despesa').selectmenu('refresh');
        });
    });
}

//Pega dados do  que foi clicado e deleta apaga
$(document).delegate('#list_despesa .delete_despesa', 'click', function () {
    idlctodespesa = $(this).attr('id');
    loading('show');
    if (confirm('Deseja excluir esta despesa?')) {
        var ajax_file = COMMON_URL_MOBILE + '/save_lanctos.php';
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idlctodespesa: idlctodespesa,
                tipo: 'despesa_excluir',
                idsenha: Objeto_json.usuario_id
            }
        }).then(function (data)
        {
            if (data == 'T') {
                $().toastmessage('showSuccessToast', 'Despesa exclu&iacute;da com sucesso!');
                $("#despesa_" + idlctodespesa).hide(500);
            } else {
                $().toastmessage('showErrorToast', data);
            }
            loading('hide');
        });
    }
});

function selecionaValorDespesa(valor, tipo, id, id2, nome2){
    if (tipo == 'c')
    {
        $("#page_despesa #selecione_cliente .ui-btn-text").text(valor);
        $("#idcliente_despesa").val(id);
        $("#idclienteprojeto_despesa").val('');
        $("#busca_projeto_despesa").val('');
    }
    else if (tipo == 'p')
    {
        $("#idclienteprojeto_despesa").val(id);
        $("#page_despesa #selecione_projeto .ui-btn-text").text(valor);
        if ($("#idcliente_despesa").val() == '')
        {
            geraDespesa(id, 0);
            $("#idcliente_despesa").val(id2);
            $("#page_despesa #selecione_cliente .ui-btn-text").text(nome2);
        } else {
            geraDespesa(id, 0);
        }
    }


    $("ul").empty();
}

//Lista clientes despesa
$(document).delegate('#page_despesa #selecione_cliente', 'click', function () {
    var Objeto_json = JSON.parse(localStorage.getItem(app_multi+'mobile_login'));
    $("#page_despesa_sub").hide();
    $("#save_despesa_top").hide();

    pesq_autocomplete = 'c';
    $("#divautocomplete_despesa").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_clientes').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum cliente encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: false, // tirando por estar influenciando na tela de lancamento qdo rola a barra // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_cliente_despesa').val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id,
        url: COMMON_URL_MOBILE + '/search.php',
        tipo: 'c'

    });
    $("#page_despesa #voltar_despesa").attr("href", "javascript:;");
    $('#page_despesa #voltar_despesa').click(function ()
    {
        $("#page_despesa_clientes").html('');
        $("#page_despesa_sub").show(function () {
            $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
            $("#divautocomplete_despesa").hide();
        });
    });
});
//pega click ao listar clientes despesa
$(document).delegate("#page_despesa [id^='idcliente_']", 'click', function () {
//$("#page_despesa > [id^='idcliente_']").on('click', function() {
    $("#divautocomplete_despesa").hide();
    $("#voltar_despesa").attr("href", "#relatorio_despesa");
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValorDespesa($(this).text(), "c", idcliente[1]);
    $("#page_despesa_clientes").html('');
    $("#page_despesa_sub").show();
});
//LISTA PROJETOS DESPESA
$(document).delegate('#page_despesa #selecione_projeto', 'click', function () {
    var Objeto_json = JSON.parse(localStorage.getItem(app_multi+'mobile_login'));    
    
    pesq_autocomplete = 'p';
    $("#divautocomplete_despesa").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    $("#page_despesa_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_despesa_projetos').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum projeto encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: false, // tirando por estar influenciando na tela de lancamento qdo rola a barra // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_projeto_despesa').val(),
        url: COMMON_URL_MOBILE + '/search.php',
        tipo: 'p',
        idcliente: $("#idcliente_despesa").val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_despesa #voltar_despesa").attr("href", "javascript:;");
    $('#page_despesa #voltar_despesa').click(function ()
    {
        $("#page_despesa_projetos").html('');
        $("#page_despesa_sub").show(function () {
            $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
            $("#divautocomplete_despesa").hide();
        });
    });
});
//pega click ao listar projetos
$(document).delegate("[id^='idclienteprojeto_']", 'click', function () {
    $("#divautocomplete_despesa").hide();
    $("#page_despesa #voltar_despesa").attr("href", "#relatorio_despesa");
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    selecionaValorDespesa($(this).text(), "p", idclienteprojeto[1], idcliente, nomecliente);
    $("#page_despesa_projetos").html('');
    $("#page_despesa_sub").show();
});

//################# FIM DESPESA ###############################################
//#############################################################################


//############# LISTA TIMESHEET ###############################################
//#############################################################################


//Buscar timesheet conforme as datas
function buscar_timesheet(data) {
    loading('show');
    if (data) {
        data = dateFormatDisplayToTimestamp(data);
    }
    var ajax_file = COMMON_URL_MOBILE + '/busca_timesheet.php';
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            data: data,
            idsenha: Objeto_json.usuario_id,
            idempresa_vendedor: Objeto_json.idempresa_vendedor
        }
    }).then(function (data)
    {
        $("#list").html(data);
        $('#list').listview().listview('refresh');
        loading('hide');
    });
}


//Editar: Pega dados do idtimecard que foi clicado na lista faz select e envia pra outra página
$(document).delegate('#list .btn-timesheet', 'click', function () {
    idtimecard = $(this).attr('id');
    //var args = {cm: 'Timesheet->getTimecard', idtimecard: idtimecard};
    var ajax_file = COMMON_URL_MOBILE + '/retorna_timecard.php';
    $.ajax({
        type: 'POST',
        url: ajax_file,
        dataType: "jsonp",
        crossDomain: true,
        data: {
            idtimecard: idtimecard
        }
    }).then(function (data) {
        loading('show');
        codigo_atividade = data.idatividade_utbms;
        if (data.idtimecard != '') {
            $("#idtimecard").val(data.idtimecard);
        }
        //Verifica se é project
        if (data.idtask != '') {
            $("#porcentagem_conclusao").show();
            seleciona_porcentagem_conclusao(data.porc_conclusao_atividade);
            //Andre Renovato - 24-06-2014
            //NOVO USANDO SELECTBOX
            $("#porc_conclusao_atividade").val();
            //$("select#porc_conclusao_atividade").selectmenu("refresh");
            $(document).bind('pageinit', function () {
                $('select#porc_conclusao_atividade').selectmenu('refresh');
            });

            //ANTIGO USANDO SLIDER
            //$(".porc_conclusao_atividade").val(Math.round(data.porc_conclusao_atividade));
            //$('.porc_conclusao_atividade').slider('refresh');

            seleciona_task_parent(data.idcliente, data.idclienteprojeto, data.idtask);
        } else {
            $("#porcentagem_conclusao").hide();
            seleciona_fase(data.idcliente, data.idclienteprojeto, data.idtarefa_utbms, codigo_atividade);
        }
        $("#data_trabalhada").val(dateFormatTimestampToDisplay((data.data_trabalhada)));
        $("#codigo_auxiliar").val(data.idcliente);
        $("#page_timesheet #selecione_cliente .ui-btn-text").text(data.nome_cliente);
        $("#codigo").val(data.idclienteprojeto);
        $("#page_timesheet #selecione_projeto .ui-btn-text").text(data.nome_projeto);
        hora_inicial = (data.dt_hr_inicial.substr(11, 5));
        hora_final = (data.dt_hr_final.substr(11, 5));
        $("#hora_ini").val(hora_inicial);
        $("#hora_inicial").val(hora_inicial);
        $("#hora_final").val(hora_final);
        $("#hora_fim").val(hora_final);

        intervalo_hr_inicial = (data.intervalo_hr_inicial.substr(0, 5));
        intervalo_hr_final = (data.intervalo_hr_final.substr(0, 5));
        $("#intervalo_hr_inicial").val(intervalo_hr_inicial);
        $("#intervalo_hr_ini").val(intervalo_hr_inicial);
        $("#intervalo_hr_final").val(intervalo_hr_final);
        $("#intervalo_hr_fim").val(intervalo_hr_final);

        $("#narrativa_principal").val(data.narrativa_principal);

        LoadMobiScroll();
    });
});
//Lista clientes no timesheet
$(document).delegate('#page_timesheet #selecione_cliente', 'click', function () {
    var Objeto_json = JSON.parse(localStorage.getItem(app_multi+'mobile_login'));
    
    pesq_autocomplete = 'c';
    $("#divautocomplete_timecard").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();

    $("#page_timesheet_sub").hide();
    $("#save_timesheet_top").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_clientes').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum cliente encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: false, // tirando por estar influenciando na tela de lancamento qdo rola a barra // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_cliente_timesheet').val(),
        url: COMMON_URL_MOBILE + '/search.php',
        tipo: 'c',
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $('#page_timesheet #voltar_timesheet').click(function ()
    {
        $("#page_timesheet_clientes").html('');
        $("#page_timesheet_sub").show(function () {
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
            $("#divautocomplete_timecard").hide();
        });
    });
});
//pega click ao listar clientes
$(document).delegate("[id^='idcliente_']", 'click', function () {
    $("#divautocomplete_timecard").hide();
    var id = $(this).attr('id');
    var idcliente = id.split('_');
    selecionaValor($(this).text(), "c", idcliente[1]);

    $("#page_timesheet_clientes").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
});
//Seleciona o projeto
$(document).delegate('#page_timesheet #selecione_projeto', 'click', function () {
    var Objeto_json = JSON.parse(localStorage.getItem(app_multi+'mobile_login'));
    
    pesq_autocomplete = 'p';
    $("#divautocomplete_timecard").show();
    $('input[data-type="search"]').val('');
    $('input[data-type="search"]').focus();
    $("#page_timesheet_sub").hide();
    //$('#page_timesheet_clientes').html('<input type="search" name="search-1" id="search-1" >');
    $('#page_timesheet_projetos').scrollPagination({
        nop: 30, // The number of posts per scroll to be loaded
        offset: 1, // Initial offset, begins at 0 in this case
        error: '<center>Nenhum projeto encontrado</center>', // When the user reaches the end this is the message that is
        // displayed. You can change this if you want.
        delay: 500, // When you scroll down the posts will load after a delayed amount of time.
        // This is mainly for usability concerns. You can alter this as you see fit
        scroll: false, // tirando por estar influenciando na tela de lancamento qdo rola a barra // The main bit, if set to false posts will not load as the user scrolls.
        // but will still load if the user clicks.
        q: $('#busca_projeto_timesheet').val(),
        url: COMMON_URL_MOBILE + '/search.php',
        tipo: 'p',
        idcliente: $("#codigo_auxiliar").val(),
        idempresa: Objeto_json.idempresa_vendedor,
        idsenha: Objeto_json.usuario_id
    });
    $("#page_timesheet #voltar_timesheet").attr("href", "javascript:;");
    $('#page_timesheet #voltar_timesheet').click(function ()
    {
        $("#page_timesheet_projetos").html('');
        $("#page_timesheet_sub").show(function () {
            $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
            $("#divautocomplete_timecard").hide();
        });
    });
});
//pega click ao listar projetos
$(document).delegate("[id^='idclienteprojeto_']", 'click', function () {
    $("#divautocomplete_timecard").hide();
    var id = $(this).attr('id');
    var idclienteprojeto = id.split('_');
    var idcliente = $(this).attr('data-idcliente');
    var nomecliente = $(this).attr('data-nomecliente');
    var lawps_utbms_project = $(this).attr('data-utbms-project');
    selecionaValor($(this).text(), "p", idclienteprojeto[1], idcliente, nomecliente, lawps_utbms_project);
    $("#page_timesheet_projetos").html('');
    $("#page_timesheet_sub").show();
    $("#page_timesheet #voltar_timesheet").attr("href", "#page_relatorio");
    if (lawps_utbms_project == 'P') {
        $("#porcentagem_conclusao").show();
        //carrega lista com porcentagens
        seleciona_porcentagem_conclusao();
    } else {
        $("#porcentagem_conclusao").hide();
    }
});

//Pega dados do idtimecard que foi clicado e deleta
$(document).delegate('#list .delete_timesheet', 'click', function () {
    idtimecard = $(this).attr('id');
    if (confirm('Deseja apagar esse Timecard ?')) {
        var ajax_file = COMMON_URL_MOBILE + '/save_lanctos.php';
        $.ajax({
            type: 'POST',
            url: ajax_file,
            dataType: "jsonp",
            crossDomain: true,
            data: {
                idtimecard: idtimecard,
                tipo: 'timesheet_excluir',
                idsenha: Objeto_json.usuario_id
            }
        }).then(function (data)
        {
            if (data == 'T') {
                $().toastmessage('showSuccessToast', 'Timecard exclu&iacute;do com sucesso!');
                $("#timesheet_" + idtimecard).hide(500);
            } else {
                $().toastmessage('showErrorToast', data);
            }
        });
    }
});
//Exibe fase conforme idprojeto
function seleciona_fase(idcliente, idprojeto, selecionado_fase, selecionado_atividade) {
    loading('show');
    if ($("input#codigo_fase").attr('type') == 'hidden') {
        $("input#codigo_fase").remove();
        $("input#codigo_atividade").remove();
    }

    $("#task_parent").attr('id', 'codigo_fase');
    $("#codigo_fase").attr('name', 'codigo_fase');
    $("#task").attr('id', 'codigo_atividade');
    $("#codigo_atividade").attr('name', 'codigo_atividade');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + '/search.php?tipo=t&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                if (selecionado_fase == 0 || typeof selecionado_fase == 'undefined') {
                    selecionado_fase = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + '>Selecione uma fase</option>';
                $.each(response, function (key, val) {
                    selected = '';
                    if (val.idutbms == selecionado_fase)
                        selected = 'selected="selected"';
                    options += '<option value="' + val.idutbms + '" ' + selected + '>' + val.utbms_nome + '</option>';
                });
                $("#codigo_fase").html(options);
                $('select#codigo_fase').selectmenu('refresh');
                loading('hide');
                if (selecionado_atividade != 0)
                    seleciona_atividade(selecionado_atividade);
            });
}

//Andre Renovato - 26/06/2014 - oc:13190
//Exibe lista de porcentagem conclusao
function seleciona_porcentagem_conclusao(item_selected) {
    loading('show');

    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + '/search.php?tipo=percent_conclusao',
        dataType: "jsonp",
        crossDomain: true
    })

            .then(function (response) {
                var options = '';
                $.each(response, function (key, val) {
                    selected = item_selected ? item_selected : '';

                    selected = val == selected ? 'selected="selected"' : '';

                    options += '<option value="' + val + '" ' + selected + '>' + val + '</option>';
                });

                $("#porc_conclusao_atividade").html(options);
                //$("select#porc_conclusao_atividade").selectmenu("refresh");
                $(document).bind('pageinit', function () {
                    $('select#porc_conclusao_atividade').selectmenu('refresh');
                });
                loading('hide');
            });
}

function seleciona_atividade(selecionado)
{
    loading('show');
    if (selecionado == 0 || typeof selecionado == 'undefined') {
        selecionado = "";
        var selected_first = "selected='selected'";
    }
    var options = '<option value="" ' + selected_first + '>Selecione uma atividade</option>';
    $("#codigo_atividade").html(options);
    val_idutbms_fase = $("#codigo_fase").val();
    idcliente = $("#codigo_auxiliar").val();
    idclienteprojeto = $("#codigo").val();
    if ($("#codigo_fase").val() != '')
    {
        $.ajax({
            type: 'GET',
            url: COMMON_URL_MOBILE + '/search.php?tipo=atividade&idtarefa=' + val_idutbms_fase + '&idsenha=' + Objeto_json.usuario_id + '&idcliente=' + idcliente + '&idprojeto=' + idclienteprojeto,
            dataType: "jsonp",
            crossDomain: true
        })
                .then(function (response)
                {
                    var items = [];
                    var options = '<option value="">Escolha uma atividade</option>';
                    $.each(response, function (key, val) {
                        selected = '';
                        if (selecionado == val.idutbms) {
                            selected = "selected='selected'";
                        }
                        options += '<option value="' + val.idutbms + '" ' + selected + '>' + val.utbms_nome + '</option>';
                    });
                    $("#codigo_atividade").html(options);
                    $('select#codigo_atividade').selectmenu('refresh');
                    loading('hide');
                });
    }
}

//Exibe TAREFA PRINCIPAL conforme idprojeto se for PROJECT
function seleciona_task_parent(idcliente, idprojeto, selecionado) {

    loading('show');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + '/search.php?tipo=task_parent&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id + '&idempresa=' + Objeto_json.idempresa_vendedor + '&idtask=' + selecionado,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                selecionado_parent = response.selecionado;

                if ((typeof selecionado == 'undefined' || selecionado == '') && selecionado_parent != '')
                    selecionado = selecionado_parent;

                if (selecionado_parent == 0 || typeof selecionado_parent == 'undefined') {
                    selecionado_parent = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + ' >Selecione uma tarefa</option>';
                $.each(response.select_tarefas, function (key, val) {
                    selected = '';
                    if (selecionado_parent == key) {
                        selected = "selected='selected'";
                    }
                    options += '<option value="' + key + '" ' + selected + '>' + val + '</option>';
                });
                //$('#atividade_task').html(response.select_atividades);
                if (!$("#task_parent").length) {
                    $("#codigo_fase").attr("id", "task_parent");
                    $("#task_parent").attr("name", "task_parent");
                }
                $("#task_parent").html(options);
                if ($("input#codigo_fase").attr('type') != 'hidden') {
                    $('#fase_task').append('<input type="hidden" name="codigo_fase" id="codigo_fase" >');
                }
                $('#codigo_fase').val(response.select_tarefas_hidden);
                //$("select#task_parent").selectmenu("refresh");
                $(document).bind('pageinit', function () {
                    $('select#task_parent').selectmenu('refresh');
                });
                loading('hide');

                if (selecionado != '')
                    seleciona_task(idcliente, idprojeto, selecionado_parent, selecionado);
            });
}

//Exibe TAREFA FILHO conforme idprojeto se for PROJECT
function seleciona_task(idcliente, idprojeto, idtarefa_principal, selecionado) {
    loading('show');
    $.ajax({
        type: 'GET',
        url: COMMON_URL_MOBILE + '/search.php?tipo=task&idcliente=' + idcliente + '&idprojeto=' + idprojeto + '&idsenha=' + Objeto_json.usuario_id + '&idempresa=' + Objeto_json.idempresa_vendedor + '&idtarefa_principal=' + idtarefa_principal,
        dataType: "jsonp",
        crossDomain: true
    })
            .then(function (response)
            {
                if (selecionado == 0 || typeof selecionado == 'undefined') {
                    selecionado = "";
                    var selected_first = "selected='selected'";
                }
                var options = '<option value="" ' + selected_first + '>Selecione uma atividade</option>';
                $.each(response.select_atividades, function (key, val) {
                    selected = '';
                    if (selecionado == key) {
                        selected = "selected='selected'";
                    }
                    options += '<option value="' + key + '" ' + selected + '>' + val + '</option>';
                });
                //$('#atividade_task').html(response.select_atividades);
                if (!$("#task").length) {
                    $("#codigo_atividade").attr("id", "task");
                    $("#task").attr("name", "task");
                }
                $("#task").html(options);
                if ($("input#codigo_atividade").attr('type') != 'hidden') {
                    $('#atividade_task').append('<input type="hidden" name="codigo_atividade" id="codigo_atividade" >');
                }
                $('#codigo_atividade').val(response.select_atividades_hidden);
                //$("select#task").selectmenu("refresh");
                $(document).bind('pageinit', function () {
                    $('select#task').selectmenu('refresh');
                });
                loading('hide');
            });
}


//ACOES DE CLIQUE E LOADING
$(document).delegate('#task_parent', 'change', function () {
    seleciona_task($('#codigo_auxiliar').val(), $('#codigo').val(), $('#task_parent').val());
});

var retries = 0;

function cam_clearCache() {
    navigator.camera.cleanup();
}

var sendpic_win = function (r) {
    if (r.response.length > 0) {
        var result = eval('(' + r.response + ')'); //transformando a string em objeto para acessar cada objeto

        $("#arquivo_md5").val(r.response);
        localStorage.setItem('foto', result.nome_arquivo_temp);
        var visu = '<div data-mini="true" data-role="controlgroup" data-type="horizontal"><img width="25%" src="' + COMMON_URL_MOBILE + '/temp_mobile/' + result.nome_arquivo_temp + '"></div>';
        $("#popup_imagem").empty().append('<br>' + visu);

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
    alert('EM DEFAULT JS');
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    //options.fileName = 'Andre.jpg';//fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI(COMMON_URL_MOBILE + '/upload.php'), sendpic_win, sendpic_fail, options);
}

function capturePhoto(sourceType) {
    if (!navigator.camera) {
        alert('Ooops, nao foi possivel usar a camera!');
    } else {
        loading('show', 'Enviando foto, aguarde...');

        if (!sourceType) {
            sourceType = Camera.PictureSourceType.CAMERA;
        }

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
    alert('Camera falhou ao tirar a foto: ' + message);
}

//TODA ACAO COMUM EM JAVASCRIPT DEVE SER TRATADA AQUI
$(document).ready(function () {
    
    //exibe campos de intervalo para apontar horas
    $("#div_intervalo").hide()
    $("#monstrarIntervalo").click(function () {
        $("#div_intervalo").toggle();
    });

    var link = '';
    //Acao do click dos botoes de atalho na home(mobile_home.html / mobile_crm_home.html), onde encaminha para pagina correta.
    $('.linkHome').click(function () {
        
        parent.preloadIframe();
        
        //alert('VERSAO MOBILE: '+version_system+' - VERSAO APLICAO: ');
        //valida se e uma page do index mobile antigo, tela do portal ou nova pagina
        if ($(this).attr('id') == 'sem_acesso') {
            link = Objeto_json['url'] + '/timesheet/multidados/module/';
            window.location.href = link;
        } else {
            if ($(this).attr('mobile') == 'true') {
                //setar o caminho absoluto, para o aplicativo ler a pagina da sua raiz
                //link = Objeto_json['url'] + '/mobile/pages.html#' + $(this).attr('id');
                link = 'pages.html#' + $(this).attr('id');
                window.location.href = link;
            } else {
                //setar url do sistema, pois o portal é chamado atraves da url
                //Andre Renovato - 12/11/2015
                //nao estamos mais tratando pelo id porque o jquery apresentava problema ao tentar setar o id para fazer alguma ação, provavelmente
                //por causa dos caracteres "?#=". Neste caso no menu os links externos vamos remover a url que ficava no id e jogar para o novo paramentro link, 
                //e o id vai ficar com o nome da acao menu. Ex. Aprovar Horas (id="aprov_horas" link="?display=portal&m=timesheet&a=timesheet_aprovacoes_portal&nomenu=1")                
                //link = COMMON_URL + $(this).attr('id');
                link = Objeto_json['url'] + '/' + $(this).attr('link');
                window.location.href = link;
            }
        }
    })


    //Pega data do dia ########################################################
    var data = new Date();
    mes = data.getMonth() + 1;
    if (mes < 10)
        mes = "0" + mes;
    if (data.getDate() < 10)
        dia = "0" + data.getDate();
    else
        dia = data.getDate();
    data_hoje = dia + "/" + mes + "/" + data.getFullYear();
    //#########################################################################

    //Configuracao alert
    $().toastmessage({
        position: 'middle-center',
        type: 'success'
    });
    
    //Define footer para todas as páginas
    $(".name_powered").html('Powered by MultidadosTI &copy; ' + vs_mobile);

    $(document).on("pageinit", function () {
        $("#data_lcto").val(data_hoje);
        $("#data_trabalhada").val(data_hoje);
        if ($("#filtro_data_trabalhada").val() == '') {
            $("#filtro_data_trabalhada").val(data_hoje);
        }
        if ($("#dateinput2").val() == '') {
            $("#dateinput2").val(data_hoje);
        }
    });

    
    $("#save_timecard_top").click(function ()
    {
        salvar_timesheet();
    });
    $("#save_timecard_bottom").click(function ()
    {
        salvar_timesheet();
    });
    $("#save_despesa_top").click(function ()
    {
        salvar_despesa();
    });
    $("#save_despesa_bottom").click(function ()
    {
        salvar_despesa();
    });
    
    ua = navigator.userAgent.toLowerCase();
    //verifica se é ios
    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipod') != -1) {
        $("#filtro_data_trabalhada").change(function ()
        {
            buscar_timesheet($("#filtro_data_trabalhada").val());
        });
    } else {
        $("#filtro_data_trabalhada").change(function ()
        {
            buscar_timesheet($("#filtro_data_trabalhada").val());
        });

        /*if (ua.indexOf('android') != -1) {
         var version = ua.match(/android\s+([\d\.]+)/)[1];
         //Se vers?o android for maior 4.3 desabilita upload despesa
         if (parseFloat(version) == 4.3) {
         $('#upload_despesa').hide();
         }
         }*/
    }

    if (ua.indexOf('iphone') != -1 || ua.indexOf('ipod') != -1 || ua.indexOf('ipad') != -1) {

        /*
         $(".pagina").css("margin-top", "20px");
         $("#barra_status_ios").css("position", "fixed");
         $("#barra_status_ios").css("z-index", "99");
         $("#barra_status_ios").css("top", "0%");
         $("#barra_status_ios").css("height", "20px");
         $("#barra_status_ios").css("width", "100%");
         $("#barra_status_ios").css("background", "#EAEAEA");
         */

        $("#dateinput2").change(function ()
        {
            buscar_despesa($("#dateinput2").val());
        });
    } else {
        $("#dateinput2").change(function ()
        {
            buscar_despesa($("#dateinput2").val());
        });
    }

    $(document).delegate('#codigo_fase', 'change', function () {
        seleciona_atividade(0);
    });
        
    $("#vlr_unitario").blur(function (){
        if ($("#vlr_unitario").val() != '') {
            if ($("#qtde_despesa").val() == 0 || $("#qtde_despesa").val() == '') {
                $("#qtde_despesa").val(1);
            }
            elValueToCurrency($("#vlr_unitario"));
            calcula_total_despesa();
            
            //valor_unitario = parseFloat($("#vlr_unitario").val().replace(',', '.'));
            //valor_unitario = formatNumber(unformatNumber(this.value, ',', '.', 2, 2), ',', '.', 2, 2);
            //$("#vlr_unitario").val(valor_unitario);
        }
    });
    
    $("#qtde_despesa").blur(function (){
        calcula_total_despesa();
    });
    
    $("#novo_timecard_top").click(function (){
        clearInputs('ts');
        $("#page_timesheet #selecione_cliente .ui-btn-text").text('Buscar Cliente');
        $("#page_timesheet #selecione_projeto .ui-btn-text").text('Buscar Projeto');
        $("#data_trabalhada").val(data_hoje);
    });
    
    $("#novo_despesa_top").click(function () {
        clearInputs();
        $("#arquivo_md5").val('');
        //$("#upload_arquivos").html('<input type="file" onchange="upload();" accept="image/*" name="arq_despesa" id="arq_despesa" class="ui-input-text ui-body-c">');
        $(document).on("pageshow", "#page_despesa", function () { //Loading de página despesa
            loading('hide');
        });
        $("#page_despesa #selecione_cliente .ui-btn-text").text('Buscar Cliente');
        $("#page_despesa #selecione_projeto .ui-btn-text").text('Buscar Projeto');
        $("#data_lcto").val(data_hoje);
    });

    $("#icon_timesheet").click(function ()
    {
        $('#filtro_data_trabalhada').val(data_hoje);
        $('#filtro_data_trabalhada').trigger('change');
    })

    $("#icon_despesa").click(function ()
    {
        $('#dateinput2').val(data_hoje);
        $('#dateinput2').trigger('change');
    })


    //DESPESA: pega dados do idserviço conforme selecionado
    $("#codigo_despesa").change(function () {
        idservico = $("#codigo_despesa option:selected").val();
        var ajax_file = COMMON_URL_MOBILE + '/retorna_despesa.php';
        dados_despesa = (dados_servicos[idservico]);
        var valor_despesa_digitado = formatNumber(dados_despesa['preco_venda'], '.', 2, 2);
        if (dados_despesa['valor_bloqueado_alt'] == 'T') {
            $('#vlr_unitario').val(valor_despesa_digitado);
            document.getElementById('vlr_unitario').style.backgroundColor = '#EAEAEA';
            document.getElementById('vlr_unitario').readOnly = true;
            $('#vlr_unitario').trigger('blur');
        } else {
            if ($('#vlr_unitario').val() == '') {
                $('#vlr_unitario').val(valor_despesa_digitado);
            }
            document.getElementById('vlr_unitario').style.backgroundColor = '';
            document.getElementById('vlr_unitario').readOnly = false;
            $('#vlr_unitario').trigger('blur');
        }

    });

    $("#divautocomplete_timecard").hide();
    $("#divautocomplete_despesa").hide();
    //ajax de pesquisa cliente/projeto
    $(document).on("pageinit", "#page_despesa", function () {
        $('#data_lcto').mobiscroll().date({
            //invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
            //theme: 'android-ics',
            //display: 'inline',
            minDate: new Date(2012, 1, 1),
            maxDate: new Date(2030, 1, 1),
            display: 'top',
            mode: 'scroller',
            dateOrder: 'dd mm yy',
            dateFormat: "dd/mm/yy",
            lang: 'pt-BR',
            dayText: 'Dia',
            monthText: 'Mes',
            yearText: 'Ano',
            cancelText: 'Cancelar',
            setText: 'Selecionar'
        });

        $("#autocomplete_cli").on("listviewbeforefilter", function (e, data) {
            var $ul = $(this),
                    $input = $(data.input),
                    value = $input.val(),
                    html = "";
            $ul.html("");
            if (value && value.length > 0) {
                $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                //$ul.listview("refresh");
                $ul.listview().listview('refresh');
                $.ajax({
                    //url: "http://gd.geobytes.com/AutoCompleteCity",
                    url: COMMON_URL_MOBILE + '/search.php',
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        q: $input.val(),
                        idempresa: Objeto_json.idempresa_vendedor,
                        idsenha: Objeto_json.usuario_id,
                        offset: 1, // Initial offset, begins at 0 in this case
                        tipo: pesq_autocomplete, //pesq_autocomplete é uma variavel global onde seto qual tipo de pesquisa, neste caso cliente ou projeto
                        mode: 'ajax'
                    }
                })
                        .then(function (response) {
                            $("#page_despesa_clientes").html('');
                            $("#page_despesa_projetos").html('');
                            $ul.html(response);
                            //$ul.listview("refresh");
                            $ul.listview().listview('refresh');
                            $ul.trigger("updatelayout");
                        });
            }
        });
    });
    
    $(document).on("pageinit", "#page_timesheet", function () {
        $("#autocomplete_prj").on("listviewbeforefilter", function (e, data) {
            var $ul = $(this),
                    $input = $(data.input),
                    value = $input.val(),
                    html = "";
            $ul.html("");
            if (value && value.length > 0) {
                $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                //$ul.listview("refresh");
                $ul.listview().listview('refresh');
                $.ajax({
                    //url: "http://gd.geobytes.com/AutoCompleteCity",
                    url: COMMON_URL_MOBILE + '/search.php',
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        q: $input.val(),
                        idempresa: Objeto_json.idempresa_vendedor,
                        idsenha: Objeto_json.usuario_id,
                        offset: 1, // Initial offset, begins at 0 in this case
                        tipo: pesq_autocomplete, //pesq_autocomplete é uma variavel global onde seto qual tipo de pesquisa, neste caso cliente ou projeto
                        mode: 'ajax'
                    }
                })
                        .then(function (response) {
                            $("#page_timesheet_clientes").html('');
                            $("#page_timesheet_projetos").html('');
                            $ul.html(response);
                            //$ul.listview("refresh");
                            $ul.listview().listview('refresh');
                            $ul.trigger("updatelayout");
                        });
            }
        });

        $('#data_trabalhada').mobiscroll().date({
            //invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
            //theme: 'android-ics',
            display: 'top',
            minDate: new Date(2012, 1, 1),
            maxDate: new Date(2030, 1, 1),
            mode: 'scroller',
            dateOrder: 'dd mm yy',
            dateFormat: "dd/mm/yy",
            lang: 'pt-BR',
            dayText: 'Dia',
            monthText: 'Mes',
            yearText: 'Ano',
            cancelText: 'Cancelar',
            setText: 'Selecionar'
        });

        LoadMobiScroll();

        $('.click_datetime').click(function () {
            var id_campo;
            var id_campo_div;
            switch (this.id) {
                case 'hora_ini':
                    id_campo = '#hora_inicial';
                    id_campo_div = '#hora_inicial_div';
                    break;
                case 'hora_fim':
                    id_campo = '#hora_final';
                    id_campo_div = '#hora_final_div';
                    break;
                case 'intervalo_hr_ini':
                    id_campo = '#intervalo_hr_inicial';
                    id_campo_div = '#intervalo_hr_inicial_div';
                    break;
                case 'intervalo_hr_fim':
                    id_campo = '#intervalo_hr_final';
                    id_campo_div = '#intervalo_hr_final_div';
                    break;
            }
            ;

            if ($(id_campo_div).css('display') == 'none') {
                $(id_campo_div).css('display', 'block');
            } else {
                //$(id_campo_div).css('display','none');
                $(id_campo_div).slideUp();
                var x = $(id_campo).mobiscroll('getValues');
                $("#" + this.id).val(x[0].value);
            }
        })
    });

    $(document).on("pageinit", "#page_relatorio", function () {
        $('#filtro_data_trabalhada').mobiscroll().date({
            //invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
            //theme: 'android-ics',
            display: 'top',
            minDate: new Date(2012, 1, 1),
            maxDate: new Date(2030, 1, 1),
            mode: 'scroller',
            dateOrder: 'dd mm yy',
            dateFormat: "dd/mm/yy",
            lang: 'pt-BR',
            dayText: 'Dia',
            monthText: 'Mes',
            yearText: 'Ano',
            cancelText: 'Cancelar',
            setText: 'Selecionar'
        });

        var x = $("#filtro_data_trabalhada").mobiscroll('getValues');
        $("#filtro_data_trabalhada").val(x[0].value);

        buscar_timesheet($("#filtro_data_trabalhada").val());
    });

    //Em pagina lista depesas
    $(document).on("pageinit", "#relatorio_despesa", function () {
        $('#dateinput2').mobiscroll().date({
            //invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] },
            //theme: 'android-ics',
            display: 'top',
            minDate: new Date(2012, 1, 1),
            maxDate: new Date(2030, 1, 1),
            mode: 'scroller',
            dateOrder: 'dd mm yy',
            dateFormat: "dd/mm/yy",
            lang: 'pt-BR',
            dayText: 'Dia',
            monthText: 'Mes',
            yearText: 'Ano',
            cancelText: 'Cancelar',
            setText: 'Selecionar'
        });

        var x = $("#dateinput2").mobiscroll('getValues');
        $("#dateinput2").val(x[0].value);
        buscar_despesa($("#dateinput2").val());
    });
    
    //Andre Renovato - 17/03/2016
    //Forcando limpeza dos inputs em timesheet e despesa, dentro da function clearInputs 
    //nao funcionou por causa do iframe entao verficamos o show da pagina para realizar acao apenas quando for um novo registro
    $(document).on("pageshow", "#page_timesheet", function () {
        res = jQuery.mobile.path.get().split('?');
        if(res[1] == 'novo'){
            clearInputs();
            
            var myselect = $("select#codigo_atividade");
            myselect[0].selectedIndex = 0;
            myselect.selectmenu("refresh");
            
            var myselect = $("select#codigo_fase");
            myselect[0].selectedIndex = 0;
            myselect.selectmenu("refresh");
            
        }        
    });

    $(document).on("pageshow", "#page_despesa", function () {
        res = jQuery.mobile.path.get().split('?');
        if(res[1] == 'novo'){
            clearInputs();
            
            var myselect = $("select#codigo_despesa");
            myselect[0].selectedIndex = 0;
            myselect.selectmenu("refresh");
        }        
    });
    //Fim limpeza inputs 17/03/2016

    //Verifica se existe user logado
    if (!objIsEmpty(Objeto_json) && Objeto_json.usuario_id) {
        //Inclui js externo. Incluimos um get randomico para nao correr o risco do arquivo nao ser instanciado apos alguma modificado
        var rand = Math.ceil(Math.random() * 999999999999999) + 1;
        var x = COMMON_URL_MOBILE + 'js/upload-despesa.js?v=' + rand;
        var mainFuncs = COMMON_URL_MOBILE + 'js/main-funcs.js?v=' + rand;
        var scriptAppend = '<script type="text/javascript" src="' + x + '"></script>';
        scriptAppend += '<script type="text/javascript" src="' + mainFuncs + '"></script>';

        $('head').append(scriptAppend);
     }
});//fim doc ready

function LoadMobiScroll() {
    /* PROPRIEDADE display:
     'modal' - The component appears as a popup at the center of the viewport.
     'inline' - If called on div element, the component is placed inside the div (overwriting existing content), otherwise is placed after the original element.
     'bubble' - The component appears as a bubble positioned to the element defined by the 'anchor' setting. By default the anchor is the original element.
     'top' - The component appears docked to the top of the viewport.
     'bottom' - The component appears docked to the bottom of the viewport.
     */
    $('#hora_inicial, #hora_final, #intervalo_hr_inicial, #intervalo_hr_final').mobiscroll('destroy');
    $('#hora_inicial, #hora_final, #intervalo_hr_inicial, #intervalo_hr_final').mobiscroll().time({
        //theme: 'mobiscroll',
        mode: 'scroller',
        display: 'inline',
        timeFormat: 'HH:ii',
        timeWheels: 'HHii',
        hourText: 'Horas',
        minuteText: 'Minutos',
        headerText: false,
        cancelText: 'Cancelar',
        setText: 'Selecionar'
    });
}
