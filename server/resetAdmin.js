require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const resetAdmin = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Remove any existing admin(s) so old credentials can't linger
  await Admin.deleteMany({});
  await Admin.create({ email: adminEmail, password: adminPassword });

  console.log(`Admin account reset. You can now log in with: ${adminEmail}`);
  process.exit(0);
};

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});