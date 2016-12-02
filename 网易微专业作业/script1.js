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
        //arr2->['username', 'abc']
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
closeTip();

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
login();



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


function init() {
    var bPct = $("#product"),
        oPct = $(".product"),
        bPgm = $("#program"),
        oPgm = $(".program");


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
    getContent(options,"product");
    getContent(options,"program");
    $(".program").style.display ="none";
}
init();


