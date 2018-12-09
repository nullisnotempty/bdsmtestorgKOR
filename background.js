chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'bdsmtest.org'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.executeScript({
        code: 'document.domain'
    }, function(result) {
        if (result == "bdsmtest.org") {
            $("#status").text('작동 중');
            $("#status").css("color", "green");

            isWorking = true;

            // translate
            function translate() {
                if (document.querySelector(".toprow p").innerHTML == "To what extent do you agree with each statement?") {
                    document.querySelector(".toprow p").innerHTML = "다음 질문들에 얼마나 동의하시나요?";

                    document.querySelector(".red.balance-text").innerHTML = "확실히<br />비동의";
                    document.querySelector(".yellow.balance-text").innerHTML = "중립 / 의견 없음";
                    document.querySelector(".green.balance-text").innerHTML = "확실히 동의";

                    var r = new XMLHttpRequest();
                    r.open("GET", "https://raw.githubusercontent.com/nullisnotempty/bdsmtestorgKOR/master/translations.json", true);
                    r.onreadystatechange = function () {
                        var translations = JSON.parse(r.responseText);

                        var list = document.getElementsByClassName('question');
                        for (var i = 0; i < list.length; i++) {
                            if (translations[list[i].id] != undefined) {
                                document.getElementById(list[i].id).innerHTML = translations[list[i].id];
                            }
                        }
                    };
                    r.send();
                } else if (document.querySelector(".toprow p").innerHTML == "First some basic info") {
                    document.querySelector(".toprow p").innerHTML = "기본적인 정보를 수집합니다.";
                    
                    var labels = document.getElementsByTagName('LABEL');
                    for (var i = 0; i < labels.length; i++) {
                        if (labels[i].htmlFor != '') {
                             var elem = document.getElementById(labels[i].htmlFor);
                             if (elem)
                                elem.label = labels[i];         
                        }
                    }
                    
                    document.getElementById('prelim_20_0').label.innerHTML = '저는 간단하고prelim_16_0 짧으나 납득 가능한 정확도의 테스트를 원합니다. (당신이 적당히 관심이 있다면 추천합니다.)';
                    document.getElementById('prelim_20_1').label.innerHTML = '저는 최대의 정확도를 가진 길고 많은 질문들을 가진 테스트를 원합니다. (당신이 BDSM에 강하게 관심이 있다면 추천합니다.)';
                    
                    document.getElementById('prelim_16_0').label.innerHTML = '모든 질문을 표시합니다. (당신이 어떤 취향을 가졌는지 확실하지 않다면 추천합니다.)';
                    document.getElementById('prelim_16_1').label.innerHTML = '섭(submissives), 마조(masochists)등과 같은 대상을 겨냥한 질문을 건너뜁니다.';
                    document.getElementById('prelim_16_2').label.innerHTML = '돔(dominants), 새디(sadists)등과 같은 대상을 겨냥한 질문을 건너뜁니다.';
                } else if (document.querySelector(".toprow p").innerHTML == "Welcome to the BDSM Test!") {
                    document.querySelector(".toprow p").innerHTML = "BDSM Test에 오신 것을 환영합니다!";
                    document.querySelector(".bottomrow .balanced-text").innerHTML = "우리는 당신의 성향을 간단히 테스트 할겁니다.<br />혹시 당신의 기록을 측정할 수 있는 무료 계정을 생성하고 싶으십니까?"
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
  }
})