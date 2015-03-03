var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;  
db.on('error', console.error.bind(console, 'connection error:'));
var kittySchema = mongoose.Schema({
    name: String,
    age: Number
});

kittySchema.methods.speak = function () {
  var greeting = this.age
    ? "Meow age is " + this.age
    : "I don't have an age";
  console.log(greeting+this.name);
};

var Kitten = mongoose.model('Kitten', kittySchema);
var fluffy = new Kitten({ name: 'fluffy' });
//fluffy.speak(); // "Meow name is fluffy"
/*
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});
*/
var temp;
Kitten.find({name: 'fluffy'},function(err,Kittens){
	for(var i=0;i<Kittens.length;i++){
		Kittens[i].speak(); 
		temp = Kittens[i];
	} 
});
var query = {age: 7};
/*
Kitten.findOneAndUpdate(query, { name: 'jason borne' }, function(err,doc){
	doc.speak();
});
*/

Kitten.update({ name: 'fluffy' }, { age: 8 }, function (err, numberAffected, raw) {  
  if (err) return handleError(err);  
  console.log('The number of updated documents was %d', numberAffected);  
  console.log('The raw response from Mongo was ', raw);  
});
