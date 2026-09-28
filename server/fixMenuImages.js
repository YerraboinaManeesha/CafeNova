require('dotenv').config();
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');

const fixes = [
  {
    name: 'Flat White',
    image: 'https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmxhdCUyMHdoaXRlfGVufDB8fDB8fHww',
  },
  {
    name: 'Filter Coffee',
    image: 'https://images.unsplash.com/photo-1659267450382-433eb3522239?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGZpbHRlciUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const fixImages = async () => {
  await connectDB();

  for (const fix of fixes) {
    const item = await MenuItem.findOne({ name: fix.name });
    if (!item) {
      console.log(`Not found: ${fix.name} — skipping`);
      continue;
    }
    item.image = fix.image;
    await item.save();
    console.log(`Updated image for: ${fix.name}`);
  }

  console.log('Done.');
  process.exit(0);
};

fixImages().catch((err) => {
  console.error(err);
  process.exit(1);
});