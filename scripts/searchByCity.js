$('#locationForm').submit(sLoc);

function sLoc(e) {
    e.preventDefault();
    var pos='q='+($("input:first").val());
    defPos(pos);
}