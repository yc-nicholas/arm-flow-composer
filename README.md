# Project: arm-flow-composer

A browser-based no-code application to configure and simulate robotic arm tasks. Users can drag-and-drop motion blocks (e.g. MoveTo, Pick, Place), edit parameters, preview actions in 2D, and export to a robot-readable JSON format. The goal is to demonstrate clean architecture, UI/UX thinking, and robotics domain awareness without relying on ROS or hardware.

---

## Frontend (React + Blockly + SVG)

### Features
- Drag-and-drop task block builder (Blockly)
- Configurable parameters: x/y/z, grip force, duration
- Animated 2D robotic arm preview using SVG or Canvas
- Buttons: "Run Simulation", "Export JSON", "Import JSON"
- Form validation and error feedback (e.g. unreachable position)

### Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ArmPreview.tsx
│   │   ├── TaskBlockEditor.tsx
│   │   └── ExportModal.tsx
│   ├── views/
│   │   └── BuilderPage.tsx
│   └── App.tsx
├── public/
└── vite.config.ts
```

---

## Backend (FastAPI)

### Endpoints
- `POST /simulate` — Accepts JSON task list, returns simulated steps
- `POST /export` — Saves task list to server (optional)
- `GET /example_task` — Returns example or template task

### Structure
```
backend/
├── main.py
├── api/
│   ├── simulate.py
│   └── models.py
├── services/
│   └── simulator.py
├── tests/
└── Dockerfile
```

### Practices
- SOLID service separation
- Pydantic v2 for schema validation
- GitHub Actions CI for test + lint
- Pre-commit: black, isort, ruff

---

## DevOps / Integration

- `docker-compose.yml` to run frontend + backend
- Linting and test workflow in `.github/workflows/`
- VS Code devcontainer config (optional)

---

## Example JSON Format (export)
```json
[
  { "action": "MoveTo", "x": 0.2, "y": 0.1, "z": 0.3 },
  { "action": "Pick", "grip": 40 },
  { "action": "MoveTo", "x": 0.1, "y": 0.1, "z": 0.4 },
  { "action": "Place", "release": true }
]
```

---

## Tech Stack Summary
- **Frontend**: React, TypeScript, Blockly, SVG, Tailwind or MUI
- **Backend**: FastAPI, Pydantic v2, Docker
- **DevOps**: Docker Compose, GitHub Actions, Pre-commit

---

## Future Enhancements (Optional)
- ROS/URScript export option
- Task validation engine
- 3D preview using Three.js
- Collaborative real-time editing (WebSocket)

---

## README Callout
> This project simulates a no-code robotics programming interface for arm manipulators. It demonstrates clean software architecture, thoughtful UI/UX, and domain-aware abstraction for robotic task design.
