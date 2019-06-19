$(function(){
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});
$(function(){
    $(Window).resize(function(e) {
        if($(Window).width()<=768){
            $("#wrapper").removeClass("toggled");
        }
        else{
            $("#wrapper").addClass("toggled");
        }
    });
});