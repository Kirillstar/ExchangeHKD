var HKD = document.getElementById("HKD").textContent,
    button = document.getElementById("calculate"),
    numHKD = Number(HKD);
console.log(typeof numHKD);

button.onclick = function() {
    var amount =  document.getElementById("amount").value;
    var result = (amount * numHKD).toFixed(4);
    document.getElementById("result").innerHTML = result;
};

var refresh = document.getElementById("refresh");

refresh.onclick = function () {
    document.location.reload();
};
