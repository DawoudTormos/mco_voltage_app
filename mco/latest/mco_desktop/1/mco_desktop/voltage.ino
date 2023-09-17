float calculateVoltage(){

int sensorValue = analogRead(A2);
 return  (sensorValue+2) * 124.927 * (5.0 / 1024.0);


}