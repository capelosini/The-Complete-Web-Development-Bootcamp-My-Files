const result = document.getElementById("result");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

var n1 = Math.floor(Math.random() * 6 + 1);
var n2 = Math.floor(Math.random() * 6 + 1);

img1.src = "images/dice" + n1 + ".png"
img2.src = "images/dice" + n2 + ".png"

if (n1 > n2){
    result.innerText = "Player 1 Wins!"
} else if (n2 > n1){
    result.innerText = "Player 2 Wins!"
} else{
    result.innerText = "Draw!";
}