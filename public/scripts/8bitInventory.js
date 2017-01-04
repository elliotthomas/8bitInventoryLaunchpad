var items = [];//global array of items in the inventory

$(document).ready(function(){
  $('#addItemButton').on('click', function(){
    addObject(event);
    $('#addObject').val('');
    $('#addColor').val('none');
    $('#addSize').val('none');
  });//end addItemButton on click function

  $('#searchButton').on('click',function(){
  //  console.log('searching...');
    getObjects(event);
  });//end searchButton onClick function
}); // end doc ready

var addObject = function(event){
//  console.log( 'in addObject' );
  // assemble object from new fields
  event.preventDefault();
  var newItem = {
    name: $('#addObject').val(),
    color: $('#addColor').val(),
    size: $('#addSize').val()
  }; // end newItem
//  console.log( 'adding:', newItem );
  $.ajax({
    type: 'POST',
    url: '/addItem',
    data: newItem,
    success: function(response){
  //    console.log('back from POST call:', response);
    },//end success function
    error: function(){
  //    console.log('error with addItem ajax call...');
    }//end error function
  });//end ajax call in addObject
  //getObjects(event);
}; // end addObject function

var findObject = function(array){
//  console.log( 'in findObject. Looking for:', $('#searchColor').val(), $('#searchSize').val());
  // array of matches
  var matches = [];
  for ( var i = 0; i < items[0].length; i++ ) {
    if(items[0][i].color == $('#searchColor').val() && items[0][i].size == $('#searchSize').val()){
      // match, add to array
      matches.push(items[0][i]);
    } // end if
  } // end for
//  console.log( 'matches:', matches );
  ////// TODO: display matches
  displaySearchResults(matches);
}; // end findObject function

var displaySearchResults = function(array){
  $('#outputDiv').html('');//clear outputDiv
  if(array.length <1){
    $('#outputDiv').append('<h3>' + 'There are no matches in the inventory' + '</h3>');
  } else {
    $('#outputDiv').append('<h4>Search Results:</h4>');
    for(var i=0; i < array.length; i++ ){
      $('#outputDiv').append('<p id="resultsDisplay">' + array[i].size + ' ' + array[i].color + ' ' + array[i].object_name + '</p>');
    }//end for loop
  }//end else statement
};//end displaySearchResults function

var getObjects = function(event){
//  console.log( 'in getObjects');
  event.preventDefault();
  $.ajax({
    type: 'GET',
    url: '/getInventory',
    success: function(response){
  //    console.log('added to items array from get:', response);
      items.push(response);
      findObject(items);
    }//end success function
  });//end getObjects ajax
}; // end getObjects function
