function areaRectangulo(){
    base = Number(prompt("Ingrese la base del rectángulo"));
    altura = Number(prompt("Ingrese la altura del rectángulo"));

    area = base * altura;
    perimetro = 2 * (base + altura);

    alert("Area de la figura\n" + "Area: " + area + " m2\n" + "Perimetro: " + perimetro + " m");
}

function resta(x,y){
    rest= x-y;
    document.write("<h2> Resta de " + x + " - " + y + "=" + rest + "</h2>")
}

function suma(a,b){
    sum = a+b;
    document.getElementById("sumar").innerHTML= "Suma de " +a + " + " + b + " = " + sum;
}

function escribir(){
    valor = document.getElementById("entrada").value;
    document.getElementById("contenido").innerHTML = ">"+valor;
}