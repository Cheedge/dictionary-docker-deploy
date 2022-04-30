/*TODO:
1. get "remeber_vocab" produced by `home_vocab.js`
    extract data then render to taks page 
2. delete/edit
3. select all
*/

$(function(){
    //get 'remember_vocab' from local storage
    var remember_list = getLocalStorage("remember_vocab");
    // render to task page
    // 1. iterate data
    $.each(remember_list, function(i, n){
        $("#remember_tb").append("<tr><td>"+
            n['Ger']+"</td><td>"+n['Eng']+
            "</td><td>"+n['Notation']+"</td><td>"+
            n['Freq']+"</td><td>"+
            "<div class='form-check'>"+
            "<input class='form-check-input' type='checkbox'>"+
          "</div>"+"</td></tr>")
    });

    // random list
    var random_list = getLocalStorage("random_list");
    $.each(random_list, function(i, n){
        $("#random_tb").append("<tr><td>"+
            n['Ger']+"</td><td>"+n['Eng']+
            "</td><td>"+n['Notation']+"</td><td>"+
            "<div class='form-check'>"+
            "<input class='form-check-input' type='checkbox'>"+
          "</div>"+"</td></tr>")
    });

    //taks list
    // add words from "remember list" and "random list"
    // to local storage as "task list"
    /*Notice: here if want 2 or more obj do same change use "," to separate
    and also use `on`; `on` can add operations to js added tags, as here the
    "input:checked" is added by above js code, `on` can change it. 
    var task_words_list = [];
    $("#remember_tb, #random_tb").on("click", "input:checked", function(){
        // 1. create local space
        // 2. store
        // 3. render
        // console.log($(this).parents("td").siblings("td").eq(1).text())
        var task_word={
            "Ger": $(this).parents("td").siblings("td").eq(0).text(),
            "Eng": $(this).parents("td").siblings("td").eq(1).text(),
            "Note": $(this).parents("td").siblings("td").eq(2).text(),
        }
        // console.log(task_word);
        task_words_list.push(task_word);
        console.log(task_words_list)
    })*/
    makeTaskList("random")
    makeTaskList("remember")
    // var task_list1 = getLocalStorage("remember_task_list");
    // var task_list2 = getLocalStorage("random_task_list");
    // console.log(task_list1, task_list2)
    // localStorage.setItem("task_data", JSON.stringify(task_list1.concat(task_list2)));
    // relief the local storage
    // localStorage.removeItem("remember_task_list");
    // localStorage.removeItem("random_task_list");
    // reder to task page
    $("#nav-task-tab").on("click", function(){
        // $("#task_tb").empty();
        var task_list = getLocalStorage("task_data");
        // var task_list1 = getLocalStorage("remember_task_list");
        // var task_list2 = getLocalStorage("random_task_list");
        // console.log(task_list1.concat(task_list2));
        // task_list = task_list1.concat(task_list2);
        renderTaskTable(task_list);
        // localStorage.setItem("task_data", JSON.stringify(task_list))
    })

    function renderTaskTable(list){
        /* Notice: here empty will clear the table class, even later
        you addClass, it will not work. so here use html("")*/
        // $("#task_tb").empty();
        $("#task_tb > tbody").html("<tr><th>German</th><th>English</th>"
        +"<th>Notation</th><th>Delete/Edit</th></tr>");
        // $("#task_tb").addClass("table table-striped table-hover");
        $.each(list, function(i, n){
            $("#task_tb").append("<tr><td>"+
                n['Ger']+"</td><td>"+n['Eng']+
                "</td><td>"+n['Note']+"</td><td>"+
                "<div class='btn-group' role='group' aria-label='Basic mixed styles example'>"+
                "<button type='button' class='btn btn-danger' name='delete'>Del</button>"+
                "<button type='button' class='btn btn-success' name='edit' data-bs-toggle='modal' data-bs-target='#edit_modal'>"
                +"Edit</button></div>"
                +"</td></tr>")
        });
    
    }

    // delete and edit
    // Notice: only in `on()` can bind added tags(can not put ".btn" in $("#task_tb .btn"))
    $("#task_tb").on("click", ".btn[name='delete']", function(){
        // console.log($(this).parents("tr").index())
        var ind = $(this).parents("tr").index()-1;
        console.log(ind)
        var task_list = getLocalStorage("task_data");
        // use splice(from, del num)
        task_list.splice(ind, 1);
        // restore it to local
        saveToLocal("task_data", task_list);
        // var new_task_list = getLocalStorage("task_data")
        renderTaskTable(task_list);
    })
    $("#task_tb").on("click", ".btn[name='edit']", function(){
        var ind = $(this).parents("tr").index()-1;
        var task_list = getLocalStorage("task_data");
        // console.log(task_list[ind]["Ger"]);
        // console.log($("#modal_ger").val(task_list[ind]["Ger"]))
        $("#modal_ger").val(task_list[ind]["Ger"]);
        $("#modal_eng").val(task_list[ind]["Eng"]);
        $("#modal_note").val(task_list[ind]["Note"]);
        $("#modal_confirm").on("click", function(){
            task_list[ind]["Ger"] = $("#modal_ger").val();
            task_list[ind]["Eng"] = $("#modal_eng").val();
            task_list[ind]["Note"] = $("#modal_note").val();
            // save to local
            saveToLocal("task_data", task_list);
            // render to page
            renderTaskTable(task_list);
            alert("change successfully!!!");
            $("#edit_modal").modal('toggle');
        });
        // saveToLocal("task_data", task_list);
        
    });

    // select all
    $("#random_selectall").on("click",function(){
        var checked = $(this).parent().siblings("table").find("input")
        if (checked.prop("checked")===true){
            checked.prop("checked", false);
        }else{
            checked.prop("checked", true);
        }     
    });
    $("#remember_selectall").on("click",function(){
        var checked = $(this).parent().siblings("table").find("input")
        if (checked.prop("checked")===true){
            checked.prop("checked", false);
        }else{
            checked.prop("checked", true);
        } 
        // $(this).siblings("table").find("input").prop("checked", true)
    });


    //finish today clear "remember_task_list""random_task_list""task_data"
    $("#finishtoday").on("click", function(){
        localStorage.removeItem("remember_task_list");
        localStorage.removeItem("random_task_list");
        localStorage.removeItem("task_data");
        var task_list = getLocalStorage("task_data");
        renderTaskTable(task_list);
    })
})

// get local data
function getLocalStorage(list_name){
    var data = localStorage.getItem(list_name);
    if (data !== null){
        return JSON.parse(data);
    } else{
        return [];
    }
}

// save local data
function saveToLocal(list_name, data){
    localStorage.setItem(list_name, JSON.stringify(data))
}

// prepare the task_list then sotre in local
function makeTaskList(button_name){
    $("#"+button_name+"_submit").on("click",function(){
        if (button_name==="random"){
            var task_list1 = getLocalStorage("remember_task_list");
        }else if (button_name==="remember"){
            var task_list1 = getLocalStorage("random_task_list");
        };    
        var task_list2 = [];
        // console.log($(this).siblings("table").find("input:checked"))
        var checked = $(this).parent().siblings("table").find("input:checked")
        checked.each(function(){
            var task_word={
                "Ger": $(this).parents("td").siblings("td").eq(0).text(),
                "Eng": $(this).parents("td").siblings("td").eq(1).text(),
                "Note": $(this).parents("td").siblings("td").eq(2).text(),
            }
            task_list2.push(task_word);
            $(this).prop("checked", false);
        });
        // console.log($(this).siblings("table").find("input").eq(3).prop("checked"))
        localStorage.setItem("task_data", JSON.stringify(task_list1.concat(task_list2)));
        // save to local
        saveToLocal(button_name+"_task_list", task_list2);
    })
};
