var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;  
db.on('error', console.error.bind(console, 'connection error:'));
/*
var kittySchema = mongoose.Schema({
    name: String,
    age: Number
});
*/
var planSchema = mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now },  
  deploy: [
    {
      f_path:String,
      s_path:String,
      data: {
        name : String
      } 
    }
  ]
});

planSchema.methods.log = function () {
  var str="";
  for(var i=0;i<this.deploy.length;i++) {
    console.log(this.deploy[i].data.name);
    str+=this.deploy[i].name+" ";
  }
  //console.log(this.deploy.length);
}
var Plan = mongoose.model("Plan", planSchema);
module.exports=Plan;
/*
var arr = [];
var obj = {
  f_path: "asd",
  s_path: "psd",
  data: {
    name: "result"
  }
};
arr.push(obj);
var p =new Plan({
  name: "freedom",
  deploy: arr
});
var query = {name: "freedom"};
Plan.findOneAndRemove(query, function(err,doc){
  doc.log();
});
/*
p.save(function (err, plan){
  if(err) {
    console.log(err);
  } else {
    plan.log();
  }
});
*/
//fluffy.speak(); // "Meow name is fluffy"
/*
fluffy.save(function (err, fluffy) {
  if (err) return console.error(err);
  fluffy.speak();
});

var temp;
Kitten.find({name: 'fluffy'},function(err,Kittens){
	for(var i=0;i<Kittens.length;i++){
		Kittens[i].speak(); 
		temp = Kittens[i];
	} 
});
var query = {age: 7};
Kitten.findOneAndUpdate(query, { name: 'jason borne' }, function(err,doc){
	doc.speak();
});
*/
/*
Kitten.update({ name: 'fluffy' }, { age: 7 }, function (err, numberAffected, raw) {  
  if (err) return handleError(err);  
  console.log('The number of updated documents was %d', numberAffected);  
  console.log('The raw response from Mongo was ', raw);  
});
*/
