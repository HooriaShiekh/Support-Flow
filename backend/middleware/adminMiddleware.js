const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        // 1. Check karein ke request ke sath user ki ID aa rahi hai ya nahi 
        // (Yeh ID aapke JWT verification middleware se milti hai jo isse pehle run hota hai)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized. Token missing or invalid." });
        }

        // 2. Database mein user ko dhoondhein
        const user = await User.findById(req.user.id);

        // 3. Check karein ke user mojood hai aur uska role 'admin' hai
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Access Denied. Admin privileges required." });
        }

        // 4. Agar admin hai, toh aage request ko chalne dein (controller tak)
        next();
        
    } catch (error) {
        console.error("Admin Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error in Admin Middleware" });
    }
};

module.exports = adminMiddleware;