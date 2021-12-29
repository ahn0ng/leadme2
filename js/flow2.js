$(function(){
    $("#menu_box").hide();
    var $side_menu =$("#side_btn li");
    var $con = $("#side_con > ul > li");
    var y = 0;
    var z = 0;
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var e = 0;
    var f = 0;
    var g = 0;
    var h = 0;

    $("#menu_btn").click(function(){
        $("#side_con").show();
        $("#menu_box").show();
        y++;
        z=y%2;
        a=0;
        c=0;
        e=0;
        g=0;

        if(z==1){
            $("#side_con").find($con).stop().animate({"margin-left":"400"},1,"linear")
            $("#menu_box").stop().animate({"right":"70"},500,"linear");
        }else{
            $("#menu_box").stop().animate({"right":"-400"},500,"linear");
            $("#side_con").hide();
        }

    });
    
    $side_menu.eq(0).click(function(){
        $("#side_con").show();
        a++;
        b=a%2;
        y=0;
        c=0;
        e=0;
        g=0;
        if(b==1){
                $("#side_con").find($con).stop().animate({"margin-left":"400"},1,"linear")
                $("#menu_box").stop().animate({"right":"-400"},500,"linear")
                $("#side_con").find($con.eq(0)).stop().animate({"margin-left":"0"},1,"linear");
        
        }else{
            $con.stop().animate({"margin-left":"400"},500,"linear");
            $("#side_con").hide();
        }
    });

    $side_menu.eq(1).click(function(){
        $("#side_con").show();
        c++;
        d=c%2;
        y=0;
        a=0;
        e=0;
        g=0;
        if(d==1){
            $("#side_con").find($con).stop().animate({"margin-left":"400"},1,"linear")
            $("#menu_box").stop().animate({"right":"-400"},500,"linear")
            $("#side_con").find($con.eq(1)).stop().animate({"margin-left":"0"},1,"linear");

        }else{
            $con.stop().animate({"margin-left":"400"},500,"linear");
            $("#side_con").hide();
        }
    
        });

    $side_menu.eq(2).click(function(){
        $("#side_con").show();
        e++;
        f=e%2;
        y=0;
        a=0;
        g=0;
        c=0;
    
        if(f==1){
            $("#side_con").find($con).stop().animate({"margin-left":"400"},1,"linear")
            $("#menu_box").stop().animate({"right":"-400"},500,"linear")
            $("#side_con").find($con.eq(2)).stop().animate({"margin-left":"0"},1,"linear");
         
        }else{
            $con.stop().animate({"margin-left":"400"},500,"linear");
            $("#side_con").hide();
        }
    
        });
        
    $side_menu.eq(3).click(function(){
        $("#side_con").show();
        g++;
        h=g%2;
        y=0;
        a=0;
        e=0;
        c=0;
        
        if(h==1){
            $("#side_con").find($con).stop().animate({"margin-left":"400"},1,"linear")
            $("#menu_box").stop().animate({"right":"-400"},500,"linear")
            $("#side_con").find($con.eq(3)).stop().animate({"margin-left":"0"},1,"linear");

        }else{
            $con.stop().animate({"margin-left":"400"},500,"linear");
            $("#side_con").hide();
        }
        
    });

});

$(function(){

    $("#imp_f").mouseenter(function(){
        
        $("#imp_menu").fadeIn();
    })
    $("#imp_f").mouseleave(function(){
        
        $("#imp_menu").fadeOut();
    });

});

// 紐⑹쟻吏� 異붽��섍린

const add_textbox = () => {
    const adding = document.getElementById("place");
    const newP = document.createElement('p');
    newP.innerHTML = '<div class="box_place"><input type="search" class="place2" placeholder="주소" /><span class="more">···</span><span class="m_menu"><span class="set_arrival">도착시각 설정</span><span class="set_stay">체류시간 설정</span><span>즐겨찾기 등록</span><span>삭제</span></span><input type="tel" class="number" placeholder="핸드폰 번호" /><input type="text" class="memo" placeholder="메모" /><input type="hidden" class="prev_place2" /><input type="hidden" class="x_coord" /><input type="hidden" class="y_coord" /></div>';
    adding.appendChild(newP);
} // onclick="remove(this)"
const remove = (obj) => {
    document.getElementById('place').removeChild(obj.parentNode);
}





// 紐⑤떖

$(function(){
    $("#drag").click(function(){
        $("#dd").fadeIn();
    });

    $(".close").click(function(){
        $("#dd").fadeOut();

    });

    $("#down").click(function(){
        $("#dw").fadeIn();
    });

    $(".close").click(function(){
        $("#dw").fadeOut();

    });

    $("#open").click(function(){
        $("#op").fadeIn();
    });

    $(".close").click(function(){
        $("#op").fadeOut();

    });

    $("#reset").click(function(){
        $("#rs").fadeIn();
    });

    $(".close").click(function(){
        $("#rs").fadeOut();

    });
});



/*
$(function(){

var button = document.getElementById('button');
var input = document.getElementById('input');
var list = document.getElementById('id_list');

var cnt = 1;

button.addEventListener('click', clickButton);

function clickButton() {
  var temp = document.createElement('span');
  temp.setAttribute("class", "list-group-item");
  temp.setAttribute("id", "span"+cnt);
  temp.innerHTML = input.value;
//   temp.innerHTML += "<button style='float: right;' class='btn btn-outline-secondary' type='button' onclick='remove("+cnt+")'>-</button>";
  list.appendChild(temp);
  
  cnt++;
}

// function remove(cnt) {
//   //window.alert(cnt);
//   var li = document.getElementById("span"+cnt);
//   list.removeChild(li);
// }


});

//test

$(function(){

    var button = document.getElementById('add_new_subacc_btn');
    var input = document.getElementById('new_subacc_input');
    var list = document.getElementById('id_list2');
    
    var cnt = 1;
    
    button.addEventListener('click', clickButton);
    
    function clickButton() {
      var temp = document.createElement('span');
      temp.setAttribute("class", "list-group-item");
      temp.setAttribute("id", "span"+cnt);
      temp.innerHTML = input.value;
    //   temp.innerHTML += "<button style='float: right;' class='btn btn-outline-secondary' type='button' onclick='remove("+cnt+")'>-</button>";
      list.appendChild(temp);
      
      cnt++;
    }
});
*/


//test

$(document).ready(function(){   
    
    var fileTarget = $('.filebox .upload-hidden'); fileTarget.on('change', function(){ 
    if(window.FileReader){ 
    
    var filename = $(this)[0].files[0].name; } else { 
    var filename = $(this).val().split('/').pop().split('\\').pop();} 
    $(this).siblings('.upload-name').val(filename); }); 

});




$(function(){ //is this being used??? on login page
    var a = 0;
    var b = 0;
    
    $("#menu_btn2").click(function(){
        $("#side_con").show();
        a++;
        b=a%2;

        if(b==1){
            $("#menu_box2").stop().animate({"right":"0"},500,"linear");

        }else{
            $("#menu_box2").stop().animate({"right":"-400"},500,"linear");
            $("#side_con").hide();
        }

    });
});

// //
$(document).on('click', '.more', function(){
    $(this).parent().children('.m_menu').show();
});

$(document).on('mouseleave', '.m_menu', function(){
    $(this).hide();
});

/*
$(function(){
    $(".more").click(function(){
        $(".m_menu").css({"opacity":"1"})
    });

   
    $(".m_menu").mouseleave(function(){
        $(".m_menu").css({"opacity":"0"})
    });
    
});
*/