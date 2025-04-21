# Custom Component Scripting Guide

The Logic Gate Simulator allows you to create custom components using a concise, C-like scripting language. This guide provides a complete reference to the language syntax, structure, and features, enabling you to build complex custom logic gates and chips.

---

## Table of Contents

- Script Structure
- Component Definitions
  - Inputs
  - Outputs
  - Clock
  - State
- Syntax and Language Features
  - Semicolons
  - Data Representation
  - Variables and Buses
  - Comments
- Operators
  - Arithmetic Operators
  - Comparison Operators
  - Logical Operators
  - Bitwise Operators
  - Assignment Operators
  - Conditional (Ternary) Operator
- Control Flow
  - If-Else Statements
- Complete Examples
  - Example 1: Combinatorial Logic (ALU)
  - Example 2: Sequential Logic (Counter)
  - Example 3: Random Access Memory (RAM)

---

## Script Structure

---

Every script consists of two distinct sections:

1.  **Header Declarations**: Located at the very top, defining the interface (inputs/outputs) and internal memory.
2.  **Logic Section**: The procedural code that defines how outputs and state variables are updated based on inputs.

---

## Component Definitions

---

The header section uses specific keywords to define your component's pins and properties. Each declaration must be on its own line and appear **before any logic code**. Each section can be defined only **once**.

### Inputs

Defines the input pins for your component.

- **Keyword**: `inputs:`
- **Syntax**: Comma-separated list of names. Use brackets `[]` for multi-bit buses.
- **Example**: `inputs: Enable, Data[8], Select[2]`

### Outputs

Defines the output pins for your component.

- **Keyword**: `outputs:`
- **Syntax**: Comma-separated list of names. Use brackets `[]` for multi-bit buses.
- **Example**: `outputs: Result[8], Overflow`

### Variables

Defines local variables for use within the script. All variables are initialized to 0 before the script executes.

- **Keyword**: `vars:`
- **Syntax**: Comma-separated list of names. Use brackets `[]` for arrays. Multi-dimensional arrays (e.g., `[4][4]`) are supported.
- **Example**: `vars: temp[4], counter`

> **Inline Declaration**: Variables can also be declared in the body using the `var` keyword.
>
> - `var temp = 1;` (Scalar declaration with initialization)
> - `var arr[4];` (Array declaration)
> - `var arr[4] = 15;` (Array declaration with assignment)
>
> **Scope**: Variables must be declared before use. Declarations are effectively script-wide (hoisted), but initialization happens where the statement is located.

### Clock

Required only for sequential logic (components that have memory or state).

- **Keyword**: `clock:`
- **Syntax**: A single name for the clock input pin.
- **Behavior**: The script body executes only on the **rising edge** of this signal (transition from 0 to 1).
- **Example**: `clock: CLK`

### State

Defines internal memory that persists between clock cycles. This is only valid if a `clock` is also defined.

- **Keyword**: `state:`
- **Syntax**: names with dimensions. Can be single values, arrays, or 2D matrices.
- **Example**: `state: counter_val[8], ram[16][8]`

---

## Syntax and Language Features

---

### Semicolons

All statements in the logic body must end with a semicolon `;`. Header declarations do not use semicolons.

```plaintext
inputs: A, B  # No semicolon in header

val = A + B;  # Semicolon required
```

### Data Representation

- **Integers**: All variables are treated as 64-bit signed integers.
- **Logic Levels**:
  - `0` represents logic **LOW** (False).
  - Any non-zero value represents logic **HIGH** (True).
  - The keywords `true` (alias for `1`) and `false` (alias for `0`) are available.
- **Bus/Array Truncation**: When assigning a large integer value to a declared array/bus (e.g., `Out[4] = 255`), the value is truncated. Only the bits that fit the array size (least significant bits) are applied.
- **Number Formats**:
  - Decimal: `123`, `-5`
  - Hexadecimal: `0xFF`, `0x1A`

### Variables and Buses

Variables used in the script must be declared in one of the header sections (`inputs`, `outputs`, `state`, `vars`) or inline using the `var` keyword.

- **Scalar Variables**: Single values.
  - _Example_: `var temp = A + B;`
- **Arrays/Buses**: Access specific bits or elements using `[]`. Indexing is 0-based.
  - _Example_: `val = Data[0];` (Accesses the first bit/element)
  - _Example_: `Data[2] = 1;` (Sets the third bit/element)
- **Full Bus Access**: using the name without brackets handles the entire value.
  - _Example_: `Result = Data;` (Copies all bits from Data to Result)

### Comments

Comments start with the hash symbol `#` and continue to the end of the line. They can appear on their own line or after code.

- _Example_: `# This is a comment`
- _Example_: `val = 1; # Valid inline comment`

### Reserved Keywords

The following words are reserved and cannot be used as variable names:
`if`, `else`, `true`, `false`, `var`, `inputs`, `outputs`, `state`, `clock`, `vars`.

---

## Operators

---

The language supports a wide range of operators. They are listed below by category.

### Arithmetic Operators

Perform standard mathematical calculations. Standard operator precedence applies (e.g., multiplication before addition).

- `+` : Addition
- `-` : Subtraction
- `*` : Multiplication
- `/` : Division (Integer division). Division by zero returns result `0`.
- `%` : Modulo (Remainder). Modulo by zero returns result `0`.

_Example_:

```c
val = (A + B) * 2;
remainder = count % 16;
```

### Comparison Operators

Compare two values and return 1 (true) or 0 (false).

- `==` : Equal to
- `!=` : Not equal to
- `<` : Less than
- `>` : Greater than
- `<=` : Less than or equal to
- `>=` : Greater than or equal to

_Example_:

```c
is_zero = (val == 0);
if (val > 15) { ... }
```

### Logical Operators

Perform boolean logic operations. Short-circuit evaluation is supported.

- `&&` : Logical AND (true if both operands are true/non-zero).
- `||` : Logical OR (true if either operand is true/non-zero).
- `!` : Logical NOT (inverts the boolean value).

_Example_:

```c
if (Enable && !Reset) { ... }
```

### Bitwise Operators

Operate on the individual bits of integer values.

- `&` : Bitwise AND
- `|` : Bitwise OR
- `^` : Bitwise XOR (Exclusive OR)
- `~` : Bitwise NOT (One's complement)
- `<<` : Left Shift
- `>>` : Right Shift

_Example_:

```c
input = 255;
masked = input & 0x0F;  # Keep only bottom 4 bits (binary 1111)
shifted = 1 << 3;      # Result is 8 (binary 1000)
```

### Assignment Operators

- `=` : Basic assignment. Sets the variable on the left to the value on the right.

### Conditional (Ternary) Operator

A shorthand for if-else statements.

- `? :` : Format is `condition ? value_if_true : value_if_false`

_Example_:

```c
# If A is greater than B, max is A, otherwise max is B
max = (A > B) ? A : B;
```

---

## Control Flow

---

### If-Else Statements

Use `if` statements to execute code conditionally.

- **Syntax**:

  ```c
  if (condition) {
      # statements
  } else if (another_condition) {
      # statements
  } else {
      # statements
  }
  ```

  > **Note**: Curly braces `{ }` are required for the code blocks.

---

## Complete Examples

---

### Example 1: Combinatorial Logic (ALU)

This script creates a simple Arithmetic Logic Unit. It has no clock, so outputs update immediately when inputs change.

```plaintext
# Header Declarations
inputs: PacketA[4], PacketB[4], OpCode[2]
outputs: Result[4], IsZero

# Body Logic

var val = 0; # Temporary variable

# Determine operation based on OpCode
if (OpCode == 0) {
    # Addition
    val = PacketA + PacketB;
} else if (OpCode == 1) {
    # Subtraction
    val = PacketA - PacketB;
} else if (OpCode == 2) {
    # Bitwise AND
    val = PacketA & PacketB;
} else {
    # Bitwise OR
    val = PacketA | PacketB;
}

# Assign result to output
Result = val;

# Set Zero flag using ternary operator
IsZero = (Result == 0) ? 1 : 0;
```

### Example 2: Sequential Logic (Counter)

This creates an 8-bit counter that increments on every clock cycle. It requires `clock` and `state`.

```plaintext
# Header Declarations
clock: CLK
inputs: Reset, Enable
outputs: Count[8]
state: internal_count[8] # Persistent memory

# Body Logic

if (Reset) {
    # Reset counter to 0
    internal_count = 0;
} else {
    if (Enable) {
        # Increment counter
        internal_count = internal_count + 1;
    }
}

# Output the internal state
Count = internal_count;
```

### Example 3: Random Access Memory (RAM)

A 4x4 RAM module that demonstrates array indexing for memory storage.

```plaintext
# Header Declarations
clock: CLK
inputs: Address[2], DataIn[4], WriteEnable, ReadEnable
outputs: DataOut[4]
state: memory[4][4] # 2D Array: 4 rows of 4 bits

# Body Logic

# Write Operation
if (WriteEnable) {
    # Store DataIn into the row specified by Address
    memory[Address] = DataIn;
}

# Read Operation
if (ReadEnable) {
    # Read from the row specified by Address
    DataOut = memory[Address];
} else {
    # Default output when not reading
    DataOut = 0;
}
```
