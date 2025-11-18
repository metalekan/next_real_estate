import connectDB from './mongoose';

export { default as User } from './models/User';
export { default as Property } from './models/Property';
export { default as Inquiry } from './models/Inquiry';

export { connectDB };