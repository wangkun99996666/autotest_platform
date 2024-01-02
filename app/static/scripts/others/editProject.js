function saveEditProject() {
    var name = $("#projectName").val();
    var domain = $("#projectDomain").val();
    var description = $("#projectDescription").val();
    $.ajax({
        url: "/edit_project",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({projectName: name, projectDomain: domain, projectDescription: description}),
        success: function (data) {
            if (data.code == '200') {
                window.location.href = "/maintain_project";
            }
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
        }
    });
}

function getUrlParameter(name) {
        // 获取点击编辑按钮传人的参数，name 是要获取的参数名
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

$(function () {
    var paramValue = getUrlParameter("id");
    showdata(paramValue);
});

function showdata(projectId){
        // 跳转到编辑项目页面后，请求数据库获取数据回显
    $.ajax({
        url: "/edit_project",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({projectId: projectId}),
        success: function (data) {
            if (data.code == '200') {
                $(function (){
                    $("#projectName").val(data.message[0].name);
                    $("#projectDomain").val(data.message[0].domain);
                    $("#projectDescription").val(data.message[0].description);
                });
            }
        },
        error: function (xhr, status, error) {
            window.alert("请求出错....");
        }
    });
}


