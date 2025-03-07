function searchModuleName() {
    var project_name = $('#selectProject').val();
    var module_name = $('#selectModule').val();
    var selectElement = $('#selectModule');
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

$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    searchProjectName();
    searchModuleName();
});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_test_cases').bootstrapTable({
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
            },
                {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var a = '<a href="javascript:;" onclick="window.location.href=(\'/edit_test_case?id=' + row.id + '\')">编辑</a> ';
                        var b = '<a href="javascript:;" onclick="copy_test_case(\'' + row.id + '\')">复制</a> ';
                        var c = '<a href="javascript:;" onclick="run_test_case(\'' + row.id + '\')">执行</a> ';
                        var d = '<a href="javascript:;" onclick="window.location.href=(\'/test_case_runhistory?id=' + row.id + '\')">执行结果</a> ';
                        var e = '<a href="javascript:;" onclick="delete_test_case(\'' + row.id + '\')">删除</a> ';
                        return a + b + c + d + e;
                    }
                }
            ]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            projectName: $("#selectProject").val(),
            module: $("#selectModule").val(),
            type: "test_cases"
        };
        return temp;
    };
    return oTableInit;
};


function searchTestCase(test_case_id) {
    var $tb_departments = $('#tb_test_cases');
    $tb_departments.bootstrapTable('refresh', {url: '/test_case.json', data: {id: test_case_id, type: "test_case"}});
}


// 删除表单
function delete_test_case(active_id) {
    if (window.confirm("确认删除吗？")) {
        if (!active_id) {
            window.alert('Error！');
            return false;
        }
        $.ajax(
            {
                url: "delete_test_case",
                data: {"id": active_id, "act": "del"},
                type: "post",
                success: function (data) {
                    if (data.code = 200) {
                        document.getElementById('btn_query').click();
                    } else {
                        $("#tip").html("<span style='color:red'>失败，请重试</span>");
                        window.alert('失败，请重试' + data.msg);
                    }
                },
                error: function () {
                    window.alert('请求出错');
                },
            });
    }
    return false;
}

function run_test_case(test_case_id) {
    $.ajax(
        {
            url: "/runtest.json",
            data: {"id": test_case_id, "type": "test_case"},
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    window.alert('success!');
                    window.location.href = ('/test_case_runhistory?id=' + test_case_id);
                } else {
                    window.alert('code is :' + data.code + ' and message is :' + data.msg);
                }
            },
            error: function () {
                window.alert('请求出错');
            },
        });
}

function copy_test_case(test_case_id) {
    $.ajax(
        {
            url: "/copy_test_case",
            data: {"id": test_case_id},
            type: "post",
            dataType: "json",
            beforeSend: function () {
                return true;
            },
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
}

