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
                    temp.push({txt: nameList[i], val: nameList[i]});
                    projectArr.set(name, temp);
                }
            }
            setSelectOption('project', projectArr.get(name), '-All-');
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
            if (response.code == 200) {
                for (var i = 0; i < response.message.length; i++) {
                    temp.push({txt: response.message[i]['name'], val: response.message[i]['name']});
                }
                moduleArr.set(name, temp);
            }
            setSelectOption('module', moduleArr.get(name), '-All-');
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
moduleArr.set('公共用例', {txt: 'public', val: 'public'});
moduleArr.set('普通用例', [{}]);
var projectArr = new Map();
projectArr.set('public', [{txt: '公共用例', val: '公共用例'}]);
projectArr.set('普通用例', [{}]);

function setProjectAndModule(type) {
    getProjectName(type);
    getModuleName(type);
}

function submitAddForm() {
    $("#new_test_case").validate({
        rules: {
            project: {
                required: true
            },
            module: {
                required: true
            }
        },
        messages: {
            project: {
                required: '请选择项目'
            },
            module: {
                required: '请选择模块'
            },
            name: {
                required: '请输入用例名称'
            },
            steps: {
                required: '请输入用例步骤'
            },
            description: {
                required: '请输入用例描述'
            }
        },
    });
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
        addBody(steps[i], i, options, 0);
    }
}

function keywordOption() {
// 新增测试用例关键字选项
    var options = [];

    $.ajax(
        {
            url: "/test_keywords_options.json",
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                options = data.rows;
            },
            error: function () {
                window.alert('请求出错');
            },
        });
    return options;
}

function addBody(content, order, options, isInsert) {
    // 新建用例时，创建新建用例页面下方的表格
    // insert为1表示插入
    // order顺序
    // options 数组格式，从数据库获取['', '']
    // content 新建用例页面中填写的用例内容
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
    select.setAttribute("style", "width: 100%;");
    select.setAttribute("onchange", "if(this.value != '') changeValue(this,'" + order + "');");
    tdvalue.appendChild(select);
    tdvalue.setAttribute("onchange", "change(this,'" + order + "');");
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
    // 创建select--option下拉框， 当提供defaultOption时，默认选中该项
    var select = document.createElement('select');
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        if (options[i] == defaultOption) {
            option.setAttribute("selected", "selected");
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
        } else if (methodSelect.length == 1 && methodSelect[0].innerText == '') {
            method.removeChild(methodSelect[0]);
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
        } // todo: 这里可以增强
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
    // console.log('-->'+obj.textContent+'--<');
    var content = document.getElementById('td_content_' + order);
    var keyword = document.getElementById('td_keyword_' + order);
    var paras = document.getElementsByClassName("td_para_" + order);
    var newvalue = keyword.options[keyword.selectedIndex].value;
    var methodSelect = paras[0].getElementsByClassName('method');  //页面中参数1单元格
    var method;
    if (methodSelect.length == 1 && methodSelect[0].innerText != '') {  // 后面的判断防止公共方法为空的情况，导致出错
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

// 编辑表单
function get_edit_info(active_id) {
    if (!active_id) {
        window.alert('Error！');
        return false;
    }
    $.ajax(
        {
            url: "/test_case.json",
            data: {"id": active_id, "type": "test_case"},
            type: "GET",
            dataType: "json",
            success: function (data) {
                var data_obj = data.rows;
                // 赋值
                $("#id").val(active_id);
                $("#name").val(data_obj.name);
                $("#steps").val(data_obj.steps);
                $("#description").val(data_obj.description);
                $("#type").val(data_obj.isPublic);
                var isPublic = data_obj.isPublic;
                if (isPublic == 1) {
                    $("#type").val('公共用例');
                    // setModule('公共用例');
                } else {
                    $("#type").val('普通用例');
                    // setModule('普通用例');
                }
                // $("#project").val(data_obj.project);
                // $("#module").val(data_obj.module);
            },
            error: function () {
                window.alert('请求出错');
            },
        });
    return false;
}

function setModule(type) {
    setSelectOption('module', moduleArr.get(type), '-All-');
    setSelectOption('project', projectArr.get(type), '-All-');
}