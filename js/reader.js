$(document).ready(function(){
	CheckCookies();
});

$(window).resize(function(){
	resize();
	scroll();
});

$(document).scroll(function(){
	scroll();
});

$(window).on('load', function(event) {
	load();
});

var VerNum = 0;
var VerHeights = [];
var WinHeight = 0;
var WinWidth = 0;
var VerWidth = 0;
var ScrollTop = 0;
var VerScrollTop = [];
var TopBarWidth = 0;
var MenuClose = false;
var Today = new Date();
var Yesterday = new Date();
var CurrVer = [];
var VerNum = 0;
var ColorValue = "";
var FinalColor = "";
var ZoomP = 0;
var Dark = 0;
var Titles = ["Home"];
var LoadConditions = 0;

const DefaultColorValue = "#009688";
const DefaultDarkValue = 0;
const DefaultZoomValue = 100;
const DarkColorValue = "#607D8B";
const StandardCurve = [0.4, 0.0, 0.2, 1];
const ScrollSpeed = 7;
const PlxSpeed = 50;
const Colors = [DefaultColorValue, "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#4CAF50", "#1B5E20", "#827717", "#FF8F00", "#FF5722", "#795548", DarkColorValue];
const MinLoadTime = 300;

const PlxSpeedF = (1-PlxSpeed/100);

function ready(){

	setTimeout(function(){
		load();
	}, MinLoadTime);

	$("body").css('overflow-y', 'hidden');

	$('.modal-trigger').leanModal();
	$(".bar-button").addClass('waves-effect waves-light');
	
	$(".page").each(function(index, el){
		$(this).html("<h1>LOREM IPUSM</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<p>");
	});
	$(".ver").each(function(index, el) {
		VerNum++;
		GetTitle = $(this).find('> .news-head > h1').text();
		if (index >= 1) {
			if (GetTitle != null && GetTitle != "") {
				Titles[index] = GetTitle;
			}
			else{
				Titles[index] = "Article " + parseInt(index);
			}
		}
	});

	$(".news-head").append("<div class='date'></div>");

	for (var i = 0; i <= (Colors.length - 1); i++){
		$(".color-buttons").append("<div class='color-button modal-close' color-value='" + Colors[i] + "'></div>");
	}

	$(".color-button").each(function(){

		var color_value = $(this).attr('color-value');
		if (color_value != "" && color_value != null) {
			$(this).css('background-color', color_value);
		}
	});

	$(".plx").each(function(index, el) {
		$(this).css("background-image", "url('img/" + $(this).attr('plx-img') + "')");
	});

	Yesterday.setDate(Today.getDate() - 1);
	$(".currDate").html(NDate(Today));
	$(".date").html(NDate(Yesterday));

	Zoom("none");

	if (Dark == 0) {
		ChangeTheme("Light");
		ChangeColor(ColorValue);
	}
	else {
		ChangeTheme("Dark");
		ChangeColor("Dark");
	}

	if (isMobile) {
		SwitchMenu();
	}

	events();
}

function resize(){
	VerHeights = [];
	VerScrollTop = [];
	WinHeight = $(window).innerHeight();
	WinWidth = $(window).innerWidth();
	VerWidth = $(".ver").innerWidth();
	TopBarWidth = 0;
	BottomBarWidth = 0;
	$(".ver").css('min-height', WinHeight);
	$(".ver").each(function(index, el) {
		VerHeights.push($(this).innerHeight());		
	});
	$(".ver").each(function(index, el) {
		VerScrollTop.push(AddArray(VerHeights, index - 1) + (index)*(VerWidth - WinHeight));
	});
	$(".hor").css('height', AddArray(VerHeights, VerHeights.length - 1) - (VerHeights.length - 1)*(WinHeight - VerWidth) + 1);
	$(".plx").css('height', (VerWidth/16)*6.75 + 'px');
	$(".home-content").css('top', (WinHeight - $(".home-content").innerHeight())/2);
}

function scroll(){
	ScrollTop = $(document).scrollTop();
	$(".ver").each(function(index, el) {
		var ScrollBefore1 = AddArray(VerHeights, index - 1) + (index)*(VerWidth - WinHeight);
		var ScrollBefore2 = AddArray(VerHeights, index) + (index)*(VerWidth - WinHeight) - WinHeight;
		if (ScrollTop < ScrollBefore1) {
			$(this).css({
				'top': '0',
				'right': (ScrollTop - ScrollBefore1),
				'box-shadow': '-2px 0 5px 0 rgba(0,0,0,0.16),-2px 0 10px 0 rgba(0,0,0,0.12)',
			});
			CurrVer[index] = 0;
		}
		else if(ScrollTop > ScrollBefore2){
			$(this).css({
				'top': - (VerHeights[index] - WinHeight),
				'right': '0',
				'box-shadow': '-2px 0 5px 0 rgba(0,0,0,0),-2px 0 10px 0 rgba(0,0,0,0)',
			});
			CurrVer[index] = 1;
		}
		else{
			$(this).css({
				'top': - (ScrollTop - ScrollBefore1),
				'right': '0',
				'box-shadow': '-2px 0 5px 0 rgba(0,0,0,0),-2px 0 10px 0 rgba(0,0,0,0)',
			});
			CurrVer[index] = 1;
		}
	});
	$(".plx").each(function(){
		$(this).css('background-position', 'center ' + Math.abs(ScrollTop - $(this).offset().top) * PlxSpeedF + 'px');
	});
	for (var i = CurrVer.length - 1; i >= 0; i--) {
		if(CurrVer[i] == 1){
			$(".title").html(Titles[i]);
			VerNum = i;
			break;
		}
	}
	BarButtonDisable($(".home"), (VerNum == 0));
	BarButtonDisable($(".prev"), (VerNum == 0));
	BarButtonDisable($(".next"), (VerNum == CurrVer.length - 1));
}

function events(){
	load();

	$(".home").click(function() {
		if (VerNum != 0) {
			ScrollToVer(0);
		}
	});

	$(".theme").click(function() {
		if (Dark == 1){
			ChangeTheme("Light");
			ChangeColor(ColorValue);
		}		
		else{
			ChangeTheme("Dark");
			ChangeColor("Dark");
		}
	});

	$(".menu").click(function() {
		SwitchMenu();
	});

	$(".ZoomOut").click(function() {
		Zoom("out");
	});

	$(".ZoomIn").click(function() {
		Zoom("in");
	});

	$(".FullScreen").click(function(event) {
		SwitchFullScreen();
	});

	$(".prev").click(function(event) {
		ChangePage("prev");
	});

	$(".next").click(function(event) {
		ChangePage("next");
	});

	$(".color-button").click(function(event) {
		ChangeColor($(this).attr('color-value'));
	});

	$(".color-reset").click(function(event) {
		ChangeColor(DefaultColorValue);
	});

	$(window).keydown(function(event) {
		switch(event.keyCode){
			case (37):
				ChangePage("prev");
				break;
			case(39):
				ChangePage("next");
				break;
		}
	});
}

function load(){
	LoadConditions++;

	if (LoadConditions == 3) {
		$(".load-page").fadeOut();
		$("body").css('overflow-y', 'auto');
	}
}

function ScrollToVer(index){
	var Return = 0;
	Return = VerScrollTop[index] + 1;

	$("html, body").animate({scrollTop: Return}, (Math.abs(Return - $(document).scrollTop()) / ScrollSpeed), $.bez(StandardCurve));

	return Return;
}

function SwitchMenu(){
	if (MenuClose) {
		$(".ver").css('width', 'calc(100% - 13em)');	
		MenuClose = false;
	}
	else{
		$(".ver").css('width', 'calc(100% - 0em)');		
		MenuClose = true;
	}
	setTimeout(function(){
		resize();
		scroll();
		resize();
		scroll();
	},300)
}

function Zoom(type) {
	if (type == "out" && ZoomP > 50){
		ZoomP = parseInt(ZoomP) - parseInt(25);
	}
	if (type == "in" && ZoomP < 200) {
		ZoomP = parseInt(ZoomP) + parseInt(25);
	}

	$("body").css('font-size', ZoomP + "%");

	$(".ZoomText").html(ZoomP + "%");

	BarButtonDisable($(".ZoomIn"), (ZoomP == 200));
	BarButtonDisable($(".ZoomOut"), (ZoomP == 50));

	CreateCookie("ZoomP", ZoomP);

	setTimeout(function(){
		resize();
		scroll();
		resize();
		scroll();
	},300);
}

function BarButtonDisable(el, condition){
	if (condition == true || condition == null) {
		el.addClass('bar-button-disabled');
		el.removeClass('waves-effect');
	}
	else{
		el.removeClass('bar-button-disabled');
		el.addClass('waves-effect');
	}
}

function SwitchFullScreen() {
  elem = document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    $(".FullScreen i").html("fullscreen_exit");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    $(".FullScreen i").html("fullscreen");
  }
}

function NDate(d){
	var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var Months = ["January", "February", "March", "April", "May", "June", "July",  "August", "September", "October", "November", "December"];
	return Days[d.getDay()] + ", " + Months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function ChangePage(type){
	if (type == "prev" && VerNum > 0) {
		ScrollToVer(VerNum - 1);
	}
	if (type == "next" && VerNum < CurrVer.length - 1) {
		ScrollToVer(VerNum + 1);
	}
}

function ChangeTheme(name){
	if (name == "Dark"){
		Dark = 1;

		$("body").css('color', 'white');
		$("p, .date").css('color', 'rgba(255,255,255,0.85)');
		$(".sidebar").css('background-color', 'black');
		$(".ver").css('background-color', '#303030');
		$(".news-head").css({
			'background-color': '#424242',
			'border-color': 'rgba(255,255,255,0.25)',
		});
		$("hr").css('background-color', 'rgba(255,255,255,0.2)');

		BarButtonDisable($(".color-pop-button"), true);
	}
	else if(name == "Light"){
		Dark = 0;

		$("body").css('color', 'black');
		$("p, .date").css('color', 'rgba(0,0,0,0.85)');
		$(".sidebar").css('background-color', '#e0e0e0');
		$(".ver").css('background-color', '#fafafa');
		$(".news-head").css({
			'background-color': 'white',
			'border-color': 'rgba(0,0,0,0.25)',
		});
		$("hr").css('background-color', 'rgba(0,0,0,0.2)');

		BarButtonDisable($(".color-pop-button"), false);
	}

	CreateCookie("Dark", Dark);
}

function ChangeColor(ToValue){
	if (ToValue == "" || ToValue == null){
		FinalColor = ColorValue;
	}
	else if (ToValue == "Dark"){
		FinalColor = DarkColorValue;
	}
	else{ 
		ColorValue = ToValue;
		FinalColor = ToValue;
		CreateCookie("ColorValue", ColorValue);
	}	

	$(".color-button[color-value='" + ColorValue + "']").html("<div class='color-tick'><i class='material-icons left'>check</i></div>").attr('color-this', 'true');
	$(".color-button").not($(".color-button[color-value='" + ColorValue + "']")).html("").attr('color-this', 'false');

	$(".sidebar .bar-button i, .sidebar .bar-text").css('color', FinalColor);
	$(".topbar, .bottombar").css('background-color', FinalColor);
	$(".loader-spinner-color").css('border-color', FinalColor);
	$("meta[name='theme-color']").attr('content', FinalColor);
}

var CreateCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + "; path=/";
}

function GetCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function CheckCookies(){
	if (GetCookie("ZoomP") != ""  && GetCookie("ZoomP") != null && GetCookie("ZoomP") != 0 && GetCookie("ZoomP") <= 200 && GetCookie("ZoomP") >= 50) {
		ZoomP = GetCookie("ZoomP");
	}
	else{
		ZoomP = DefaultZoomValue;
	}


	if (GetCookie("Dark") != ""  && GetCookie("Dark") != null) {
		Dark = GetCookie("Dark");
	}
	else{
		Dark = DefaultDarkValue;
	}

	if (GetCookie("ColorValue") != ""  && GetCookie("ColorValue") != null) {
		ColorValue = GetCookie("ColorValue");
	}
	else{
		ColorValue = DefaultColorValue;
	}


	setTimeout(function () {
		CookiesRead();
	}, 100);
}

function AddArray(Array, TillIndex){
	var ArraySize = Array.length - 1;
	var Return = 0;

	if (ArraySize <= TillIndex) {
		TillIndex = ArraySize;
	}

	if (TillIndex >= 0) {
		for (var i = 0; i <= TillIndex; i++) {
			Return += Array[i];
		}
	}
	
	return Return;
}

function CookiesRead() {
	ready();
	resize();
	scroll();
	resize();
}











var isMobile = false;
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;