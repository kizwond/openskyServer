const mongoose = require("mongoose");

// 스키마 객체를 생성
const userschema = new mongoose.Schema({
  id: String,
  password: String,
  name: String,
  email: String,  
  nickname: String,
  phone: String,
  newbook_no: Number,
});


// users라는 모델을 생성하고 이걸 export하는 겅가? 뒤에 커렉션도 정의할 수 있는 듯
module.exports = mongoose.model("user", userschema)
