function submitNewModule() {
    var name = $("#selectProject").val();
    var module = $("#moduleName").val();
    var description = $("#moduleDescription").val();

    $.ajax({
        url: "/save_new_module",
        method: "POST",
        cache: false,
        keepalive: true,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            projectName: name.toString(),
            moduleName: module.toString(),
            moduleDescription: description.toString()
        }),
        success: function (data) {
            if (data.code == "200") {
                window.location.href = "/maintain_module";
            } else {
                window.alert("data.message");
            }
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
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

function selectOnchang() {
    var text = $("#selectProject").val();
    $("#name").val(text);

}

function selectFunction(test_case_id) {
    var $tb_departments = $('#tb_project');
    $tb_departments.bootstrapTable('refresh', {url: '/search_project', data: {type: "test_project"}});
}

$(function () {
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    searchProjectName();


});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_project').bootstrapTable({
            url: '/search_project',         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
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
                field: 'name',
                title: '项目名称'
            }, {
                field: 'domain',
                title: '项目域名'
            }, {
                field: 'description',
                title: '项目描述'
            }, {
                field: 'creator',
                title: '创建人'
            },
                {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    formatter: function (value, row, index) {
                        var a = '<a href="javascript:;" onclick="">编辑</a> ';
                        var b = '<a href="javascript:;" onclick="">复制</a> ';
                        var e = '<a href="javascript:;" onclick="">删除</a> ';
                        return a + b + e;
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
            name: $("#name").val(),
            project: $("#selectProject").val(),
            type: "test_project"
        };
        return temp;
    };
    return oTableInit;
};