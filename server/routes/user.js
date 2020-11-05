const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Studyingcard = require('../models/studyingcard');

const router = express.Router();

router.post('/register', isNotLoggedIn, async (req, res, next) => {
  const id = req.body.register_user_id;
  const password = req.body.register_password;

  try {
    console.log('성공적1');
    const exUser = await User.findOne({ id: id });
    const hash = await bcrypt.hash(password, 12);
    console.log('성공적2');
    if (exUser) {
      return res.json({msg : '중복된 아이디가 있습니다.'});
    };
    
    let newUser = User.create({
        id: id,
        password: hash,        
        name: '윤상일',
        email: 'kizwond@gmail.com',
        nickname : '홍익인간',
        phone : '01093484979',
        newbook_no: 0
    })

    const phase1studyingcard = await Studyingcard.create({
      user_id: id,
      phase : '1',
      studyingcardlist : [],
    });
    const phase2studyingcard = await Studyingcard.create({
      user_id: id,
      phase : '2',
      studyingcardlist : [],
    });
  } catch (error) {
      console.error(error);
      return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {  
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error('authError', authError);
      return next(authError);
    }
    if (!user) {
        return res.json({msg : '아이디가 없는 듯요'});      
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log('req.session', req.session);      
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();  
});

module.exports = router;