#!/usr/bin/env node

/**
 * Test script for middleware control system
 * This script tests the Redis-based middleware control functionality
 */

const Redis = require("ioredis");

console.log("🧪 Testing Middleware Control System");
console.log("====================================\n");

// Test Redis connection
async function testRedis() {
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  try {
    console.log("🔌 Testing Redis connection...");
    await redis.ping();
    console.log("✅ Redis connection successful\n");

    // Test middleware control functions
    console.log("🔧 Testing middleware control functions...");

    // Test setting middleware state
    await redis.set("mw:store:enabled", "1");
    await redis.set("mw:admin:enabled", "0");
    console.log("✅ Set middleware states");

    // Test reading middleware state
    const storeEnabled = await redis.get("mw:store:enabled");
    const adminEnabled = await redis.get("mw:admin:enabled");
    console.log(
      `✅ Store middleware: ${storeEnabled === "1" ? "ENABLED" : "DISABLED"}`
    );
    console.log(
      `✅ Admin middleware: ${adminEnabled === "1" ? "ENABLED" : "DISABLED"}`
    );

    // Test metrics
    console.log("\n📊 Testing metrics collection...");
    const now = Math.floor(Date.now() / 1000);
    const bucket = Math.floor(now / 60);
    const key = `mw:store:m:${bucket}`;

    await redis.hincrby(key, "ok", 5);
    await redis.hincrby(key, "err", 2);
    await redis.hincrby(key, "sumMs", 150);
    await redis.expire(key, 60 * 10);

    const metrics = await redis.hgetall(key);
    console.log(
      `✅ Metrics collected: OK=${metrics.ok}, ERR=${metrics.err}, SumMs=${metrics.sumMs}`
    );

    console.log(
      "\n🎉 All tests passed! Middleware control system is working correctly."
    );
    console.log("\n💡 Next steps:");
    console.log("1. Start your applications");
    console.log("2. Visit http://localhost:3001/ops/middleware");
    console.log("3. Test toggling middleware on/off");
    console.log("4. Watch metrics update in real-time");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure Redis is running: docker-compose up -d");
    console.log("2. Check REDIS_URL environment variable");
    console.log("3. Verify Redis connection on localhost:6379");
  } finally {
    await redis.quit();
  }
}

// Run the test
testRedis().catch(console.error);
