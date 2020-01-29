$(function () {

  const socket = io();
  var color = "#ffffff";
  var tamano = 40;
  var pintura = false;
  //obteniendo los elementos del DOM de la interface
  const $canvas = $('#canvas');
  const $lapiz = $('#lapiz');
  const $borrador = $('#borrador');
  const $color = $('#color');
  const $save = $('#save');

  $canvas.mousemove(e =>{
    var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
    var _x = $canvas.position();
    console.log(e.clientX);
    console.log(_x.top);
    console.log(e.clientY);
    console.log(_x.left);
		var x = e.clientX -_x.left;
		var y = e.clientY- _x.top;
		if(pintura){
			ctx.fillStyle = color;
			ctx.fillRect(x,y,tamano, tamano);
		}
  });

  $canvas.mouseup(e =>{
    pintura = false;
  });

  $canvas.mousedown(e =>{
    pintura = true;
  });

  $lapiz.click(e=>{
		document.getElementById("canvas").style.cursor  = "url('img/lapizcursor.gif'), default";
  });

  $borrador.click(e =>{
		var canvas = document.getElementById("canvas");
	  var context = canvas.getContext("2d");
	  clear(context);
  });

  $color.click(e =>{
    tamano = 40;
  });
  $save.click(e =>{
    var ctx = document.getElementById("canvas").getContext('2d');
    ctx.fillStyle = "#000";
    var canvas = document.getElementById("canvas");
    w = canvas.width;
    h = canvas.height;
    var data = canvas.toDataURL("image/jpeg");
    //var data = ctx.getImageData(0, 0, w, h);
    //console.log(typeof(data))
    socket.emit('new_img',data);
    //clear(ctx);
    //
    // //console.log(Array.from(data));
    // document.getElementById("save").download = "image.jpeg";
    // //console.log(document.getElementById("canvas").toDataURL("image/jpeg").replace(/^data:image\/[^;]/, 'data:application/octet-stream'));
    // document.getElementById("save").href = document.getElementById("canvas").toDataURL("image/jpeg").replace(/^data:image\/[^;]/, 'data:application/octet-stream');



    // var image = canvas.toDataURL("image/png");
    // this.href = image;

    // var imgData = context.getImageData(550, 20, canvas.width, canvas.height);

  //   red = imgData.data;
  //   green = imgData.data[1];
  //   blue = imgData.data[2];
  //   alpha = imgData.data[3];
  //   console.log(red +" "+ green +" " + blue);
  //   //var dataInBase64 = $(canvas)[0].toDataURL('image/png').replace(/data\:image\/png;base64,/, '');
  //   //var imgData = binEncode(dataInBase64);
  //   socket.emit('new_img',red, data =>{
  //     if(data){
  //       console.log('ok');
  //     }else{
  //       console.log('something went wrong');
  //     }
  //   });
  });
});

function binEncode(data) {
    var binArray = []
    var datEncode = "";

    for (i=0; i < data.length; i++) {
        binArray.push(data[i].charCodeAt(0).toString(2));
    }
    for (j=0; j < binArray.length; j++) {
        var pad = padding_left(binArray[j], '0', 8);
        datEncode += pad + ' ';
    }
    function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
        return s;
    }
    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s = c + s; } return s;
    }
    console.log(binArray);
    return binArray;
}

function clear(ctx){
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
// var color = "#ffffff";
// 	var tamano = 25;
// 	var pintura = false;
// 	function pintar(event){
// 		var canvas = document.getElementById("canvas");
// 		var ctx = canvas.getContext("2d");
// 		var x = event.clientX-10;
// 		var y = event.clientY+15;
// 		if(pintura){
// 			ctx.fillStyle = color;
// 			ctx.fillRect(x,y,tamano, tamano);
// 		}
// 	}
// 	function activar(){
// 		pintura = true;
// 	}
// 	function desactivar(){
// 		pintura = false;
// 	}
//
// 	function borrador(){
// 		var canvas = document.getElementById("canvas");
// 	    var context = canvas.getContext("2d");
// 	    context.clearRect (0, 0, 400, 400);
// 	}
//
// 	function lapiz(){
// 		document.getElementById("canvas").style.cursor = "url('lapizcursor.gif'), default";
// 		color = document.getElementById("colores").value;
// 		document.getElementById("colores").removeAttribute("disabled");
// 	}
// 	function scolor(){
// 		color = document.getElementById("colores").value;
// 	}
// 	function stamano(numero) {
// 		tamano = numero;
// 	}
//
// 	function guardari(){
// 		var canvas = document.getElementById("canvas");
// 		var imagen = canvas.toDataURL("image/png");
// 		this.href = imagen;
// 	}
