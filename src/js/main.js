import legoWaitng from './legolib/lego-waiting/0.0.1/legoWaiting.min.js';
import LegoToast from './legolib/lego-toast/0.0.1/legoToast.min.js';
import util from './lib/util.js';
setTimeout(function() {
    $('.js-loading-line').addClass('full');
}, 100);

var pageTpl = {
    maparea: require('./tpl/maparea.tpl'),
    fanlist: require('./tpl/fanlist.tpl'),
    salelist: require('./tpl/salelist.tpl')
};

var app = {
    smsTimer: null,
    waiting: new legoWaitng("请稍后.", "extraClass"),
    curSelectArea: null,
    userinfo: null,
    init: function(){
        var self = this;
        $('.js-loading-wrap').addClass('hide');
        $('.js-login-wrap').removeClass('hide');
        if(util.getCookie('ci_session')){
            self.gameviewInit();
        }
        self.bindEven();
    },
    gameviewInit: function(){
        var self = this;
        /**获取用户信息 */
        util.ajaxFun('/app/main/getUserInfo',{
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.userinfo = jdata.data;
                $('.js-login-wrap,.js-reg-wrap').addClass('hide');
                $('.js-main-view').removeClass('hide');
                $('.js-jb-show').html(jdata.data.jb);
                $('.js-user-name').html(jdata.data.nick || '还没名字');
                $('.js-activation_code_num').html(jdata.data.activation_code_num);
                jdata.data.headimgurl && $('.js-user-avatar').attr('src',jdata.data.headimgurl)
                self.getUserLands();
            }else{
                $('.js-login-wrap').removeClass('hide');
                $('.js-main-view').addClass('hide');
            }
            
        })
    },
    /** 购买房产 */
    buildMap: function(selectbuildtype){
        var self = this;
        if(!self.curSelectArea.attr('land_id')){
            util.windowToast('请先选择土地');
            return;
        }
        if(isNaN(selectbuildtype)){
            util.windowToast('请先选择建筑类型');
            return;
        }
        util.ajaxPost('/app/main/buyLand',{
            id: self.curSelectArea.attr('land_id'),
            type: selectbuildtype
        }).done((jdata)=>{
            if(jdata.code == 0){
                self.getUserLands();
                util.windowToast('购买完成');
            } else if (jdata.code == 1002) {
                $('.js-activation_code_num').html(self.userinfo.activation_code_num);
                $('.js-my-jhm').removeClass('hide');
            }
        })
    },
    /** 获取土地 */
    getUserLands: function(){
        util.ajaxFun('/app/main/getUserLands',{}).done((jdata)=>{
            if(jdata.code == 0 && jdata.data.lands.length > 0){
                var newArr = [],b;
                var arr = jdata.data.lands;
                arr.forEach(function(item, index, array) {
                    var a = Math.floor(index / 4);
                    if (b !== a) {
                        b = a;
                        newArr[a] = new Array();
                    }
                    newArr[a].push(item);         
                });
                console.log('newArr', newArr);
                $('.js-area-wrap').html(pageTpl.maparea({
                    dataarr: newArr
                }));
            }
        })
    },
    /** 获取交易记录 */
    getSalesRecord: function(){
        util.ajaxFun('/app/main/getSalesRecord',{}).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-cc-list').html(pageTpl.salelist({
                    data: jdata.data.orders
                }));
            }
        })
    },
    /** 完成注册 */
    regdone: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val())){
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-sms-code').val().length < 4){
            util.windowToast('请输入短信验证码');
            return;
        }
        if($('.js-reg-pwd').val().length < 4){
            util.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/register',{
            sms_captcha: $('.js-sms-code').val(),
            mobile: $('.js-mobile').val(),
            password: $('.js-reg-pwd').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                util.windowToast('完成注册');
                gameviewInit();
            }
        })

    },
    /** 完成登录 */
    logindone: function(){
        var self = this;
        if(!/tcpan/.test(window.location.href)){
            window.testtoken = '7f76bb56a511792cfe56ccfd7a492fd7';
            self.gameviewInit();
            return;
        }
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-login-mob').val())){
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-login-pwd').val().length < 4){
            util.windowToast('请输入密码');
            return;
        }
        util.ajaxPost('/app/main/login',{
            mobile: $('.js-login-mob').val(),
            password: $('.js-login-pwd').val()
        }).done((jdata)=>{
            if(jdata.code == 0){
                //window.testtoken = jdata.data.token;
                //window.testtoken = '7f76bb56a511792cfe56ccfd7a492fd7';
                self.gameviewInit();
                
            }
        })
    },
    /** 获取图形验证码 */
    qrcodeInit: function(){
        util.ajaxFun('/app/main/getPicCaptcha',{}).done(function(jdata){            
            if(jdata.code == 0){
                $('.js-checkcode').attr({
                    src: jdata.data.pic_captcha,
                    session_id: jdata.data.session_id,
                })
            }
        })
    },
    /** 短信验证码倒计时 */
    smsCodeTimeout: function(){
        var self = this;
        var timeoutVal = window.localStorage.getItem('smstimeout');
        console.log('smsCodeTimeout', new Date()*1 - timeoutVal);
        if(timeoutVal && new Date()*1 - timeoutVal < 60*1000 ){
            $('.js-get-check-code').addClass('disable').html(' 60秒');
            self.smsTimer = setInterval(function(){
                var thedate = new Date()*1;
                var timeoutshow = Math.ceil(60 - (thedate - timeoutVal)/1000);
                $('.js-get-check-code').addClass('disable').html(` ${timeoutshow}秒`);
                if(timeoutshow <= 0){
                    clearInterval(self.smsTimer);
                    $('.js-get-check-code').removeClass('disable').html(' 获取短信验证码');
                    window.localStorage.setItem('smstimeout', null);
                }
            },1000);
        }else{
            $('.js-get-check-code').removeClass('disable').html(' 获取短信验证码');
            window.localStorage.setItem('smstimeout', null);
        }
    },
    /** 获取短信验证码 */
    getSmsCode: function(){
        var self = this;
        if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-mobile').val())){
            util.windowToast('请输入正确手机号');
            return;
        }
        if($('.js-checkcodeval').val().length < 4){
            util.windowToast('请输入图形验证码');
            return;
        }
        window.localStorage.setItem('smstimeout', new Date() * 1);
        self.smsCodeTimeout();
        util.ajaxPost('/app/main/getSmsCaptcha',{
            mobile: $('.js-mobile').val(),
            session_id: $('.js-checkcode').attr('session_id'),
            pic_captcha: $('.js-checkcodeval').val()
        }).done((jdata)=>{
            console.log('getSmsCode',jdata);
        })

    },
    /** 获取粉丝列表 */
    getUserFansList: function(listtype){
        $('.js-fanlist-wrap').html('');
        util.ajaxFun('/app/main/getUserFans',{
            type: listtype,
            page: 1,
        }).done((jdata)=>{
            if(jdata.code == 0){
                $('.js-fanlist-wrap').html(pageTpl.fanlist({
                    data: jdata.data.fans
                }))
            }
        })
    },
    bindEven: function(){
        var self = this;
        /** 购入金币弹窗 */
        $('.js-jiaoyi-in').on('click', ()=>{
            $('.js-jiaoyi-center').removeClass('hide').find('.ccc-value').addClass('hide');
            $('.js-jiaoyi-numout').addClass('hide');
            $('.js-jiaoyi-numin').removeClass('hide');
        });
        /** 购入金币 */
        $('.js-jiaoyi-numin').on('click', ()=>{
            if(!$('.js-jiaoyi-num').val() || isNaN($('.js-jiaoyi-num').val())){
                util.windowToast('请输入购买数量');
                return;
            }
            window.location.href = `//cbd.72work.com/app/main/exchangeCoin?type=1&jb=${$('.js-jiaoyi-num').val()}`;
        });
        /** 卖出金币弹窗 */
        $('.js-jiaoyi-out').on('click', ()=>{
            $('.js-jiaoyi-center').removeClass('hide').find('.ccc-value').removeClass('hide');
            $('.js-jiaoyi-numout').removeClass('hide');
            $('.js-jiaoyi-numin').addClass('hide');
        });
        /** 卖出金币 */
        $('.js-jiaoyi-numout').on('click', ()=>{
            if(!$('.js-jiaoyi-num').val() || isNaN($('.js-jiaoyi-num').val())){
                util.windowToast('请输入购买数量');
                return;
            }
            window.location.href = `//cbd.72work.com/app/main/exchangeCoin?type=2&jb=${$('.js-jiaoyi-num').val()}`;
        });
        /** 显示交易列表 */
        $('.js-go-jiaoyi').on('click', ()=>{
            self.getSalesRecord();
            $('.js-jiaoyi-window').removeClass('hide');
        });
        /**选地建筑逻辑 */
        $('.js-area-wrap').on('click', '.area-unit', function(){
            self.curSelectArea = $(this);
            if($(this).attr('build_type') == 0){
                
                $('.select-build-wrap').removeClass('hide');
            }else{
                $('.js-destory-building').removeClass('hide');
                $('.js-bcj').html('---');
                util.ajaxFun('/app/main/getLandInfo',{
                    land_id:  self.curSelectArea.attr('land_id')
                }).done((jdata)=>{
                    if(jdata.code==0){
                        $('.js-bcj').html(jdata.data.sell_price);
                        $('.js-db-sure').attr('land_id',jdata.data.land_id);
                    }
                })
            }
        });
        $('.js-sb-list > li').on('click', function(){
            $('.js-sb-list > .cur').removeClass('cur');
            $(this).addClass('cur');
        });
        /**选地取消 */
        $('.js-sb-cancel').on('click', function(){
            $('.select-build-wrap').addClass('hide');
        });
        /**选地确认 */
        $('.js-sb-sure').on('click', function(){
            self.buildMap($('.js-sb-list > .cur').data('type'));
            $('.select-build-wrap').addClass('hide');
        });
        /** 拆迁 */
        $('.js-db-sure').on('click', function(){
            util.ajaxPost('/app/main/sellLand',{
                land_id: $('.js-db-sure').attr('land_id')
            }).done((jdata)=>{
                if(jdata.code == 0){
                    self.getUserLands();
                    util.windowToast('拆迁完成');
                    $('.js-destory-building').addClass('hide');
                }
            })
        })
        /** 登录 */
        $('.js-login-bt').on('click', function(){
            self.logindone();
        });
        /** 完成注册 */
        $('.js-regdone-bt').on('click',function(){
            self.regdone();
        })
        /** 注册页面 */
        $('.js-reg-bt').on('click', function(){
            $('.js-login-wrap').addClass('hide');
            $('.js-reg-wrap').removeClass('hide');
            self.qrcodeInit();
        });
        /** 刷新验证码 */
        $('.js-checkcode').on('click', function(){
            self.qrcodeInit();
        });

        /** 获取短信验证码 */
        $('.js-get-check-code').on('click', function(){
            self.getSmsCode();
        })

        /** 二维码界面 */
        $('.js-go-qr-view').on('click', function(){
            $('.js-qr-view').removeClass('hide');
            util.ajaxFun('/app/main/getQRCode',{}).done((jdata)=>{
                if(jdata.code == 0){
                    $('.js-main-qr').attr({
                        src: jdata.data.qrcode_base64
                    })
                }
            })
        })
        
        $('.js-gologin-bt').on('click', function(){
            $('.js-login-wrap').removeClass('hide');
            $('.js-reg-wrap').addClass('hide');
        })

        /** 转换用户 */
        $('.js-user-switch').on('click', function(){
            util.ajaxFun('/app/main/logout',{});
            $('.js-login-wrap').removeClass('hide');
            $('.js-main-view').addClass('hide');
        })
        /** 激活按钮 */
        $('.js-active').on('click', function(){
            $('.js-activation_code_num').html(self.userinfo.activation_code_num);
            $('.js-my-jhm').removeClass('hide');
        });

        /** 激活 */
        $('.js-my-jhm').on('click','.ccc-out',function(){
            if(self.userinfo.activation_code_num < 1 ){
                util.windowToast('你没有激活码');
                return;
            }
            if(self.userinfo.is_activated != 0){
                util.windowToast('你已激活');
            }else{
                // 激活
                util.ajaxPost('/app/main/activateAccount',{

                }).done((jdata)=>{
                    if(jdata.code == 0){
                        $('.js-my-jhm').addClass('hide');
                        $('.js-jhcg').removeClass('hide');
                    }
                })
            }
        })

        /** 转赠 */
        $('.js-my-jhm').on('click','.ccc-in',function(){
            if(self.userinfo.activation_code_num < 1 ){
                util.windowToast('你没有激活码');
                return;
            }
            $('.js-zryh-s1').removeClass('hide');
        });
        /** 转赠确认 */
        $('.js-zryh-s1').on('click', '.js-gozr', function(){
            if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-ccf-tel').val())){
                util.windowToast('请输入正确手机号');
                return;
            }
            if(isNaN($('.js-ccf-num').val())){
                util.windowToast('请输入正确数量');
                return;
            }
            $('.js-ccf2-num').html($('.js-ccf-num').val());
            $('.js-ccf2-tel').html($('.js-ccf-tel').val());
            $('.js-zryh-sure').removeClass('hide');
        });
        /** 转赠完成 */
        $('.js-zrdone').on('click', function(){
            if(!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($('.js-ccf-tel').val())){
                util.windowToast('请输入正确手机号');
                return;
            }
            if(isNaN($('.js-ccf-num').val())){
                util.windowToast('请输入正确数量');
                return;
            }
            util.ajaxPost('/app/main/transferActivationCode',{
                mobile: $('.js-ccf-tel').val(),
                num: $('.js-ccf-num').val()
            }).done((jdata)=>{
                if(jdata.code == 0){
                    self.userinfo.activation_code_num -= Number($('.js-ccf-num').val());
                    util.windowToast('转赠成功');
                    $('.js-activation_code_num').html(self.userinfo.activation_code_num);
                    $('.js-zrwindow').addClass('hide');
                }
            })
        });
        /** 收租 */
        $('.js-user-shouzu-bt').on('click', function(){
            util.ajaxFun('/app/main/getIncome',{}).done((jdata)=>{
                if(jdata.code == 0){
                    util.windowToast(jdata.msg);
                    $('.js-shouzu-add').html('+'+jdata.data.jb).removeClass('hide');
                    $('.js-jb-show').html(jdata.data.left_jb);
                    setTimeout(()=>{
                        $('.js-shouzu-add').addClass('hide');
                    }, 4000);
                }
            })
        });

        /** 显示粉丝列表 */
        $('.js-user-fans').on('click', function(){
            self.getUserFansList($('.js-cc-fans-nav > .cur').data('type'));
            $('.js-myfriend-list').removeClass('hide');
        });

        /** 粉丝列表切换 */
        $('.js-cc-fans-nav > .fn-unit').on('click', function(){
            $('.js-cc-fans-nav > .cur').removeClass('cur');
            $(this).addClass('cur');
            self.getUserFansList($('.js-cc-fans-nav > .cur').data('type'));
        });


        $('.js-main-qr').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
        });
        $('.js-qr-view').on('click', function(){
            $('.js-qr-view').addClass('hide');
            $('.js-main-view').removeClass('hide');
        })
        /** 通用关闭父弹窗 */
        $('.js-cc-close').on('click', function(){
            $(this).parents('.common-client-wrap').addClass('hide');
        })
    }
}

window.onload = function(){
    setTimeout(()=>{
        app.init();
    },800)
    
}