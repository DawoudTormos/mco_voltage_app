
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


#include <Ethernet.h>

// replace the MAC address below by the MAC address printed on a sticker on the Arduino Shield 2
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

EthernetClient client;

int    HTTP_PORT   = 80;
String HTTP_METHOD = "GET"; // or POST
char   HOST_NAME[] = "maker.ifttt.com";
String PATH_NAME   = "/trigger";




#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define NUMFLAKES     10 // Number of snowflakes in the animation example

#define LOGO_HEIGHT   16
#define LOGO_WIDTH    16

#define p1 20
#define p2 25

static const unsigned char PROGMEM logo_bmp[] =
{ B00000000, B11000000,
  B00000001, B11000000,
  B00000001, B11000000,
  B00000011, B11100000,
  B11110011, B11100000,
  B11111110, B11111000,
  B01111110, B11111111,
  B00110011, B10011111,
  B00011111, B11111100,
  B00001101, B01110000,
  B00011011, B10100000,
  B00111111, B11100000,
  B00111111, B11110000,
  B01111100, B11110000,
  B01110000, B01110000,
  B00000000, B00110000 };


unsigned int disconnected =3;
unsigned int low =6;
unsigned int high =13;
unsigned int dur =15000;
unsigned long int time_since_low =0;
unsigned long int time_since_high =0;
unsigned long int last_voltage_read =0;
bool gen = 0;


void setup() {
 Serial.begin(9600);
pinMode(A2, INPUT) ;
pinMode(2, OUTPUT) ;



// SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }else{
       Serial.println(F("SSD1306 allocation succeeded"));
  }


   if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to obtaining an IP address using DHCP");
    while(true);
  }




   if(client.connect(HOST_NAME, HTTP_PORT)) {
    // if connected:
    Serial.println("Connected to server");
    // make a HTTP request:
    // send HTTP header
    client.println(HTTP_METHOD + " " + PATH_NAME + " HTTP/1.1");
    client.println("Host: " + String(HOST_NAME));
    client.println("Connection: close");
    client.println(); // end HTTP header

    while(client.connected()) {
      if(client.available()){
        // read an incoming byte from the server and print it to serial monitor:
        char c = client.read();
        Serial.print(c);
      }
    }

    // the server's disconnected, stop the client:
    client.stop();
    Serial.println();
    Serial.println("disconnected");
  } else {// if not connected:
    Serial.println("connection failed");
  }



}

// the loop function runs over and over again forever
void loop() {

float voltage = calculateVoltage();



if(gen==1){
digitalWrite(2,HIGH);
}else{
  digitalWrite(2,LOW);
}








if( (millis() - last_voltage_read ) > 200  ){
      displayWrite(voltage);
      last_voltage_read=millis();
      Serial.println("updating");
Serial.println(abs(last_voltage_read - millis()));
    }














if(gen == 0 && voltage>disconnected && voltage<low){


time_since_high=0;

  if(time_since_low == 0) {
    time_since_low = millis();
  }else if( (millis() - time_since_low ) > dur  ){
      gen =1;
      time_since_low=0;
      sendToServer(1);
    }
  
}else{
  time_since_low == 0;
}













if(gen == 1 && voltage>high ){


time_since_low=0;

  if(time_since_high == 0) {
    time_since_high = millis();
  }else if( (millis() - time_since_high ) > dur  ){
      gen =0;
      time_since_high=0;
      sendToServer(0);
    }
  
}else{
  time_since_high == 0;
}





}