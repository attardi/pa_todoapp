
function addTodoElement(TODOElement) {
	$('#list').append("<li id='" + TODOElement.id + "'>"+TODOElement.text+" - <a href='javascript:complete(" + TODOElement.id + ")'>complete</a></li>");
}

function complete(id) {
	$.post( "/complete", {'id':id}, function( data ) {
		loadList();
	});
}

function loadList() {
	// clear the list
	$('#list').empty();
	// load list from server
	$.getJSON("/list", function (data) {
		for (var i = 0; i < data.length; i++) {
			addTodoElement(data[i]);
		};
	});

}


$(document).ready(function(){
  loadList();
});
