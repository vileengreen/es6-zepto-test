/*TMODJS:{"version":18,"md5":"c8c2cd6b4577265d62fa47d94ebd8786"}*/
template("E:/wamp/www/Jeremy/2017xiyou/cbd/dev/src/js/tpl/maparea",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.dataarr,e=(a.vrr,a.irr,a.v,a.i,b.$escape),f="";return c(d,function(a){f+=' <div class="area-wrap-block"> ',c(a,function(a){f+=" <div build_type=",f+=e(a.build_type),f+=" land_id=",f+=e(a.land_id),f+=" uid=",f+=e(a.uid),f+=' class="area-unit"> ',1==a.build_type?f+=' <img class="shop t71" src="./img/page/cbd/shop-71.png"/> ':2==a.build_type?f+=' <img class="shop thg" src="./img/page/cbd/shop-hg.png"/> ':3==a.build_type?f+=' <img class="shop tmv" src="./img/page/cbd/shop-mv.png"/> ':4==a.build_type?f+=' <img class="shop tcs" src="./img/page/cbd/shop-cs.png"/> ':5==a.build_type&&(f+=' <img class="shop t4s" src="./img/page/cbd/shop-4s.png"/> '),f+=" </div> "}),f+=" </div> "}),new String(f)});