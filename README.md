# Project: arm-flow-composer

A fun browser-based app to create and simulate robotic arm tasks—no coding or hardware needed! Drag-and-drop motion blocks (like Move, Grip, Wait), tweak the parameters, preview actions in 3D, and export the result to a JSON file ready for robots.

---

**🌐 Try it live**: https://arm-flow-composer.onrender.com/

---

## Frontend (React + Blockly + SVG + Three.js)

### Features
- Drag-and-drop task block builder (Blockly)
- Configurable parameters: x/y/z, grip force, duration
- Animated robotic arm preview (3D via Three.js)
- Export JSON: users can download the task list as a .json file


### Structure
```
src/
├── components/
│   ├── ArmPreview.tsx
│   ├── TaskBlockEditor.tsx
│   └── ExportModal.tsx
├── views/
│   └── BuilderPage.tsx
└── App.tsx
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- npm

### Steps
```bash
git clone https://github.com/yourusername/arm-flow-composer.git
cd arm-flow-composer
npm install
npm run dev
```

Visit `http://localhost:8080` in your browser.

---

## Backend (FastAPI)

*(In progress)*

Planned endpoints:
- `POST /simulate` — Accepts JSON task list, returns simulated steps
- `POST /export` — Saves task list to server (optional)
- `GET /example_task` — Returns example or template task

---

## DevOps / Integration

- `docker-compose.yml` to run frontend + backend (planned)
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
- **Frontend**: React, TypeScript, Blockly, SVG, Three.js, Tailwind or MUI
- **DevOps**: GitHub Actions, Pre-commit

---


## Future Enhancements

### Task Planning & Simulation
- Add FastAPI backend for simulation and validation
- Display estimated execution time for task sequences
- Improve task feedback: success/failure simulation
- Enable basic collision detection or range checks

### File Handling & Integration
- Allow saving/loading task files to/from local disk
- Implement undo/redo history for task editing
- Support real hardware output: ROS/URScript export

### Robotics & Models
- Support different robotic arm models with presets

### Perception & Vision 
- Add simulated object detection in 3D view
- Visualize robot arm's field of view (FOV) or detection range
- Enable basic perception-based decision logic (e.g., pick object if detected)
- Add camera-based alignment or guidance in simulation

---

## README Callout
> This project is a fun exploration of building a no-code robotics interface for arm manipulators—mixing drag-and-drop coding, 3D animation, and a bit of creative tinkering around robot task design.
