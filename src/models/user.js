import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

export const User = mongoose.model('User', { 
  login: String,
  avatar_url: String,
  token: String
 });
 