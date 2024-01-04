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


// function removeOptions(selectObj) {
//     if (typeof selectObj != 'object') {
//         selectObj = document.getElementById(selectObj);
//     }
//     // 原有选项计数
//     var len = selectObj.options.length;
//     for (var i = 0; i < len; i++) {
//         // 移除当前选项
//         selectObj.options[0] = null;
//     }
// }

// function getProjectName(name) {
//         // 给测试用例--新增测试用例用
//         $.ajax({
//             type: "POST",
//             url: "/search_project_name",
//             dataType: "json",
//             contentType: "application/json; charset=utf-8",
//             data: JSON.stringify({}),
//             success: function (response) {
//                 if (response.projectName.indexOf(", ") == -1) {
//                     projectArr.set('普通用例', [{txt: response.projectName, val: response.projectName}])
//                 }
//                 else {
//                     var nameList = response.projectName.split(", ");
//                     for (var i = 0; i < nameList.length; i++) {
//                         projectArr.set('普通用例', [{txt: nameList[i], val: nameList[i]}]);
//                     }
//                 }
//                 setSelectOption('project', projectArr.get(name), '-请选择-');
//             }
//         })
//     }

/*
* @param {String || Object]} selectObj 目标下拉选框的名称或对象，必须
* @param {Array} optionList 选项值设置 格式：[{txt:'北京', val:'010'}, {txt:'上海', val:'020'}] ，必须
* @param {String} firstOption 第一个选项值，如：“请选择”，可选，值为空
* @param {String} selected 默认选中值，可选
*/
// function setSelectOption(selectObj, optionList, firstOption, selected) {
//     if (typeof selectObj != 'object') {
//         selectObj = document.getElementById(selectObj);
//     }
//     // 清空选项
//     removeOptions(selectObj);
//     // 选项计数
//     var start = 0;
//     // 如果需要添加第一个选项
//     if (firstOption) {
//         selectObj.options[0] = new Option(firstOption, '');
//         // 选项计数从 1 开始
//         start++;
//     }
//     var len = optionList.length;
//     for (var i = 0; i < len; i++) {
//         // 设置 option
//         selectObj.options[start] = new Option(optionList[i].txt, optionList[i].val);
//         // 选中项
//         if (selected == optionList[i].val) {
//             selectObj.options[start].selected = true;
//         }
//         // 计数加 1
//         start++;
//     }
// }

//-----------------------------start-----------------------------------
// //添加测试用例时使用
// var moduleArr = [];
// moduleArr['公共用例'] = [{txt: 'public', val: 'public'}];
// moduleArr['普通用例'] = [{txt: '模块1', val: '模块1'}];
// var projectArr = new Map();
// projectArr.set('public', [{txt: '公共用例', val: '公共用例'}]);
// projectArr.set('普通用例', [{}]);
//
// function setProjectAndModule(type) {
//     getProjectName(type);
//     // setSelectOption('module', moduleArr[type], '-请选择-');
//
// }


//-----------------------------end-----------------------------------


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