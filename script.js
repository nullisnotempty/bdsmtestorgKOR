var isWorking = false;

$("document").ready(function() {
    $("#enable_debug").click(function() {
        function adddebug() {
            var list = document.getElementsByClassName('question');
            for (var i = 0; i < list.length; i++) {
                document.getElementById(list[i].id).innerHTML += " (" + list[i].id + ")";
            }
        }
        chrome.tabs.executeScript({
            code: '(' + adddebug + ')();'
        });
    });
    
    chrome.tabs.executeScript({
        code: 'document.domain'
    }, function(result) {
        if (result == "bdsmtest.org") {
            $("#status").text('작동 중');
            $("#status").css("color", "green");
            
            isWorking = true;
            
            // translate
            function translate() {
                document.querySelector(".toprow p").innerHTML = "다음 질문들에 얼마나 동의하시나요?";
                
                document.querySelector(".red.balance-text").innerHTML = "확실히<br />비동의";
                document.querySelector(".yellow.balance-text").innerHTML = "중립 / 의견 없음";
                document.querySelector(".green.balance-text").innerHTML = "확실히 동의";

                var translations = {};
                
                var list = document.getElementsByClassName('question');
                for (var i = 0; i < list.length; i++) {
                    if (translations[list[i].id] != undefined) {
                        document.getElementById(list[i].id).innerHTML = translations[list[i].id];
                    }
                }
            }
            chrome.tabs.executeScript({
                code: '(' + translate + ')();'
            });
        } else {
            $("#status").text('작동 중지 (테스트 페이지가 아닙니다)');
            $("#status").css("color", "red");
        }
    });
});