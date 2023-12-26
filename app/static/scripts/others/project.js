function submitNewProject() {
    var name = $("#projectName").val();
    var domain = $("#projectDomain").val();
    var description = $("#projectDescription").val();
    $.ajax({
        url: "/add_new_project",
        method: "POST",
        dataType: "json",
        data: {"projectName": name, "projectDomain": domain, "projectDescription": description},
        success: function (data){
            console.log(data);
            window.location.href="/maintain_project";
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
        }
    });
}

function searchProject() {

}

$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();


});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_project').bootstrapTable({
            url: '/search_priject',         //请求后台的URL（*）
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

    function edit(index) {
        window.location.href = ('/edit_test_case?id=' + index);
    }

    function operateFormatter(value, row, index) {
        return [
            '<button type="button" class="RoleOfEdit btn btn-default  btn-sm" style="margin-right:15px;">编辑</button>',
            '<button type="button" class="RoleOfDelete btn btn-default  btn-sm" style="margin-right:15px;">删除</button>'
        ].join('');
    }

    window.operateEvents = {
        'click .RoleOfEdit': function (e, value, row, index) {
            window.location.href = ('/add_test_case');
        },
        'click .RoleOfDelete': function (e, value, row, index) {
            alert("B");
        }
    }


    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            name: $("#name").val(),
            module: $("#selectModule").val(),
            type: "test_cases"
        };
        return temp;
    };
    return oTableInit;
};