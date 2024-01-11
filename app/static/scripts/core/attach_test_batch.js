function getDevices() {
    $.ajax(
        {
            url: "/getDevicesList.json",
            data: {},
            type: "get",
            dataType: "json",
            beforeSend: function () {
                return true;
            },
            success: function (data) {

                var ipList = data["msg"];
                $("#ipList").html("");
                var option_group = '';
                var optionInit = '<option value="">-请选择-</option>';
                for (var j = 0; j < ipList.length; j++) {
                    var selectdata = ipList[j];
                    var ip = ipList[j]["ip"];
                    var model = ipList[j]["model"];
                    var option = '<option value="' + ip + '">' + model + '</option>';
                    option_group += option;
                }
                $("#ipList").append(optionInit);
                $("#ipList").append(option_group);

            },
            error: function () {
                window.alert('请求出错');
            },
        });
}

// submit form
function submitAddForm() {
    $("#new_test_case").validate();
    $.validator.setDefaults({
        submitHandler: function () {
            document.getElementById("new_test_case").submit();
        }
    });
}

function initPage(test_suite_id) {
    var oTable = new TableInit(test_suite_id);
    oTable.Init(test_suite_id);
    get_edit_info(test_suite_id);


}


var TableInit = function (test_suite_id) {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_test_batch1').bootstrapTable({
            url: '/test_case.json',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100, 500],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'id'
            }, {
                field: 'project',
                title: '项目'
            }, {
                field: 'module',
                title: '模块'
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'steps',
                title: '步骤'
            }, {
                field: 'description',
                title: '描述'
            }
            ]
        });
    };
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            id: test_suite_id,
            module: get_multiple_select_value("module"),
            name: $('#casename1').val(),
            type: 'unattach'
        };
        return temp;
    };
    return oTableInit;
};

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


// 编辑表单
function get_edit_info(active_id) {
    if (!active_id) {
        window.alert('Error！');
        return false;
    }
    $.ajax(
        {
            url: "/test_suite.json",
            data: {"id": active_id},
            type: "get",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var data_obj = data.rows;
                // 赋值
                $("#id").val(active_id);
                $("#name").val(data_obj.name);
                $("#run_type").val(data_obj.run_type);
                $("#description").val(data_obj.description);
                if (data_obj.run_type == 'Android') {
                    getDevices();
                } else {
                    $("#ipList").hide();
                    $("#ipListLabel").hide();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.alert('请求出错');
                window.console.error(XMLHttpRequest, textStatus, errorThrown);
            },
        });

    return false;
}


function searchTestBatch1(test_suite_id) {
    var $tb_departments = $('#tb_test_batch1');
    $tb_departments.bootstrapTable('refresh', {
        url: '/test_case.json',
        data: {id: test_suite_id, status: $("#selectStatus1").val(), name: $('#casename1').val(), type: 'unattach'}
    });
}

function attachTestCase(test_suite_id) {
    var ipVal = get_multiple_select_value("ipList");
    var browser_list = get_multiple_select_value("browserList");
    var $tb_departments = $('#tb_test_batch1');
    var a = $tb_departments.bootstrapTable('getSelections');
    var datarow = '';
    for (var i = 0; i < a.length; i++) {
        datarow = datarow + ',' + a[i].id;
    }
    if (a.length > 0) {
        $.ajax(
            {
                url: "/attach_test_batch.json",
                data: {
                    "test_suite_id": test_suite_id,
                    "ipVal": ipVal,
                    "browser_list": browser_list,
                    "datarow": datarow
                },
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.code == 200) {
                        window.alert('success!');
                        document.location.reload();
                    } else {
                        window.alert('code is :' + data.code + ' and message is :' + data.msg);
                    }
                },
                error: function () {
                    window.alert('请求出错');
                },
            });
    } else {
        window.alert('no row is selected!');
    }
}

function searchProjectName() {
    var project_name = $('#selectProject').val();
    $.ajax({
        url: "/search_project_name",
        method: "POST",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({"projectName": project_name}),
        success: function (data) {
            var name = data.projectName;
            var selectElement = $('#selectProject');
            if (name === 't') {
                //    处理无项目情况
            } else {
                // 多个项目返回数组
                if ((name.indexOf(", ")) !== -1) {
                    var arr = name.split(', ');
                    var op = [];
                    for (var i = 0; i < arr.length; i++) {
                        op[i] = {value: arr[i], text: arr[i]};
                    }
                    // 遍历选项数据，创建并添加 option 元素
                    $.each(op, function (index, option) {
                        // 使用 append 方法添加 option 元素
                        selectElement.append($('<option>', {
                            value: option.value,
                            text: option.text
                        }));
                    });
                } else { // 单一项目情况
                    selectElement.append($('<option>', {
                        value: name,
                        text: name
                    }));
                }
            }
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
        }
    });
}

function searchModuleName() {
    var project_name = $('#selectProject').val();
    var module_name = $('#selectModule').val();
    var selectElement = $('#module');
    $.ajax({
        url: "/search_module_name",
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({projectName: project_name, module_name: module_name}),
        success: function (data) {
            if (data.code == "200") {
                var op = [];
                for (var i = 0; i < data.message.length; i++) {
                    op[i] = data.message[i].name;
                }
                $.each(op, function (index, option) {
                    selectElement.append($("<option>", {
                        value: op[index],
                        text: op[index]
                    }));
                });
            }
        }
    });
}

$(document).ready(function (test_suite_id) {
    searchModuleName();
});
