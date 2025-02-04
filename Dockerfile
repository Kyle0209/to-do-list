# 使用 Node.js 官方映像
FROM node:16-alpine

# 複製 package.json 和 package-lock.json 並安裝依賴
COPY package*.json ./
RUN npm install

# 複製所有檔案到容器中
COPY . .

ENV PORT=8088
# 暴露應用運行端口
EXPOSE 8088

# 啟動應用
CMD ["node", "server.cjs"]

