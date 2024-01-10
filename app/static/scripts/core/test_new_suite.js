// 提交表单
function add_test_suite() {
    $.ajax(
        {
            url: "/add_test_suite.json",
            data: JSON.stringify({
                "run_type": $("#run_type").val(),
                "project": $("#project").val(),
                "module": $("#module").val(),
                "name": $("#name").val(),
                "description": $("#description").val()
            }),
            type: "POST",
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    alert('新增成功，请关联用例!');
                    window.location.href = ('/attach_test_batch?test_suite_id=' + data.ext);
                } else {
                    alert(data.msg);
                }
            },
            error: function () {
                alert('请求出错');
            },
            complete: function () {
                $('#acting_tips').hide();
            }
        });

    return false;
}

$(document).ready(function () {
    searchModuleName();
    searchProjectName();

});

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
            var selectElement = $('#project');
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