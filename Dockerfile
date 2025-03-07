# Sử dụng image Node.js
FROM node:17.9.1

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "run", "start:prod"]