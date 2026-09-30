const Redis = require("ioredis");
const redis = new Redis();

const rateLimiter = async (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const key = "rate_limit:" + clientIP;
  const currentTime = Date.now();
  const windowSizeInMs = 60 * 1000;
  const maxRequests = 10;

  try {
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, currentTime - windowSizeInMs);
    pipeline.zadd(key, currentTime, currentTime);
    pipeline.zcard(key);
    pipeline.expire(key, 60);

    const results = await pipeline.exec();
    const requestCount = results[2][1];

    if (requestCount > maxRequests) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Maximum " + maxRequests + " requests per minute allowed.",
        retryAfterSeconds: 60
      });
    }

    next();
  } catch (error) {
    console.error("Redis Rate Limiter Error:", error);
    next();
  }
};

module.exports = rateLimiter;
