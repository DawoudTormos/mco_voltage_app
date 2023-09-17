float calculateVoltage(){

int sensorValue = analogRead(volPin);/*
float v = (sensorValue+2) * 124.927 * (5 / 1024.0);*/

float v = (sensorValue+2) * 273.48  * (2.503 / 1024.0);

//545    278.144
//1.591


if (     (v > (1.1*v5))    &&    n1<5   ){

n1++;
n2=0;
return  (v4+v5+v3+v2+v1)/5;



}else if (  (v < (0.9*v5)) &&    n2<5  ){



n1=0;
n2++;
return  (v4+v5+v3+v2+v1)/5;



}else{



n1=0;
n2=0;
v1=v2;
v2=v3;
v3=v4;
v4=v5;
v5=v;
return  (v4+v5+v3+v2+v1)/5;



}


//return v;


}