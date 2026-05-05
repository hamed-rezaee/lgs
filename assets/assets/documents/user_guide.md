# Gate Lab — User Guide

This guide details the features, controls, and components available in Gate Lab.

## Contents

- Getting Started
- Workspace Basics
- Navigation & View
- Selecting, Moving, Copy/Paste, Delete
- Wiring
- Simulation Controls
- Menus & Commands
- Files, Import/Export
- Component Catalog
- Programmable Components & Scripting
- Lab Hub
- Troubleshooting

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

- **Top menu bar**: File/Edit/Tools/Collaboration/Help (+ Settings and Theme toggle buttons).
- **Components toolbar** (left): searchable component palette.
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

- Use **Edit → Reset Viewport** or press **Ctrl+R**.

### View toggles

Keyboard shortcuts (no dedicated menu — use these directly):

- Toggle **Minimap**: **Alt+M**
- Toggle **Components toolbar**: **Alt+T**
- Toggle **Status bar**: **Alt+Q**
- Toggle **Keyboard shortcuts helper**: **Alt+K**
- Toggle **Theme** (Light/Dark): **Alt+Shift+T**

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

After a wire is drawn and you have selected it:

- Click on the **small dot** between two segments to add a node and drag it.

### Remove wire segments (waypoints)

You can remove intermediate node points to straighten a wire trace out.

- Select the wire to reveal its nodes.
- **double-click** on a visible square node on the wire to remove it.
- **Note:** Wires are required to retain at least two node segments to maintain routing structure, so the final node cannot be deleted using this process.

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

- Start/Pause simulation: **Ctrl+Space**
- Stop simulation: **Shift+Space**

Notes:

- Output propagation is handled by the simulation engine; signals update continuously while running.
- If a custom script throws a runtime error, the simulator can enter an **error** state.

---

## 7. Menus & Commands

### File menu

- **New Workspace**: Start a new workspace (**Ctrl+N**)
- **Save Workspace**: Save workspace to app storage (**Ctrl+S**)
- **Restore Workspace**: Restore workspace from app storage (**Ctrl+L**)
- **Export Workspace**: Export workspace to `.lgs` (**Ctrl+E**)
- **Import Workspace**: Import workspace from `.lgs` (**Ctrl+I**)
- **Export Blueprint as PNG**: Render the current workspace as a PNG image
- **Export Blueprint as SVG**: Render the current workspace as an SVG

### Edit menu

- Copy (**Ctrl+C**)
- Paste (**Ctrl+V**)
- Select All (**Ctrl+A**)
- Clear Workspace (**Ctrl+D**)
- Delete selection (**Delete/Backspace**)
- Reset Viewport (**Ctrl+R**)

Note: Undo (**Ctrl+Z**) and Redo (**Ctrl+Y**) are available as dedicated buttons in the app bar.

### Tools menu

- **Optimize Wires** (**Ctrl+Shift+O**): collapse redundant wire segments
- **Auto Route Wires** (**Ctrl+Shift+R**): apply Manhattan routing to all wires

### Collaboration menu

- **Lab Hub** (**Alt+Shift+L**): open the Lab Hub panel (sign in/up required)
- **Collaboration Session** (**Alt+Shift+C**): open the real-time collaboration panel to host or join a session

### Help menu

- **User Guide** (opens this guide)
- **Script Syntax Guide** (opens the scripting reference)
- **Sample Projects** (loads bundled sample workspaces — see list below)
- Support Development
- Send Feedback
- Version display

#### Sample workspaces (via Help → Sample Projects)

- 4-Bit ALU
- 7-Segment Display
- 8-Bit Counter
- Custom 4x4 RAM
- Invader Matrix Display
- Keyboard Driver
- Keypad 4x4 Driver
- LCD Hello World

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

Components are available in the **Components toolbar** (left).

### 9.1 Input/Output & Timing

- **INPUT**: click to toggle output **Y** HIGH/LOW.
- **OUTPUT**: visual indicator driven by input **A**.
- **TRI-STATE BUFFER**: inputs **A**, control **EN**, output **Y**.
  - Implemented behavior: `Y = A AND EN`.
  - Note: although the UI text refers to High-Z, the simulator represents signals as booleans; disabled effectively drives LOW.
- **CLOCK**: configurable clock generator with **EN**; outputs a square wave.
- **DELAY GATE**: models RC capacitor-like signal delay behavior.
  - Input: **A**, Output: **Y**
  - **Delay**: rising edge (LOW → HIGH) is delayed by n ticks; falling edge (HIGH → LOW) is immediate.
  - If input goes LOW before the delay completes, the tick counter resets and the output stays LOW.
  - Configure via context menu → Configuration.
- **KEYBOARD INPUT**: captures physical keyboard input when **EN** is HIGH. Outputs an 8-bit ASCII code on **D0..D7** and sends a short pulse on the **STR** (Strobe) pin on key press.
- **KEYPAD 4x4**: 4×4 matrix keypad.
  - Inputs **C0-C3** (columns), outputs **R0-R3** (rows).
  - When a key is pressed and the corresponding column is HIGH, the matching row goes HIGH.
- **LABEL**: text label; right-click to edit text; can be used for annotations or as a non-interactive output display.
- **INPUT TUNNEL / OUTPUT TUNNEL**: signal “teleport” by Tunnel ID.
  - OutputTunnel outputs are the OR-combination of all InputTunnels with matching Tunnel ID (per pin index).
  - Configure Tunnel ID + pin count via context menu.

### 9.2 Basic Logic Gates

All basic gates output **Y** and use lettered inputs (A, B, …) depending on the gate.

- **NOT**: `Y = NOT A`
- **AND**: `Y = A AND B (...)`
- **OR**: `Y = A OR B (...)`
- **NAND**: `Y = NOT(AND(...))`
- **NOR**: `Y = NOT(OR(...))`
- **XOR**: `Y = A XOR B (...)`
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

- **D Flip-Flop**
- **T Flip-Flop**
- **SR Flip-Flop**
- **JK Flip-Flop**

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

- 2-bit
- 4-bit
- 8-bit

### 9.7 Multiplexers & Demultiplexers

- **MUX N×1** (2×1 free, 4×1/8×1):
  - Select lines: **S...** choose which input is routed to outputs.

- **DEMUX 1×N** (1×2 free, 1×4/1×8):
  - Select lines: **S...** choose which output receives the input.
  - Unselected outputs remain LOW.

### 9.8 Bus Systems

Bus components are **multi-bit multiplexers** used to route grouped data.

- Inputs are grouped per source (A0.., B0.., etc depending on size)
- Select lines choose which group routes to the output group.

### 9.9 Encoders & Decoders

- **Decoder (with EN)**: binary input → one-hot output.
- **Encoder (with EN)**: one-hot input → binary output.
  - Implemented as a priority encoder (highest active input wins).

### 9.10 Data Converters

- **PISO (Parallel-In Serial-Out)** (4-bit free, 8-bit):
  - Inputs: **D0..Dn**, Controls: **CLK**, **LD**, **CLR**, Output: **Y**
  - If LD=1 at CLK rising edge: loads inputs; else shifts.

- **SIPO (Serial-In Parallel-Out)** (4-bit free, 8-bit):
  - Input: **D**, Controls: **CLK**, **CLR**, Outputs: **Y...**
  - Shifts in on CLK rising edge.

### 9.11 Arithmetic Units

- **Adders (1/2/4/8-bit)**:
  - Inputs: **A...**, **B...**, Control: **Cin**
  - Outputs: **S...**, **Cout**

### 9.12 Comparators

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

- **MATRIX DISPLAY 32x32 / 64x64**:
  - Inputs: **X...**, **Y...**, **C** (Color/State)
  - Controls: **CLK**, **CLR**
  - Behavior: Writes the pixel (C) at coordinate (X, Y) on CLK rising edge. CLR clears the display.

- **Character LCD 1×16 / 2×16 / 4×16**:
  - Control pins: **D0–D7**, **RS**, **EN**
  - Writes on EN rising edge.
  - Commands supported: 0x01 Clear, 0x02 Home, 0x03 Cursor Right, 0x04 Cursor Left, 0x05 Show Cursor, 0x06 Hide Cursor.

### 9.14 Test & Measurement

- **Oscilloscope (1/2/4/8 channels)**:
  - Each channel is a control input pin **CH0..**
  - Displays waveform history (HIGH vs LOW) over time.

### 9.15 Subcircuits

- **Subcircuit Component**: Select multiple components and wires, right-click, and choose **Create Subcircuit** to package them into a single reusable component. The inputs and outputs of the selected inner components become the pins of the subcircuit. You can rename its pins via the context menu.

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

See the Script Syntax Guide in the Help menu for a complete reference of the scripting language used for programmable components.

---

## 11. Lab Hub

Lab Hub connects instructors and students through a shared course system backed by cloud storage. It requires an account (email + password) and an internet connection.

### Access

- **Collaboration → Lab Hub** (**Alt+Shift+L**) in the top menu bar.
- If you are not signed in, the sign-in/sign-up dialog appears first.

### Sign up / Sign in

1. Choose **Sign Up** if you do not have an account yet, or **Sign In** if you do.
2. On sign-up, enter a **Display Name**, choose a **Role** (Student or Instructor), then provide an email and password.
3. On sign-in, enter your email and password.
4. Use **Sign Out** inside the dashboard to log out.

---

### Instructor workflow

After signing in as an **Instructor** the **Instructor Dashboard** opens automatically.

#### Courses

- **Create a course**: click **New Course**, enter a name. A unique 6-character **join code** is generated and shown on the course card.
- **Delete a course**: click the delete icon on the course card. Deletion is blocked if any students are still enrolled.

#### Assignments

- Click a course to open its assignment list.
- **Upload Assignment**: click **Upload Assignment**, pick a `.lgs` file from your computer, then fill in a title and description. The assignment file is uploaded to cloud storage and attached to the course.
- Click an assignment to view its submissions.

#### Submissions

- Each submitted workspace is listed with the student's ID and submission time.
- Click a submission to load it into the canvas for review.

---

### Student workflow

After signing in as a **Student** the **Courses** dialog opens automatically.

#### Joining a course

1. Click **Join Course**.
2. Enter the **join code** provided by your instructor (case-insensitive).
3. The course appears in your course list.

#### Opening a lab

1. Click a course to see its assignments.
2. Click **Open** on an assignment.
3. If the canvas is not empty, you will be prompted to confirm — opening a lab replaces the current workspace.
4. The lab file is downloaded and loaded into the canvas.

#### Submitting an assignment

Once a lab is open:

1. Work on the circuit as normal.
2. Go to **File → Submit Assignment** (or trigger it from the app bar).
3. Confirm the submission. Your current workspace is uploaded and recorded under your account.
4. A snack-bar confirms success.

> **Note:** You must open a lab from the Lab Hub menu before you can submit. Attempting to submit without an active assignment shows an error prompt.

---

## 12. Troubleshooting

- **Can’t paste**: paste is only enabled after you copy at least one component.
- **Wire won’t connect**: ensure you’re connecting output↔input (same-direction cancels).
- **Routing looks odd**: try **Tools → Optimize Wires**, or toggle **Tools → Wire Routing**.
- **Custom component shows error**: open **Edit Script** and fix parse/runtime errors; simulator may enter an error state after a runtime exception.
