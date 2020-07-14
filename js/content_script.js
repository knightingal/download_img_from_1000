function doTask() {
    Task.init();
    var pageInfo = Task.getPageInfo();
    browser.runtime.sendMessage(
        pageInfo.toJSONString(),
        function(response) {
            if (response == "checkError") {
                doTask();
            }
            else if (Task.isLastPage()) {
                window.location.href = Task.getNextUrl();
            }
            else {
                browser.runtime.sendMessage("stop", function(response) {});
            }
        }
    );
}

var Task = {
    "fontElementArray": [],
    "pElementArray": [],
    "init": function() {
        this.fontElementArray = [];
        this.pElementArray = [];


        this.fontElementArray = document.getElementsByTagName("font");
        this.nextTitle = document.getElementsByClassName("fenxianga")[0]
            .getElementsByTagName("a")[0];
        console.log(this.fontElementArray);
        var bigImgDiv = document.getElementsByClassName('big_img')[0];
        this.imgElementArray = bigImgDiv.getElementsByTagName("img");
        console.log(this.imgElementArray);
    },
    "getCurrentTitle": function() {
        return this.getTitleShort(
                new String(document.title)
        );
    },
    "getNextTitle": function() {
        return this.getTitleShort(new String(this.nextTitle.innerHTML));
    },
    "getNextUrl": function() {
        var nextUrl = this.nextTitle.href;
        return nextUrl;
    },
    "getTitleShort": function(titleString) {
        return new String(titleString.slice(0, -4));
    },
    "getPageInfo": function() {
        var imgSrcArray = [];
        var pageInfoObj = {};
        for (var i = 0; i < this.imgElementArray.length; i++) {
            console.log("scan to " + this.imgElementArray[i].src);
            imgSrcArray.push({src:this.imgElementArray[i].src, ref:document.URL});
        }
        pageInfoObj.imgSrcArray = imgSrcArray;
        pageInfoObj.title = this.getCurrentTitle();
        return pageInfoObj;
    },
    "isLastPage": function() {
        var nextTitle = this.getNextTitle();
        var currentTitle = this.getCurrentTitle();
        return nextTitle.localeCompare(currentTitle) == 0;
    }
    // ,
    // "doTask": function() {
    //     var getInfo = this.getPageInfo();
    //     console.log(getInfo);
    //     self.port.emit("sendPageInfo", getInfo);
    //     if (this.isLastPage() == 0) {
    //         self.port.emit("goToNextPage", this.getNextUrl());
    //     }
    //     else {
    //         self.port.emit("stopAndSendPageInfosToServer");
    //     }
    // }
}

console.log("enter content_script.js");
function checkIsAutoRun(autoRunCallback) {
    browser.runtime.sendMessage("checkIsAutoRun", function(response) {
        var isAutoRun = response;
        if (isAutoRun === true) {
            autoRunCallback();
        }
    });
}

checkIsAutoRun(doTask);

function getTitleShort(titleString) {
    return new String(titleString.slice(0, -4));
}
