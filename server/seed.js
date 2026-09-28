require('dotenv').config();
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');
const Admin = require('./models/Admin');

const menuItems = [
  { name: 'Americano', price: 130, category: 'coffee', image: 'images/americano.jpg' },
  { name: 'Cappuccino', price: 160, category: 'coffee', image: 'images/cappuccino.jpg' },
  { name: 'Cafe Latte', price: 170, category: 'coffee', image: 'images/cafelatte.jpg' },
  { name: 'Mocha', price: 190, category: 'coffee', image: 'images/mocha.jpg' },
  { name: 'Cold Coffee', price: 180, category: 'coffee', image: 'images/coldcoffee.jpg' },
  { name: 'Caramel Latte', price: 200, category: 'coffee', image: 'images/caramellatte.jpg' },
  { name: 'Espresso', price: 110, category: 'coffee', image: 'images/espresso.jpg' },
  { name: 'Hazelnut Coffee', price: 190, category: 'coffee', image: 'images/hazelnut.jpg' },
  { name: 'Vanilla Latte', price: 190, category: 'coffee', image: 'images/vanillalatte.jpg' },
];

const seed = async () => {
  await connectDB();

  // Clear existing menu items and reseed fresh every time this script runs
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItems);
  console.log(`Cleared old items and inserted ${menuItems.length} menu items`);

  // Remove the old Brew & Bliss admin account, then create the current one from .env
  await Admin.deleteOne({ email: 'admin@brewbliss.com' });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({ email: adminEmail, password: adminPassword });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping');
  }

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});