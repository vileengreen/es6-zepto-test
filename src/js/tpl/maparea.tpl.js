/*TMODJS:{"version":31,"md5":"1144869baf4e8d5535007dd601ae169e"}*/
template("/Users/xiaominghari/Documents/wanrenqun/cbd/cbd/src/js/tpl/maparea",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.dataarr,e=(a.vrr,a.irr,a.v,a.i,b.$escape),f="";return c(d,function(a){f+=' <div class="area-wrap-block"> ',c(a,function(a){f+=" <div build_type=",f+=e(a.build_type),f+=" land_id=",f+=e(a.land_id),f+=" uid=",f+=e(a.uid),f+=' class="area-unit ',a.build_type>0&&(f+=" build "),f+='" > ',1==a.build_type?f+=' <img class="shop t71" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-71.png"/> ':2==a.build_type?f+=' <img class="shop thg" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-hg.png"/> ':3==a.build_type?f+=' <img class="shop tmv" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-mv.png"/> ':4==a.build_type?f+=' <img class="shop tcs" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-cs.png"/> ':5==a.build_type&&(f+=' <img class="shop t4s" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-4s.png"/> '),f+=" </div> "}),f+=" </div> "}),new String(f)});