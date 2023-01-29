/* --- Swazz Javascript Calendar ---
/* --- v 1.0 3rd November 2006
/* --- last modification: 16th August 2007 by Pascal Hennig
By Oliver Bryant
http://calendar.swazz.org
Modified by Alan Blount - alan[a7]zeroasterisk[d07]com
Modified by William Eriau - inmagnaveritas[at]gmail.com - fixed positioning problem when using doctype 
Modified by Pascal Hennig - added german as second language; 
							made script flexible, so you can use parameters to disable or allow the Past. Just call lcs(this, true) to disable the Past.
							Choose between Monday and Sunday as your starting day.
*/

//var dateformat = 'ymd'; // year-month-date
//var dateformat = 'mdy'; // date-month-year

var dateformat 	= 'mdy'; 		// date-month-year (default)
var datesplitter= '/'; 			// in between date, month, year... typically '/' or '-' or '.'
var prefix0 	= false; 		// months and dates less than 10, get prefixed w/ a '0'
var disablepast = false; 		// disable date selection in the past
var startday	= 'Sun';		// Mon = Monday; Sun = Sunday
var language	= 'en';			// de = German; en = English

if( startday == 'Sun' )
{
	if( language == 'en' )	{
		document.write('<table id="fc" style="position:absolute;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none" cellpadding=2>');
document.write('<tr><td style="cursor:pointer" onclick="csubm()">&lt;&lt;</td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()">&gt;&gt;</td></tr>');
document.write('<tr><td align=center style="background:#ABABAB;font:12px Arial">S</td><td align=center style="background:#ABABAB;font:12px Arial">M</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">W</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">F</td><td align=center style="background:#ABABAB;font:12px Arial">S</td></tr>');
	}
	else if( language == 'de' ) {
		document.write('<table id="fc" style="position:absolute;top:356px;left:380px;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none" cellpadding=2><tr><td style="cursor:pointer" onclick="csubm()">&lt;&lt;</td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()">&gt;&gt;</td></tr><tr><td align=center style="background:#ABABAB;font:12px Arial">SO</td><td align=center style="background:#ABABAB;font:12px Arial">MO</td><td align=center style="background:#ABABAB;font:12px Arial">DI</td><td align=center style="background:#ABABAB;font:12px Arial">MI</td><td align=center style="background:#ABABAB;font:12px Arial">DO</td><td align=center style="background:#ABABAB;font:12px Arial">FR</td><td align=center style="background:#ABABAB;font:12px Arial">SA</td></tr>');
	}
	
	for(var kk=1;kk<=6;kk++) 
	{
		document.write('<tr>');
		for(var tt=1;tt<=7;tt++) 
		{
			num=7 * (kk-1) - (-tt);
			document.write('<td id="v' + num + '" style="width:18px;height:18px"> </td>');
		}
		document.write('</tr>');
	}
}

if(  startday == 'Mon' )
{

	if( language == 'en' )	{
		document.write('<table id="fc" style="position:absolute;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none" cellpadding=2>');
document.write('<tr><td style="cursor:pointer" onclick="csubm()">&lt;&lt;</td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()">&gt;&gt;</td></tr>');
document.write('<tr><td align=center style="background:#ABABAB;font:12px Arial">M</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">W</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">F</td><td align=center style="background:#ABABAB;font:12px Arial">S</td><td align=center style="background:#ABABAB;font:12px Arial">S</td></tr>');
	}
	else if( language == 'de' ) {
		document.write('<table id="fc" style="position:absolute;top:356px;left:380px;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none" cellpadding=2><tr><td style="cursor:pointer" onclick="csubm()">&lt;&lt;</td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()">&gt;&gt;</td></tr><tr><td align=center style="background:#ABABAB;font:12px Arial">MO</td><td align=center style="background:#ABABAB;font:12px Arial">DI</td><td align=center style="background:#ABABAB;font:12px Arial">MI</td><td align=center style="background:#ABABAB;font:12px Arial">DO</td><td align=center style="background:#ABABAB;font:12px Arial">FR</td><td align=center style="background:#ABABAB;font:12px Arial">SA</td><td align=center style="background:#ABABAB;font:12px Arial">SO</td></tr>');
	}
	
	for(var kk=1;kk<=7;kk++)
	{
		document.write('<tr>');
		for(var tt=-5;tt<=1;tt++)
		{
			num=7 * (kk-1) - (-tt);
			document.write('<td id="v' + num + '" style="width:18px;height:18px; background-color:#FFF0F5; border: 1px solid #FFE4E1">&nbsp;</td>');
		}
		document.write('</tr>');
	}	
}

document.write('</table>');
document.all?document.attachEvent('onclick',checkClick):document.addEventListener('click',checkClick ,false);

// Calendar script
var now = new Date;
var sccm=now.getMonth();
var sccy=now.getFullYear();
var scfd=now.getDate();
var ccm=sccm;
var ccy=sccy;
var cfd=scfd;

var updobj;

if( language == 'en' )
	var mn=new Array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC');
else if( language == 'de' )
	var mn=new Array('JAN','FEB','M&Auml;R','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ');
var mnn=new Array('31','28','31','30','31','30','31','31','30' ,'31','30','31');
var mnl=new Array('31','29','31','30','31','30','31','31','30' ,'31','30','31');
var calvalarr=new Array(42);
prepcalendar('',ccm,ccy);



function getObj(objID)
{
if (document.getElementById) {return document.getElementById(objID);}
else if (document.all) {return document.all[objID];}
else if (document.layers) {return document.layers[objID];}
}

function checkClick(e) {
e?evt=e:evt=event;
CSE=evt.target?evt.target:evt.srcElement;
if (getObj('fc'))
if (!isChild(CSE,getObj('fc')))
getObj('fc').style.display='none';
}

function isChild(s,d) {
while(s) {
if (s==d)
return true;
s=s.parentNode;
}
return false;
}

function Left(obj)
{
var curleft = 0;
if (obj.offsetParent)
{
while (obj.offsetParent)
{
curleft += obj.offsetLeft
obj = obj.offsetParent;
}
}
else if (obj.x)
curleft += obj.x;
return curleft;
}

function Top(obj)
{
var curtop = 0;
if (obj.offsetParent)
{
while (obj.offsetParent)
{
curtop += obj.offsetTop
obj = obj.offsetParent;
}
}
else if (obj.y)
curtop += obj.y;
return curtop;
}

function lcs(ielem, parameter_disablepast) {
if( parameter_disablepast != null) 	disablepast = parameter_disablepast;
updobj=ielem;
getObj('fc').style.left = Left(ielem) + "px";
getObj('fc').style.top = Top(ielem) + ielem.offsetHeight + "px";
getObj('fc').style.display = '';

// First check date is valid
curdt=ielem.value;
curdtarr=curdt.replace(/\ /gi,'').replace(/[^0-9]/gi,'/').split('/');
isdt=true;
for(var k=0;k<curdtarr.length;k++) {
if (isNaN(parseInt(curdtarr[k])))
isdt=false;
}
if (isdt&(curdtarr.length==3)) {
if (dateformat=='ymd') {
ccy=parseInt(curdtarr[0], 10);
ccm=parseInt(curdtarr[1], 10)-1;
ccd=parseInt(curdtarr[2], 10);
} else if (dateformat=='mdy') {
ccy=parseInt(curdtarr[2], 10);
ccm=parseInt(curdtarr[0], 10)-1;
ccd=parseInt(curdtarr[1], 10);
} else {
ccy=parseInt(curdtarr[2], 10);
ccm=parseInt(curdtarr[1], 10)-1;
ccd=parseInt(curdtarr[0], 10);
}
prepcalendar(ccd,ccm,ccy);
}
}

function evtTgt(e)
{
var el;
if(e.target)el=e.target;
else if(e.srcElement)el=e.srcElement;
if(el.nodeType==3)el=el.parentNode; // defeat Safari bug
return el;
}
function EvtObj(e){if(!e)e=window.event;return e;}
function cs_over(e) {
evtTgt(EvtObj(e)).style.background='#FFCC66';
}
function cs_out(e) {
evtTgt(EvtObj(e)).style.background='#FFF0F5';
}
function cs_click(e) {
updobj.value=calvalarr[evtTgt(EvtObj(e)).id.substring(1,evtTgt(EvtObj(e)) .id.length)];
getObj('fc').style.display='none';

}

function f_cps(obj) {
obj.style.background='#FFF0F5';
obj.style.font='10px Arial';
obj.style.color='#333333';
obj.style.textAlign='center';
obj.style.textDecoration='none';
obj.style.border='1px solid #FFE4E1';
obj.style.cursor='pointer';
}

function f_cpps(obj) {
obj.style.background='#FFF0F5';
obj.style.font='10px Arial';
obj.style.color='#ABABAB';
obj.style.textAlign='center';
obj.style.textDecoration='line-through';
obj.style.border='1px solid #FFE4E1';
obj.style.cursor='default';
}

function f_hds(obj) {
obj.style.background='#E36087';
obj.style.font='bold 10px Arial';
obj.style.color='#000000';
obj.style.textAlign='center';
obj.style.border='1px solid #250709';
obj.style.cursor='pointer';
}

// day selected
function prepcalendar(hd,cm,cy) {
//init(parameter_dateformat, parameter_datesplitter, parameter_disablepast);
now=new Date();
sd=now.getDate();
td=new Date();
td.setDate(1);
td.setFullYear(cy);
td.setMonth(cm);
cd=td.getDay();
getObj('mns').innerHTML=mn[cm]+ ' ' + cy;
marr=((cy%4)==0)?mnl:mnn;
for(var d=1;d<=42;d++) {
f_cps(getObj('v'+parseInt(d)));
if ((d >= (cd -(-1))) && (d<=cd-(-marr[cm]))) {
dip=(disablepast&&(d-cd < sd)&&(cm==sccm)&&(cy==sccy));
htd=((hd!='')&&(d-cd==hd));
if (dip)
f_cpps(getObj('v'+parseInt(d)));
else if (htd)
f_hds(getObj('v'+parseInt(d)));
else
f_cps(getObj('v'+parseInt(d)));

getObj('v'+parseInt(d)).onmouseover=(dip)?null:cs_over;
getObj('v'+parseInt(d)).onmouseout=(dip)?null:cs_out;
getObj('v'+parseInt(d)).onclick=(dip)?null:cs_click;

getObj('v'+parseInt(d)).innerHTML=d-cd;

cmx = parseInt(cm)+1;
if (cmx < 10 && prefix0==true) {
cmx = '0'+cmx;
}
dx = d-cd;
if (dx < 10 && prefix0==true) {
dx = '0'+dx;
}
if (dateformat=='ymd') {
calvalarr[d]=''+cy+datesplitter+cmx+datesplitter+dx;
} else if (dateformat=='mdy') {
calvalarr[d]=''+cmx+datesplitter+dx+datesplitter+cy;
} else {
calvalarr[d]=''+dx+datesplitter+cmx+datesplitter+cy;
}
}
else {
getObj('v'+d).innerHTML=' ';
getObj('v'+parseInt(d)).onmouseover=null;
getObj('v'+parseInt(d)).onmouseout=null;
getObj('v'+parseInt(d)).style.cursor='default';
}
}
}


function caddm() {
marr=((ccy%4)==0)?mnl:mnn;

ccm+=1;
if (ccm>=12) {
ccm=0;
ccy++;
}
cdayf();
prepcalendar('',ccm,ccy);
}
//Added for Next Year Function
function caddy() {
marr=((ccy%4)==0)?mnl:mnn;
ccy++;
prepcalendar('',ccm,ccy);
}


function csubm() {
marr=((ccy%4)==0)?mnl:mnn;

ccm-=1;
if (ccm<0) {
ccm=11;
ccy--;
}
cdayf();
prepcalendar('',ccm,ccy);
}
//added for Previous Year Function
function csuby() {
marr=((ccy%4)==0)?mnl:mnn;

ccy--;
prepcalendar('',ccm,ccy);
}


function cdayf() {
if (!disablepast||((ccy>sccy)||((ccy==sccy)&&(ccm>=sccm))))
return;
else {
ccy=sccy;
ccm=sccm;
cfd=scfd;
}
}