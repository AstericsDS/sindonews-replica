function orionInit(lastPage) {
    $.ajax({
        url: $('#orioninfo').attr('data-status'),
        method: 'POST',
        data: {
            u: lastPage
        },
        success: function (result) {
            if (result.login === 1) {
                $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').addClass('logged').removeClass('not-logged').html('<div class="login-img"></div>');
                orionProfile(result.id_mpi, result.info, lastPage);
                firstLogin();
            } else {
                $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').removeClass('logged').addClass('not-logged').show();
                var orionURL = result.login_url;
                orionLogin(orionURL, lastPage);
                clearStorage();
            }
            //console.log(result);
        }
    });
}

$('#OpenNav,#OpenNavFloat,#OpenNavFloat2').click(function(){
    $('#OpenNav,#OpenNavFloat,#OpenNavFloat2').addClass('open-sidemenu');
    if ($('.login-popup').hasClass('show-popup')) {
        $('.login-popup').removeClass('show-popup').hide();
    }
});

$('#CloseNav,#CloseNavFloat,#CloseNavFloat2').click(function(){
    $('#OpenNav,#OpenNavFloat,#OpenNavFloat2').removeClass('open-sidemenu');
});

$('#OpenNav').click(function(){
    $('#OpenNavFloat,#OpenNavFloat2').hide();
    $('#CloseNavFloat,#CloseNavFloat2').show();
});

$('#OpenNavFloat').click(function(){
    $('#OpenNav,#OpenNavFloat2').hide();
    $('#CloseNav,#CloseNavFloat2').show();
});

$('#OpenNavFloat2').click(function(){
    $('#OpenNav,#OpenNavFloat').hide();
    $('#CloseNav,#CloseNavFloat').show();
});

$('#CloseNav').click(function(){
    $('#OpenNavFloat,#OpenNavFloat2').show();
    $('#CloseNavFloat,#CloseNavFloat2').hide();
});

$('#CloseNavFloat').click(function(){
    $('#OpenNav,#OpenNavFloat2').show();
    $('#CloseNav,#CloseNavFloat2').hide();
});

$('#CloseNavFloat2').click(function(){
    $('#OpenNav,#OpenNavFloat').show();
    $('#CloseNav,#CloseNavFloat').hide();
});

function orionDashboard(profilepict,urlprofile) {
    $('.login-img').addClass('bg-none').append(profilepict).show();
    $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').show();
    
    $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').clickToggle(function () {
        if($('.login-popup').hasClass('show-popup')) {
            $('.login-popup').removeClass('show-popup').hide();
        } else {
            $('.login-popup').addClass('show-popup').show();
        }
        
        if($('#OpenNav,#OpenNavFloat,#OpenNavFloat2').hasClass('open-sidemenu')){
            $('#CloseNav').click();
        }
    },function(){
        if($('.login-popup').hasClass('show-popup')) {
            $('.login-popup').removeClass('show-popup').hide();
        } else {
            $('.login-popup').addClass('show-popup').show();
        }
        
        if($('#OpenNav,#OpenNavFloat,#OpenNavFloat2').hasClass('open-sidemenu')){
            $('#CloseNav').click();
        }
        
    });
    
    $('.warp-user-avatar').click(function(){
        window.open(urlprofile, '_blank');
    });
}

function orionLogin(orionURL, lastPage) {
    $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').click(function () {
        window.location.href = orionURL + '&lastpage=' + lastPage;
    });
}

function orionProfile(idmpi, info, urlgo) {
    $.ajax({
        url: $('#orioninfo').attr('data-profile') + '/' + idmpi,
        method: 'POST',
        data: {ext: info, u: urlgo},
        success: function (result) {
            $('.login-popup').html(atob(result.out));
            orionDashboard(result.pict,result.urlprofile);
            orionMove();

            $('.close-avatar').click(function () {
                $('.login-popup').hide();
                $('#LoginNav,#LoginNavFloat,#LoginNavFloat2').removeClass('show-popup');
            });

            $('.data-complete').parent().remove();

            if (typeof (Storage) !== "undefined") {
                var orionFirst = window.localStorage.getItem('orionFirst');
                var orionClose = window.localStorage.getItem('orionAlertClose');
                if ((orionFirst !== 1) && (orionClose === null || orionClose === 1) && !orionGetCookie('orionAlertClose')) {
                    $('.alert-popup').html(atob(result.popup)).show();
                    $('.data-complete').parent().remove();
                    $('.alert-close').click(function () {
                        $('.alert-popup').remove();
                        closeAlert();
                    });
                }
            }
            //console.log(result);
        }
    });
}

function orionMove() {
    $(window).scroll(function () {
        if (document.body.scrollTop > 130 || document.documentElement.scrollTop > 130) {
            $('.login-popup').addClass('top-ns').removeClass('top-s');
        } else {
            $('.login-popup').addClass('top-s').removeClass('top-ns');
        }
    });
}

function clearStorage() {
    if(orionGetCookie('orionAlertClose')){
        var exdays = -7;
        var domain = $('#orioninfo').attr('data-host');
        orionCookie('orionAlertClose','',exdays,domain);
    }
    
    if (typeof (Storage) !== "undefined") {
        localStorage.removeItem('orionFirst');
        localStorage.removeItem('orionAlertClose');
    }
}

function firstLogin() {
    if (typeof (Storage) !== "undefined") {
        var orionFirst = window.localStorage.getItem('orionFirst');
        if (orionFirst === 0 || orionFirst === null) {
            window.localStorage.setItem('orionFirst', 1);
        }
    }
}

function closeAlert() {
    if(!orionGetCookie('orionAlertClose')){
        var exdays = 6 * 30;
        var domain = $('#orioninfo').attr('data-host');
        orionCookie('orionAlertClose',1,exdays,domain);
    }
    
    if (typeof (Storage) !== "undefined") {
        var orionNum = 0;
        var orionClose = window.localStorage.getItem('orionAlertClose');
        if (orionClose === 0 || orionClose === null) {
            orionNum = 1;
            window.localStorage.setItem('orionAlertClose', orionNum);
        } else {
            orionNum = Number(orionClose) + 1;
            window.localStorage.setItem('orionAlertClose', orionNum);
        }
    }
}

function orionCookie(cname,cvalue,exdays,domain){var d = new Date();d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));var expires = "expires=" + d.toUTCString();document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain=" + domain + "; secure; SameSite=None";}
function orionGetCookie(cname){var name = cname + "=";var decodedCookie = decodeURIComponent(document.cookie);var ca = decodedCookie.split(';');for(var i = 0;i < ca.length;i++){var c = ca[i];while(c.charAt(0) == ' '){c = c.substring(1);}if(c.indexOf(name) == 0){return c.substring(name.length,c.length);}}return "";}