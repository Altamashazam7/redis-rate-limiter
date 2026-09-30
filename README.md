# High-Performance Distributed Rate Limiter & Caching Engine

A scalable backend architecture built with **Node.js**, **Express**, and **Redis** implementing an atomic sliding-window rate limiter and an in-memory TTL caching layer. Containerized using **Docker** for seamless local setup and production deployment.

## ?? Key Features

* **Atomic Sliding-Window Rate Limiter:** Utilizes Redis Sorted Sets (`ZSET`) and atomic pipelines (`multi`/`exec`) to prevent race conditions and enforce strict request limits per client IP.
* **Sub-10ms Response Caching:** Caches high-latency database calls using Redis string keys with explicit Time-To-Live (TTL) expiration policies.
* **Fully Containerized Environment:** Pre-configured `docker-compose.yml` to instantly spin up Redis services.

---

## ??? Tech Stack

* **Runtime:** Node.js, Express.js
* **Database / Cache:** Redis (`ioredis` client)
* **Infrastructure:** Docker, Docker Compose
* **Development Tools:** Nodemon, Git

---

## ??? Architecture & Logic

### 1. Sliding-Window Rate Limiter
1. Incoming requests capture the client IP address.
2. Expired timestamps outside the current window (`currentTime - 60s`) are removed via `ZREMRANGEBYSCORE`.
3. The current request timestamp is appended via `ZADD`.
4. Total request counts inside the active 60-second window are calculated via `ZCARD`.
5. If requests exceed **10 req/min**, HTTP `429 Too Many Requests` is returned immediately.

### 2. TTL Caching Flow
* **Cache Miss:** Queries the database (simulated 2-second delay), writes result to Redis with a **30-second TTL**, and returns payload with `"source": "database"`.
* **Cache Hit:** Retrieves data directly from Redis in **< 10ms** and returns payload with `"source": "cache"`.

---

## ?? Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
* [Node.js](https://nodejs.org/) (v18+ recommended)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Altamashazam7/redis-rate-limiter.git](https://github.com/Altamashazam7/redis-rate-limiter.git)
   cd redis-rate-limiter
