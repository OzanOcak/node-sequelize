## squelize sqlite to node.js

---

### 1.

```javascript
touch server.js
npm init -y
yarn add express sequelize sqlite3
yarn add --dev nodemon
```

---

### 2. creating model

curl http://localhost:3000/posts -X POST -d <json query>

```json
{ "username": "tom", "email": "tom@go.com", "password": "psswd" }
```

then we can check it in sql explorer
