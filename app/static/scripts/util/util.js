//检查下拉框选中id
function get_multiple_select_value(objSelectId) {
    var objSelect = document.getElementById(objSelectId);
    var length = objSelect.options.length;
    var value = '';
    for (var i = 0; i < length; i++) {
        if (objSelect.options[i].selected == true) {
            if (value == '') {
                value = objSelect.options[i].value;
            } else {
                value = value + ',' + objSelect.options[i].value;
            }

        }
    }
    return value;
}

function selectOnchang(obj) {
//获取被选中的option标签选项
    var value = obj.options[obj.selectedIndex].value;
}


function setIframeHeight(iframe) {
    if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
            iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
    }
}

window.onload = function () {
    setIframeHeight(document.getElementById('external-frame'));
};