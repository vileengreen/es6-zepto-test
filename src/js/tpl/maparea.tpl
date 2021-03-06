{{each dataarr as vrr irr}}
<div class="area-wrap-block">
    {{each vrr as v i}}
        <div 
        build_type={{v.build_type}} 
        land_id={{v.land_id}} 
        uid={{v.uid}} 
        class="area-unit {{if v.build_type > 0}} build {{/if}}"
        >
            {{if v.build_type == 1}}
            <img class="shop t71" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-71.png"/>
            {{else if  v.build_type == 2}}
            <img class="shop thg" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-hg.png"/>
            {{else if  v.build_type == 3}}
            <img class="shop tmv" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-mv.png"/>
            {{else if  v.build_type == 4}}
            <img class="shop tcs" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-cs.png"/>
            {{else if  v.build_type == 5}}
            <img class="shop t4s" src="//cbd.tcpan.com/mex/cbd/img/page/cbd/shop-4s.png"/>
            {{/if}}
        </div>
    {{/each}}
    {{if irr%2 == 0}}
    <div class="topdown-wrap carmovedown topadapt2 pt-delay4">
        <img class="car-rd1 car carmoveright pt-delay4 " src="//cbd.tcpan.com/mex/cbd/img/decoration/car-rd1.png" alt="">
    </div>
    <div class="topdown-wrap carmovedown topadapt1 pt-delay8">
        <img class="car-ld1 car carmoveleft pt-delay8" src="//cbd.tcpan.com/mex/cbd/img/decoration/car-ld1.png" alt="">
    </div>
    {{else}}
    <div class="topdown-wrap carmovetop topadapt1 pt-delay6">
        <img class="car-rt{{Math.ceil(irr/2)%3 + 1}} car carmoveright pt-delay6" src="//cbd.tcpan.com/mex/cbd/img/decoration/car-rt{{Math.ceil(irr/2)%3 + 1}}.png" alt="">
    </div>
    <div class="topdown-wrap carmovetop topadapt1">
        <img class="car-lt{{Math.ceil(irr/2)%2 + 1}} car carmoveleft" src="//cbd.tcpan.com/mex/cbd/img/decoration/car-lt{{Math.ceil(irr/2)%2 + 1}}.png" alt="">
    </div>
    {{/if}}
    <div class="street-block-add"></div>
</div>
{{/each}}