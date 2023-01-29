<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<!-- saved from url=(0079)http://github.com/DmitryBaranovskiy/raphael/blob/master/raphael-min.js?raw=true -->
<HTML><HEAD>
<META http-equiv=Content-Type content="text/html; charset=utf-8">
<META content="MSHTML 6.00.2900.5921" name=GENERATOR></HEAD>
<BODY>/* * Raphael 1.3.1 - JavaScript Vector Library * * Copyright (c) 2008 - 
2009 Dmitry Baranovskiy (http://raphaeljs.com) * Licensed under the MIT 
(http://www.opensource.org/licenses/mit-license.php) license. */ 
Raphael=(function(){var a=/[, 
]+/,aO=/^(circle|rect|path|ellipse|text|image)$/,L=document,au=window,l={was:"Raphael" 
in au,is:au.Raphael},an=function(){if(an.is(arguments[0],"array")){var 
d=arguments[0],e=w[aW](an,d.splice(0,3+an.is(d[0],al))),S=e.set();for(var 
R=0,a0=d[m];R<A0;R++){VAR vml] 
ag='document.createElement("div");ag.innerHTML="<!--[if' 
0?,width:0,x:0,y:0},Z='{along:"along","clip-rect":"csv",cx:al,cy:al,fill:"colour","fill-opacity":al,"font-size":al,height:al,opacity:al,path:"path",r:al,rotation:"csv",rx:al,ry:al,scale:"csv",stroke:"colour","stroke-opacity":al,"stroke-width":al,translation:"csv",width:al,x:al,y:al},aP="replace";an.version="1.3.1";an.type=(au.SVGAngle||L.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML");if(an.type=="VML"){var' 
1?,src:??,stroke:?#000?,?stroke-dasharray?:??,?stroke-linecap?:?butt?,?stroke-linejoin?:?butt?,?stroke-miterlimit?:0,?stroke-opacity?:1,?stroke-width?:1,target:?_blank?,?text-anchor?:?middle?,title:?Raphael?,translation:?0 
?,opacity:1,path:?M0,0?,r:0,rotation:0,rx:0,ry:0,scale:?1 raphaeljs.com 
?Arial??,?font-family?:??Arial??,?font-size?:?10?,?font-style?:?normal?,?font-weight?:400,gradient:0,height:0,href:?http: 
1e9?,cursor:?default?,cx:0,cy:0,fill:?#fff?,?fill-opacity?:1,font:?10px 1e9 0 
,aZ="String[aY].toLowerCase,ab=Math,g=ab.max,aI=ab.min,al=&quot;number&quot;,aA=&quot;toString&quot;,aw=Object[aY][aA],aQ={},aM=ab.pow,f=&quot;push&quot;,aU=/^(?=[\da-f]$)/,c=/^url\(['&quot;]?([^\)]+)['&quot;]?\)$/i,x=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgb\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|rgb\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i,O=ab.round,v=&quot;setAttribute&quot;,W=parseFloat,G=parseInt,aN=String[aY].toUpperCase,j={&quot;clip-rect&quot;:&quot;0" 
,aY="prototype" ,m="length" ,az="join" [z](am),Q="hasOwnProperty" 
,F="click dblclick mousedown mousemove mouseout mouseover mouseup" ?,z="split" 
w[aW](an,arguments);},aT='function(){},aL="appendChild",aW="apply",aS="concat",at="",am="' 
S;}return 
E="d[R]||{};aO.test(E.type)&amp;&amp;S[f](e[E.type]().attr(E));}return">");a0.close();S=a0.body;}catch(a2){S=createPopup().document.body;}var 
i=S.createTextRange();try{S.style.color=R;var 
a1=i.queryCommandValue("ForeColor");a1=((a1&amp;255)&lt;&lt;16)|(a1&amp;65280)|((a1&amp;16711680)&gt;&gt;&gt;16);return"#"+("000000"+a1[aA](16)).slice(-6);}catch(a2){return"none";}});}else{var 
E=L.createElement("i");E.title="Rapha\xebl Colour 
Picker";E.style.display="none";L.body[aL](E);aD=aj(function(i){E.style.color=i;return 
L.defaultView.getComputedStyle(E,at).getPropertyValue("color");});}return 
aD(e);};an.hsb2rgb=aj(function(a3,a1,a7){if(an.is(a3,"object")&amp;&amp;"h" in 
a3&amp;&amp;"s" in a3&amp;&amp;"b" in a3){a7=a3.b;a1=a3.s;a3=a3.h;}var 
R,S,a8;if(a7==0){return{r:0,g:0,b:0,hex:"#000"};}if(a3&gt;1||a1&gt;1||a7&gt;1){a3/=255;a1/=255;a7/=255;}var 
a0=~~(a3*6),a4=(a3*6)-a0,E=a7*(1-a1),e=a7*(1-(a1*a4)),a9=a7*(1-(a1*(1-a4)));R=[a7,e,E,E,a9,a7,a7][a0];S=[a9,a7,a7,e,E,E,a9][a0];a8=[E,E,a9,a7,a7,e,E][a0];R*=255;S*=255;a8*=255;var 
a5={r:R,g:S,b:a8},d=(~~R)[aA](16),a2=(~~S)[aA](16),a6=(~~a8)[aA](16);d=d[aP](aU,"0");a2=a2[aP](aU,"0");a6=a6[aP](aU,"0");a5.hex="#"+d+a2+a6;return 
a5;},an);an.rgb2hsb=aj(function(d,e,a1){if(an.is(d,"object")&amp;&amp;"r" in 
d&amp;&amp;"g" in d&amp;&amp;"b" in 
d){a1=d.b;e=d.g;d=d.r;}if(an.is(d,"string")){var 
a3=an.getRGB(d);d=a3.r;e=a3.g;a1=a3.b;}if(d&gt;1||e&gt;1||a1&gt;1){d/=255;e/=255;a1/=255;}var 
a0=g(d,e,a1),i=aI(d,e,a1),R,E,S=a0;if(i==a0){return{h:0,s:0,b:a0};}else{var 
a2=(a0-i);E=a2/a0;if(d==a0){R=(e-a1)/a2;}else{if(e==a0){R=2+((a1-d)/a2);}else{R=4+((d-e)/a2);}}R/=6;R&lt;0&amp;&amp;R++;R&gt;1&amp;&amp;R--;}return{h:R,s:E,b:S};},an);var 
aE=/,?([achlmqrstvxz]),?/gi;an._path2string=function(){return 
this.join(",")[aP](aE,"$1");};function aj(E,e,d){function i(){var 
R=Array[aY].slice.call(arguments,0),a0=R[az]("\u25ba"),S=i.cache=i.cache||{},a1=i.count=i.count||[];if(S[Q](a0)){return 
d?d(S[a0]):S[a0];}a1[m]&gt;=1000&amp;&amp;delete 
S[a1.shift()];a1[f](a0);S[a0]=E[aW](e,R);return d?d(S[a0]):S[a0];}return 
i;}an.getRGB=aj(function(d){if(!d||!!((d=d+at).indexOf("-")+1)){return{r:-1,g:-1,b:-1,hex:"none",error:1};}if(d=="none"){return{r:-1,g:-1,b:-1,hex:"none"};}!(({hs:1,rg:1})[Q](d.substring(0,2))||d.charAt()=="#")&amp;&amp;(d=aD(d));var 
S,i,E,a2,a3,a0=d.match(x);if(a0){if(a0[2]){a2=G(a0[2].substring(5),16);E=G(a0[2].substring(3,5),16);i=G(a0[2].substring(1,3),16);}if(a0[3]){a2=G((a3=a0[3].charAt(3))+a3,16);E=G((a3=a0[3].charAt(2))+a3,16);i=G((a3=a0[3].charAt(1))+a3,16);}if(a0[4]){a0=a0[4][z](/\s*,\s*/);i=W(a0[0]);E=W(a0[1]);a2=W(a0[2]);}if(a0[5]){a0=a0[5][z](/\s*,\s*/);i=W(a0[0])*2.55;E=W(a0[1])*2.55;a2=W(a0[2])*2.55;}if(a0[6]){a0=a0[6][z](/\s*,\s*/);i=W(a0[0]);E=W(a0[1]);a2=W(a0[2]);return 
an.hsb2rgb(i,E,a2);}if(a0[7]){a0=a0[7][z](/\s*,\s*/);i=W(a0[0])*2.55;E=W(a0[1])*2.55;a2=W(a0[2])*2.55;return 
an.hsb2rgb(i,E,a2);}a0={r:i,g:E,b:a2};var 
e=(~~i)[aA](16),R=(~~E)[aA](16),a1=(~~a2)[aA](16);e=e[aP](aU,"0");R=R[aP](aU,"0");a1=a1[aP](aU,"0");a0.hex="#"+e+R+a1;return 
a0;}return{r:-1,g:-1,b:-1,hex:"none",error:1};},an);an.getColor=function(e){var 
i=this.getColor.start=this.getColor.start||{h:0,s:1,b:e||0.75},d=this.hsb2rgb(i.h,i.s,i.b);i.h+=0.075;if(i.h&gt;1){i.h=0;i.s-=0.2;i.s&lt;=0&amp;&amp;(this.getColor.start={h:0,s:1,b:i.b});}return 
d.hex;};an.getColor.reset=function(){delete 
this.start;};an.parsePathString=aj(function(d){if(!d){return null;}var 
i={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},e=[];if(an.is(d,"array")&amp;&amp;an.is(d[0],"array")){e=av(d);}if(!e[m]){(d+at)[aP](/([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,function(R,E,a1){var 
a0=[],S=aZ.call(E);a1[aP](/(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,function(a3,a2){a2&amp;&amp;a0[f](+a2);});while(a0[m]&gt;=i[S]){e[f]([E][aS](a0.splice(0,i[S])));if(!i[S]){break;}}});}e[aA]=an._path2string;return 
e;});an.findDotsAtSegment=function(e,d,be,bc,a0,R,a2,a1,a8){var 
a6=1-a8,a5=aM(a6,3)*e+aM(a6,2)*3*a8*be+a6*3*a8*a8*a0+aM(a8,3)*a2,a3=aM(a6,3)*d+aM(a6,2)*3*a8*bc+a6*3*a8*a8*R+aM(a8,3)*a1,ba=e+2*a8*(be-e)+a8*a8*(a0-2*be+e),a9=d+2*a8*(bc-d)+a8*a8*(R-2*bc+d),bd=be+2*a8*(a0-be)+a8*a8*(a2-2*a0+be),bb=bc+2*a8*(R-bc)+a8*a8*(a1-2*R+bc),a7=(1-a8)*e+a8*be,a4=(1-a8)*d+a8*bc,E=(1-a8)*a0+a8*a2,i=(1-a8)*R+a8*a1,S=(90-ab.atan((ba-bd)/(a9-bb))*180/ab.PI);(ba&gt;bd||a9<BB)&&(S+=180);RETURN{X:A5,Y:A3,M:{X:BA,Y:A9},N:{X:BD,Y:BB},START:{X:A7,Y:A4},END:{X:E,Y:I},ALPHA:S};};VAR 
E='[];if(!an.is(a0,"array")||!an.is(a0&amp;&amp;a0[0],"array")){a0=an.parsePathString(a0);}for(var' 
by="(bo*bo)/(bi*bi)+(bn*bn)/(bg*bg);if(by" 
e="0,R=a0[m];e<R;e++){E[e]=[];for(var" 
bH="bF*ab.cos(i)-bI*ab.sin(i),bG=bF*ab.sin(i)+bI*ab.cos(i);return{x:bH,y:bG};});if(!bb){bj=bA(a9,bE,-d);a9=bj.x;bE=bj.y;bj=bA(a8,bD,-d);a8=bj.x;bD=bj.y;var" 
R="ab.PI,bf=R*120/180,d=R/180*(+ba||0),bm=[],bj,bA=aj(function(bF,bI,i){var" 
S='0,a4=a5[m];S<a4;S++){E=a5[S];if(E[0]=="M"){a2=E[1];a1=E[2];R[f](a2);e[f](a1);}else{var' 
a3;},null,av),aX="function(e,E,d,i){return[e,E,d,i,d,i];},aK=function(e,E,a0,R,d,i){var" 
a0="aC(a2,a1,E[1],E[2],E[3],E[4],E[5],E[6]);R=R[aS](a0.min.x,a0.max.x);e=e[aS](a0.min.y,a0.max.y);a2=E[5];a1=E[6];}}var" 
d="aI[aW](0,R),a3=aI[aW](0,e);return{x:d,y:a3,width:g[aW](0,R)-d,height:g[aW](0,e)-a3};}),av=function(a0){var" 
a1="E,ba=R[m];a1<ba;a1++){var" 
a3='a4[a1][m];switch(a4[a1][0]){case"z":a6=a9;a5=a8;break;case"h":a6+=+a4[a1][a3-1];break;case"v":a5+=+a4[a1][a3-1];break;default:a6+=+a4[a1][a3-2];a5+=+a4[a1][a3-1];}}a4[aA]=an._path2string;return' 
a4;},0,av),r='aj(function(R){if(!an.is(R,"array")||!an.is(R&amp;&amp;R[0],"array")){R=an.parsePathString(R);}var' 
a4='[],a6=0,a5=0,a9=0,a8=0,E=0;if(R[0][0]=="M"){a6=R[0][1];a5=R[0][2];a9=a6;a8=a5;E++;a4[f](["M",a6,a5]);}for(var' 
E;},ad='aj(function(R){if(!an.is(R,"array")||!an.is(R&amp;&amp;R[0],"array")){R=an.parsePathString(R);}var' 
a2="0,a1=0,R=[],e=[],E;for(var" 
U="aj(function(a5){if(!a5){return{x:0,y:0,width:0,height:0};}a5=H(a5);var">1){bi=ab.sqrt(by)*bi;bg=ab.sqrt(by)*bg;}var 
E=bi*bi,br=bg*bg,bt=(a4==S?-1:1)*ab.sqrt(ab.abs((E*br-E*bn*bn-br*bo*bo)/(E*bn*bn+br*bo*bo))),bd=bt*bi*bn/bg+(a9+a8)/2,bc=bt*-bg*bo/bi+(bE+bD)/2,a3=ab.asin(((bE-bc)/bg).toFixed(7)),a2=ab.asin(((bD-bc)/bg).toFixed(7));a3=a9<BD?R-A3:A3;A2=A8<BD?R-A2:A2;A3<0&&(A3=R*2+A3);A2<0&&(A2=R*2+A2);IF(S&&A3>a2){a3=a3-R*2;}if(!S&amp;&amp;a2&gt;a3){a2=a2-R*2;}}else{a3=bb[0];a2=bb[1];bd=bb[2];bc=bb[3];}var 
a7=a2-a3;if(ab.abs(a7)&gt;bf){var 
be=a2,bh=a8,a5=bD;a2=a3+bf*(S&amp;&amp;a2&gt;a3?1:-1);a8=bd+bi*ab.cos(a2);bD=bc+bg*ab.sin(a2);bm=K(a8,bD,bi,bg,ba,0,S,bh,a5,[a2,be,bd,bc]);}a7=a2-a3;var 
a1=ab.cos(a3),bC=ab.sin(a3),a0=ab.cos(a2),bB=ab.sin(a2),bp=ab.tan(a7/4),bs=4/3*bi*bp,bq=4/3*bg*bp,bz=[a9,bE],bx=[a9+bs*bC,bE-bq*a1],bw=[a8+bs*bB,bD-bq*a0],bu=[a8,bD];bx[0]=2*bz[0]-bx[0];bx[1]=2*bz[1]-bx[1];if(bb){return[bx,bw,bu][aS](bm);}else{bm=[bx,bw,bu][aS](bm)[az]()[z](",");var 
bk=[];for(var 
bv=0,bl=bm[m];bv<BL;BV++){BK[BV]=BV%2?BA(BM[BV-1],BM[BV],D).Y:BA(BM[BV],BM[BV+1],D).X;}RETURN 
R="1-a3;return{x:aM(R,3)*e+aM(R,2)*3*a3*E+R*3*a3*a3*a2+aM(a3,3)*a0,y:aM(R,3)*d+aM(R,2)*3*a3*i+R*3*a3*a3*a1+aM(a3,3)*S};},aC=aj(function(i,d,R,E,a9,a8,a5,a2){var" 
a7="(a9-2*R+i)-(a5-2*a9+R),a4=2*(R-i)-2*(a9-R),a1=i-R,a0=(-a4+ab.sqrt(a4*a4-4*a7*a1))/2/a7,S=(-a4-ab.sqrt(a4*a4-4*a7*a1))/2/a7,a3=[d,a2],a6=[i,a5],e;ab.abs(a0)" 
bk;}},M="function(e,d,E,i,a2,a1,a0,S,a3){var">1000000000000&amp;&amp;(a0=0.5);ab.abs(S)&gt;1000000000000&amp;&amp;(S=0.5);if(a0&gt;0&amp;&amp;a0&lt;1){e=M(i,d,R,E,a9,a8,a5,a2,a0);a6[f](e.x);a3[f](e.y);}if(S&gt;0&amp;&amp;S&lt;1){e=M(i,d,R,E,a9,a8,a5,a2,S);a6[f](e.x);a3[f](e.y);}a7=(a8-2*E+d)-(a2-2*a8+E);a4=2*(E-d)-2*(a8-E);a1=d-E;a0=(-a4+ab.sqrt(a4*a4-4*a7*a1))/2/a7;S=(-a4-ab.sqrt(a4*a4-4*a7*a1))/2/a7;ab.abs(a0)&gt;1000000000000&amp;&amp;(a0=0.5);ab.abs(S)&gt;1000000000000&amp;&amp;(S=0.5);if(a0&gt;0&amp;&amp;a0&lt;1){e=M(i,d,R,E,a9,a8,a5,a2,a0);a6[f](e.x);a3[f](e.y);}if(S&gt;0&amp;&amp;S&lt;1){e=M(i,d,R,E,a9,a8,a5,a2,S);a6[f](e.x);a3[f](e.y);}return{min:{x:aI[aW](0,a6),y:aI[aW](0,a3)},max:{x:g[aW](0,a6),y:g[aW](0,a3)}};}),H=aj(function(a9,a4){var 
R=r(a9),a5=a4&amp;&amp;r(a4),a6={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},d={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},a0=function(ba,bb){var 
i,bc;if(!ba){return["C",bb.x,bb.y,bb.x,bb.y,bb.x,bb.y];}!(ba[0] in 
{T:1,Q:1})&amp;&amp;(bb.qx=bb.qy=null);switch(ba[0]){case"M":bb.X=ba[1];bb.Y=ba[2];break;case"A":ba=["C"][aS](K[aW](0,[bb.x,bb.y][aS](ba.slice(1))));break;case"S":i=bb.x+(bb.x-(bb.bx||bb.x));bc=bb.y+(bb.y-(bb.by||bb.y));ba=["C",i,bc][aS](ba.slice(1));break;case"T":bb.qx=bb.x+(bb.x-(bb.qx||bb.x));bb.qy=bb.y+(bb.y-(bb.qy||bb.y));ba=["C"][aS](aK(bb.x,bb.y,bb.qx,bb.qy,ba[1],ba[2]));break;case"Q":bb.qx=ba[1];bb.qy=ba[2];ba=["C"][aS](aK(bb.x,bb.y,ba[1],ba[2],ba[3],ba[4]));break;case"L":ba=["C"][aS](aX(bb.x,bb.y,ba[1],ba[2]));break;case"H":ba=["C"][aS](aX(bb.x,bb.y,ba[1],bb.y));break;case"V":ba=["C"][aS](aX(bb.x,bb.y,bb.x,ba[1]));break;case"Z":ba=["C"][aS](aX(bb.x,bb.y,bb.X,bb.Y));break;}return 
ba;},e=function(ba,bb){if(ba[bb][m]&gt;7){ba[bb].shift();var 
bc=ba[bb];while(bc[m]){ba.splice(bb++,0,["C"][aS](bc.splice(0,6)));}ba.splice(bb,1);a7=g(R[m],a5&amp;&amp;a5[m]||0);}},E=function(be,bd,bb,ba,bc){if(be&amp;&amp;bd&amp;&amp;be[bc][0]=="M"&amp;&amp;bd[bc][0]!="M"){bd.splice(bc,0,["M",ba.x,ba.y]);bb.bx=0;bb.by=0;bb.x=be[bc][1];bb.y=be[bc][2];a7=g(R[m],a5&amp;&amp;a5[m]||0);}};for(var 
a2=0,a7=g(R[m],a5&amp;&amp;a5[m]||0);a2<A7;A2++){R[A2]=A0(R[A2],A6);E(R,A2);A5&&(A5[A2]=A0(A5[A2],D));A5&&E(A5,A2);E(R,A5,A6,D,A2);E(A5,R,D,A6,A2);VAR 
E="W(a3[a0-1].offset||0),R=0;for(var" 
e="{},a2=a4[a0].match(/^([^:]*):?([\d\.]*)/);e.color=an.getRGB(a2[1]);if(e.color.error){return" 
S="a0+1;S<a5;S++){if(a3[S].offset){R=a3[S].offset;break;}}if(!R){R=100;S=a5;}R=W(R);var" 
a0="0,a5=a4[m];a0<a5;a0++){var" 
a1="R[a2],a8=a5&amp;&amp;a5[a2],S=a1[m],a3=a5&amp;&amp;a8[m];a6.x=a1[S-2];a6.y=a1[S-1];a6.bx=W(a1[S-4])||a6.x;a6.by=W(a1[S-3])||a6.y;d.bx=a5&amp;&amp;(W(a8[a3-4])||d.x);d.by=a5&amp;&amp;(W(a8[a3-3])||d.y);d.x=a5&amp;&amp;a8[a3-2];d.y=a5&amp;&amp;a8[a3-1];}return" 
a3="[];for(var" 
i,e,R,E,d;if(an.is(arguments[0],?string?)||an.is(arguments[0],?object?)){if(an.is(arguments[0],?string?)){i="L.getElementById(arguments[0]);}else{i=arguments[0];}if(i.tagName){if(arguments[1]==null){return{container:i,width:i.style.pixelWidth||i.offsetWidth,height:i.style.pixelHeight||i.offsetHeight};}else{return{container:i,width:arguments[1],height:arguments[2]};}}}else{if(an.is(arguments[0],al)&amp;&amp;arguments[m]" 
a3;}),ao="function(){var" 
null;}e.color='e.color.hex;a2[2]&amp;&amp;(e.offset=a2[2]+"%");a3[f](e);}for(var' 
a5?[R,a5]:R;},null,av),p="aj(function(a4){var">3){return{container:1,x:arguments[0],y:arguments[1],width:arguments[2],height:arguments[3]};}}},aG=function(d,i){var 
e=this;for(var E in i){if(i[Q](E)&amp;&amp;!(E in d)){switch(typeof 
i[E]){case"function":(function(R){d[E]=d===e?R:function(){return 
R[aW](e,arguments);};})(i[E]);break;case"object":d[E]=d[E]||{};aG.call(this,d[E],i[E]);break;default:d[E]=i[E];break;}}}},ak=function(d,e){d==e.top&amp;&amp;(e.top=d.prev);d==e.bottom&amp;&amp;(e.bottom=d.next);d.next&amp;&amp;(d.next.prev=d.prev);d.prev&amp;&amp;(d.prev.next=d.next);},Y=function(d,e){if(e.top===d){return;}ak(d,e);d.next=null;d.prev=e.top;e.top.next=d;e.top=d;},k=function(d,e){if(e.bottom===d){return;}ak(d,e);d.next=e.bottom;d.prev=null;e.bottom.prev=d;e.bottom=d;},A=function(e,d,i){ak(e,i);d==i.top&amp;&amp;(i.top=e);d.next&amp;&amp;(d.next.prev=e);e.next=d.next;e.prev=d;d.next=e;},aq=function(e,d,i){ak(e,i);d==i.bottom&amp;&amp;(i.bottom=e);d.prev&amp;&amp;(d.prev.next=e);e.prev=d.prev;d.prev=e;e.next=d;},s=function(d){return 
function(){throw new Error("Rapha\xebl: you are calling to method 
\u201c"+d+"\u201d of removed 
object");};},ar=/^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;if(an.svg){aT[aY].svgns="http://www.w3.org/2000/svg";aT[aY].xlink="http://www.w3.org/1999/xlink";var 
O=function(d){return +d+(~~d===d)*0.5;},V=function(S){for(var 
e=0,E=S[m];e<E;E++){IF(AZ.CALL(S[E][0])!="A"){FOR(VAR e 
d="1,R=S[e][m];d<R;d++){S[e][d]=O(S[e][d]);}}else{S[e][6]=O(S[e][6]);S[e][7]=O(S[e][7]);}}return" 
a4="linear" ba="((S" 
,a1='0.5,S=0.5,a9=E.style;a7=(a7+at)[aP](ar,function(bb,i,bc){a4="radial";if(i&amp;&amp;bc){a1=W(i);S=W(bc);var' 
b="function(E,a7,d){var" i;};var 
;aa(i,{fill:?none?,stroke:?#000?,path:d});return ax(e,E);i.type="path" i="new" 
q="function(d,E){var" ?+this.version;};var Rapha\xebl running are SVG.\nYou 
supports browser 
L.createElementNS(aT[aY].svgns,i);}};an[aA]='function(){return"Your' 
d){if(d[Q](e)){i[v](e,d[e]);}}}else{return in 
S;},aJ="function(i,d){if(d){for(var">0.5)*2-1);aM(a1-0.5,2)+aM(S-0.5,2)&gt;0.25&amp;&amp;(S=ab.sqrt(0.25-aM(a1-0.5,2))*ba+0.5)&amp;&amp;S!=0.5&amp;&amp;(S=S.toFixed(5)-0.00001*ba);}return 
at;});a7=a7[z](/\s*\-\s*/);if(a4=="linear"){var 
a0=a7.shift();a0=-W(a0);if(isNaN(a0)){return null;}var 
R=[0,0,ab.cos(a0*ab.PI/180),ab.sin(a0*ab.PI/180)],a6=1/(g(ab.abs(R[2]),ab.abs(R[3]))||1);R[2]*=a6;R[3]*=a6;if(R[2]&lt;0){R[0]=-R[2];R[2]=0;}if(R[3]&lt;0){R[1]=-R[3];R[3]=0;}}var 
a3=p(a7);if(!a3){return null;}var 
e=aJ(a4+"Gradient");e.id="r"+(an._id++)[aA](36);aJ(e,a4=="radial"?{fx:a1,fy:S}:{x1:R[0],y1:R[1],x2:R[2],y2:R[3]});d.defs[aL](e);for(var 
a2=0,a8=a3[m];a2<A8;A2++){VAR 
E='aJ("a");bd.insertBefore(E,bb);E[aL](bb);bd=E;}bd.setAttributeNS(a6.paper.xlink,ba,a8);break;case"cursor":bb.style.cursor=a8;break;case"clip-rect":var' 
e="(a8+at)[z](a);if(e[m]==4){a6.clip&amp;&amp;a6.clip.parentNode.parentNode.removeChild(a6.clip.parentNode);var" 
R="(a8+at).match(c);if(R){var" S="0,a4=E[m];S<a4;S++){if(E[S]){var" 
a0='(a8+at)[z](a);a0[0]=+a0[0]||0;a0[1]=+a0[1]||0;if(a2){a2[1]+=a0[0];a2[2]+=a0[1];}t.call(a6,a0[0],a0[1]);break;case"scale":var' 
d='e.getBBox();aJ(e.pattern,{patternTransform:an.format("translate({0},{1})",d.x,d.y)});};var' 
a1='d.getElementsByTagName("stop");a1[a1[m]-1][v]("stop-opacity",a8);}break;}default:ba=="font-size"&amp;&amp;(a8=G(a8,10)+"px");var' 
a3='d.attrs,e=d.node,a5=e.firstChild?G(L.defaultView.getComputedStyle(e.firstChild,at).getPropertyValue("font-size"),10):10;if(R[Q]("text")){a3.text=R.text;while(e.firstChild){e.removeChild(e.firstChild);}var' 
a4="ba[aP](/(\-.)/g,function(bh){return" 
a2="(a3+at)[z](a);if(!(a2.length-1)){a2=null;}else{a2[1]=+a2[1];a2[2]=+a2[2];}W(a3)&amp;&amp;a6.rotate(0,true);for(var" 
ba 
i='aJ("clipPath"),bc=aJ("rect");i.id="r"+(an._id++)[aA](36);aJ(bc,{x:e[0],y:e[1],width:e[2],height:e[3]});i[aL](bc);a6.paper.defs[aL](i);aJ(bb,{"clip-path":"url(#"+i.id+")"});a6.clip=bc;}if(!a8){var' 
in U(this.attrs.path);}if(this.node.style.display='="none"){this.show();var' 
this;}if(this.type='="path"){return' 
this[d];}this.removed="true;};ax[aY].getBBox=function(){if(this.removed){return" 
this){delete 
this;};ax[aY].remove="function(){if(this.removed){return;}ak(this,this.paper);this.node.parentNode.removeChild(this.node);for(var" 
this;};ax[aY].show='function(){!this.removed&amp;&amp;(this.node.style.display="");return' 
this;};ax[aY].hide='function(){!this.removed&amp;&amp;(this.node.style.display="none");return' 
{2})?,-this._.rt.deg,d,E)});}else{this.transformations[0]="at;this.clip&amp;&amp;aJ(this.clip,{transform:at});}aJ(this.node,{transform:this.transformations[az](am)});return" 
{1} 
{2})?,this._.rt.deg,d,E);this.clip&&aJ(this.clip,{transform:an.format(?rotate({0} 
this._.rt.deg;}var 
this;}if(e="=null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy][az](am);}return" 
ax="function(e,d){var" 
D='function(d,R){if(d.type!="text"||!(R[Q]("text")||R[Q]("font")||R[Q]("font-size")||R[Q]("x")||R[Q]("y"))){return;}var' 
h="1.2;var" 
aN.call(bh.substring(1));});bb.style[a4]="a8;bb[v](ba,a8);break;}}}D(a6,bf);if(a2){a6.rotate(a2.join(am));}else{W(a3)&amp;&amp;a6.rotate(a3,true);}};var" 
)&&b(bb,a8,a6.paper)){a7.gradient='a8;a7.fill="none";break;}}case"stroke":bb[v](ba,an.getRGB(a8).hex);break;case"gradient":(({circle:1,ellipse:1})[Q](a6.type)||(a8+at).charAt()!="r")&amp;&amp;b(bb,a8,a6.paper);break;case"opacity":case"fill-opacity":if(a7.gradient){var' 
a7.gradient;!an.is(a7.opacity,?undefined?)&&an.is(bf.opacity,?undefined?)&&aJ(bb,{opacity:a7.opacity});!an.is(a7[?fill-opacity?],?undefined?)&&an.is(bf[?fill-opacity?],?undefined?)&&aJ(bb,{?fill-opacity?:a7[?fill-opacity?]});}else{if((({circle:1,ellipse:1})[Q](a6.type)||(a8+at).charAt()!="r" 
bf.gradient;delete 
bg='L.createElement("img");bg.style.cssText="position:absolute;left:-9999em;top-9999em";bg.onload=function(){aJ(i,{width:this.offsetWidth,height:this.offsetHeight});aJ(a5,{width:this.offsetWidth,height:this.offsetHeight});L.body.removeChild(this);a6.paper.safari();};L.body[aL](bg);bg.src=R[1];a6.paper.defs[aL](i);bb.style.fill="url(#"+i.id+")";aJ(bb,{fill:"url(#"+i.id+")"});a6.pattern=i;a6.pattern&amp;&amp;N(a6);break;}if(!an.getRGB(a8).error){delete' 
a6.clip;}break;case?path?:if(a8&&a6.type='="path"){a7.path=V(r(a8));aJ(bb,{d:a7.path});}break;case"width":bb[v](ba,a8);if(a7.fx){ba="x";a8=a7.x;}else{break;}case"x":if(a7.fx){a8=-a7.x-(a7.width||0);}case"rx":if(ba=="rx"&amp;&amp;a6.type=="rect"){break;}case"cx":a2&amp;&amp;(ba=="x"||ba=="cx")&amp;&amp;(a2[1]+=a8-a7[ba]);bb[v](ba,O(a8));a6.pattern&amp;&amp;N(a6);break;case"height":bb[v](ba,a8);if(a7.fy){ba="y";a8=a7.y;}else{break;}case"y":if(a7.fy){a8=-a7.y-(a7.height||0);}case"ry":if(ba=="ry"&amp;&amp;a6.type=="rect"){break;}case"cy":a2&amp;&amp;(ba=="y"||ba=="cy")&amp;&amp;(a2[2]+=a8-a7[ba]);bb[v](ba,O(a8));a6.pattern&amp;&amp;N(a6);break;case"r":if(a6.type=="rect"){aJ(bb,{rx:a8,ry:a8});}else{bb[v](ba,a8);}break;case"src":if(a6.type=="image"){bb.setAttributeNS(a6.paper.xlink,"href",a8);}break;case"stroke-width":bb.style.strokeWidth=a8;bb[v](ba,a8);if(a7["stroke-dasharray"]){S(a6,a7["stroke-dasharray"]);}break;case"stroke-dasharray":S(a6,a8);break;case"translation":var' 
be='L.getElementById(bb.getAttribute("clip-path")[aP](/(^url\(#|\)$)/g,at));be&amp;&amp;be.parentNode.removeChild(be);aJ(bb,{"clip-path":at});delete' 
bd='bb.parentNode;if(aZ.call(bd.tagName)!="a"){var' 
a8='bf[ba];a7[ba]=a8;switch(ba){case"rotation":a6.rotate(a8,true);break;case"href":case"title":case"target":var' 
bf){if(bf[Q](ba)){if(!j[Q](ba)){continue;}var 
bi='bl[m];while(bi--){bk[bi]=bl[bi]*bj+((bi%2)?1:-1)*bh;}aJ(bb,{"stroke-dasharray":bk[az](",")});}};bf[Q]("rotation")&amp;&amp;(a3=bf.rotation);var' 
bj='bm.attrs["stroke-width"]||"1",bh={round:bj,square:bj,butt:0}[bm.attrs["stroke-linecap"]||bf["stroke-linecap"]]||0,bk=[];var' 
.?:[4,3,1,3],?--.?:[8,3,1,3],?--..?:[8,3,1,3,1,3]},bb="a6.node,a7=a6.attrs,a3=a6.rotate(),S=function(bm,bl){bl=a9[aZ.call(bl)];if(bl){var" 
?:[4,3],?--?:[8,3],?- ?:[1,3],?- 
a9='{"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],".' 
aa="function(a6,bf){var" N="function(e){var" 1;};var 
a5='aJ("stop");aJ(a5,{offset:a3[a2].offset?a3[a2].offset:!a2?"0%":"100%","stop-color":a3[a2].color||"#fff"});e[aL](a5);}aJ(E,{fill:"url(#"+e.id+")",opacity:1,"fill-opacity":1});a9.fill=at;a9.opacity=1;a9.fillOpacity=1;return'>a1.height)&amp;&amp;(a1.height=a0.y+a0.height-a1.y);(a0.x+a0.width-a1.x&gt;a1.width)&amp;&amp;(a1.width=a0.x+a0.width-a1.x);}}E&amp;&amp;this.hide();return 
a1;};ax[aY].attr=function(){if(this.removed){return 
this;}if(arguments[m]==0){var R={};for(var E in 
this.attrs){if(this.attrs[Q](E)){R[E]=this.attrs[E];}}this._.rt.deg&amp;&amp;(R.rotation=this.rotate());(this._.sx!=1||this._.sy!=1)&amp;&amp;(R.scale=this.scale());R.gradient&amp;&amp;R.fill=="none"&amp;&amp;(R.fill=R.gradient)&amp;&amp;delete 
R.gradient;return 
R;}if(arguments[m]==1&amp;&amp;an.is(arguments[0],"string")){if(arguments[0]=="translation"){return 
t.call(this);}if(arguments[0]=="rotation"){return 
this.rotate();}if(arguments[0]=="scale"){return 
this.scale();}if(arguments[0]=="fill"&amp;&amp;this.attrs.fill=="none"&amp;&amp;this.attrs.gradient){return 
this.attrs.gradient;}return 
this.attrs[arguments[0]];}if(arguments[m]==1&amp;&amp;an.is(arguments[0],"array")){var 
d={};for(var e in 
arguments[0]){if(arguments[0][Q](e)){d[arguments[0][e]]=this.attrs[arguments[0][e]];}}return 
d;}if(arguments[m]==2){var 
S={};S[arguments[0]]=arguments[1];aa(this,S);}else{if(arguments[m]==1&amp;&amp;an.is(arguments[0],"object")){aa(this,arguments[0]);}}return 
this;};ax[aY].toFront=function(){if(this.removed){return 
this;}this.node.parentNode[aL](this.node);var 
d=this.paper;d.top!=this&amp;&amp;Y(this,d);return 
this;};ax[aY].toBack=function(){if(this.removed){return 
this;}if(this.node.parentNode.firstChild!=this.node){this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild);k(this,this.paper);var 
d=this.paper;}return 
this;};ax[aY].insertAfter=function(d){if(this.removed){return this;}var 
e=d.node;if(e.nextSibling){e.parentNode.insertBefore(this.node,e.nextSibling);}else{e.parentNode[aL](this.node);}A(this,d,this.paper);return 
this;};ax[aY].insertBefore=function(d){if(this.removed){return this;}var 
e=d.node;e.parentNode.insertBefore(this.node,e);aq(this,d,this.paper);return 
this;};var P=function(e,d,S,R){d=O(d);S=O(S);var 
E=aJ("circle");e.canvas&amp;&amp;e.canvas[aL](E);var i=new 
ax(E,e);i.attrs={cx:d,cy:S,r:R,fill:"none",stroke:"#000"};i.type="circle";aJ(E,i.attrs);return 
i;};var aF=function(i,d,a1,e,S,a0){d=O(d);a1=O(a1);var 
R=aJ("rect");i.canvas&amp;&amp;i.canvas[aL](R);var E=new 
ax(R,i);E.attrs={x:d,y:a1,width:e,height:S,r:a0||0,rx:a0||0,ry:a0||0,fill:"none",stroke:"#000"};E.type="rect";aJ(R,E.attrs);return 
E;};var ai=function(e,d,a0,S,R){d=O(d);a0=O(a0);var 
E=aJ("ellipse");e.canvas&amp;&amp;e.canvas[aL](E);var i=new 
ax(E,e);i.attrs={cx:d,cy:a0,rx:S,ry:R,fill:"none",stroke:"#000"};i.type="ellipse";aJ(E,i.attrs);return 
i;};var o=function(i,a0,d,a1,e,S){var 
R=aJ("image");aJ(R,{x:d,y:a1,width:e,height:S,preserveAspectRatio:"none"});R.setAttributeNS(i.xlink,"href",a0);i.canvas&amp;&amp;i.canvas[aL](R);var 
E=new ax(R,i);E.attrs={x:d,y:a1,width:e,height:S,src:a0};E.type="image";return 
E;};var X=function(e,d,S,R){var 
E=aJ("text");aJ(E,{x:d,y:S,"text-anchor":"middle"});e.canvas&amp;&amp;e.canvas[aL](E);var 
i=new 
ax(E,e);i.attrs={x:d,y:S,"text-anchor":"middle",text:R,font:j.font,stroke:"none",fill:"#000"};i.type="text";aa(i,i.attrs);return 
i;};var 
aV=function(e,d){this.width=e||this.width;this.height=d||this.height;this.canvas[v]("width",this.width);this.canvas[v]("height",this.height);return 
this;};var w=function(){var 
E=ao[aW](null,arguments),i=E&amp;&amp;E.container,e=E.x,a0=E.y,R=E.width,d=E.height;if(!i){throw 
new Error("SVG container not found.");}var 
S=aJ("svg");R=R||512;d=d||342;aJ(S,{xmlns:"http://www.w3.org/2000/svg",version:1.1,width:R,height:d});if(i==1){S.style.cssText="position:absolute;left:"+e+"px;top:"+a0+"px";L.body[aL](S);}else{if(i.firstChild){i.insertBefore(S,i.firstChild);}else{i[aL](S);}}i=new 
aT;i.width=R;i.height=d;i.canvas=S;aG.call(i,i,an.fn);i.clear();return 
i;};aT[aY].clear=function(){var 
d=this.canvas;while(d.firstChild){d.removeChild(d.firstChild);}this.bottom=this.top=null;(this.desc=aJ("desc"))[aL](L.createTextNode("Created 
with 
Rapha\xebl"));d[aL](this.desc);d[aL](this.defs=aJ("defs"));};aT[aY].remove=function(){this.canvas.parentNode&amp;&amp;this.canvas.parentNode.removeChild(this.canvas);for(var 
d in this){this[d]=s(d);}};}if(an.vml){var aH=function(a8){var 
a5=/[ahqstv]/ig,a0=r;(a8+at).match(a5)&amp;&amp;(a0=H);a5=/[clmz]/g;if(a0==r&amp;&amp;!(a8+at).match(a5)){var 
e={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},R=/([clmz]),?([^clmz]*)/gi,S=/-?[^,\s-]+/g;var 
a4=(a8+at)[aP](R,function(a9,bb,i){var 
ba=[];i[aP](S,function(bc){ba[f](O(bc));});return e[bb]+ba;});return a4;}var 
a6=a0(a8),E,a4=[],d;for(var 
a2=0,a7=a6[m];a2<A7;A2++){E=A6[A2];D=AZ.CALL(A6[A2][0]);D=="Z"&&(D="X");FOR(VAR 
E='ah("group");E.style.cssText="position:absolute;left:0;top:0;width:"+S.width+"px;height:"+S.height+"px";E.coordsize=S.coordsize;E.coordorigin=S.coordorigin;var' 
e='((+a9["fill-opacity"]+1||2)-1)*((+a9.opacity+1||2)-1);e<0&amp;&amp;(e=0);e' 
R="new" 
d='(a8["clip-rect"]+at)[z](a);if(d[m]==4){d[2]=+d[2]+(+d[0]);d[3]=+d[3]+(+d[1]);var' 
a1='1,a3=E[m];a1<a3;a1++){d+=O(E[a1])+(a1!=a3-1?",":at);}a4[f](d);}return' 
a2='a6.clipRect||L.createElement("div"),bc=a2.style,S=a6.parentNode;bc.clip=an.format("rect({1}px' 
a7='(a6.getElementsByTagName("fill")&amp;&amp;a6.getElementsByTagName("fill")[0]),ba=false;!a7&amp;&amp;(ba=a7=ah("fill"));if("fill-opacity"' 
i='ah("shape"),e=i.style;e.width=S.width+"px";e.height=S.height+"px";i.coordsize=this.coordsize;i.coordorigin=this.coordorigin;E[aL](i);var' 
q="function(d,S){var" ?+this.version;};var Rapha\xebl running are browser in 
aa="function(a3,a8){a3.attrs=a3.attrs||{};var" a8){var a8||?opacity? 
)?;a0.filter="(a6.filterMatrix||at)+(a6.filterOpacity||at);}a8.font&amp;&amp;(a0.font=a8.font);a8[&quot;font-family&quot;]&amp;&amp;(a0.fontFamily='&quot;'+a8[&quot;font-family&quot;][z](&quot;,&quot;)[0][aP](/^['&quot;]+|['&quot;]+$/g,at)+'&quot;');a8[&quot;font-size&quot;]&amp;&amp;(a0.fontSize=a8[&quot;font-size&quot;]);a8[&quot;font-weight&quot;]&amp;&amp;(a0.fontWeight=a8[&quot;font-weight&quot;]);a8[&quot;font-style&quot;]&amp;&amp;(a0.fontStyle=a8[&quot;font-style&quot;]);if(a8.opacity!=null||a8[&quot;stroke-width&quot;]!=null||a8.fill!=null||a8.stroke!=null||a8[&quot;stroke-width&quot;]!=null||a8[&quot;stroke-opacity&quot;]!=null||a8[&quot;fill-opacity&quot;]!=null||a8[&quot;stroke-dasharray&quot;]!=null||a8[&quot;stroke-miterlimit&quot;]!=null||a8[&quot;stroke-linejoin&quot;]!=null||a8[&quot;stroke-linecap&quot;]!=null){a6=a3.shape||a6;var" 
progid:DXImageTransform.Microsoft.Alpha(opacity="+(a8.opacity*100)+" 
;bc.top='0;bc.left=0;bc.width=a3.paper.width+"px";bc.height=a3.paper.height+"px";S.parentNode.insertBefore(a2,S);a2[aL](S);a6.clipRect=a2;}}if(!a8["clip-rect"]){a6.clipRect&amp;&amp;(a6.clipRect.style.clip=at);}}if(a3.type=="image"&amp;&amp;a8.src){a6.src=a8.src;}if(a3.type=="image"&amp;&amp;a8.opacity){a6.filterOpacity="' 
{0}px)?,d);if(!a6.clipRect){bc.position="absolute" {3}px {2}px 
a8){if(a8[Q](a1)){a9[a1]='a8[a1];}}a8.href&amp;&amp;(a6.href=a8.href);a8.title&amp;&amp;(a6.title=a8.title);a8.target&amp;&amp;(a6.target=a8.target);a8.cursor&amp;&amp;(a0.cursor=a8.cursor);if(a8.path&amp;&amp;a3.type=="path"){a9.path=a8.path;a6.path=aH(a9.path);}if(a8.rotation!=null){a3.rotate(a8.rotation,true);}if(a8.translation){E=(a8.translation+at)[z](a);t.call(a3,E[0],E[1]);if(a3._.rt.cx!=null){a3._.rt.cx+=+E[0];a3._.rt.cy+=+E[1];a3.setBox(a3.attrs,E[0],E[1]);}}if(a8.scale){E=(a8.scale+at)[z](a);a3.scale(+E[0]||1,+E[1]||+E[0]||1,+E[2]||null,+E[3]||null);}if("clip-rect"' 
a6="a3.node,a9=a3.attrs,a0=a6.style,E,bd=a3;for(var" R;};var 
ax(i,E,S);R.isAbsolute='true;R.type="path";R.path=[];R.Path=at;d&amp;&amp;aa(R,{fill:"none",stroke:"#000",path:d});S.canvas[aL](E);return' 
VML.\nYou to down Falling SVG. support doesn\u2019t 
a4[az](am);};an[aA]='function(){return"Your'>1&amp;&amp;(e=1);a7.opacity=e;}a8.fill&amp;&amp;(a7.on=true);if(a7.on==null||a8.fill=="none"){a7.on=false;}if(a7.on&amp;&amp;a8.fill){var 
i=a8.fill.match(c);if(i){a7.src=i[1];a7.type="tile";}else{a7.color=an.getRGB(a8.fill).hex;a7.src=at;a7.type="solid";if(an.getRGB(a8.fill).error&amp;&amp;(bd.type 
in 
{circle:1,ellipse:1}||(a8.fill+at).charAt()!="r")&amp;&amp;b(bd,a8.fill)){a9.fill="none";a9.gradient=a8.fill;}}}ba&amp;&amp;a6[aL](a7);var 
R=(a6.getElementsByTagName("stroke")&amp;&amp;a6.getElementsByTagName("stroke")[0]),bb=false;!R&amp;&amp;(bb=R=ah("stroke"));if((a8.stroke&amp;&amp;a8.stroke!="none")||a8["stroke-width"]||a8["stroke-opacity"]!=null||a8["stroke-dasharray"]||a8["stroke-miterlimit"]||a8["stroke-linejoin"]||a8["stroke-linecap"]){R.on=true;}(a8.stroke=="none"||R.on==null||a8.stroke==0||a8["stroke-width"]==0)&amp;&amp;(R.on=false);R.on&amp;&amp;a8.stroke&amp;&amp;(R.color=an.getRGB(a8.stroke).hex);var 
e=((+a9["stroke-opacity"]+1||2)-1)*((+a9.opacity+1||2)-1),a4=(W(a8["stroke-width"])||1)*0.75;e&lt;0&amp;&amp;(e=0);e&gt;1&amp;&amp;(e=1);a8["stroke-width"]==null&amp;&amp;(a4=a9["stroke-width"]);a8["stroke-width"]&amp;&amp;(R.weight=a4);a4&amp;&amp;a4&lt;1&amp;&amp;(e*=a4)&amp;&amp;(R.weight=1);R.opacity=e;a8["stroke-linejoin"]&amp;&amp;(R.joinstyle=a8["stroke-linejoin"]||"miter");R.miterlimit=a8["stroke-miterlimit"]||8;a8["stroke-linecap"]&amp;&amp;(R.endcap=a8["stroke-linecap"]=="butt"?"flat":a8["stroke-linecap"]=="square"?"square":"round");if(a8["stroke-dasharray"]){var 
a5={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". 
":"dot","- ":"dash","--":"longdash","- 
.":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};R.dashstyle=a5[Q](a8["stroke-dasharray"])?a5[a8["stroke-dasharray"]]:at;}bb&amp;&amp;a6[aL](R);}if(bd.type=="text"){var 
a0=bd.paper.span.style;a9.font&amp;&amp;(a0.font=a9.font);a9["font-family"]&amp;&amp;(a0.fontFamily=a9["font-family"]);a9["font-size"]&amp;&amp;(a0.fontSize=a9["font-size"]);a9["font-weight"]&amp;&amp;(a0.fontWeight=a9["font-weight"]);a9["font-style"]&amp;&amp;(a0.fontStyle=a9["font-style"]);bd.node.string&amp;&amp;(bd.paper.span.innerHTML=(bd.node.string+at)[aP](/</G,"&#60;")[AP]( 
g,?<br \n g,?&#38;?)[aP]( 
&>"));bd.W=a9.w=bd.paper.span.offsetWidth;bd.H=a9.h=bd.paper.span.offsetHeight;bd.X=a9.x;bd.Y=a9.y+O(bd.H/2);switch(a9["text-anchor"]){case"start":bd.node.style["v-text-align"]="left";bd.bbx=O(bd.W/2);break;case"end":bd.node.style["v-text-align"]="right";bd.bbx=-O(bd.W/2);break;default:bd.node.style["v-text-align"]="center";break;}}};var 
b=function(d,a1){d.attrs=d.attrs||{};var 
a2=d.attrs,a4=d.node.getElementsByTagName("fill"),S="linear",a0=".5 
.5";d.attrs.gradient=a1;a1=(a1+at)[aP](ar,function(a6,a7,i){S="radial";if(a7&amp;&amp;i){a7=W(a7);i=W(i);aM(a7-0.5,2)+aM(i-0.5,2)&gt;0.25&amp;&amp;(i=ab.sqrt(0.25-aM(a7-0.5,2))*((i&gt;0.5)*2-1)+0.5);a0=a7+am+i;}return 
at;});a1=a1[z](/\s*\-\s*/);if(S=="linear"){var 
e=a1.shift();e=-W(e);if(isNaN(e)){return null;}}var R=p(a1);if(!R){return 
null;}d=d.shape||d.node;a4=a4[0]||ah("fill");if(R[m]){a4.on=true;a4.method="none";a4.type=(S=="radial")?"gradientradial":"gradient";a4.color=R[0].color;a4.color2=R[R[m]-1].color;var 
a5=[];for(var 
E=0,a3=R[m];E<A3;E++){R[E].OFFSET&&A5[F](R[E].OFFSET+AM+R[E].COLOR);}A4.COLORS&&(A4.COLORS.VALUE=A5[M]?A5[AZ](","):"0% 
class=rvml 
E='e-this.paper.width/2,a4=d-this.paper.height/2;if(this.type=="path"||this.type=="text"){(a5.left!=E+"px")&amp;&amp;(a5.left=E+"px");(a5.top!=a4+"px")&amp;&amp;(a5.top=a4+"px");this.X=this.type=="text"?a1:-E;this.Y=this.type=="text"?a0:-a4;this.W=a2;this.H=ba;(R.left!=-E+"px")&amp;&amp;(R.left=-E+"px");(R.top!=-a4+"px")&amp;&amp;(R.top=-a4+"px");}else{(a5.left!=E+"px")&amp;&amp;(a5.left=E+"px");(a5.top!=a4+"px")&amp;&amp;(a5.top=a4+"px");this.X=a1;this.Y=a0;this.W=a2;this.H=ba;(a5.width!=this.paper.width+"px")&amp;&amp;(a5.width=this.paper.width+"px");(a5.height!=this.paper.height+"px")&amp;&amp;(a5.height=this.paper.height+"px");(R.left!=a1-E+"px")&amp;&amp;(R.left=a1-E+"px");(R.top!=a0-a4+"px")&amp;&amp;(R.top=a0-a4+"px");(R.width!=a2+"px")&amp;&amp;(R.width=a2+"px");(R.height!=ba+"px")&amp;&amp;(R.height=ba+"px");var' 
e 
R='ah("group"),a0=ah("oval"),i=a0.style;R.style.cssText="position:absolute;left:0;top:0;width:"+e.width+"px;height:"+e.height+"px";R.coordsize=e.coordsize;R.coordorigin=e.coordorigin;R[aL](a0);var' 
S="0,i=0,e=0,E=1;this[0]=R;this.id=an._oid++;this.node=R;R.raphael=this;this.X=0;this.Y=0;this.attrs={};this.Group=a0;this.paper=d;this._={tx:0,ty:0,rt:{deg:0},sx:1,sy:1};!d.bottom&amp;&amp;(d.bottom=this);this.prev=d.top;d.top&amp;&amp;(d.top.next=this);d.top=this;this.next=null;};ax[aY].rotate=function(e,d,i){if(this.removed){return" 
d 
a7='this.attrs,a1,a0,a2,ba;switch(this.type){case"circle":a1=a7.cx-a7.r;a0=a7.cy-a7.r;a2=ba=a7.r*2;break;case"ellipse":a1=a7.cx-a7.rx;a0=a7.cy-a7.ry;a2=a7.rx*2;ba=a7.ry*2;break;case"rect":case"image":a1=+a7.x;a0=+a7.y;a2=a7.width||0;ba=a7.height||0;break;case"text":this.textpath.v=["m",O(a7.x),",' 
in this;}if(this.type='="path"){return' 
this[d];}this.removed="true;};ax[aY].attr=function(){if(this.removed){return" 
this){delete 
this;};ax[aY].show='function(){!this.removed&amp;&amp;(this.Group.style.display="block");return' 
this;}if(e="=null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy][az](am);}return" 
ax="function(R,a0,d){var" 
a8="U(this.attrs.path);a1=a8.x;a0=a8.y;a2=a8.width;ba=a8.height;}break;default:a1=0;a0=0;a2=this.paper.width;ba=this.paper.height;break;}e=(e==null)?a1+a2/2:e;d=(d==null)?a0+ba/2:d;var" 
a9 1;};var 
a5="this.Group.style,R=(this.shape&amp;&amp;this.shape.style)||this.node.style;bb=bb||{};for(var" 
a6='ah("roundrect"),bc={},a9=0,a3=this.events&amp;&amp;this.events[m];a6.arcsize=S;a6.raphael=this;this.Group[aL](a6);this.Group.removeChild(this.node);this[0]=this.node=a6;this.arcsize=S;for(var' 
L.createElement(?<rvml:?+d+? 
this;},ah;L.createStyleSheet().addRule(?.rvml?,?behavior:url(#default#VML)?);try{!L.namespaces.rvml&&L.namespaces.add(?rvml?,?urn:schemas-microsoft-com:vml?);ah="function(d){return" 
0)?;return ?+d+? ?+i+? S;},aV="function(i,d){var" 
ax(i,R,e);S.shape='E;S.textpath=a4;S.type="text";S.attrs.text=a3;S.attrs.x=a2;S.attrs.y=a1;S.attrs.w=1;S.attrs.h=1;aa(S,{font:j.font,stroke:"none",fill:"#000"});S.setBox();e.canvas[aL](R);return' 
S;},X="function(e,a2,a1,a3){var" 
;S.attrs.src="d;S.attrs.x=a2;S.attrs.y=a1;S.attrs.w=a3;S.attrs.h=E;S.setBox({x:a2,y:a1,width:a3,height:E});e.canvas[aL](R);return" 
ax(i,R,e);S.type="rect" S;},o="function(e,d,a2,a1,a3,E){var" 
;aa(S,{stroke:?#000?});S.attrs.cx="a2;S.attrs.cy=a1;S.attrs.rx=i;S.attrs.ry=e;S.setBox({x:a2-i,y:a1-e,width:i*2,height:e*2});d.canvas[aL](R);return" 
ax(E,R,d);S.type="ellipse" S;},ai="function(d,a2,a1,i,e){var" 
;aa(S,{stroke:?#000?});S.arcsize="a3;S.setBox({x:a1,y:a0,width:a2,height:E,r:d});e.canvas[aL](R);return" 
E;},aF="function(e,a1,a0,a2,E,d){var" 
;aa(E,{stroke:?#000?,fill:?none?});E.attrs.cx="d;E.attrs.cy=a1;E.attrs.r=S;E.setBox({x:d-S,y:a1-S,width:S*2,height:S*2});e.canvas[aL](R);return" 
ax(a0,R,e);E.type="circle" P="function(e,d,a1,S){var" this;};var 
this;}d.Group.parentNode.insertBefore(this.Group,d.Group);aq(this,d,this.paper);return 
this;};ax[aY].insertBefore="function(d){if(this.removed){return" 
this;}if(d.Group.nextSibling){d.Group.parentNode.insertBefore(this.Group,d.Group.nextSibling);}else{d.Group.parentNode[aL](this.Group);}A(this,d,this.paper);return 
this;};ax[aY].insertAfter="function(d){if(this.removed){return" 
this;}if(this.Group.parentNode.firstChild!="this.Group){this.Group.parentNode.insertBefore(this.Group,this.Group.parentNode.firstChild);k(this,this.paper);}return" 
this;};ax[aY].toBack="function(){if(this.removed){return" 
this;};ax[aY].toFront="function(){!this.removed&amp;&amp;this.Group.parentNode[aL](this.Group);this.paper.top!=this&amp;&amp;Y(this,this.paper);return" 
S;if(arguments[m]='=2){S={};S[arguments[0]]=arguments[1];}arguments[m]==1&amp;&amp;an.is(arguments[0],"object")&amp;&amp;(S=arguments[0]);if(S){if(S.text&amp;&amp;this.type=="text"){this.node.string=S.text;}aa(this,S);if(S.gradient&amp;&amp;(({circle:1,ellipse:1})[Q](this.type)||(S.gradient+at).charAt()!="r")){b(this,S.gradient);}(this.type!="path"||this._.rt.deg)&amp;&amp;this.setBox(this.attrs);}return' 
d;}var 
this.attrs[arguments[0]];}if(this.attrs&&arguments[m]='=1&amp;&amp;an.is(arguments[0],"array")){var' 
this.attrs.gradient;}return 
this.scale();}if(arguments[0]='="fill"&amp;&amp;this.attrs.fill=="none"&amp;&amp;this.attrs.gradient){return' 
this.rotate();}if(arguments[0]='="scale"){return' 
t.call(this);}if(arguments[0]='="rotation"){return' 
E;}if(arguments[m]='=1&amp;&amp;an.is(arguments[0],"string")){if(arguments[0]=="translation"){return' 
E.gradient;return 
this.attrs){if(this.attrs[Q](e)){E[e]='this.attrs[e];}}this._.rt.deg&amp;&amp;(E.rotation=this.rotate());(this._.sx!=1||this._.sy!=1)&amp;&amp;(E.scale=this.scale());E.gradient&amp;&amp;E.fill=="none"&amp;&amp;(E.fill=E.gradient)&amp;&amp;delete' 
this;}if(arguments[m]="=0){var" 
U(this.attrs.path);}return{x:this.X+(this.bbx||0),y:this.Y,width:this.W,height:this.H};};ax[aY].remove="function(){if(this.removed){return;}ak(this,this.paper);this.node.parentNode.removeChild(this.node);this.Group.parentNode.removeChild(this.Group);this.shape&amp;&amp;this.shape.parentNode.removeChild(this.shape);for(var" 
this;};ax[aY].getBBox="function(){if(this.removed){return" 
bc.scale;this.attr(bc);if(this.events){for(;a9<a3;a9++){this.events[a9].unbind='ae(this.node,this.events[a9].name,this.events[a9].f,this);}}}}};ax[aY].hide=function(){!this.removed&amp;&amp;(this.Group.style.display="none");return' 
a7){bc[a9]="a7[a9];}delete" 
?,O(a7.y-2)][az](at);a1='a7.x-O(this.W/2);a0=a7.y-this.H/2;a2=this.W;ba=this.H;break;case"path":if(!this.attrs.path){a1=0;a0=0;a2=this.paper.width;ba=this.paper.height;}else{var' 
?,O(a7.y-2),?l?,O(a7.x)+1,?, 
bb){if(bb[Q](a9)){this.attrs[a9]="bb[a9];}}e=e||this._.rt.cx;d=d||this._.rt.cy;var" 
this;}var this;};ax[aY].setBox="function(bb,e,d){if(this.removed){return" 
this._.rt.deg;}e="(e+at)[z](a);if(e[m]-1){d=W(e[1]);i=W(e[2]);}e=W(e[0]);if(d!=null){this._.rt.deg=e;}else{this._.rt.deg+=e;}i==null&amp;&amp;(d=null);this._.rt.cx=d;this._.rt.cy=i;this.setBox(this.attrs,d,i);this.Group.style.rotation=this._.rt.deg;return" 
?+a4.color);if(S='="radial"){a4.focus="100%";a4.focussize=a0;a4.focusposition=a0;}else{a4.angle=(270-e)%360;}}return'>');};}catch(af){ah=function(d){return 
L.createElement("&lt;"+d+' xmlns="urn:schemas-microsoft.com:vml" 
class="rvml"&gt;');};}var w=function(){var 
i=ao[aW](null,arguments),d=i.container,a2=i.height,a3,e=i.width,a1=i.x,a0=i.y;if(!d){throw 
new Error("VML container not found.");}var R=new 
aT,S=R.canvas=L.createElement("div"),E=S.style;e=e||512;a2=a2||342;e==+e&amp;&amp;(e+="px");a2==+a2&amp;&amp;(a2+="px");R.width=1000;R.height=1000;R.coordsize="1000 
1000";R.coordorigin="0 
0";R.span=L.createElement("span");R.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";S[aL](R.span);E.cssText=an.format("width:{0};height:{1};position:absolute;clip:rect(0 
{0} {1} 
0);overflow:hidden",e,a2);if(d==1){L.body[aL](S);E.left=a1+"px";E.top=a0+"px";}else{d.style.width=e;d.style.height=a2;if(d.firstChild){d.insertBefore(S,d.firstChild);}else{d[aL](S);}}aG.call(R,R,an.fn);return 
R;};aT[aY].clear=function(){this.canvas.innerHTML=at;this.span=L.createElement("span");this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";this.canvas[aL](this.span);this.bottom=this.top=null;};aT[aY].remove=function(){this.canvas.parentNode.removeChild(this.canvas);for(var 
d in 
this){this[d]=s(d);}};}if((/^Apple|^Google/).test(navigator.vendor)&amp;&amp;!(navigator.userAgent.indexOf("Version/4.0")+1)){aT[aY].safari=function(){var 
d=this.rect(-99,-99,this.width+99,this.height+99);setTimeout(function(){d.remove();});};}else{aT[aY].safari=function(){};}var 
ae=(function(){if(L.addEventListener){return function(R,i,e,d){var 
E=function(S){return e.call(d,S);};R.addEventListener(i,E,false);return 
function(){R.removeEventListener(i,E,false);return 
true;};};}else{if(L.attachEvent){return function(S,E,i,e){var 
R=function(a0){return i.call(e,a0||au.event);};S.attachEvent("on"+E,R);var 
d=function(){S.detachEvent("on"+E,R);return true;};return d;};}}})();for(var 
ac=F[m];ac--;){(function(d){ax[aY][d]=function(e){if(an.is(e,"function")){this.events=this.events||[];this.events.push({name:d,f:e,unbind:ae(this.shape||this.node,d,e,this)});}return 
this;};ax[aY]["un"+d]=function(E){var 
i=this.events,e=i[m];while(e--){if(i[e].name==d&amp;&amp;i[e].f==E){i[e].unbind();i.splice(e,1);!i.length&amp;&amp;delete 
this.events;return this;}}return 
this;};})(F[ac]);}ax[aY].hover=function(e,d){return 
this.mouseover(e).mouseout(d);};ax[aY].unhover=function(e,d){return 
this.unmouseover(e).unmouseout(d);};aT[aY].circle=function(d,i,e){return 
P(this,d||0,i||0,e||0);};aT[aY].rect=function(d,R,e,i,E){return 
aF(this,d||0,R||0,e||0,i||0,E||0);};aT[aY].ellipse=function(d,E,i,e){return 
ai(this,d||0,E||0,i||0,e||0);};aT[aY].path=function(d){d&amp;&amp;!an.is(d,"string")&amp;&amp;!an.is(d[0],"array")&amp;&amp;(d+=at);return 
q(an.format[aW](an,arguments),this);};aT[aY].image=function(E,d,R,e,i){return 
o(this,E||"about:blank",d||0,R||0,e||0,i||0);};aT[aY].text=function(d,i,e){return 
X(this,d||0,i||0,e||at);};aT[aY].set=function(d){arguments[m]&gt;1&amp;&amp;(d=Array[aY].splice.call(arguments,0,arguments[m]));return 
new 
T(d);};aT[aY].setSize=aV;aT[aY].top=aT[aY].bottom=null;aT[aY].raphael=an;function 
u(){return 
this.x+am+this.y;}ax[aY].scale=function(a6,a5,E,e){if(a6==null&amp;&amp;a5==null){return{x:this._.sx,y:this._.sy,toString:u};}a5=a5||a6;!+a5&amp;&amp;(a5=a6);var 
ba,a8,a9,a7,bm=this.attrs;if(a6!=0){var 
a4=this.getBBox(),a1=a4.x+a4.width/2,R=a4.y+a4.height/2,bl=a6/this._.sx,bk=a5/this._.sy;E=(+E||E==0)?E:a1;e=(+e||e==0)?e:R;var 
a3=~~(a6/ab.abs(a6)),a0=~~(a5/ab.abs(a5)),be=this.node.style,bo=E+(a1-E)*bl,bn=e+(R-e)*bk;switch(this.type){case"rect":case"image":var 
a2=bm.width*a3*bl,bd=bm.height*a0*bk;this.attr({height:bd,r:bm.r*aI(a3*bl,a0*bk),width:a2,x:bo-a2/2,y:bn-bd/2});break;case"circle":case"ellipse":this.attr({rx:bm.rx*a3*bl,ry:bm.ry*a0*bk,r:bm.r*aI(a3*bl,a0*bk),cx:bo,cy:bn});break;case"path":var 
bg=ad(bm.path),bh=true;for(var bj=0,bc=bg[m];bj<BC;BJ++){VAR 
d="U(bg),ba=bo-d.x-d.width/2,a8=bn-d.y-d.height/2;bg[0][1]+=ba;bg[0][2]+=a8;this.attr({path:bg});break;}if(this.type" 
a2='0,a7=a9.length;a2<a7;a2++){E=a9[a2];if(E[0]=="M"){a5=+E[1];a4=+E[2];}else{a1=n(a5,a4,E[1],E[2],E[3],E[4],E[5],E[6]);if(a3+a1' 
in ,a8="{},a6,a3=0;for(var" a5,a4,E,a1,R="" function(a9,S,a0){a9="H(a9);var" 
aB="function(d,e){return" this.paper[this.type]().attr(d);};var 
d.translation;return d.scale;delete this;};ax[aY].clone="function(){var" 
)?);be.filter='(this.node.filterMatrix||at)+(this.node.filterOpacity||at);}}else{if(this.transformations){this.transformations[2]=at;this.node[v]("transform",this.transformations[az](am));bm.fx=0;bm.fy=0;}else{this.node.filterMatrix=at;be.filter=(this.node.filterMatrix||at)+(this.node.filterOpacity||at);}}bm.scale=[a6,a5,E,e][az](am);this._.sx=a6;this._.sy=a5;}return' 
filtertype="bilinear" , sizingmethod="auto expand" Dy="0," Dx="0," M22=",a0," 
M21="0," M12="0," progid:DXImageTransform.Microsoft.Matrix(M11="[aS](a3," 
{text:1,image:1}&&(a3!='1||a0!=1)){if(this.transformations){this.transformations[2]="scale("[aS](a3,",",a0,")");this.node[v]("transform",this.transformations[az](am));ba=(a3==-1)?-bm.x-(a2||0):bm.x;a8=(a0==-1)?-bm.y-(bd||0):bm.y;this.attr({x:ba,y:a8});bm.fx=a3-1;bm.fy=a0-1;}else{this.node.filterMatrix="' 
bf='bg[bj],bi,S=aN.call(bf[0]);if(S=="M"&amp;&amp;bh){continue;}else{bh=false;}if(S=="A"){bf[bg[bj][m]-2]*=bl;bf[bg[bj][m]-1]*=bk;bf[1]*=a3*bl;bf[2]*=a0*bk;bf[5]=+(a3+a0?!!+bf[5]:!+bf[5]);}else{if(S=="H"){for(bi=1,jj=bf[m];bi<jj;bi++){bf[bi]*=bl;}}else{if(S=="V"){for(bi=1,jj=bf[m];bi<jj;bi++){bf[bi]*=bk;}}else{for(bi=1,jj=bf[m];bi<jj;bi++){bf[bi]*=(bi%2)?bl:bk;}}}}}var'>S){if(e&amp;&amp;!a8.start){a6=an.findDotsAtSegment(a5,a4,E[1],E[2],E[3],E[4],E[5],E[6],(S-a3)/a1);R+=["C",a6.start.x,a6.start.y,a6.m.x,a6.m.y,a6.x,a6.y];if(a0){return 
R;}a8.start=R;R=["M",a6.x,a6.y+"C",a6.n.x,a6.n.y,a6.end.x,a6.end.y,E[5],E[6]][az]();a3+=a1;a5=+E[5];a4=+E[6];continue;}if(!d&amp;&amp;!e){a6=an.findDotsAtSegment(a5,a4,E[1],E[2],E[3],E[4],E[5],E[6],(S-a3)/a1);return{x:a6.x,y:a6.y,alpha:a6.alpha};}}a3+=a1;a5=+E[5];a4=+E[6];}R+=E;}a8.end=R;a6=d?a3:e?a8:an.findDotsAtSegment(a5,a4,E[1],E[2],E[3],E[4],E[5],E[6],1);a6.alpha&amp;&amp;(a6={x:a6.x,y:a6.y,alpha:a6.alpha});return 
a6;};},n=aj(function(E,d,a0,S,a6,a5,a4,a3){var R={x:0,y:0},a2=0;for(var 
a1=0;a1&lt;1.01;a1+=0.01){var 
e=M(E,d,a0,S,a6,a5,a4,a3,a1);a1&amp;&amp;(a2+=ab.sqrt(aM(R.x-e.x,2)+aM(R.y-e.y,2)));R=e;}return 
a2;});var 
ap=aB(1),C=aB(),J=aB(0,1);ax[aY].getTotalLength=function(){if(this.type!="path"){return;}return 
ap(this.attrs.path);};ax[aY].getPointAtLength=function(d){if(this.type!="path"){return;}return 
C(this.attrs.path,d);};ax[aY].getSubpath=function(i,e){if(this.type!="path"){return;}if(ab.abs(this.getTotalLength()-e)&lt;0.000001){return 
J(this.attrs.path,i).end;}var d=J(this.attrs.path,e,1);return 
i?J(d,i).end:d;};an.easing_formulas={linear:function(d){return 
d;},"&lt;":function(d){return aM(d,3);},"&gt;":function(d){return 
aM(d-1,3)+1;},"&lt;&gt;":function(d){d=d*2;if(d&lt;1){return 
aM(d,3)/2;}d-=2;return(aM(d,3)+2)/2;},backIn:function(e){var d=1.70158;return 
e*e*((d+1)*e-d);},backOut:function(e){e=e-1;var d=1.70158;return 
e*e*((d+1)*e+d)+1;},elastic:function(i){if(i==0||i==1){return i;}var 
e=0.3,d=e/4;return 
aM(2,-10*i)*ab.sin((i-d)*(2*ab.PI)/e)+1;},bounce:function(E){var 
e=7.5625,i=2.75,d;if(E&lt;(1/i)){d=e*E*E;}else{if(E&lt;(2/i)){E-=(1.5/i);d=e*E*E+0.75;}else{if(E&lt;(2.5/i)){E-=(2.25/i);d=e*E*E+0.9375;}else{E-=(2.625/i);d=e*E*E+0.984375;}}}return 
d;}};var I={length:0},aR=function(){var a2=+new Date;for(var be in 
I){if(be!="length"&amp;&amp;I[Q](be)){var bj=I[be];if(bj.stop){delete 
I[be];I[m]--;continue;}var 
a0=a2-bj.start,bb=bj.ms,ba=bj.easing,bf=bj.from,a7=bj.diff,E=bj.to,a6=bj.t,a9=bj.prev||0,a1=bj.el,R=bj.callback,a8={},d;if(a0<BB){VAR 
S="an.easing_formulas[ba]?an.easing_formulas[ba](a0/bb):a0/bb;for(var" d 
a4='a7[bc][0]*(a0-a9),a3=a7[bc][1]*(a0-a9);a6.x+=a4;a6.y+=a3;d=a4+am+a3;break;case"rotation":d=+bf[bc][0]+S*bb*a7[bc][0];bf[bc][1]&amp;&amp;(d+=","+bf[bc][1]+","+bf[bc][2]);break;case"scale":d=[+bf[bc][0]+S*bb*a7[bc][0],+bf[bc][1]+S*bb*a7[bc][1],(2' 
in 
bg='1,bi=bf[bc][bh][m];bg<bi;bg++){d[bh][bg]=+bf[bc][bh][bg]+S*bb*a7[bc][bh][bg];}d[bh]=d[bh][az](am);}d=d[az](am);break;case"csv":switch(bc){case"translation":var' 
bd='C(E[bc],d);a1.translate(a7.sx-a7.x||0,a7.sy-a7.y||0);a7.x=bd.x;a7.y=bd.y;a1.translate(bd.x-a7.sx,bd.y-a7.sy);E.rot&amp;&amp;a1.rotate(a7.r+bd.alpha,bd.x,bd.y);break;case"number":d=+bf[bc]+S*bb*a7[bc];break;case"colour":d="rgb("+[B(O(bf[bc].r+S*bb*a7[bc].r)),B(O(bf[bc].g+S*bb*a7[bc].g)),B(O(bf[bc].b+S*bb*a7[bc].b))][az](",")+")";break;case"path":d=[];for(var' 
I[be];I[m]--;a1.in_animation='null;an.is(R,"function")&amp;&amp;R.call(a1);}bj.prev=a0;}}an.svg&amp;&amp;a1&amp;&amp;a1.paper.safari();I[m]&amp;&amp;setTimeout(aR);},B=function(d){return' 
bh="0,a5=bf[bc][m];bh<a5;bh++){d[bh]=[bf[bc][bh][0]];for(var" 
E[bc]?E[bc][3]:at)][az](am);break;case?clip-rect?:d="[];var" 
E[bc]?E[bc][2]:at),(3 
bf){if(bf[Q](bc)){switch(Z[bc]){case?along?:d="S*bb*a7[bc];E.back&amp;&amp;(d=E.len-d);var" 
bc>255?255:(d&lt;0?0:d);},t=function(d,i){if(d==null){return{x:this._.tx,y:this._.ty,toString:u};}this._.tx+=+d;this._.ty+=+i;switch(this.type){case"circle":case"ellipse":this.attr({cx:+d+this.attrs.cx,cy:+i+this.attrs.cy});break;case"rect":case"image":case"text":this.attr({x:+d+this.attrs.x,y:+i+this.attrs.y});break;case"path":var 
e=ad(this.attrs.path);e[0][1]+=+d;e[0][2]+=+i;this.attr({path:e});break;}return 
this;};ax[aY].animateWith=function(e,i,d,R,E){I[e.id]&amp;&amp;(i.start=I[e.id].start);return 
this.animate(i,d,R,E);};ax[aY].animateAlong=ay();ax[aY].animateAlongBack=ay(1);function 
ay(d){return function(E,i,e,S){var 
R={back:d};an.is(e,"function")?(S=e):(R.rot=e);E&amp;&amp;E.constructor==ax&amp;&amp;(E=E.attrs.path);E&amp;&amp;(R.along=E);return 
this.animate(R,i,S);};}ax[aY].onAnimation=function(d){this._run=d||0;return 
this;};ax[aY].animate=function(be,a5,a4,E){if(an.is(a4,"function")||!a4){E=a4||null;}var 
a9={},e={},a2={};for(var a6 in 
be){if(be[Q](a6)){if(Z[Q](a6)){a9[a6]=this.attr(a6);(a9[a6]==null)&amp;&amp;(a9[a6]=j[a6]);e[a6]=be[a6];switch(Z[a6]){case"along":var 
bc=ap(be[a6]),a7=C(be[a6],bc*!!be.back),R=this.getBBox();a2[a6]=bc/a5;a2.tx=R.x;a2.ty=R.y;a2.sx=a7.x;a2.sy=a7.y;e.rot=be.rot;e.back=be.back;e.len=bc;be.rot&amp;&amp;(a2.r=W(this.rotate())||0);break;case"number":a2[a6]=(e[a6]-a9[a6])/a5;break;case"colour":a9[a6]=an.getRGB(a9[a6]);var 
a8=an.getRGB(e[a6]);a2[a6]={r:(a8.r-a9[a6].r)/a5,g:(a8.g-a9[a6].g)/a5,b:(a8.b-a9[a6].b)/a5};break;case"path":var 
S=H(a9[a6],e[a6]);a9[a6]=S[0];var a3=S[1];a2[a6]=[];for(var 
bb=0,a1=a9[a6][m];bb&lt;a1;bb++){a2[a6][bb]=[0];for(var 
ba=1,bd=a9[a6][bb][m];ba&lt;bd;ba++){a2[a6][bb][ba]=(a3[bb][ba]-a9[a6][bb][ba])/a5;}}break;case"csv":var 
d=(be[a6]+at)[z](a),a0=(a9[a6]+at)[z](a);switch(a6){case"translation":a9[a6]=[0,0];a2[a6]=[d[0]/a5,d[1]/a5];break;case"rotation":a9[a6]=(a0[1]==d[1]&amp;&amp;a0[2]==d[2])?a0:[0,d[1],d[2]];a2[a6]=[(d[0]-a9[a6][0])/a5,0,0];break;case"scale":be[a6]=d;a9[a6]=(a9[a6]+at)[z](a);a2[a6]=[(d[0]-a9[a6][0])/a5,(d[1]-a9[a6][1])/a5,0,0];break;case"clip-rect":a9[a6]=(a9[a6]+at)[z](a);a2[a6]=[];var 
bb=4;while(bb--){a2[a6][bb]=(d[bb]-a9[a6][bb])/a5;}break;}e[a6]=d;}}}}this.stop();this.in_animation=1;I[this.id]={start:be.start||+new 
Date,ms:a5,easing:a4,from:a9,diff:a2,to:e,el:this,callback:E,t:{x:0,y:0}};++I[m]==1&amp;&amp;aR();return 
this;};ax[aY].stop=function(){I[this.id]&amp;&amp;I[m]--;delete 
I[this.id];return this;};ax[aY].translate=function(d,e){return 
this.attr({translation:d+" 
"+e});};ax[aY][aA]=function(){return"Rapha\xebl\u2019s object";};an.ae=I;var 
T=function(d){this.items=[];this[m]=0;if(d){for(var 
e=0,E=d[m];e&lt;E;e++){if(d[e]&amp;&amp;(d[e].constructor==ax||d[e].constructor==T)){this[this.items[m]]=this.items[this.items[m]]=d[e];this[m]++;}}}};T[aY][f]=function(){var 
R,d;for(var 
e=0,E=arguments[m];e&lt;E;e++){R=arguments[e];if(R&amp;&amp;(R.constructor==ax||R.constructor==T)){d=this.items[m];this[d]=this.items[d]=R;this[m]++;}}return 
this;};T[aY].pop=function(){delete this[this[m]--];return 
this.items.pop();};for(var y in 
ax[aY]){if(ax[aY][Q](y)){T[aY][y]=(function(d){return function(){for(var 
e=0,E=this.items[m];e&lt;E;e++){this.items[e][d][aW](this.items[e],arguments);}return 
this;};})(y);}}T[aY].attr=function(e,a0){if(e&amp;&amp;an.is(e,"array")&amp;&amp;an.is(e[0],"object")){for(var 
d=0,S=e[m];d&lt;S;d++){this.items[d].attr(e[d]);}}else{for(var 
E=0,R=this.items[m];E&lt;R;E++){this.items[E].attr[aW](this.items[E],arguments);}}return 
this;};T[aY].animate=function(S,e,a2,a1){(an.is(a2,"function")||!a2)&amp;&amp;(a1=a2||null);var 
d=this.items[m],E=d,a0=this,R;a1&amp;&amp;(R=function(){!--d&amp;&amp;a1.call(a0);});this.items[--E].animate(S,e,a2||R,R);while(E--){this.items[E].animateWith(this.items[d-1],S,e,a2||R,R);}return 
this;};T[aY].insertAfter=function(e){var 
d=this.items[m];while(d--){this.items[d].insertAfter(e);}return 
this;};T[aY].getBBox=function(){var d=[],a0=[],e=[],R=[];for(var 
E=this.items[m];E--;){var 
S=this.items[E].getBBox();d[f](S.x);a0[f](S.y);e[f](S.x+S.width);R[f](S.y+S.height);}d=aI[aW](0,d);a0=aI[aW](0,a0);return{x:d,y:a0,width:g[aW](0,e)-d,height:g[aW](0,R)-a0};};an.registerFont=function(e){if(!e.face){return 
e;}this.fonts=this.fonts||{};var 
E={w:e.w,face:{},glyphs:{}},i=e.face["font-family"];for(var a0 in 
e.face){if(e.face[Q](a0)){E.face[a0]=e.face[a0];}}if(this.fonts[i]){this.fonts[i][f](E);}else{this.fonts[i]=[E];}if(!e.svg){E.face["units-per-em"]=G(e.face["units-per-em"],10);for(var 
R in e.glyphs){if(e.glyphs[Q](R)){var 
S=e.glyphs[R];E.glyphs[R]={w:S.w,k:{},d:S.d&amp;&amp;"M"+S.d[aP](/[mlcxtrv]/g,function(a1){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a1]||"M";})+"z"};if(S.k){for(var 
d in S.k){if(S[Q](d)){E.glyphs[R].k[d]=S.k[d];}}}}}}return 
e;};aT[aY].getFont=function(a2,a3,e,R){R=R||"normal";e=e||"normal";a3=+a3||{normal:400,bold:700,lighter:300,bolder:800}[a3]||400;var 
S=an.fonts[a2];if(!S){var E=new 
RegExp("(^|\\s)"+a2[aP](/[^\w\d\s+!~.:_-]/g,at)+"(\\s|$)","i");for(var d in 
an.fonts){if(an.fonts[Q](d)){if(E.test(d)){S=an.fonts[d];break;}}}}var 
a0;if(S){for(var 
a1=0,a4=S[m];a1&lt;a4;a1++){a0=S[a1];if(a0.face["font-weight"]==a3&amp;&amp;(a0.face["font-style"]==e||!a0.face["font-style"])&amp;&amp;a0.face["font-stretch"]==R){break;}}}return 
a0;};aT[aY].print=function(R,E,d,a1,a2,bb){bb=bb||"middle";var 
a7=this.set(),ba=(d+at)[z](at),a8=0,a4=at,bc;an.is(a1,"string")&amp;&amp;(a1=this.getFont(a1));if(a1){bc=(a2||16)/a1.face["units-per-em"];var 
e=a1.face.bbox.split(a),a0=+e[0],a3=+e[1]+(bb=="baseline"?e[3]-e[1]+(+a1.face.descent):(e[3]-e[1])/2);for(var 
a6=0,S=ba[m];a6&lt;S;a6++){var 
a5=a6&amp;&amp;a1.glyphs[ba[a6-1]]||{},a9=a1.glyphs[ba[a6]];a8+=a6?(a5.w||a1.w)+(a5.k&amp;&amp;a5.k[ba[a6]]||0):0;a9&amp;&amp;a9.d&amp;&amp;a7[f](this.path(a9.d).attr({fill:"#000",stroke:"none",translation:[a8,0]}));}a7.scale(bc,bc,a0,a3).translate(R-a0,E-a3);}return 
a7;};an.format=function(i){var 
e=an.is(arguments[1],"array")?[0][aS](arguments[1]):arguments,d=/\{(\d+)\}/g;i&amp;&amp;an.is(i,"string")&amp;&amp;e[m]-1&amp;&amp;(i=i[aP](d,function(R,E){return 
e[++E]==null?at:e[E];}));return i||at;};an.ninja=function(){var 
d=Raphael;if(l.was){Raphael=l.is;}else{delete Raphael;}return 
d;};an.el=ax[aY];return an;})();</BODY></HTML>
