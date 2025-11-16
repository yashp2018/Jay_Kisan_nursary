import CropGroup from '../models/CropGroup.js';
import CropVariety from '../models/CropVariety.js';

const seedCrops = async () => {
  try {
    // IDEMPOTENCY CHECK: Do not seed if crop groups already exist
    const existingGroupCount = await CropGroup.countDocuments();
    if (existingGroupCount > 0) {
      console.log('✅ Crop data already exists. Skipping crop seeding.');
      return; 
    }

    // WARNING: Original code ran deleteMany. Removed for safety.
    // To wipe and re-seed, manually run `await CropGroup.deleteMany();` before insertMany.

    const groups = await CropGroup.insertMany([
      { name: 'Vegetables' },
      { name: 'Fruits' },
      { name: 'Flowers' },
      { name: 'Herbs' },
    ]);

    const groupMap = {};
    groups.forEach((g) => (groupMap[g.name] = g._id));

    await CropVariety.insertMany([
      { name: 'Tomato Hybrid', group: groupMap['Vegetables'] },
      { name: 'Cabbage Green', group: groupMap['Vegetables'] },
      { name: 'Carrot Red', group: groupMap['Vegetables'] },

      { name: 'Banana Rasthali', group: groupMap['Fruits'] },
      { name: 'Mango Alphonso', group: groupMap['Fruits'] },

      { name: 'Rose Red', group: groupMap['Flowers'] },
      { name: 'Marigold Orange', group: groupMap['Flowers'] },

      { name: 'Tulsi', group: groupMap['Herbs'] },
      { name: 'Mint', group: groupMap['Herbs'] },
    ]);

    console.log('🌱 Successfully seeded crop data.');
  } catch (error) {
    console.error('❌ Crop seeding failed:', error.message);
    throw error; // Propagate error
  }
};

export default seedCrops;
