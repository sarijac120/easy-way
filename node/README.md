# Ride Match – Backend

Express + TypeScript API for matching fixed ride groups.

## Quick Start

```bash
# install dependencies
npm install

# copy environment variables
cp .env.example .env
# edit .env and add your MongoDB URI

# development
npm run dev

# production
npm run build && npm start
```

## Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | /api/user | Register |
| POST | /api/user/login | Login |
| GET | /api/rideGroup | List ride groups |
| POST | /api/rideGroup | Create ride group (Driver) |
| POST | /api/booking | Create booking (Passenger) |

Refer to the project specification for full API details.