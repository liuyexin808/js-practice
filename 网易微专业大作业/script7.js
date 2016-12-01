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
    xhr.onReadyStateChange = function() {
        if(xhr.redayState === 4){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                callback(xhr.responseText);
            } else {
                alert("request failed " + xhr.status);
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
    var oBox = $(".modal"),
        oClose = $(".close"),
        oConfirm = $(".confirm"),
        oCancel = $(".cancel"),
        oBtn = $("#attention"),
        oNum = $(".num");

    if(!getCookie("loginSuc")) {
        oBtn.onclick = function(){
            oBox.style.display = "block";
        }
    } else {
        followSuccess();
    }

    function followSuccess() {
        oBtn.disabled = true;
        oBtn.className = "nofocus-btn";
        oBtn.innerHTML = "√  已关注";
        oCancel.style.display = "block";
        oNum.innerHTML = "粉丝46"; 
    };
    function followCancel() {
        removeCookie("loginSuc");
        removeCookie("followSuc");
        oBtn.disabled = false;
        oBtn.className = "focus-btn";
        oBtn.innerHTML = "+  关注";
        oCancel.style.display = "none";
        oNum.innerHTML = "粉丝45"; 
    };
    oConfirm.onclick = function(){
        var uVal = $('.username').value,
            pVal = $('.password').value,
            data = {userName:uVal, password:pVal};
        getAjax("http://study.163.com/webDev/login.htm",data,function(text1){
            if(text1 === 1) {
                setCookie("loginSuc",1,1);
                oBox.style.display = "none";
                getAjax("http://study.163.com/webDev/attention.htm","",function(text2){
                    if(text2 ===1) {setCookie("followSuc",1,1);loginSuccess();}
                })
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

