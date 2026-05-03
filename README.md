# 🎯 三角洲行动新手攻略

> 面向《三角洲行动》新玩家的地图探索与高价值物资分布指南

## 功能特色

- **🗺️ 交互式地图** — 5张精心绘制的游戏地图，标注所有高价值物资点位
- **🔍 物资筛选** — 按类型（武器/弹药/医疗/钥匙/电子/贵重物品）筛选物资
- **📊 稀有度标识** — 普通、稀有、史诗、传说四级稀有度，颜色直观区分
- **💡 新手攻略** — 20条精选攻略，覆盖移动、战斗、搜刮、意识、装备、策略六大维度
- **🌙 暗色主题** — 军事风格暗色界面，长时间使用不伤眼
- **📱 响应式设计** — 桌面端和移动端均可流畅使用

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + TailwindCSS v3 |
| 地图 | Leaflet + React-Leaflet |
| 后端 | Python FastAPI |
| 数据库 | SQLite |
| 部署 | Docker + Nginx |

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
docker-compose up --build
```

访问 http://localhost 查看前端，http://localhost:8000/docs 查看 API 文档。

### 方式二：本地开发

**后端：**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py  # 初始化数据库
python main.py  # 启动服务
```

**前端：**
```bash
cd frontend
npm install
npm run dev
```

前端开发服务器运行在 http://localhost:5173，自动代理 /api 请求到后端。

## 项目结构

```
delta-force-guide/
├── frontend/                # React 前端
│   ├── src/
│   │   ├── api/             # API 客户端
│   │   ├── components/      # 通用组件
│   │   ├── pages/           # 页面组件
│   │   └── types/           # TypeScript 类型定义
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                 # FastAPI 后端
│   ├── main.py              # API 路由
│   ├── database.py          # 数据库连接
│   ├── models.py            # Pydantic 数据模型
│   ├── seed.py              # 数据初始化脚本
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/maps | 获取所有地图列表 |
| GET | /api/maps/{id} | 获取地图详情（含物资点位） |
| GET | /api/loot?map_id=&type= | 筛选物资点位 |
| GET | /api/loot/types | 获取物资类型列表 |
| GET | /api/tips?category=&difficulty= | 获取攻略提示 |

## 地图数据

| 地图 | 难度 | 物资点数 | 特点 |
|------|------|----------|------|
| 零号大坝 | ★★☆☆☆ | 18 | 新手推荐，场景紧凑 |
| 长弓溪谷 | ★★★☆☆ | 17 | 开阔山地，狙击为主 |
| 巴克什 | ★★★★☆ | 17 | 城市巷战，近距离交战 |
| 空间站 | ★★★★★ | 17 | 高难度，传说物资多 |
| 坠机之地 | ★★★☆☆ | 17 | 混合地形，战斗多变 |

## 开源协议

MIT License
