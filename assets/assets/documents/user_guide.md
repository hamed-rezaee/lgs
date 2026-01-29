# Logic Gate Simulator — User Guide

This guide describes the **actual features implemented in the app** (menus, shortcuts, editor behavior, file formats, and built-in components).

## Contents

- [1. Getting Started](#1-getting-started)
- [2. Workspace Basics](#2-workspace-basics)
- [3. Navigation & View](#3-navigation--view)
- [4. Selecting, Moving, Copy/Paste, Delete](#4-selecting-moving-copypaste-delete)
- [5. Wiring](#5-wiring)
- [6. Simulation Controls](#6-simulation-controls)
- [7. Menus & Commands](#7-menus--commands)
- [8. Files, Import/Export](#8-files-importexport)
- [9. Component Catalog](#9-component-catalog)
- [10. Programmable Components & Scripting](#10-programmable-components--scripting)
- [11. Troubleshooting](#11-troubleshooting)

---

## 1. Getting Started

### Build a first circuit (30 seconds)

1. Drag **INPUT** from the Components toolbar onto the canvas.
2. Drag a logic gate (for example **AND**) onto the canvas.
3. Drag **OUTPUT** onto the canvas.
4. Create wires by clicking pins (see [Wiring](#5-wiring)).
5. Press **Space** to start/pause simulation.
6. Click the **INPUT** component to toggle it HIGH/LOW.

### What you see on screen

- **Top menu bar**: File/Edit/View/Tools/Samples/Help.
- **Components toolbar** (left): searchable component palette (some items show **PRO**).
- **Canvas** (center): place components, draw wires, select/edit.
- Optional:
  - **Minimap** (toggleable)
  - **Status bar** with contextual hints (toggleable)
  - **Keyboard shortcuts helper** overlay (toggleable)

---

## 2. Workspace Basics

- A **workspace** is your current circuit (components + wires + some configuration).
- You can **save/load** the current workspace to persistent app storage.
- You can **export/import** workspaces as `.lgs` files.
- You can load built-in **sample** workspaces from the Samples menu.

---

## 3. Navigation & View

### Pan and zoom

- Pan/zoom uses the canvas viewer controls (mouse/trackpad depending on platform).

### Reset viewport

- Use **View → Reset Viewport** or press **R**.

### View toggles

Use **View** menu or the shortcuts:

- Toggle **Minimap**: **M**
- Toggle **Components toolbar**: **C**
- Toggle **Status bar**: **I**
- Toggle **Keyboard shortcuts helper**: **K**
- Toggle **Theme** (Light/Dark): **Ctrl+T**

---

## 4. Selecting, Moving, Copy/Paste, Delete

### Selecting components

- Click a component to select it.
- Drag on empty canvas to draw a **selection rectangle**.
- Hold **Ctrl** while selecting to add to the selection.

### Selecting wires

- Click a wire to select it.
- Right-clicking a wire can also select it (context menu).

### Moving components

- Drag selected components to move them.

### Copy / Paste

- Copy: **Ctrl+C** (copies selected components).
  - Wires are copied **only if both endpoints** are within the selected components.
- Paste: **Ctrl+V**
  - Each subsequent paste offsets by `(20, 20)` more than the previous paste.
  - If you paste from the wire/canvas context menu, paste can target the **clicked location**.

### Delete

- Delete selected components/wires: **Delete** or **Backspace**.
- Clear entire workspace: **Ctrl+D** or **Edit → Clear Workspace**.

Undo/Redo:

- Undo: **Ctrl+Z**
- Redo: **Ctrl+Y**

---

## 5. Wiring

### Create a wire

1. Click a **pin** on a component to start wiring.
2. Valid destination pins are highlighted.
3. Move the cursor near a valid pin to **snap** to it.
4. Click the destination pin to connect.

Rules enforced by the editor:

- You can only connect **output → input** (or **input → output**). Attempting to connect same-direction pins cancels wiring.
- Attempting to create a duplicate wire between the same two pins cancels wiring.

### Add manual wire segments (waypoints)

While you are drawing a wire:

- Click on the **canvas** to add a manual segment point (waypoint).
- Once you add manual segments, auto-routing will no longer override your segments for that wire.

### Cancel wiring

- Press **Esc** (cancel/clear shortcut), or
- Right-click (depending on the current interaction state).

### Auto-routing (“Wire Routing”)

- Toggle: **Tools → Wire Routing**.
- When enabled (and you have not added manual segments), the app generates a **Manhattan-style route** for the wire while you draw it.

### Optimize wires

- Optimize all wires: **Ctrl+O** or **Tools → Optimize Wires**.
- Optimize selected wires: via the wire context menu.

---

## 6. Simulation Controls

Simulation state shortcuts:

- Start/Pause simulation: **Space**
- Stop simulation: **Shift+Space**

Notes:

- Output propagation is handled by the simulation engine; signals update continuously while running.
- If a custom script throws a runtime error, the simulator can enter an **error** state.

---

## 7. Menus & Commands

### File menu

- **New**: Start a new workspace (**Ctrl+N**)
- **Save**: Save workspace to app storage (**Ctrl+S**)
- **Load**: Load workspace from app storage (**Ctrl+L**)
- **Export**: Export workspace to `.lgs` (**Ctrl+E**)
- **Import**: Import workspace from `.lgs` (**Ctrl+I**)
- **Export as PNG**: Render the current workspace as a PNG image
- **Export as SVG**: Render the current workspace as an SVG

### Edit menu

- Copy (**Ctrl+C**)
- Paste (**Ctrl+V**)
- Select All (**Ctrl+A**)
- Clear Workspace (**Ctrl+D**)
- Delete selection (**Delete/Backspace**)

### View menu

- Reset viewport (**R**)
- Toggle minimap (**M**)
- Toggle components toolbar (**C**)
- Toggle status bar (**I**)
- Toggle keyboard shortcuts helper (**K**)
- Toggle Light/Dark theme (**Ctrl+T**)

### Tools menu

- **Wire Routing** (toggle): enable/disable Manhattan routing while drawing wires
- **Optimize Wires** (**Ctrl+O**)

### Samples menu

Loads bundled sample workspaces:

- 4-Bit ALU
- 7-Segment Display
- 8-Bit Counter
- Custom 4x4 RAM
- Keypad 4x4 Driver
- LCD Hello World

### Help menu

- Script Syntax Guide (opens the in-app guide)
- Support Development
- Send Feedback
- Version display

---

## 8. Files, Import/Export

### Workspace files (`.lgs`)

- Exported/imported workspace files use the `.lgs` extension.

### Memory files (`.lgm`)

- Memory components can export/import memory contents as `.lgm` from the memory editor dialog.

### Image export

- PNG and SVG exports are available from the File menu.

---

## 9. Component Catalog

Components are available in the **Components toolbar** (left). Items labeled **PRO** are gated behind premium mode.

### 9.1 Input/Output & Timing

- **INPUT**: click to toggle output **Y** HIGH/LOW.
- **OUTPUT**: visual indicator driven by input **A**.
- **TRI-STATE BUFFER**: inputs **A**, control **EN**, output **Y**.
  - Implemented behavior: `Y = A AND EN`.
  - Note: although the UI text refers to High-Z, the simulator represents signals as booleans; disabled effectively drives LOW.
- **CLOCK**: configurable clock generator with **EN**; outputs a square wave.
- **KEYPAD 4x4**: 4×4 matrix keypad.
  - Inputs **C0-C3** (columns), outputs **R0-R3** (rows).
  - When a key is pressed and the corresponding column is HIGH, the matching row goes HIGH.
- **LABEL**: text label; double-click to edit.
- **INPUT TUNNEL / OUTPUT TUNNEL**: signal “teleport” by Tunnel ID.
  - OutputTunnel outputs are the OR-combination of all InputTunnels with matching Tunnel ID (per pin index).
  - Configure Tunnel ID + pin count via context menu.

### 9.2 Basic Logic Gates

All basic gates output **Y** and use lettered inputs (A, B, …) depending on the gate.

- **NOT**: `Y = NOT A`
- **AND**: `Y = A AND B (...)
- **OR**: `Y = A OR B (...)`
- **NAND**: `Y = NOT(AND(...))`
- **NOR**: `Y = NOT(OR(...))`
- **XOR**: `Y = A XOR B (...)
- **XNOR**: `Y = NOT(XOR(...))`

### 9.3 Programmable

- **CUSTOM COMPONENT**: define combinational logic using the built-in scripting language.
- **CUSTOM SEQUENTIAL COMPONENT**: define clocked/stateful logic using scripting (`clock:` and `state:` support).
- **TRUTH TABLE**: define custom combinational logic via a table editor (1–8 inputs, 1–8 outputs).

### 9.4 Flip-Flops

Flip-flops share the same control pins:

- Controls: **CLK** (rising-edge), **RST** (reset).
- Outputs: **Q**, **~Q**.

Available:

- **D Flip-Flop** (free)
- **T Flip-Flop** (PRO)
- **SR Flip-Flop** (PRO)
- **JK Flip-Flop** (PRO)

### 9.5 Registers & Memory

- **REGISTER 4/8/16-bit**:
  - Inputs: **D0..D(n-1)**
  - Controls: **CLK**, **LD**, **INC**, **CLR**
  - Outputs: **Y0..Y(n-1)**
  - Behavior: on CLK rising edge, CLR has highest priority, then LD, then INC.

- **MEMORY 128x4 / 128x8**:
  - Address inputs: **A0..**
  - Data inputs: **D0..**
  - Controls: **WE** (write enable), **RE** (read enable)
  - Outputs: **Y0..**
  - Behavior:
    - If **WE=1**, writes D to selected address.
    - Else if **RE=1**, reads selected address to outputs.
    - Else outputs are LOW.
  - Memory editor is available via context menu.

### 9.6 Counters

- Inputs: **CLK**
- Control: **RST**
- Outputs: **Y0..Y(n-1)**
- Behavior: increments on CLK rising edge; wraps around; RST resets to 0.

Available:

- 2-bit (PRO)
- 4-bit (free)
- 8-bit (PRO)

### 9.7 Multiplexers & Demultiplexers

- **MUX N×1** (2×1 free, 4×1/8×1 PRO):
  - Select lines: **S...** choose which input is routed to outputs.

- **DEMUX 1×N** (1×2 free, 1×4/1×8 PRO):
  - Select lines: **S...** choose which output receives the input.
  - Unselected outputs remain LOW.

### 9.8 Bus Systems (PRO)

Bus components are **multi-bit multiplexers** used to route grouped data.

- Inputs are grouped per source (A0.., B0.., etc depending on size)
- Select lines choose which group routes to the output group.

### 9.9 Encoders & Decoders

- **Decoder (with EN)**: binary input → one-hot output.
- **Encoder (with EN)**: one-hot input → binary output.
  - Implemented as a priority encoder (highest active input wins).

### 9.10 Data Converters

- **PISO (Parallel-In Serial-Out)** (4-bit free, 8-bit PRO):
  - Inputs: **D0..Dn**, Controls: **CLK**, **LD**, **CLR**, Output: **Y**
  - If LD=1 at CLK rising edge: loads inputs; else shifts.

- **SIPO (Serial-In Parallel-Out)** (4-bit free, 8-bit PRO):
  - Input: **D**, Controls: **CLK**, **CLR**, Outputs: **Y...**
  - Shifts in on CLK rising edge.

### 9.11 Arithmetic Units (PRO)

- **Adders (1/2/4/8-bit)**:
  - Inputs: **A...**, **B...**, Control: **Cin**
  - Outputs: **S...**, **Cout**

### 9.12 Comparators (PRO)

- **Comparators (1/2/4/8-bit)**:
  - Inputs: **A...**, **B...**
  - Outputs: **LT**, **EQ**, **GT** (exactly one is HIGH)

### 9.13 Displays

- **7-Segment Display**:
  - Inputs: **A..G**, **DP**, Control: **EN**
  - Each input directly drives the corresponding segment.

- **7-Segment Decoder**:
  - Inputs: **D0..D3** (4-bit)
  - Outputs: **A..G**
  - Converts 0–15 to seven-segment patterns (0–9 numeric, 10–15 A–F).

- **Character LCD 1×16 / 2×16 / 4×16**:
  - Control pins: **D0–D7**, **RS**, **EN**
  - Writes on EN rising edge.
  - Commands supported: 0x01 Clear, 0x02 Home, 0x03 Cursor Right, 0x04 Cursor Left, 0x05 Show Cursor, 0x06 Hide Cursor.

### 9.14 Test & Measurement

- **Oscilloscope (1/2/4/8 channels)**:
  - Each channel is a control input pin **CH0..**
  - Displays waveform history (HIGH vs LOW) over time.

---

## 10. Programmable Components & Scripting

### Script editor

Custom components and custom sequential components support editing scripts.

- Use the component context menu → **Edit Script**.
- The editor includes formatting and validation.

### Truth table editor

- Use the component context menu → **Edit Table**.
- Configure input/output pin count and fill the truth table.

### Full language reference

See the Script Syntax Guide:

- In-app: **Help → Script Syntax Guide**
- In repo: `assets/documents/script_syntax_guide.md`

---

## 11. Troubleshooting

- **Can’t paste**: paste is only enabled after you copy at least one component.
- **Wire won’t connect**: ensure you’re connecting output↔input (same-direction cancels).
- **Routing looks odd**: try **Tools → Optimize Wires**, or toggle **Tools → Wire Routing**.
- **Custom component shows error**: open **Edit Script** and fix parse/runtime errors; simulator may enter an error state after a runtime exception.
