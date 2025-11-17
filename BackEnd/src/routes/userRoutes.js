// routes/userRoutes.js  (append this block - remove after use)
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

router.post('/fix-passwords', async (req, res) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const users = await User.find({}).exec();
    const report = [];

    for (const u of users) {
      const pw = u.password || '';
      const needsHash = !(typeof pw === 'string' && pw.startsWith('$2'));
      if (needsHash) {
        const plain = pw || process.env.SEED_STAFF_PASS || 'changeme';
        const hashed = await bcrypt.hash(plain, saltRounds);
        u.password = hashed;
        await u.save();
        report.push({ staffId: u.staffId, updated: true });
      } else {
        report.push({ staffId: u.staffId, updated: false });
      }
    }

    return res.json({ ok: true, report });
  } catch (err) {
    console.error('fix-passwords error', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});
