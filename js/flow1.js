// store each account in its own item in the dicts below and each path/pinpoint under them
// to access: dict[account][path] or dict[route][pinpoint]  in case a saved route is retrieved
let coordDict = {};
let markerDict = {};
let pathDict = {};

let temp_markers = [];

//let lastPath;
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.388947, lng: -121.884179 },
        zoom: 10,
        scrollwheel: true,
        mapTypeControl: true,
    });

    //addPath('37.521,-121.1', coords2LatLng(coordinates));
    // add event listener for click event
    $('.add-line').on('click', showSelectedPath);
    $('.remove-line').on('click', hideSelectedPath);
    $('.make-line').on('click', addNewPath);
    $('.test_class').on('click', test_function);

    $(document).on('focusout', '.place1', place1_focusout); //works with all dynamically generated elements!
    $(document).on('focusout', '.place2', place2_focusout); //works with all dynamically generated elements!
    $(document).on('click', '#imp_menu', drawAll); //works with all dynamically generated elements!
    
}

function place2_focusout(event){
  var target_input = $(event.target);
  var entered_address = target_input.val();
  var place_div = target_input.parent(); //.box_place
  var prev_address = place_div.children('.prev_place2').val();
  var cleared_version = entered_address.replace(/\s+/g, ''); //to remove all spaces
  if (cleared_version!='' && cleared_version.length > 5){ //avoid an empty or not-long-enough address
    if (entered_address!=prev_address){
        var data = "addr="+entered_address;
        $.ajax({
            type: "POST",
            url: "./php/coord.php",
            data: data,
            success: function(e){
                $('#place_result').html(e);
                updateDictPrevAddrXY(place_div, 2, entered_address, input_x, input_y);
                if (place_div.attr('id')==undefined){ assignOrderlyId(place_div); } //upon the first time entering a valid address, since valid addr when no id, assign an id
                if (input_x=='' || input_y==''){ 
                  alert('�낅젰�섏떊 二쇱냼瑜� 李얠쓣 �� �놁뒿�덈떎. �뺥솗�� 二쇱냼瑜� �낅젰�댁＜�몄슂.');target_input.css('border', '1px solid #f2827a');
                  removePath('a');
                }else{ target_input.css('border', '1px solid #3cb371');addMarker(event);redraw('a'); }
            }
        })
    }
  }else{ //if an empty address is entered,
    target_input.css('border', ''); //no border unlike 異쒕컻 and 紐⑹쟻吏� when their addresses are empty
    updateDictPrevAddrXY(place_div, 2, entered_address, '', '');
    if (entered_address!=prev_address){ redraw('a'); } //redraw, but this time no optimization only update the path //if condition: to avoid blinking path
  }
}

// 異쒕컻吏� and 紐⑹쟻吏� (place1 instead of place2, .prev_place1 instead of .prev_place2)
function place1_focusout(event){
  var target_input = $(event.target);
  var entered_address = target_input.val();
  var place_div = target_input.parent();
  var prev_address = place_div.children('.prev_place1').val();
  var cleared_version = entered_address.replace(/\s+/g, ''); //to remove all spaces
  if (cleared_version!='' && cleared_version.length > 5){ //avoid an empty or not-long-enough address
    if (entered_address!=prev_address){
        var data = "addr="+entered_address;
        $.ajax({
            type: "POST",
            url: "./php/coord.php",
            data: data,
            success: function(e){
                $('#place_result').html(e);
                updateDictPrevAddrXY(place_div, 1, entered_address, input_x, input_y);
                if (input_x=='' || input_y==''){ 
                  alert('�낅젰�섏떊 二쇱냼瑜� 李얠쓣 �� �놁뒿�덈떎. �뺥솗�� 二쇱냼瑜� �낅젰�댁＜�몄슂.');target_input.css('border', '1px solid #f2827a');
                  removePath('a');
                }else{ target_input.css('border', '1px solid #3cb371');addMarker(event);redraw('a', place_div); }
            }
        })
    }
  }else{ //if an empty address is entered,
    target_input.css('border', '1px solid #f2827a');
    updateDictPrevAddrXY(place_div, 1, entered_address, '', '');
    redraw('a'); //redraw, but this time no optimization only update the path
  }
}

function updateDictPrevAddrXY(place_div, place_number, entered_address, x, y){
  if (place_number==1){ var prev_place = '.prev_place1'; }else{ var prev_place = '.prev_place2'; }
  if (markerDict[place_div.prop('id')]!=undefined) { removeFromMap(markerDict[place_div.prop('id')]); } //remove the previous marker, using the existing id if already exists
  place_div.children(prev_place).val(entered_address);
  place_div.children('.x_coord').val(x);
  place_div.children('.y_coord').val(y);
}

function assignOrderlyId(targetItem){
  var waypoints = $('.box_place');
  var counter = 0;
  for(var box_place of waypoints){
      counter++; //the first box_place being 1, and so forth (indices => start:0, waypoints:1~n, end:n+1)
      if(targetItem.is(box_place)){
          targetItem.attr('id', counter);
          //targetItem.prop('id', 'p'+counter);
          return;
      }
  }
}

function addMarker(event, order) {
  var place = $(event.target);
  var x_lat = place.parent().children('.x_coord').val();
  var y_lng = place.parent().children('.y_coord').val();
  var id = place.parent().prop('id');
  if (id == 'finish'){ var text = 'E'; }else if(id == 'start'){ var text = 'S'; }else{ var text = order; }
  var marker = new google.maps.Marker({
    position: {lat: parseFloat(x_lat), lng: parseFloat(y_lng)},
    label: {
      text: text,
      color: 'white'
    },
    map: map,
  });
  temp_markers.push(marker);
  markerDict[id] = marker; //
  //alert(id);
}

function getStayTime(targetElement){
  if (targetElement.length){
    var st_val = targetElement.children('input').val();
    var st_unit = targetElement.children('select').val();
    if (st_val==''){ //if empty or string, that is, containing a non-number character which returns empty string
      alert('泥대쪟 �쒓컙�� �뺥솗�� �レ옄濡� �낅젰�댁＜�몄슂.'); //distinguish between 泥대쪟 �쒓컙 and 湲곕낯 泥대쪟 �쒓컙
      //highlight the targetElement
      return;
    }else if (!isNaN(st_val)){ //if number
      st_val = Math.round(st_val);
      return st_val * st_unit;
    }else{
      alert('泥대쪟 �쒓컙�� �뺥솗�� �レ옄濡� �낅젰�댁＜�몄슂.'); //distinguish between 泥대쪟 �쒓컙 and 湲곕낯 泥대쪟 �쒓컙
      //highlight the targetElement
      return;
    }
  }else{
    return 'pass'; //pass since no such element; unlikely to happen for overall, but can happen for each
  }
}

function formListData(format){
  //start and end
  var start_x = $('#start').children('.x_coord').val();
  var start_y = $('#start').children('.y_coord').val();
  if (isEmpty(start_x) && isEmpty(start_y)){ alert('異쒕컻吏��� 二쇱냼瑜� �뺥솗�� �낅젰�댁＜�몄슂.');removePath('a');return; }
  var end_x = $('#finish').children('.x_coord').val();
  var end_y = $('#finish').children('.y_coord').val();
  if (isEmpty(end_x) && isEmpty(end_y)){ alert('紐⑹쟻吏��� 二쇱냼瑜� �뺥솗�� �낅젰�댁＜�몄슂.');removePath('a');return; }

  //異쒕컻�쒓컖
  var start_time_in_seconds = 0;
  var start_time_day_or_afternoon = $('#start').find('.select_time').val();
  if(start_time_day_or_afternoon){
    var start_time_hour = $('#start').find('.select_hour').val();
    var start_time_minute = $('#start').find('.select_minute').val();
    if(start_time_hour && start_time_minute){
      if(start_time_day_or_afternoon=='PM'){ var start_time_adjustor = 12; }else{ var start_time_adjustor = 0; }
      start_time_in_seconds = (start_time_adjustor * 3600) + (start_time_hour * 3600) + (start_time_minute * 60);
    }else{ alert("異쒕컻�쒓컖�� '�쒓컙'怨� '遺�' 紐⑤몢 �뺥솗�� �좏깮�댁＜�몄슂.");return; }
  }else{
    //�꾩옱�쒓컖 �댁슜 so get the current time and calculate it in seconds
    var now = new Date();
    var currentTimeInSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + (now.getSeconds());
    start_time_in_seconds = currentTimeInSeconds;
  }

  var jdata = { "start": parseInt(0), "end": parseInt(0), "num_iter": parseInt(5000), "points": [] };
  jdata['points'].push({ "lng": parseFloat(start_y), "lat": parseFloat(start_x), "stay": parseInt(0), "deadline": parseInt(0), "wait": false });
  if (format == 'list'){ var data_list = [];data_list.push([parseFloat(start_y), parseFloat(start_x)]); }

  var counter = 0;
  //setup for stay time
  var stay_time = 0; var each_stay_time = 0;
  var overall_stay_time = getStayTime($('#place').children('.staytime'));
  //if(isEmpty(overall_stay_time)){ return; }else if(overall_stay_time=='pass'){ overall_stay_time = 0; } //causing an error
  //end of setup for stay time
  var box_places = $('.box_place');
  box_places.each(function(){
    var x = $(this).children('.x_coord').val();
    var y = $(this).children('.y_coord').val();
    if (!isEmpty(x) && !isEmpty(y)){
      if (format == 'list'){ data_list.push([parseFloat(y), parseFloat(x)]); }
      else{
        counter++;
        //stay time
        stay_time = 0; each_stay_time = 0;
        each_stay_time = getStayTime($(this).children('.staytime2'));
        if(isEmpty(each_stay_time)){ return; }else if(each_stay_time=='pass'){ each_stay_time = 0; }
        if(each_stay_time!=overall_stay_time){ stay_time = each_stay_time; }else{ stay_time = overall_stay_time; }
        //account for deadline - using the what you see is what you get approach (if unused, hide it!)
        var deadline = 0; //in seconds
        var deadline_div = $(this).find('.select_container');
        if((deadline_div.length)&&(deadline_div.find('span').is(":visible"))){ //if �꾩갑�쒓컖 �ㅼ젙 clicked and �쒓컙&遺� shown
          var deadline_day_or_afternoon = deadline_div.find('.select_time').val();
          if(deadline_day_or_afternoon == 'PM'){ var deadline_adjustor = 12; }else{ var deadline_adjustor = 0; }
          var deadline_hour = deadline_div.find('.select_hour').val();
          var deadline_minute = deadline_div.find('.select_minute').val();
          if(deadline_hour && deadline_minute){ //if the shown �쒓컙&遺� are selected
            var deadline_time_in_seconds = (deadline_adjustor * 3600) + (deadline_hour * 3600) + (deadline_minute * 60);
            //check if the deadline is later than �쒖옉吏� 異쒕컻�쒓컖
            if (start_time_in_seconds > deadline_time_in_seconds){ alert('寃쎌쑀吏��� �꾩갑�쒓컖�� 異쒕컻吏��� 異쒕컻�쒓컖蹂대떎 �대쫭�덈떎. �대떦 �꾩갑�쒓컖 �먮뒗 異쒕컻�쒓컖�� �섏젙�댁＜�몄슂.');return; }
            deadline = deadline_time_in_seconds  - start_time_in_seconds;
          }else{
            alert("�꾩갑�쒓컖�� '�쒓컙'怨� '遺�' 紐⑤몢 �뺥솗�� �좏깮�댁＜�몄슂.");return;
          }
        }
        jdata['points'].push({ "lng": parseFloat(y), "lat": parseFloat(x), "stay": parseInt(stay_time), "deadline": parseInt(deadline), "wait": false });
      }
    }
  });
                     
  jdata['points'].push({ "lng": parseFloat(end_y), "lat": parseFloat(end_x), "stay": parseInt(0), "deadline": parseInt(0), "wait": false });
  jdata['end'] = counter + 1;
  if (format == 'list'){ data_list.push([parseFloat(end_y), parseFloat(end_x)]); }

  if (format == 'list'){ return data_list; }
  return jdata;
}

function drawAll(){
  var jdata = formListData();
  if(isEmpty(jdata)){ return; }
  //alert(JSON.stringify(jdata));
  //remove_temp_markers();

  //ajax
  $.ajax({
    type: "POST",
    url: "./php/opt.php",
    contentType: "application/json; charset=utf-8",
    processData: false,
    data: JSON.stringify(jdata),
    success: function(e){
      $('#place_result').html(e);
      //alert(JSON.stringify(jdata)); //input data
      var url = construct_url();
      getGeoData(url);
      //before_geo(); //output data
    }
  })
} //end of drawAll()

function redraw(itemName, placeDiv){ //itemName should be renamed to accountName or accountId
  if (!isEmpty(placeDiv)){
    var placeId = placeDiv.attr('id');
    if (placeId == 'start'){ var otherDiv = $('#finish'); }else{ var otherDiv = $('#start'); }
    if (isEmpty(otherDiv.children('.prev_place1').val())){ removePath(itemName);return; } //to avoid alert when 泥섏쓬�쇰줈 異쒕컻吏� �먮뒗 紐⑹쟻吏�瑜� �낅젰�� ��
  }
  var data_list = formListData('list');
  if(isEmpty(data_list)){ return; }
  var url = construct_url(data_list);
  getGeoData(url);
}

function construct_url(data_list){
  var base_url = "https://router.project-osrm.org/route/v1/driving/";
  if (isEmpty(data_list)){ var coords = optr['features'][0]['geometry']['coordinates']; } //if data_list not given, use optr
  else { var coords = data_list; } //if given, use it
  for(let i = 0; i < coords.length; i++){
    base_url = base_url + coords[i][0] + ',' + coords[i][1];
    if(i < coords.length-1){ base_url = base_url+';'; }
  }
  var suffix_url = "?overview=full"; //this increases the returned geometry's precision
  return base_url+suffix_url;
}

function before_geo(){
  //alert(optr);
  alert(JSON.stringify(optr));
}

function remove_temp_markers(){
  for (let i = 0; i < temp_markers.length; i++) {
    temp_markers[i].setMap(null);
  }
}

//make sure any newly created object, whether a path or pinpoint, can also be deleted, that is, remains accessible
function test_function(event){
    id = event.target.id;
    alert(id);
}

function removePlace(){
  if (markerDict[place_div.prop('id')]!=undefined) { removeFromMap(markerDict[place_div.prop('id')]); }
  place_div.prop('id', ''); //
  //drawn a new route if an already drawn route exists on the map
}

//upon focus in (on the address? the itme?), store the already entered address of the item in a variable 
//and compare it against the address of the same item upon focus out
//if different, reconvert the address to coords and update the id of the item
function addNewPath(event){
    itemName = event.target.id;              
    latlng = coords2LatLng(coordinates); //to be replaced by getGeoData()
    addPath(itemName, latlng);
    alert(itemName);
}

function addPath(itemName, latlng){
    newPathObj = new google.maps.Polyline({
        path: latlng,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 1,
    });
  removePath(itemName);
  pathDict[itemName] = newPathObj;
  addToMap(newPathObj);
}

function showSelectedPath(event){
    id = event.target.id;
    targetObj = pathDict[id];
    addToMap(targetObj);
}

function hideSelectedPath(event){
    id = event.target.id;
    targetObj = pathDict[id];
    removeFromMap(targetObj);
}

function removePath(itemName){
    if (!isEmpty(pathDict[itemName])){ removeFromMap(pathDict[itemName]); }
}

function addToMap(obj) {
    obj.setMap(map);
}

function removeFromMap(obj) {
    obj.setMap(null);
}

function isEmpty(str) {
    return (!str || str.length === 0 );
}


//var coordinates = [[37.772,-122.214],[21.291,-157.821],[-18.142,178.431],[-27.467,153.027]];
function coords2LatLng(coordinates){
    latlngArray = new Array();
    for(i=0;i<coordinates.length;i++){  
        var point = new google.maps.LatLng(coordinates[i][1],coordinates[i][0]);
        latlngArray.push(point);
    }
    return latlngArray;
}

/*
function formURL(){

}
*/

//var url_link = 'http://router.project-osrm.org/route/v1/driving/-121.84696,37.35681;-121.85915,37.34324';
//getGeoData(url_link);

//either retrieving coords(id) of pinpoints from server via php or getting addresses(empty id)/coords(id) right from the list via javascript
// (if new addresses, first convert them to coords)
// turn the coords into a url

//
//
// 

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);

        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
//got to call getGeoData(url) inside initMap() with addEventListener
//form a url with a for loop through the coordinates of all pinpoints at hand
//var latlng;
function getGeoData(url){
    var client = new HttpClient();
    client.get(url, function(response) {
        // do something with response
        json_data = JSON.parse(response);
        geo_data = json_data['routes'][0]['geometry'];
        geo_coords = decode(geo_data)['coordinates'];
        //have to do it all in here
        //alert(JSON.stringify(geo_coords));

        //removeFromMap(latlng);


        latlng = coords2LatLng(geo_coords);
        //draw
        addPath('a', latlng); //'a' to be replaced by subaccount's reference
        //alert(latlng.length);
    });
}

//
//
//

function decode(encodedPolyline) {
  return polyline.toGeoJSON(encodedPolyline);
}

var polyline = {};

function encode(current, previous, factor) {
  current = Math.round(current * factor);
  previous = Math.round(previous * factor);
  var coordinate = current - previous;
  coordinate <<= 1;
  if (current - previous < 0) {
    coordinate = ~coordinate;
  }
  var output = '';
  while (coordinate >= 0x20) {
    output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
    coordinate >>= 5;
  }
  output += String.fromCharCode(coordinate + 63);
  return output;
}

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function(str, precision) {
  var index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision || 5);

  // Coordinates have variable length when encoded, so just keep
  // track of whether we've hit the end of the string. In each
  // loop iteration, a single coordinate is decoded.
  while (index < str.length) {

    // Reset shift, result, and byte
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
};

/**
 * Encodes the given [latitude, longitude] coordinates array.
 *
 * @param {Array.<Array.<Number>>} coordinates
 * @param {Number} precision
 * @returns {String}
 */
polyline.encode = function(coordinates, precision) {
  if (!coordinates.length) {
    return '';
  }

  var factor = Math.pow(10, precision || 5),
    output = encode(coordinates[0][0], 0, factor) + encode(coordinates[0][1], 0, factor);

  for (var i = 1; i < coordinates.length; i++) {
    var a = coordinates[i],
      b = coordinates[i - 1];
    output += encode(a[0], b[0], factor);
    output += encode(a[1], b[1], factor);
  }

  return output;
};

function flipped(coords) {
  var flipped = [];
  for (var i = 0; i < coords.length; i++) {
    flipped.push(coords[i].slice().reverse());
  }
  return flipped;
}

/**
 * Encodes a GeoJSON LineString feature/geometry.
 *
 * @param {Object} geojson
 * @param {Number} precision
 * @returns {String}
 */
polyline.fromGeoJSON = function(geojson, precision) {
  if (geojson && geojson.type === 'Feature') {
    geojson = geojson.geometry;
  }
  if (!geojson || geojson.type !== 'LineString') {
    throw new Error('Input must be a GeoJSON LineString');
  }
  return polyline.encode(flipped(geojson.coordinates), precision);
};

/**
 * Decodes to a GeoJSON LineString geometry.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Object}
 */
polyline.toGeoJSON = function(str, precision) {
  var coords = polyline.decode(str, precision);
  return {
    type: 'LineString',
    coordinates: flipped(coords)
  };
};

if (typeof module === 'object' && module.exports) {
  module.exports = polyline;
}