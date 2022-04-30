/*TODO:
1. abstract top 5 from search_tb in home page
    store as "remember_vocab" then `task_vocab.js`
    can get it and render it onto task page
2. login/logout
*/
$(function(){
    var search_data = $("#search_tb").text().trim().split('\n');//.replace(/\n\s+/g, '\n')
    // save the remember_tb data
    search_list = getSearchTableData(search_data, 5);
    // stored in local storage as "remember_vocab"
    saveToLocal(search_list, "remember_vocab");
    var dict_data = $("#dictionary").text().trim().split('\n');
    random_list = getDictionaryData(dict_data, 8);
    saveToLocal(random_list, "random_list");

    // New add list
    // newwords = []
    $("#newadd_button").on("click", function(){
        /* Notice: val() and text(), html() is jquery method
        and val is the value set, but text is orignal value: empty
        and [0] is js notation, jquery use .eq(0)*/
        var newword = {
            "German": $(this).siblings("input").eq(0).val(),
            "English": $(this).siblings("input").eq(1).val(),
            "Note": $(this).siblings("input").eq(2).val(),
        };
        // console.log($(this).siblings("input").eq(0).val());
        var newwords = getLocalStorage("new_words");
        newwords.push(newword);
        saveToLocal(newwords, "new_words");
        renderNewWordsTable(newwords);
        $(this).siblings("input").each(function(i, n){
            /* Notice here n is js obj not jquery obj use $() transform
            to jquery obj*/
            // console.log($(n).val())
            $(n).val("")
        })
        // $("#newadd_tb").append("<tr name='data_tr'><td>"+
        // newword['German']+"</td><td>"+newword['English']+
        // "</td><td>"+newword['Note']+"</td><td>"+
        // "<div class='btn-group' role='group' aria-label='Basic mixed styles example'>"+
        // "<button type='button' class='btn btn-danger' name='delete'>Del</button>"+
        // "<button type='button' class='btn btn-success' name='edit' data-bs-toggle='modal' data-bs-target='#edit_modal'>"
        // +"Edit</button></div>"
        // +"</td></tr>"
        // )
    }); 
    $("#nav-newadd-tab").on("click", function(){
        var newwords = getLocalStorage("new_words");
        renderNewWordsTable(newwords);
    });
    
    $("#newadd2dict").on("click", function(){
        localStorage.removeItem("new_words");
        var newwords = getLocalStorage("new_words");
        renderNewWordsTable(newwords);
    })
    //delete and edit
    $("#newadd_tb").on("click", ".btn[name='delete']", function(){
        // console.log($(this).parents("tr").index())
        var ind = $(this).parents("tr[name='data_tr']").index()-1;
        // console.log(ind)
        var task_list = getLocalStorage("new_words");
        // use splice(from, del num)
        task_list.splice(ind, 1);
        // restore it to local
        saveToLocal(task_list, "new_words");
        // var new_task_list = getLocalStorage("task_data")
        renderNewWordsTable(task_list);
    })
    $("#newadd_tb").on("click", ".btn[name='edit']", function(){
        var ind = $(this).parents("tr[name='data_tr']").index()-1;
        // console.log(ind)
        var task_list = getLocalStorage("new_words");
        // console.log(task_list[ind]);
        // console.log($("#modal_ger").val(task_list[ind]["Ger"]))
        $("#modal_ger").val(task_list[ind]["German"]);
        $("#modal_eng").val(task_list[ind]["English"]);
        $("#modal_note").val(task_list[ind]["Note"]);
        $("#modal_confirm").on("click", function(){
            task_list[ind]["German"] = $("#modal_ger").val();
            task_list[ind]["English"] = $("#modal_eng").val();
            task_list[ind]["Note"] = $("#modal_note").val();
            // save to local
            saveToLocal(task_list, "new_words");
            // render to page
            renderNewWordsTable(task_list);
            alert("change successfully!!!");
            $("#edit_modal").modal('toggle');
        });
    });

    /*Search in show in newadd_tb Dictionary */
    $("#home_search_button").on("click", function(){
        if ($(this).siblings("input").val()){
            var word = $(this).siblings("input").val()
            alert("/home.html?"+word)
            // $(window).load("/home.html?"+word);
            $.get("/home.html?"+word, function(search_tb, status){
                // alert(status)
                if (search_tb!=""){
                
                    // data ="<tr>"+
                    //     "<td>"+data['German']+"</td>"+
                    //     "<td>"+data['English']+"</td>"+
                    //     "<td>"+data['Note']+"</td>"+
                    //     "<td>1</td></tr>";
                    $("#newadd_tb").append(search_tb);
                    var newword = {
                        "German": $("td[name='search_de']").text(),
                        "English": $("td[name='search_en']").text(),
                        "Note": $("td[name='search_note']").text(),
                        "Freq": $("td[name='search_freq']").text()
                    };
                    // alert(newword["German"])
                    // alert(search_tb);
                    // $("tr[name='search_tr'] td").each(function(){
                    //     var newword = $(this).text()  
                    // })
                    // alert(newword);
                    var new_words = getLocalStorage("new_words");
                    new_words.push(newword);
                    saveToLocal(new_words, "new_words");
                }else{
                    alert("no such words in dictionary, please search in google")
                }
            })
        }
    });

})

function getSearchTableData(content, num){
    var content = $("#search_tb").text().trim().split('\n');//.replace(/\n\s+/g, '\n')
    let i=6;;//html <tr> and </tr> take 2 lines
    var data_list = [];
    while(content[i]){
        //data need to be deleted after add to list. or it will change(shallow copy)
        var data = {};
        data[content[0].trim()]=content[i].trim();
        data[content[1].trim()]=content[i+1].trim();
        data[content[2].trim()]=content[i+2].trim();
        data[content[3].trim()]=content[i+3].trim();
        data_list.push(data);
      i += 6;
      if(i>(num+1)*6){
          break;
      }
    }
    return data_list;
}

function getDictionaryData(content, num){
    var content = $("#dictionary").text().trim().split('\n');//.replace(/\n\s+/g, '\n')
    let i=5;;//html <tr> and </tr> take 2 lines
    var data_list = [];
    while(content[i]){
        //data need to be deleted after add to list. or it will change(shallow copy)
        var data = {};
        data[content[0].trim()]=content[i].trim();
        data[content[1].trim()]=content[i+1].trim();
        data[content[2].trim()]=content[i+2].trim();
        data_list.push(data);
      i += 5;
      if(i>(num+1)*5){
          break;
      }
    }
    return data_list;
}

function saveToLocal(data, list_name){
    localStorage.setItem(list_name, JSON.stringify(data))
};

// get local data
function getLocalStorage(list_name){
    var data = localStorage.getItem(list_name);
    if (data !== null){
        return JSON.parse(data);
    } else{
        return [];
    }
}


function renderNewWordsTable(data){
    // use empty will cause two problem
    // 1. will clear the class (even later addClass)
    // 2. will clear the th.
    // $("#newadd_tb > tbody").empty();
    $("#newadd_tb > tbody").html("<tr><th>German</th><th>English</th>"
    +"<th>Notation</th><th>Delete/Edit</th></tr>");
    $.each(data, function(i, it_dict){
        $("#newadd_tb").append("<tr name='data_tr'><td>"+
        it_dict['German']+"</td><td>"+it_dict['English']+
        "</td><td>"+it_dict['Note']+"</td><td>"+
        "<div class='btn-group' role='group' aria-label='Basic mixed styles example'>"+
        "<button type='button' class='btn btn-danger' name='delete'>Del</button>"+
        "<button type='button' class='btn btn-success' name='edit' data-bs-toggle='modal' data-bs-target='#edit_modal'>"
        +"Edit</button></div>"+"</td></tr>"
        )
    })
}