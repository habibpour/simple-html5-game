var bgAudio = new Audio(); // تعریف آهنگ پس زمینه بازی
bgAudio.src="assets/bg.mp3", bgAudio.loop=true ,bgAudio.play(); // آدرس دهی آهنگ و شروع پخش مکرر به صورت خودکار
var canvas = document.getElementsByTagName("canvas")[0]; // انتخاب canvas
var ctx = canvas.getContext("2d"); // آماده سازی جهت شروع کار با canvas
var game = { speed : 12  , score:0, time : 25 , status : true } // تنظیمات اولیه بازی
var role = { positionY:292 , width : 48 , height: 48}; // مشخصات نقش اول بازی
var coin = { positionY:0 , width : 32 , height: 32}; // مشخصات سکه
var keys = {}; // ذخیره دکمه های فشار داده شده در هر لحظه جهت کنترل بازی
addEventListener("keydown", function (e) {	keys[e.keyCode] = true;}, false);
addEventListener("keyup", function (e) {  delete keys[e.keyCode];}, false);

// راه اندازی بازی
var launch = function (step) {
	if(step=="start") // قرار دادن نقش اول در وسط صفحه وقتی که بازی تازه شروع شده باشد.
	{
		role.x = canvas.width / 2, role.y = role.positionY;
		
		window.setInterval(function(){ // آغاز تایمر بازی
		if(game.time>0)
			game.time--;
		else
		{
			game.status=false;
			bgimg.src = "images/background2.gif";
			bgAudio.pause();
		}
		},1000);
	}
	if(step=="score") 
		audio.play(), game.score+=1; // پخش آهنگ و افزایش امتیاز وقتی که سکه خورده باشد.
		
	coin.positionY=0; // تنظیم دوباره محل سکه
	coin.x = coin.width + (Math.random() * (canvas.width - coin.width*2)), coin.y = coin.positionY;
};

// ترسیم اشیای موجود در بازی
var br = false, bgimg = new Image(); // عکس پس زمینه
bgimg.onload = function () {br = true;};
bgimg.src = "images/background.gif";

var rr = false, roleimg = new Image(); // عکس قارچ
roleimg.onload = function () {rr = true;};
roleimg.src = "images/role.png";

var cr = false, coinimg = new Image(); // عکس سکه
coinimg.onload = function () {cr = true;};
coinimg.src = "images/coin.png";

var audio = new Audio(); // تعریف آهنگ جهت استفاده در بازی
audio.src="assets/coin.wav";

// چرخه اصلی بازی
var loop = function () {
	if (37 in keys) // حرکت به سمت چپ هنگام فشرده شدن دکمه مربوطه
		if(role.x>0)
			role.x -= game.speed;
			
	if (39 in keys) // حرکت به سمت راست در هنگام فشرده شدن دکمه مربوطه
		if(role.x<canvas.width-48)
			role.x += game.speed;

	// تشخیص خورده شدن سکه و راه اندازی دوباره بازی
	if(
		(role.x <= (coin.x + coin.width)) && (coin.x <= (role.x + coin.width))
		&& (role.y <= (coin.positionY + coin.height)) && (coin.positionY <= (role.y + coin.height))
	)
		launch("score");
	
	// تنظیم سرعت حرکت سکه ها با توجه به سرعت بازی
	if(game.status)
		coin.positionY+=game.speed/2;
	if(coin.positionY>310) // وقتی سکه به زمین برخورد می کند حذف شود
		launch();
	
	if(br)ctx.drawImage(bgimg, 0, 0); // ترسیم اشیای موجود در بازی
	if(rr)ctx.drawImage(roleimg, role.x, role.y);
	if(cr)ctx.drawImage(coinimg, coin.x, coin.positionY);
	
	ctx.fillStyle = "rgb(250, 250, 250)"; // امتیاز
	ctx.font = "20px arial";
	ctx.fillText(game.score, 40, 32);
	
	ctx.fillStyle = "rgb(250, 250, 250)"; // تایمر
	ctx.font = "20px arial";
	ctx.fillText(game.time, 134, 32);
};

var main = function () { // اجرای بازی
	loop(); // فراخوانی چرخه بازی
	requestAnimationFrame(main); 
};

window.requestAnimFrame = (function(){ // درخواست از مرورگرها برای تنظیم فریم های انیمیشن
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    ||
          function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

// شروع بازی
launch("start"); // راه اندازی اولیه بازی
main();  // شروع بازی