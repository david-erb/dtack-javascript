﻿


// global var eq_symb_base must be defined before executing these functions

// Next: Fix Up preprocessing of binary operators to search for left-hand and right-hand arguments (NOT whole string) 
// for infix notation, a+b should be $(a)+$(b), and NOT $(a+b) Tell them that...
// add to instructions: approx = "apprx" actual symbols is Å
// for operations with longer than one character:
//	first replace them all by a single symbol
//	do this in the array oper[] as well!
// 	then insert the routines to process them
// NOTE order of operations requires ^ to be preprocessed BEFORE +,_, and even adjacent expressions
// This will require $/, $^, etc as special characters added
// Note that, for example, $(a) $, $(b) will become $(a)Char$(b) and the char will vanish
// Solution for typesetting, put the comma (or character) inside the formula:
// $(a $,) $(b)

// *********************** COPYRIGHT © 1997 STEFAN WANER *********
// *********************** ALL RIGHTS RESERVED *********************
// Each math object is a table td which may include script tags for 
// fraction lines, square roots & other items.
// It also has the following atributes: height, width
// gradually replaces each embedded paren with a table, starting from the innermost
// to get parentheses, use square brackets:$B(expression), eg ($B(a/(b+c))) or

var eq_xFactor = 6;			// for fraction bars
var eq_yFactor = 10;			// for parens
var eq_font_size_small = 9;            // for the smaller characters like nth roots

var notEq = eq_symb_base + "/equations/waner/SYMB/NEQ.GIF";

// ******************************** Main ******************************
function EQ(InString) {
// this finds an innermost operation and processes it, replacing it by a table
var theString = preProcess(InString);
// alert(theString);
var foundOp= checkString(theString,"$", false);
while (foundOp> -1)
	{
	theString = extractAndProcess(theString);
	foundOp= checkString(theString,"$",false);
	} // while
theString = postProcess(theString);
// document.write(theString);
return(theString);
}
// ***************************** End Main ******************************

// **********************Pre- and Post-processing **************************
function preProcess(InString) {
var theString = InString;

theString = replaceSubstring (theString,"{","$E("); // math expression
theString = replaceSubstring (theString,"}",")"); // math expression
theString = replaceSubstring (theString,"$M($E()","$M({}"); // fix up $M stuff
theString = replaceSubstring (theString,"$M($E(","$M({"); // fix up $M stuff
theString = replaceSubstring (theString,"--",""); //negative offset code
theString = replaceSubstring (theString,"$(","$E("); // math expression $S is text
theString = replaceSubstring (theString,"apprx","Å"); // approx
theString = replaceSubstring (theString,"$infinity","Ó"); // infinity
theString = replaceSubstring (theString,"$pi","½"); // pi
theString = replaceSubstring (theString,"$$","ð"); // Dollar sign 
theString = replaceSubstring (theString,"$ ","¡"); // Forced Space
theString = replaceSubstring (theString,"$/","¿"); // Forced Space
theString = replaceSubstring (theString,"$,","¤"); // Comma
theString = replaceSubstring (theString,"$+ ","±±"); // Plus,space
theString = replaceSubstring (theString,"$- ","°"); // minus,space
theString = replaceSubstring (theString,"$> ","¦¦"); // gt,space
theString = replaceSubstring (theString,"$< ","……"); // lt,space
theString = replaceSubstring (theString,"$= ","®®"); // eqspace
theString = replaceSubstring (theString,"$- ","°"); // minus,space
theString = replaceSubstring (theString,">=","„"); // gte
theString = replaceSubstring (theString,"<=","¾"); // lte
theString = replaceSubstring (theString,"notequal ","Z"); // obvious
theString = replaceSubstring (theString,"<->","Ï"); // bi arrow
theString = replaceSubstring (theString,"->","Í"); // right arrow
theString = replaceSubstring (theString,"<-","Î"); // left arrow
theString = stripSpaces(theString);	// this leaves $S(  ) expressions alone.
theString = replaceSubstring (theString,")$",")ø$"); // adjacent expressions

// alert(theString);


// ********** Binary Operators *************
var tempString = theString;
var posn = new makeArray(30);
var oper = new makeArray(30);
for (var i = 1; i < 31; i++) posn[i] = -1;
oper[1] = "^"; 
oper[2] = "/";
oper[3] = "-";
oper[4] = "+";
oper[5] = "_";
oper[6] = "=";
oper[7] = "<";
oper[8] = "¾";
oper[9] = ">";
oper[10] = "„";
oper[11] = "Å";
oper[12] = "Z";
oper[13] = "~";
oper[14] = "Î"; // left arrow
oper[15] = "Í"; // right arrow
oper[16] = "Ï"; // bi arrow
oper[17] = "ø" // adjacent expressions
for (i = 18; i < 31; i++) oper[i] = "¶"; // whoops!
for (i = 1; i <= 30; i++) theString = replaceSubstring(theString,oper[i],"¢"+oper[i]);
// remove the extra symbol when processed

// alert(theString);
for (i = 1; i <= 30; i++)
	{ 
	posn[i] = checkString(theString,"¢"+oper[i],false);
	var count = 0;
	while ( (posn[i] != -1) && (count < 300) )
		{
		count ++;
// alert (theString);
		theString = processInfix(theString,oper[i], posn[i]);
// alert (theString);
		posn[i] = checkString(theString, "¢"+oper[i], false);
		} // while posn[i]... 
	} // for i = ...
return (theString);
} // end of preprocess

function processInfix(InString, operation, position) {
// position is one before the operation  ... ¢*
// first get rid of it if it's already prefix
var Length = InString.length;
if ((position > 0) && (InString.charAt(position-1) == "$")) var theString = (InString.substring(0, position) + InString.substring(position+1,Length)); // remove the ¢
else 
	{
	var leftPart = InString.substring(0,position);
// alert(leftPart);
	var rightPart = InString.substring(position+2,Length);
	// now scan leftward until completed paranthetical operation $(...)
	// treat negative sign with care
	var backMark = position; 
	var parencount = 0;
	for (var i = position-1; i >-1; i--)
		{
		var theChar = leftPart.charAt(i);
// alert(theChar);
		if (theChar == ")") parencount++;
		else if (theChar == "(") 
			{
			parencount--;
			if (i == position-1) {backMark = i+1; break}
			}
		if (parencount == 0) 
			{
			backMark = i-2; 
			if (i == position-1) backMark = i+1;
			break;
			} 
// beginning of $X(..)
		} // i
	// now to the right
	var foreMark = 0;
	var rLength = rightPart.length; 	
	var parencount = 0;
	for (var i = 1; i <= rLength; i++)
		{
		var theChar = rightPart.charAt(0);
		if( (theChar == "$") && (i == 1)) i++;
		theChar = rightPart.charAt(i);
		if (theChar == "(") parencount++;
		else if (theChar == ")") parencount--;
		if (parencount == 0) {foreMark = i+1; break} 
// end of $X(..)
		} // i
// alert(backMark);
var leftString = leftPart.substring(backMark,position);
var rightString = rightPart.substring(0,foreMark);
	var newOperation = operation;
	if (operation == "/") newOperation = "F";
	var theString = leftPart.substring(0,backMark) + "$" + newOperation + "(" + leftString + "," + rightString + ")" + rightPart.substring(foreMark,rLength);
	}
// alert(theString);
return (theString);
}

function postProcess(InString) {
var theString = InString;
theString = replaceSubstring (theString,"ð","$"); // Dollar sign 
theString = replaceSubstring (theString, "¡","&nbsp;"); // Forced Space
theString = replaceSubstring (theString ,"¤", ","); // Comma
theString = replaceSubstring (theString ,"¿", "/"); // slash
theString = replaceSubstring (theString, "±±","+ "); // plus, space
theString = replaceSubstring (theString, "°","-"); // minus, space
theString = replaceSubstring (theString, "¦¦","> "); // gt, space
theString = replaceSubstring (theString, "……","< "); // lt, space
theString = replaceSubstring (theString, "®®","= "); // lt, space
theString = replaceSubstring (theString, 'Ó','<img src = "' + eq_symb_base + '/equations/waner/SYMB/INF.GIF">'); // infinity
theString = replaceSubstring (theString, '½','<img src = "' + eq_symb_base + '/equations/waner/SYMB/PI.GIF">'); // pi
return(theString);
}
// *********************** End Pre/Post processing **************************

// ********************* String Processing Routines *************************
function stripSpaces (InString)  {
	var exception = "$S(";
	var parencount = 0;
	var OutString="";
	var deleting = true;
	for (Count=0; Count < InString.length; Count++)  
		{
		var theSubstr = InString.substring (Count,Count+3);
		if (theSubstr == exception) {deleting = false};
		var TempChar=InString.substring (Count, Count+1);
		if ( (deleting == false ) && (TempChar == ")") ) { parencount--; if (parencount == 0) deleting = true}
		else if  ( (deleting == false ) && (TempChar == "(") ) parencount++;
// alert(parencount);
		if ( (TempChar!=" ") ||  ( (TempChar == " ") && (!deleting) ) )OutString=OutString+TempChar;
		}
	return (OutString);
}

function replaceChar (InString,oldSymbol,newSymbol)  {
	OutString="";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=oldSymbol)
			OutString=OutString+TempChar
		else OutString=OutString+newSymbol;
	}
	return (OutString);
} // replace

function replaceSubstring (InString,oldSubstring,newSubstring)  {
	OutString="";
	var sublength = oldSubstring.length;
	for (Count=0; Count < InString.length; Count++)  {
		TempStr=InString.substring (Count, Count+sublength);
		TempChar=InString.substring (Count, Count+1);
		if (TempStr!= oldSubstring)
			OutString=OutString+TempChar
		else 
			{
			OutString=OutString+ newSubstring;
			Count +=sublength-1
			}

	}
	return (OutString);
}

function checkString(InString,subString,backtrack)
// check for subString
// if backtrack = false, returns -1 if not found, and left-most location in string if found
// if backtrack = true, returns -1 if not found, and right-most location in string if found
// note that location is to the left of the substring in both cases
{
var found = -1;
var theString = InString;
var Length = theString.length;
var symbLength = subString.length;
for (var i = Length- symbLength; i >-1; i--)
	{	
	TempChar=theString.substring (i, i+ symbLength);
	if (TempChar == subString) 
			{
			found = i;
			if (backtrack) i = -1
			}
	} // i
return(found);
} // check

function removeTableTags(InString) {
var result = "";
var pos = checkString(InString,"<table",false);
if (pos == -1) return (InString);
else
	{
	result += InString.substring(0,pos);
	var pos2 = checkString(InString,"</tr",true);
	result += InString.substring(pos+27,pos2) + InString.substring(pos2 + 13,InString.length);
// <table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr></tr></table>
	return(result);
	}
}

function makeArray (NumElements, Fill)  {
	var Count;
	this.length = NumElements;
	for (Count = 1; Count <= NumElements; Count++)  {
		this[Count] = Fill;
	}
	return (this);
} // makeArray


function parser (InString, Sep)  {
	NumSeps=1;
	for (Count=0; Count < InString.length; Count++)  {
		if (InString.charAt(Count)==Sep)
			NumSeps++;
	}
	parse = new makeArray (NumSeps);
	Start=0; Count=1; ParseMark=0;
	LoopCtrl=1;
	while (LoopCtrl==1)  {
		ParseMark = InString.indexOf(Sep, ParseMark);
		TestMark=ParseMark+0;
		if  (TestMark==-1){
			parse[Count]= InString.substring (Start, InString.length);
			LoopCtrl=0;
			break;
		}
		parse[Count] = InString.substring (Start, ParseMark);
		Start=ParseMark+1;
		ParseMark=Start;
		Count++;
	}
	parse[0]=Count;
	return (parse);
} // parser

// ******************* Extract & Process Operation  **************************
function extractAndProcess(InString){ 
// extract innermost operation $*(---) and sends it off for processing
var looking = true;
theString = InString;
var Length = theString.length;
var theExpression = "";
var startExpression = checkString(theString,"$",true);
var mark = startExpression + 3;
var parenCount = 1;
while  ( (mark < Length) && (parenCount > 0) )
	{
	TempChar=theString.substring (mark, mark+1);
	if (TempChar == "(") parenCount++;
	else if (TempChar == ")") parenCount--;
	mark++;
	}
if (parenCount == 0) theExpression = theString.substring(startExpression,mark);
else theExpression = "Error!";
var leftString = theString.substring(0, startExpression);
var rightString = theString.substring(mark, Length);
var midString = process(theExpression); 
return (leftString+midString+rightString);
}
//*************************** end extractAndProcess *********************



// ************* info routines ********************************************
function myEval(InString){
// assumes a three-digit integer and overcomes the octal difficulty with leading 00.
var theNumber = 0;
theNumber += parseInt(InString.substring(2,3)) + parseInt (10* InString.substring(1,2)) + parseInt (100* InString.substring(0,1));
return(theNumber);
}

function threeDig(InNumber) {
var theNumber = InNumber;
var theString = "000";
// alert(theNumber);
if (theNumber < 10) theString = "00"+ theNumber;
else if (theNumber < 100) theString = "0"+ theNumber;
else if (theNumber < 1000) theString = theNumber;
else theString = "999";
return (theString);
} // threedig

function getInfo(InString) {
this.table = true; 
var check = checkString(InString,"<table",false);
if (check == -1) this.table = false;
var num = checkString(InString,"ww",false);
	if (num > -1) 
		{
// alert(InString.substring(num+3,num+6));
		var x = myEval(InString.substring(num+3,num+6)); 
// alert(x);
// alert("here");
		}
		else 
		{
		var x = InString.length;
		}
this.width = x;
num = checkString(InString,"hh",false); 
// if (num > -1) alert("here");
	if (num > -1) var x = myEval(InString.substring(num+3,num+6));
	else var x = 1;
this.height = x;
num = checkString(InString,"rr",false); 
// if (num > -1) alert("here");
	if (num > -1) var x = myEval(InString.substring(num +3, num +6));
	else var x = 1;
this.cells = x;

return (this);
}

function stripInfo(InString) {
var OutString = InString;
// alert(InString);
var num = checkString(OutString,"ww",false);
while (num > -1)
	{
	var tempString = OutString;
	OutString = tempString.substring(0,num-3) + tempString.substring(num+30,tempString.length);
// if (OutString.substring(0,2) == "<t") alert(tempString.substring(0,num-3) + "num = " + num + "rest of the string is "+ tempString.substring(num-3, num+30));
// [! ww 003 ][! hh 002 ][! rr 005 ][table class=eq_table cellpadding=0 cellspacing=0 vspace=0]
	num = checkString(OutString,"ww",false);
// alert(OutString);
	}
return(OutString);
}

function addToTotal(InString, name , y){
// alert(InString);
var num = checkString(InString,name,false); 
	if (num > -1) var x = myEval(InString.substring(num +3, num +6)) + y;
	else var x = y;
var OutString = InString.substring(0, num+3) + threeDig(x) + InString.substring(num+6, InString.length);
// alert(OutString);
return(OutString);
}
 // ************ end info routines *******************************************

function process(InString) {
// This processes a single expression.
// Input has the form $A(*****) where the inside is either a table or a primitive
// expression.
var theOutput = "";
var Length = InString.length;
var theOperation = InString.substring(1,2);
if ( (theOperation == "F") || (theOperation == "L"))
	{
	// Fraction
	// should only contain a single comma (rest preproceesed)
	var commaPosition = checkString(InString,",",false);
	if (commaPosition == -1) theOutput = "Error!";
	else
		{
		var numerator = InString.substring(3,commaPosition);
		var denominator = InString.substring(commaPosition+1,Length-1);
		var tl = getInfo(numerator).width;
		var bl = getInfo(denominator).width;
// alert(denominator + " " + bl);
// if (numerator == "sin(x)") alert (tl);
		if (tl >bl) var maxl = tl; else var maxl = bl;
		var barLen = Math.ceil(maxl*eq_xFactor);
		var hl1 = getInfo(numerator).height;
		var hl2 = getInfo(denominator).height;
		var hl = hl1 + hl2 + 1; // total height;
		var widthString = "<! ww "+threeDig(maxl) + " >";
		var heightString = "<! hh "+threeDig(hl) + " >";
		var cellString = "<! rr 001 >";
		var  num1 = checkString(numerator,"</table>",false);
		var  num2 = checkString(denominator,"</table>",false);
		if ((num1 > -1) || (theOperation == "L")) var str1 = ""; else str1 = "<br>";
		if (num2 > -1) var str2 = ""; else str2 = "<br>";
		var fraclineString = "";
		if  (theOperation == "F") fraclineString = '<img src = "' + eq_symb_base + '/equations/waner/SYMB/FR.GIF" height = 1 width ='+barLen+'>';
		theOutput =  widthString + heightString + cellString + "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + "<center>"  + stripInfo(numerator)  + str1 + fraclineString + str2 + stripInfo(denominator)  + "</center>" + "</td></tr></table>"
// alert(theOutput);
		}
	}

else if ( ( ( (theOperation == "ø") || (theOperation == ".") || (theOperation == "+") ) || ( (theOperation == "-" ) || (theOperation == "=") ) ) || (theOperation == "Z") || (theOperation == "Å") || (theOperation == "<") || (theOperation == ">") ||  (theOperation == "¾") || (theOperation == "„") || (theOperation == "Í") ||  (theOperation == "Î") || (theOperation == "Ï") || (theOperation == "~"))
	{
	var commaPosition = checkString(InString,",",false);
	if (commaPosition == -1) theOutput = "Error!";
	else
		{
		var leftFactor = InString.substring(3,commaPosition);
		var rightFactor = InString.substring(commaPosition+1,Length-1);
		var mult = false;
		var diff = false;
		var equals = false;
		var sum = false;
		var notequals = false;
		var approx = false;
		var lessthan = false;
		var greaterthan = false;
		var lte = false;
		var gte = false;
		var rightarr = false;
		var leftarr = false;
		var biarr = false;
		var tilde = false;

		if ( (theOperation == "ø") || (theOperation == ".")) mult = true;
		else if (theOperation == "-") diff = true;
		else if (theOperation == "=") equals = true;
		else if (theOperation == "+") sum = true;
		else if (theOperation == "Z") notequals = true;
		else if (theOperation == "Å") approx = true;
		else if (theOperation == "<") lessthan = true;
		else if (theOperation == ">") greaterthan = true;
		else if (theOperation == "¾") lte = true;
		else if (theOperation == "„") gte = true;
		else if (theOperation == "Î") leftarr = true;
		else if (theOperation == "Í") rightarr = true;
		else if (theOperation == "Ï") biarr = true; 
		else if (theOperation == "~") tilde = true;

		var tl = getInfo(leftFactor).width;
// alert(tl);
		var bl = getInfo(rightFactor).width;
// alert(leftFactor);
		var maxl = tl + bl + 1; // width
		if (!mult) maxl += 2;
// alert (maxl);
		var hl1 = getInfo(leftFactor).height;
		var hl2 = getInfo(rightFactor).height;
		if (hl1>hl2) var hl = hl1; else var hl = hl2; // height
// alert(maxl);
// alert(hl);
// alert(threeDig(maxl));
		var opString = " + "; 
		if (diff) opString = ' <font face="Symbol">-</font> ';
		else if (mult) opString = "";
		else if (equals) opString = " = ";
		else if (notequals) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/NEQ.GIF" width = 7 height = 7> ';
		else if (approx) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/APR.GIF" width = 6 height = 5> ';
		else if (lessthan) opString = ' < ';
		else if (greaterthan) opString = ' > ';
		else if (lte) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/LTE.GIF" width = 6 height = 6> ';
		else if (gte) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/GTE.GIF" width = 6 height = 6> ';
		

		else if (leftarr) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/LAR.GIF" width = 12 height = 7> ';
		else if (rightarr) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/RAR.GIF" width = 12 height = 7> ';
		else if (biarr) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/DAR.GIF" width = 12 height = 7> ';
		else if (gte) opString = ' <img src = "' + eq_symb_base + '/equations/waner/SYMB/TIL.GIF" width = 6 height = 2> ';
// if (mult) alert( getInfo(leftFactor).width + "..."+ getInfo(rightFactor).width)


		var widthString = "<! ww "+threeDig(maxl) + " >";
// if (mult) alert(widthString)
		var heightString = "<! hh "+threeDig(hl) + " >";
		var cellString = "<! rr 001 >";
// if ( (!getInfo(leftFactor).table)&&(!getInfo(rightFactor).table) ) alert(widthString + heightString + cellString +  leftFactor + opString + rightFactor);
		if ( (!getInfo(leftFactor).table)&&(!getInfo(rightFactor).table) ) theOutput = widthString + heightString + cellString +  leftFactor + opString + rightFactor;
		else
			{
			// widthString = addToTotal(widthString,"ww",2);
			// cellString = addToTotal(cellString,"rr",2);
			if (diff) opString = '<td nowrap><font face="Symbol">-</font></td>'
			else if (sum) opString = "<td nowrap>+</td>";
			else if (equals) opString = "<td nowrap>=</td>";
			else if (lessthan) opString = '<td nowrap><</td>';
			else if (greaterthan) opString = '<td nowrap>></td>';
			else if (notequals) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/NEQ.GIF" width = 7 height = 7></td>';
			else if (approx) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/APR.GIF" width = 6 height = 5></td>';
			else if (lte) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/LTE.GIF" width = 6 height = 6></td>';
			else if (gte) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/GTE.GIF" width = 6 height = 6></td>';
			else if (leftarr) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/LAR.GIF" width = 12 height = 7></td>';
			else if (rightarr) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/RAR.GIF" width = 12 height = 7></td>';
			else if (biarr) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/DAR.GIF" width = 12 height = 7></td>';
			else if (gte) opString = '<td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/TIL.GIF" width = 6 height = 2></td>';

			var tempLeft = leftFactor;
			var tempRight = rightFactor;
			tempLeft =  leftFactor + "</td>";
			tempRight = "<td nowrap>" + rightFactor;
			theOutput =  widthString + heightString + cellString + "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" +  stripInfo(tempLeft) + opString + stripInfo(tempRight) +  "</td></tr></table>";
// alert(theOutput);
			}
		}
	}

else if (theOperation == "B" )
	{
	// parentheses
	var Expression = InString.substring(3, Length-1);
// alert (Expression);
	var isTable = getInfo(Expression).table;
	var Length2 = Expression.length;
	var height = getInfo(Expression).height; 

	if ( (!isTable) && (height == 1)) theOutput = InString.substring(2, Length);	
	else if (height == 1)
		{ 

		var start = checkString(Expression, '<td nowrap>',false) + 4;
		var end = checkString(Expression, '</td>',true);
		theOutput = Expression.substring(0,start) + "(" + Expression.substring(start,end) + ")" + Expression.substring(end,Length2);
		}
	else
		{
		var pheight = Math.ceil(eq_yFactor*(height-1));
		Expression = addToTotal(Expression,"ww", 3);
// alert("***"+Expression + "***");
		var leftPart = '<img src = "' + eq_symb_base + '/equations/waner/SYMB/LP.GIF" width = 4 height =' + pheight + '>';
		var rightPart = '<img src = "' + eq_symb_base + '/equations/waner/SYMB/RP.GIF" width = 4 height =' + pheight + '>';
		
		if(!isTable) theOutput = leftPart + Expression + rightPart;
		else 
			{
			var rowNum = getInfo(Expression).cells;
			if (rowNum == 1) theOutput = "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + leftPart + "</td>" + removeTableTags(Expression)+  "<td nowrap>" + rightPart + "</td></tr></table>";

			else theOutput = "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + leftPart + "</td><td nowrap>" + Expression +  "</td><td nowrap>" + rightPart + "</td></tr></table>";
			}
// alert(result);
		} 

	} // end brackets
	
else if (theOperation == "R" )
	{
	// radicals
	//   **** Format *********
	// $R(expr; ±#)
	// $R(expr1)
	// (use negative numbers for subScripts)
	// note the semicolon
	// where the last argument is optional
// alert ("here");
	var root = 2; // default 
	var Argument = InString.substring(3, Length-1);
	var theData = parser(Argument,";");
	var num = eval(theData[2]);
	if  (num >0)  root = num;
	var Expression = theData[1];
	var height = getInfo(Expression).height + 1;
	var width = getInfo(Expression).width + 1;
	var IsATable = getInfo(Expression).table;
	if (!IsATable) {Expression = "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + Expression + "</td></tr></table>"; height += 1}
// alert(Expression + " width is " + width);
	var outwidth = width + 3;
	if (root != 2) outwidth+=1;
	var widthString = "<! ww "+threeDig(outwidth) + " >";
	var heightString = "<! hh "+threeDig(height) + " >";
	var breakTag = "<br>&nbsp";
	for (var i = 1; i <= height-2; i++) breakTag+= "<br>&nbsp";
	var preTag = widthString + heightString +"<! rr 001 ><table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr>"
//	if (root != 2) preTag += "<td nowrap><font size = -2>"+root+breakTag+"</font></td>";
//	if (root != 2) preTag += "<td nowrap><sup>"+root+breakTag+"</sup></td>";
	if (root != 2) preTag += "<td nowrap><span style='font-size: " + eq_font_size_small + "px;'>"+root+breakTag+"</span></td>";
	var sqrtTag = '<td nowrap align = center><img src = "' + eq_symb_base + '/equations/waner/SYMB/SQR.GIF" height = '+ (eq_yFactor-2)*(height-1) + ' width = 9 align = left>'
	var barTag = '<img src = "' + eq_symb_base + '/equations/waner/SYMB/FR.GIF" height = 1 width ='+Math.ceil(eq_xFactor*width)+' align = top>'
	theOutput = preTag + sqrtTag + barTag + '<br>'+ stripInfo(Expression) + '</td></tr></table>';


// <center><! ww 003 ><! hh 002 ><! rr 001 ><table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap><img src = "' + eq_symb_base + '/equations/waner/SYMB/SQR.GIF" height = 10 width = 9 align = left><img src = "' + eq_symb_base + '/equations/waner/SYMB/FR.GIF" height = 1 width =12 align = top><br> 4</td></tr></table></center>


	} // end radicals

else if (theOperation == "I")
	{
	// Integral
	// should contain 3 commas format $I(a,b,f(x),dx)
	var Expression = InString.substring(3, Length-1);
	var Sep = ","
	var intArray = parser(Expression,Sep);
// alert(intArray[0]); 
	if ( (intArray[0] != 4) && (intArray[0] != 2) ) theOutput = "Error!";
	else
		{
		var definite = true;
		if (intArray[0] ==2) definite = false; 
		if (definite) 
			{
			var lowerLimit = intArray[1];
			var upperLimit = intArray[2];
			var integrand = intArray[3];
			var dx = intArray[4];	
			}
		else
			{
			upperLimit = "";
			lowerLimit = "";
			var integrand = intArray[1];
			var dx = intArray[2];	
			}	
// alert (lowerLimit + " " + upperLimit + " " + integrand + " " + dx);
		
		var widthTop = getInfo(upperLimit).width;
		var widthBottom = getInfo(lowerLimit). width;
		if (widthTop > widthBottom) var widthMax = widthTop; 
		else var widthMax = widthBottom;
		var width = widthMax + getInfo(integrand).width + getInfo(dx).width + 1;
		var hl1 = getInfo(upperLimit).height;
		var hl2 = getInfo(lowerLimit).height;
		var htint = getInfo(integrand).height;
		var hl = (hl1 + hl2)*.5 + htint; // total height;
		var widthString = "<! ww "+threeDig(width) + " >";
		var heightString = "<! hh "+threeDig(hl) + " >";
		var cellString = "<! rr 001 >";
		var breakString = "<br>";
		for (var i = 1; i <= Math.ceil(hl-1); i++) breakString += "<br>"
		var intLen = Math.ceil(eq_yFactor*hl);
		var integralString = '<img src = "' + eq_symb_base + '/equations/waner/SYMB/IN.GIF" height = '+ intLen+ ' width =8>';
		if (definite) theOutput =  widthString + heightString + cellString + "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + integralString + "</td><td nowrap><font size = -1>" + stripInfo(upperLimit)  + breakString + stripInfo(lowerLimit) + "</font></td><td nowrap>" + stripInfo(integrand) + "</td><td nowrap>" + dx + "</td></tr></table>";

		else theOutput =  widthString + heightString + cellString + "<table class=eq_table cellpadding=0 cellspacing=0 vspace=0><tr><td nowrap>" + integralString + "</td><td nowrap>" + stripInfo(integrand) + "</td><td nowrap>" + dx + "</td></tr></table>";
// alert(theOutput);
		}
	} // integral

else if ( (theOperation == "S") || (theOperation == "E") )
	{
	var Expression = InString.substring(3, Length-1);
	var widthString = "<! ww "+threeDig(getInfo(Expression).width) + " >";
	var heightString = "<! hh 001 >";
	var rowString = "<! rr 001 >";
	theOutput = widthString + heightString + rowString + Expression;
	}

else if (theOperation == "M")
	{
	// Matrix
	// format $M(LRA; a11,a12,...a1n ; a21, ... ; ... )
	// L = left paren {, [, | or N
	// R = right paren }, ], | or N
	// A = alignment of entries: L, R, or C
	// rows seperated by semicolons
	var leftBorder = InString.substring(3,4);
	var rightBorder = InString.substring(4,5);
	var alignMode = InString.substring(5,6);
	var theTd = "<td nowrap>";
	if (alignMode == "R") theTd = "<td nowrap align = right>";
	else if (alignMode == "C") theTd = "<td nowrap align = center>";
// could just scan for the first ";" in future implementations for more flexibility
	var Expression = InString.substring(7, Length-1);
	var rowArray = parser(Expression,";");
	var numRows = rowArray[0];
	var theRow = new Array;
	matString  = "<table cellpadding = 2><tr>"
	for (var i = 1; i <= numRows;i++)
		{
		theRow[i] = parser(rowArray[i],",");
		numCols = theRow[i][0];
		for (var j = 1; j <=numCols; j++)
			{
			matString += theTd + theRow[i][j]+ "</td>";
			} // j
		matString += "</tr><tr>";
		} // i
	matString += "</tr></table>";
	// now the parens
	rowHeight = new  makeArray(numRows,0);
	rowWidth = new makeArray(numCols,0);
	rowCells = new  makeArray(numRows,0);

	for (var i = 1; i <= numRows; i++)
		{
		for (j = 1; j <= numCols; j++)
			{
			var numh = getInfo(theRow[i][j]).height;
			var numw = getInfo(theRow[i][j]).width;
//			var numc = getInfo(theRow[i][j]).cells;
			if (numh > rowHeight[i]) rowHeight[i] = numh;
			rowWidth[i] += numw;
//			if (numc > rowCells[i]) rowCells[i] = numc;
			} // j
// alert("row "+i+" width = " + rowWidth[i]);
		} // i
// alert(rowHeight[1]  + rowHeight[2]  + rowHeight[3] + numRows)
	var width = 0; var height = 0;
//	var cells = 1;
	for (i = 1; i <= numRows; i++) if (rowWidth[i] > width) width = rowWidth[i];
	for (i = 1; i <= numRows; i++) height += rowHeight[i];
//	for (i = 1; i <= numRows; i++) if (rowCells[i] > cells) cells = rowCells[i];
	// adjustments and borders
	var leftGif = ""; var rightGif = "";
	height += Math.round(0.8*numRows);
	if (leftBorder == "[") leftGif = '"' + eq_symb_base + '/equations/waner/SYMB/LP.GIF" width = 4 ';
	else if (leftBorder == "{") leftGif = '"' + eq_symb_base + '/equations/waner/SYMB/LB.GIF" width = 6 ';
	else if (leftBorder == "|") leftGif = '"' + eq_symb_base + '/equations/waner/SYMB/V.GIF" width = 1 '
	if (rightBorder == "]") rightGif = '"' + eq_symb_base + '/equations/waner/SYMB/RP.GIF" width = 4 ';
	else if (rightBorder == "}") rightGif = '"' + eq_symb_base + '/equations/waner/SYMB/RB.GIF" width = 6 ';
	else if (rightBorder == "|") rightGif = '"' + eq_symb_base + '/equations/waner/SYMB/V.GIF" width = 1 ';
	if (leftGif != "") width += 1; if (rightGif != "") width +=1;
	width += Math.round(0.5*numCols);
	var widthString = "<! ww "+threeDig(width) + " >";
	var heightString = "<! hh "+threeDig(height) + " >";
//	var cellString = "<! rr 001 >";
	var cellString = "<! rr "+threeDig(numRows) + " >";
	var pheight = Math.ceil(eq_yFactor*(height));
	var leftPart = ""; var rightPart = "";
	if (leftGif != "") 
		{
		leftPart = '<table><tr><td nowrap><img src = ' + leftGif + ' height =' + pheight + '></td><td nowrap>';
		if (rightGif == "") rightPart = "</td></tr></table>";
		}
	if (rightGif != "") 
		{
		rightPart = '</td><td nowrap><img src = ' + rightGif + ' height =' + pheight + '></td></tr></table>';
		if (leftGif == "") leftPart = "<table><tr><td nowrap>";
		}
	theOutput = widthString + heightString + cellString + leftPart + matString + rightPart;
	} // matrix

else if ( (theOperation == "^") || (theOperation == "_") )
	{
	// Superscript and Subscript
	// requires two arguments, since it is important 
	// to know what expression is being superscripted 
	// This is a failing in the MS equation typesetting
	// I suppose we can add an optional parameter to 
	// adjust the height, like +2 or -3
	//   **** Format *********
	// $^(expr1,expr2; #)
	// $(expr1,expr2)
	// note the semicolon
	// where the last argument is optional
// alert ("here");
	var superscript = false; var subScript = false;
	if (theOperation == "^") superscript = true; else subScript = true;
	var Argument = InString.substring(3, Length-1);
	var theData = parser(Argument,";");
	var increment = 0; 	// default height of superscript
	// first decode
	var delta = 0;
	if (theData[0] == 2) delta = eval(replaceSubstring(theData[2],"","-")); // decode the 
	if ( (delta >0) || (delta <0) ) increment += delta;
	argList = parser(theData[1],",");
	if  (argList[0] != 2) theOutput = "Error!";
	else
	// ok to process
		{
		var simple = false;	// simple superscript no bottom
		if (!getInfo(theData[1]).table)  simple = true;
		if (simple) 
		// just enclose in tags and adjust the heght by adding 0.25*increment
			{
			var base = argList[1];
			var exponent = argList[2];
// alert(width);
			// height calculation
			var baseHeight = getInfo(base).height; 
			var expHeight = getInfo(exponent).height;
			var height = Math.round(baseHeight +0.5*(expHeight+increment));
			var displacement = baseHeight + Math.round(increment);
			var width = getInfo(base).width + Math.round(0.6*getInfo(exponent).width);
			var widthString = "<! ww "+threeDig(width) + " >";
			var heightString = "<! hh "+threeDig(height) + " >";
			var leftString = ""; var rightString = "";
			var leftTag = "<sup>"; if (subScript) leftTag = "<sub>";
			var rightTag = "</sup>"; if (subScript) rightTag = "</sub>";
//			var leftTag = "<sup><span style=\"font-size: " + eq_font_size_small + "px;\">"; if (subScript) leftTag = "<sub><span style=\"font-size: " + eq_font_size_small + "px;\">";
//			var rightTag = "</span></sup>"; if (subScript) rightTag = "</span></sub>";
// alert(height);
			for (var i = 1; i <= displacement; i++) 
				{leftString += leftTag; rightString += rightTag}
			
			theOutput = widthString + heightString + "<! rr 001 >"+ stripInfo(base) + leftString + stripInfo (exponent)  + rightString;
			} // simple
		else
		// complicated, use height of first argument and line breaks as in integral
		// everything must be tables now....
			{
//
			var base = argList[1];
			var exponent = argList[2]; 	
			var baseHeight = getInfo(argList[1]).height;
//alert(baseHeight);
			// height calculation ????
			var height = Math.round(baseHeight + 0.5*(getInfo(exponent).height+increment));
// alert (height);
			var width = getInfo(base).width + Math.round(0.6*getInfo(exponent).width);
			var widthString = "<! ww "+threeDig(width) + " >";
			var heightString = "<! hh "+threeDig(height) + " >";
			var leftTag = "";
// alert(increment + 0.5*baseHeight);
			if (superscript) for (var i = 0; i <= increment + 0.5*baseHeight; i++) leftTag+= "<br>&nbsp";
			else for (var i = 0; i <= increment + 0.5*baseHeight; i++) leftTag+= "&nbsp<br>";
			if (superscript) var rightString = exponent + leftTag; else var rightString = leftTag + stripInfo(exponent);
			theOutput = widthString + heightString + "<! rr 001 ><table><tr><td nowrap>"  + stripInfo(base) + "</td><td nowrap>" + rightString + "</td></tr></table>";
			} // complicated
		}
	
	} // superscript and subScript


return(theOutput);

} // process
