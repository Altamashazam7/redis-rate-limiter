const express = require("express");
const Redis = require("ioredis");
const rateLimiter = require("./rateLimiter");

const app = express();
const redis = new Redis();
const PORT = 3000;

app.use(express.json());
app.use(rateLimiter);

const fetchUserData = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    userId,
    name: "Altamash Azam",
    role: "AI Engineer",
    skills: ["Python", "LangChain", "FastAPI", "Node.js", "Redis"]
  };
};

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const cacheKey = "user:" + userId;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json({
        source: "cache",
        data: JSON.parse(cachedData)
      });
    }

    const userData = await fetchUserData(userId);
    await redis.set(cacheKey, JSON.stringify(userData), "EX", 30);

    return res.json({
      source: "database",
      data: userData
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
