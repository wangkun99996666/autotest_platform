function getProjectName(name) {
    // 给测试用例--新增测试用例用, name是选择的option的值
    var temp = [];
    $.ajax({
        type: "POST",
        url: "/search_project_name",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({}),
        success: function (response) {
            if (response.projectName.indexOf(", ") == -1) {
                projectArr.set(name, [{txt: response.projectName, val: response.projectName}])
            } else {
                var nameList = response.projectName.split(", ");
                for (var i = 0; i < nameList.length; i++) {
                    // projectArr.set('普通用例', [{txt: nameList[i], val: nameList[i]}]);
                    temp.push({txt: nameList[i], val: nameList[i]});
                    projectArr.set(name, temp);
                }
            }
            setSelectOption('project', projectArr.get(name), '-请选择-');
        }
    });
}

function getModuleName(name) {
    // 给测试用例--新增测试用例用, name是选择的option的值
    var temp = [];
    $.ajax({
        type: "POST",
        url: "/search_module_name",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({}),
        success: function (response) {
            if (response.code == 200){
                for (var i = 0; i < response.message.length; i++) {
                    temp.push({txt: response.message[i]['name'], val: typeof(response.message[i]['name'])});
                }
                moduleArr.set(name, temp);
            }
            setSelectOption('module', moduleArr.get(name), '-请选择-');
        }
    });

}

/*
* @param {String || Object]} selectObj 目标下拉选框的名称或对象，必须
* @param {Array} optionList 选项值设置 格式：[{txt:'北京', val:'010'}, {txt:'上海', val:'020'}] ，必须
* @param {String} firstOption 第一个选项值，如：“请选择”，可选，值为空
* @param {String} selected 默认选中值，可选
*/
function setSelectOption(selectObj, optionList, firstOption, selected) {
    if (typeof selectObj != 'object') {
        selectObj = document.getElementById(selectObj);
    }
    // 清空选项
    removeOptions(selectObj);
    // 选项计数
    var start = 0;
    // 如果需要添加第一个选项
    if (firstOption) {
        selectObj.options[0] = new Option(firstOption, '');
        // 选项计数从 1 开始
        start++;
    }
    var len = optionList.length;
    for (var i = 0; i < len; i++) {
        // 设置 option
        selectObj.options[start] = new Option(optionList[i].txt, optionList[i].val);
        // 选中项
        if (selected == optionList[i].val) {
            selectObj.options[start].selected = true;
        }
        // 计数加 1
        start++;
    }
}

function removeOptions(selectObj) {
    if (typeof selectObj != 'object') {
        selectObj = document.getElementById(selectObj);
    }
    // 原有选项计数
    var len = selectObj.options.length;
    for (var i = 0; i < len; i++) {
        // 移除当前选项
        selectObj.options[0] = null;
    }
}

//添加测试用例时使用
var moduleArr = new Map();
moduleArr.set('公共用例',{txt: 'public', val: 'public'});
moduleArr.set('普通用例', [{}]);
var projectArr = new Map();
projectArr.set('public', [{txt: '公共用例', val: '公共用例'}]);
projectArr.set('普通用例', [{}]);

function setProjectAndModule(type) {
    getProjectName(type);
    getModuleName(type);
}

function submitAddForm() {
    $("#new_test_case").validate();
    $.validator.setDefaults({
        submitHandler: function () {
            document.getElementById("new_test_case").submit();
        }
    });
}

function openEditStepWindow() {

    document.getElementById('editStep').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
    var options = keywordOption();

    var content = $("#steps").val();
    if (content == '') {
        content = 'Chrome';
    }
    $("#step").val();
    $("#step").val(content);
    var steps = content.split(',');
    var steprows = steps.length;

    for (var i = 0; i < steprows; i++) {
        addBody(steps[i], i + 1, options, 0);
    }
}

function keywordOption() {

    var options = [];

    $.ajax(
        {
            url: "/test_keywords_options.json",
            type: "get",
            dataType: "json",
            async: false,
            beforeSend: function () {
                return true;
            },
            success: function (data) {
                options = data.rows;

            },
            error: function () {
                window.alert('请求出错');
            },
            complete: function () {
            }
        });
    return options;
}

function addBody(content, order, options, isInsert) {

    var tbody = document.getElementsByTagName('tbody')[0];
    var tr = '';
    if (isInsert == 1) {
        var table = document.getElementById('stepsTable');
        tr = table.insertRow(order);
        var ran = Math.floor(Math.random() * (100 - 10 + 1) + 10);
        order = 'new_' + order + ran;
    } else {
        tr = document.createElement('tr');
    }

    var words = content.split('|');
    var tdoperate = document.createElement('td');
    var addBtn = document.createElement('a');
    var delBtn = document.createElement('a');
    var copyBtn = document.createElement('a');

    addBtn.setAttribute("onclick", "addRow(this);");
    addBtn.setAttribute("class", "btn");
    var addIcon = document.createElement('i');
    addIcon.setAttribute("class", "fa fa-plus");
    addBtn.appendChild(addIcon);

    delBtn.setAttribute("onclick", "delRow(this);");
    delBtn.setAttribute("class", "btn");
    var delIcon = document.createElement('i');
    delIcon.setAttribute("class", "fa fa-minus");
    delBtn.appendChild(delIcon);

    copyBtn.setAttribute("onclick", "copyRow(this,'" + order + "');");
    copyBtn.setAttribute("class", "btn");
    var copyIcon = document.createElement('i');
    copyIcon.setAttribute("class", "fa fa-clone");
    copyBtn.appendChild(copyIcon);

    tdoperate.appendChild(addBtn);
    tdoperate.appendChild(delBtn);
    tdoperate.appendChild(copyBtn);
    tr.appendChild(tdoperate);

    var tdvalue = document.createElement('td');
    var select = selectOptions(options, words[0]);
    select.setAttribute("id", "td_keyword_" + order);
    select.setAttribute("onchange", "if(this.value != '') changeValue(this,'" + order + "');");
    tdvalue.appendChild(select);
    tdvalue.setAttribute("onchange", "change(this," + order + ");");
//    $("#td_keyword_"+order).find("option[value='"+words[0]+"']").attr("selected",true);
    tr.appendChild(tdvalue);
    if (words.length == 1) {
        for (var i = 0; i < 4; i++) {
            tdvalue = document.createElement('td');
            tdvalue.contentEditable = "true";
            tdvalue.setAttribute("class", "td_para_" + order);
            tdvalue.setAttribute("onKeyUp", "change(this,'" + order + "');");
            tdvalue.innerHTML = '';
            tr.appendChild(tdvalue);
        }
    } else {

        var steps = words[1].split('@@');
        for (var i = 0; i < 4; i++) {
            tdvalue = document.createElement('td');
            tdvalue.contentEditable = "true";
            tdvalue.setAttribute("class", "td_para_" + order);
            tdvalue.setAttribute("onKeyUp", "change(this," + order + ");");
            if (i < steps.length) {
                tdvalue.innerHTML = steps[i];
            } else {
                tdvalue.innerHTML = '';
            }
            tr.appendChild(tdvalue);
        }

    }
    tdvalue = document.createElement('td');
    tdvalue.contentEditable = "true";
    tdvalue.setAttribute("class", "td_content");
    tdvalue.setAttribute("id", "td_content_" + order);
    if (content != '') {
        tdvalue.innerHTML = content;
    } else {
        var newkeyword = document.getElementById('td_keyword_' + order);
        tdvalue.innerHTML = newkeyword.options[newkeyword.selectedIndex].value;
    }
    tr.appendChild(tdvalue);

    if (isInsert == 0) {
        tbody.appendChild(tr);
    }
    window.console.log('body is:' + tbody);

}

function selectOptions(options, defaultOption) {
    var select = document.createElement('select');
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        if (options[i] == defaultOption) {
            option.setAttribute("selected", "true");
        }
        select.appendChild(option);
    }
    return select;
}

function closeEditStepWindow() {

    var tb_step = document.getElementById('stepsTable');
    var tbodies = document.getElementsByTagName("tbody");
    tb_step.removeChild(tbodies[0]);
    var tbody = document.createElement('tbody');
    tb_step.appendChild(tbody)
    document.getElementById('editStep').style.display = 'none';
    document.getElementById('fade').style.display = 'none';

}

function SaveAndCloseEditStepWindow() {
    var stepsvalue = '';
    var contents = document.getElementsByClassName("td_content");
    for (var i = 0; i < contents.length; i++) {
        if (i != 0) {
            stepsvalue = stepsvalue + ',' + contents[i].textContent;
        } else {
            stepsvalue = stepsvalue + contents[i].textContent;
        }
    }

    $("#steps").val(stepsvalue);
    closeEditStepWindow();

}

function addRow(ojb) {
    var n = ojb.parentNode.parentNode.rowIndex + 1;
    var options = keywordOption();
    addBody('', n, options, 1);
}

function delRow(ojb) {
    var n = ojb.parentNode.parentNode.rowIndex;
    var table = document.getElementById('stepsTable');
    var tr = table.deleteRow(n);
}

function copyRow(ojb, order) {
    var n = ojb.parentNode.parentNode.rowIndex + 1;
    var content = document.getElementById('td_content_' + order).textContent;
    var options = keywordOption();
    addBody(content, n, options, 1);
}

function changeValue(obj, order) {
//setModule(obj.options[obj.selectedIndex].value);
    var keyword = obj.options[obj.selectedIndex].value;
    var method = document.getElementsByClassName('td_para_' + order)[0];
    var methodSelect;
    var select;
    if (['点击', '填写', '选择', '填写日期', '填写文件', '选择全部', '验证文字', '验证文字非', '点击索引'].indexOf(keyword) != -1) {
//    changeBy(keyword,order);
        methodSelect = method.getElementsByClassName('method');

        if (methodSelect.length == 0) {
            select = selectOptions(['id', 'name', 'class', 'xpath', 'text', 'css'], 'id');
            select.setAttribute('onchange', 'change(this,"' + order + '");');
            select.setAttribute("class", "method");
            method.textContent = '';
            method.appendChild(select);
        }

    } else if (keyword == '公共方法') {
        var publicSelect = method.getElementsByClassName('method');
        var publicFuntions = getPublicFunctions();
        if (publicSelect.length == 0) {
            select = selectOptions(publicFuntions, publicFuntions[0]);
            select.setAttribute('onchange', 'change(this,"' + order + '");');
            select.setAttribute("class", "method");
            method.textContent = '';
            method.appendChild(select);
        }
    } else {
        methodSelect = method.getElementsByClassName('method');
        if (methodSelect.length == 1) {
            method.removeChild(methodSelect[0]);
        }
    }
    change(obj, order);

}

function getPublicFunctions() {

    var cases = [];

    $.ajax(
        {
            url: "/test_public_test_cases.json",
            type: "get",
            dataType: "json",
            async: false,
            beforeSend: function () {
                return true;
            },
            success: function (data) {
                cases = data.rows;

            },
            error: function () {
                window.alert('请求出错');
            },
            complete: function () {
            }
        });
    return cases;
}

function change(obj, order) {
    console.log('-->'+obj.textContent+'--<');
    var content = document.getElementById('td_content_' + order);
    var keyword = document.getElementById('td_keyword_' + order);
    var paras = document.getElementsByClassName("td_para_" + order);
    var newvalue = keyword.options[keyword.selectedIndex].value;
    var methodSelect = paras[0].getElementsByClassName('method');
    var method ;
    if (methodSelect.length == 1) {
        method = methodSelect[0].options[methodSelect[0].selectedIndex].value;
    } else {
        method = paras[0].textContent;
    }
    if (method != '') {
        newvalue = newvalue + '|' + method;
    }

    for (var i = 1; i < paras.length; i++) {
        if (paras[i].textContent != '') {
            newvalue = newvalue + '@@' + paras[i].textContent;
        }
    }

    content.innerHTML = newvalue;
}