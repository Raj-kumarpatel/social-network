# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# PM2 install karo
RUN npm install pm2 -g

COPY --from=builder /app/dist ./dist

EXPOSE 8080

# PM2 se app run karo
CMD ["pm2-runtime", "dist/index.js"]