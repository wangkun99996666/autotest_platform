function saveEditModule() {
    var name = $("#selectProject").val();
    var module = $("#moduleName").val();
    var description = $("#moduleDescription").val();
    var moduleId = getUrlParameter("id");

    $.ajax({
        url: "/save_edit_module",
        method: "POST",
        cache: false,
        keepalive: true,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            moduleId: moduleId,
            projectName: name,
            moduleName: module,
            moduleDescription: description
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

$(function () {
    //1.初始化Table
    searchProjectName();
    var module_id = getUrlParameter("id");
    showdata(module_id);
});

function getUrlParameter(name) {
    // 获取点击编辑按钮传人的参数，name 是要获取的参数名
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showdata(moduleId) {
    // 跳转到编辑项目页面后，请求数据库获取数据回显
    $.ajax({
        url: "/show_module",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({moduleId: moduleId}),
        success: function (data) {
            if (data.code == '200') {
                $(function () {
                    // $("#selectProject").val(data.message[0].name);
                    $("#moduleName").val(data.message[0].module_name);
                    $("#moduleDescription").val(data.message[0].module_description);
                });
            }
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
        }
    });
}

