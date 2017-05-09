
function addTodoElement(TODOElement) {
    // .id and not ._id
    $('#list').append("<li class='item' id='" + TODOElement.id + "'><span class='update-link'>"+TODOElement.text+"</span><a class='del-btn' href='javascript:complete(\""+ TODOElement.id + "\")'>done</a></li>");
}

function complete(id) {
    $.post("/complete", {'id': id}, function(data) {
	loadList();
    });
}

function add(text) {
    $.post("/add", {'text': text}, function(data) {
	// here it has ._id
	data.id = data._id;
	// console.log("to add " + data);
	addTodoElement(data);
    })
}

function loadList() {
    // clear the list
    $('#list').empty();
    // load list from server
    $.get("/list", function(data) {
	for (var x of data) {
	    // here it has .id. Why?
	    addTodoElement(x);
	};
    });
}

$(document).ready(function() {
  loadList();
  $("#add_submit").click(function(e) {
      // avoid button handler associated to form
      e.preventDefault();
      add($("#text").val());
  })
});
