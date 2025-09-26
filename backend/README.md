# 1. 克隆项目
```bash
git clone https://github.com/PeisongHao/chuwaProj0.git
cd backend
```

# 2. 创建 .env 文件
## 在项目根目录新建 .env 文件，并写入以下内容
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.lsolddr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
其中<db_username> 和 <db_password> 需要拍改成云端创建的账户和密码

# 3. 安装依赖
```bash
npm install
```
# 4.启动项目
## 生产模式
npm start

## 开发模式（自动重启）
npm run dev

# 5. 验证运行

## 启动成功后，终端会看到类似信息：
```bash
Server is running on port 3000
Connected to MongoDB
```