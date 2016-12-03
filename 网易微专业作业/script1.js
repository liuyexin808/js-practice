"use strict"

function $(el) {
	return document.querySelector(el);
}

function $$(el) {
	return document.querySelectorAll(el);
}


function setCookie(name, value, Day) {
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+Day);
    document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
}
 
function getCookie(name){
    var arr=document.cookie.split('; ');
    for(var i=0;i<arr.length;i++){
        var arr2=arr[i].split('=');
        if(arr2[0]==name)
        {  
            var getC = decodeURIComponent(arr2[1]);
            return getC;
        }
    }
    return '';
}
 
function removeCookie(name){
    setCookie(name, '1', -1);
}

function serialize(data){
    var name,value,pair=[];
    if(!data) return "";
    for(var name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === "function") continue;
        value = data[name].toString();
        value = encodeURIComponent(value);
        name = encodeURIComponent(name);
        pair.push(name + "=" + value);
    }
    return pair.join("&");
}

function getAjax(url,data,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                callback(xhr.responseText);
            } else {
                console.log("request failed " + xhr.status);
                if(xhr.status == 0) {
                    getAjax(url,data,callback);
                }
            }
        }
    };
    xhr.open("get",url + "?" +serialize(data),true);
    xhr.send(null);
}




function closeTip() {
	var oTip = $(".tip"),
		oTc = $(".tip-close");
	if(getCookie("tip")){
		oTip.style.display = "none";
	} else{
		oTc.addEventListener("click",function(){
			oTip.style.display = "none";
			setCookie("tip",true,1);
		})
	}
}


function login() {
    var oBox = $(".f-nav .modal"),oClose = $(".close"),oConfirm = $(".confirm"),
        oCancel = $(".cancel"),oBtn = $("#attention"),oNum = $(".num"),
        user = $(".username"),word = $(".password");

    function followSuccess() {
        oBtn.disabled = true;
        oCancel.style.display = "inline";
        oBtn.className = "nofocus-btn";
        oBtn.innerHTML = "√  已关注";
        oNum.innerHTML = "粉丝46"; 
    };
    function followCancel() {
        removeCookie("loginSuc");
        removeCookie("followSuc");
        oCancel.style.display = "none";
        oBtn.disabled = false;
        oBtn.className = "focus-btn";
        oBtn.innerHTML = "+  关注";
        oNum.innerHTML = "粉丝45"; 
    };

    if(!getCookie("loginSuc")) {
        oBtn.onclick = function(){
            user.value = "";
            word.value = ""
            oBox.style.display = "block";
        }
    } else {
        followSuccess();
    }

    oConfirm.onclick = function(){
        var uVal = hex_md5(user.value),
            pVal = hex_md5(word.value),
            data = {userName:uVal, password:pVal};
        getAjax("http://study.163.com/webDev/login.htm",data,function(text1){
            if(text1 == 1) {
                setCookie("loginSuc",1,1);
                oBox.style.display = "none";
                getAjax("http://study.163.com/webDev/attention.htm","",function(text2){
                    if(text2 == 1) {setCookie("followSuc",1,1);followSuccess();}
                })
            } else {
                alert("账号密码输入错误");
            } 
        })
    };
    oCancel.onclick = function() {
        followCancel();
    };
    oClose.onclick = function() {
        oBox.style.display = "none";
    }
}


function carousel() {
    var oSlider = $("#s-slide"),
        oImg = $("#s-slide img"),
        srcData=["http://open.163.com/","http://study.163.com/","http://www.icourse163.org/"],
        imgData=["images/banner1.jpg","images/banner2.jpg","images/banner3.jpg"],
        oBtn = [].slice.apply($$(".s-control")),
        oIndex = -1,timer = null;
    function slide(index){
        oImg.className = "fadeout"
        oSlider.href = srcData[index];
        oImg.src = imgData[index];
        oBtn.forEach(function(item){
            item.style.background = "#fff";
        })
        oIndex = index;
        setTimeout(function(){
            oImg.className = "fadein"
            oBtn[index].style.background = "#000";
        },50)
    }

    function autoSlide() {
       timer = setInterval(function(){
        oIndex = (oIndex+1) % 3;
        slide(oIndex);
       },5000)
    }
    oBtn.forEach(function(item,index){
        item.onclick = function(){slide(index)};
    });
    oSlider.onmouseover = function(){clearInterval(timer)}
    oSlider.onmouseout = function(){autoSlide()}
    autoSlide();
    slide(0);
}

 
var options = {
    program:{
        pageNo:2,
        psize:20,
        type:20,
    },
    product:{
        pageNo:1,
        psize:20,
        type:10,
    }
}


function getContent(options,name) {
    var oid = $("."+name);
    getAjax("http://study.163.com/webDev/couresByCategory.htm",options[name],function(text){
        var data = JSON.parse(text),template = "",
            data = data.list;
        data.forEach(function(item){
            var oImg = "<img src="+item.middlePhotoUrl+">";
            template +="<div class='item'>"+oImg+"<p class='i-name'>"+item.name+"</p><p class='i-provider'>"+item.provider
            +"</p><p class='i-count'>"+item.learnerCount+"</p><p class='i-price'>￥"+item.price+"</p><a>" + oImg +"<p class='name'>"+item.name+"</p>"
            +"<p class='count'>"+item.learnerCount+"人在学</p>"+"<p class='provider'>发布者:" + item.provider+"</p>"+"<p class='category'>分类:无</p>"+
            "<p class='description'>"+item.description +"</p></a></div>" 
        })
        oid.innerHTML = template;
    })
}

function getList(){
    getAjax("http://study.163.com/webDev/hotcouresByCategory.htm","",function(text){
        var data = JSON.parse(text),template="";
        data.forEach(function(item){
            template += "<a class='l-item'><img src=" + item.smallPhotoUrl +
            "><p class='l-name'>" + item.name + "</p><p class='l-count'>"+item.learnerCount+"</p></a>";
        })
        $(".l-wrap").innerHTML = template; 
    })
}

function rollList() {
    var oWrap = $(".l-wrap"),timer = null,oTop = 0;
    timer = setInterval(function(){
        if(oTop == -700) oTop = 70;
        oTop += -70;
        oWrap.style.top = oTop +"px";
    },5000)
}

function videoHandler() {
    var btn = $("#vd-btn"),
        close = $("#vd-close"),  
        wrap = $(".video .modal"),
        video = $("video");
    btn.onclick = function() {
        wrap.style.display = "block";
    };
    close.onclick= function() {
        wrap.style.display = "none";
        video.pause();
    }
}

function courseHandler() {
     var bPct = $("#product"),
        oPct = $(".product"),
        bPgm = $("#program"),
        oPgm = $(".program");
    $(".program").style.display ="none";
    bPct.onclick = function(){
        oPct.style.display = "block";
        oPgm.style.display = "none";
        this.className += " active";
        this.disabled = true;
        bPgm.className = "btn";
        bPgm.disabled = false;
    }
    bPgm.onclick = function(){
        oPgm.style.display ="block";
        oPct.style.display = "none";
        this.className += " active";
        this.disabled = true;
        bPct.className = "btn";
        bPct.disabled = false;
    }
}


function init() {
    closeTip();
    login();
    carousel();
    getContent(options,"product");
    getContent(options,"program");
    courseHandler()
    videoHandler();
    getList();
    rollList();
}

init();


