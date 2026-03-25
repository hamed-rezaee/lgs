# Logic Gate Simulator — Scripting Guide

The Logic Gate Simulator supports custom components via a custom C-like scripting language. This guide details the language syntax, available operators, and built-in functions for developing complex logic circuits.

## Contents

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
  - Example 1: Basic Logic Gates (AND, OR, NOT)
  - Example 2: XOR Gate (Exclusive OR)
  - Example 3: Half Adder
  - Example 4: 4-to-1 Multiplexer (MUX)
  - Example 5: Combinatorial Logic (Simple ALU)
  - Example 6: Sequential Logic (Counter)
  - Example 7: Random Access Memory (RAM)
  - Example 8: Random Number Generator
  - Example 9: Basic ALU with Built-in Functions

---

## 1. Script Structure

Every script consists of two distinct sections:

1.  **Header Declarations**: Located at the very top, defining the interface (inputs/outputs) and internal memory.
2.  **Logic Section**: The procedural code that defines how outputs and state variables are updated based on inputs.

---

## 2. Component Definitions

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

## 3. Syntax and Language Features

### Semicolons

All statements in the logic body must end with a semicolon `;`. Header declarations do not use semicolons.

```c
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
`if`, `else`, `for`, `while`, `break`, `continue`, `true`, `false`, `var`, `inputs`, `outputs`, `state`, `clock`, `vars`, `random`, `abs`, `min`, `max`, `popcount`.

---

## 4. Operators

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

## 5. Built-in Functions

The language provides built-in functions that can be called in expressions.

### abs(x)

Returns the absolute value of a number.

- **One argument**: `abs(x)` returns the absolute value of `x`.

_Examples_:

```c
# Get absolute value
distance = abs(-15);  # Returns 15
result = abs(A - B);  # Always positive difference
```

### min(a, b)

Returns the smaller of two values.

- **Two arguments**: `min(a, b)` returns whichever value is smaller.

_Examples_:

```c
# Find minimum of two values
smaller = min(A, B);

# Clamp a value to maximum
limited = min(value, 255);
```

### max(a, b)

Returns the larger of two values.

- **Two arguments**: `max(a, b)` returns whichever value is larger.

_Examples_:

```c
# Find maximum of two values
larger = max(A, B);

# Ensure minimum value
positive = max(value, 0);
```

### random()

Generates pseudo-random integer values.

- **No arguments**: `random()` returns either `0` or `1` (random bit).
- **One argument**: `random(max)` returns a random integer from `0` to `max-1` (inclusive).

_Examples_:

```c
# Generate a random bit (0 or 1)
coin_flip = random();

# Generate a random number from 0 to 15
dice = random(16);

# Generate random 4-bit value
random_data[4] = random(16);
```

> **Note**: Each call to `random()` produces a new pseudo-random value. The random number generator is automatically seeded.

### popcount(x)

Counts the number of set bits (1s) in a value.

- **One argument**: `popcount(x)` returns the count of 1-bits in `x`.

_Examples_:

```c
# Count set bits
ones = popcount(0x0B);  # Returns 3

# Parity check (odd/even number of 1s)
parity = popcount(data) & 1;

# Hamming weight
weight = popcount(value);
```

> **Note**: `popcount()` is particularly useful for parity generation, error detection, and population count operations in digital circuits.

---

## 6. Control Flow

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

### For Loops

Use `for` loops to repeat code a specific number of times.

- **Syntax**:

```c
for (initialization; condition; update) {
  # statements
}
```

- **Parts**:
  - `initialization`: Executed once before the loop starts (optional). Can be a variable declaration or expression.
  - `condition`: Evaluated before each iteration. Loop continues while true/non-zero (optional).
  - `update`: Executed after each iteration (optional).

- **Examples**:

```c
# Count from 0 to 9
for (var i = 0; i < 10; i = i + 1) {
  # Loop body
}

# Sum array elements
var sum = 0;
for (var i = 0; i < 8; i = i + 1) {
  sum = sum + data[i];
}

# Infinite loop (condition omitted)
for (;;) {
  # Loop forever (use break to exit)
}
```

### While Loops

Use `while` loops to repeat code as long as a condition is true.

- **Syntax**:

```c
while (condition) {
  # statements
}
```

- **Examples**:

```c
# Countdown
var count = 10;
while (count > 0) {
  count = count - 1;
}

# Find first set bit
var value = 0xF0;
var bit_pos = 0;
while ((value & 1) == 0 && bit_pos < 8) {
  value = value >> 1;
  bit_pos = bit_pos + 1;
}
```

### Break and Continue

Control loop execution with `break` and `continue` statements.

- **break**: Immediately exit the innermost loop.
- **continue**: Skip to the next iteration of the innermost loop.

- **Examples**:

```c
# Find first match
var found = 0;
for (var i = 0; i < 16; i = i + 1) {
  if (array[i] == target) {
    found = 1;
    break;  # Exit loop early
  }
}

# Skip even numbers
var sum = 0;
for (var i = 0; i < 10; i = i + 1) {
  if ((i & 1) == 0) {
    continue;  # Skip even numbers
  }

  sum = sum + i;
}
```

> **Note**: Break and continue only affect the innermost loop they are in.

---

## 7. Complete Examples

### Example 1: Basic Logic Gates (AND, OR, NOT)

This script demonstrates how to create basic logic gates. These are foundational building blocks for digital circuits.

```c
# Header Declarations
inputs: A, B
outputs: OutAND, OutOR, OutNOT

# Body Logic

# AND gate: Output is 1 only if BOTH inputs are 1
OutAND = A && B;

# OR gate: Output is 1 if AT LEAST ONE input is 1
OutOR = A || B;

# NOT gate (Inverter): Output is the opposite of A
OutNOT = !A;
```

### Example 2: XOR Gate (Exclusive OR)

An XOR gate outputs 1 if exactly one of its inputs is 1. This example shows both the built-in bitwise operator and how it's constructed from basic logical operators.

```c
# Header Declarations
inputs: A, B
outputs: OutXOR

# Body Logic

# Using the built-in bitwise XOR operator (most efficient)
OutXOR = A ^ B;

# Alternatively, using basic logical construction:
# OutXOR = (A && !B) || (!A && B);
```

### Example 3: Half Adder

A Half Adder adds two single-bit binary numbers. It produces a sum and a carry.

```c
# Header Declarations
inputs: A, B
outputs: Sum, Carry

# Body Logic

# The sum is essentially an XOR operation
Sum = A ^ B;

# The carry happens when both A and B are 1 (AND operation)
Carry = A && B;
```

### Example 4: 4-to-1 Multiplexer (MUX)

A multiplexer selects one of several input signals and forwards the selected input into a single line.

```c
# Header Declarations
inputs: Select[2], In0, In1, In2, In3
outputs: OutMUX

# Body Logic

# Use the 2-bit Select bus to choose the output
if (Select == 0) {
  OutMUX = In0;
} else if (Select == 1) {
  OutMUX = In1;
} else if (Select == 2) {
  OutMUX = In2;
} else {
  OutMUX = In3;
}
```

### Example 5: Combinatorial Logic (Simple ALU)

This script creates a simple Arithmetic Logic Unit. It has no clock, so outputs update immediately when inputs change.

```c
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

### Example 6: Sequential Logic (Counter)

This creates an 8-bit counter that increments on every clock cycle. It requires `clock` and `state`.

```c
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

### Example 7: Random Access Memory (RAM)

A 4x4 RAM module that demonstrates array indexing for memory storage.

```c
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

### Example 8: Random Number Generator

A simple component that generates random values for testing or probabilistic circuits.

```c
# Header Declarations
inputs: Enable, Range[4]
outputs: RandomValue[8], RandomBit

# Body Logic

if (Enable) {
  # Generate random bit (0 or 1)
  RandomBit = random();

  # Generate random 8-bit value (0 to 255)
  var maxValue = Range;
  if (maxValue == 0) {
    maxValue = 256;
  }
  RandomValue = random(maxValue);
} else {
  RandomBit = 0;
  RandomValue = 0;
}
```

### Example 9: Basic ALU with Built-in Functions

Demonstrates usage of `abs`, `min`, `max`, and `popcount` functions.

```c
# Header Declarations
inputs: A[8], B[8], Operation[2]
outputs: Result[8], Flags[4]

# Body Logic

var output = 0;
var overflow = 0;
var parity = 0;
var ones_count = 0;

if (Operation == 0) {
  # Absolute difference
  output = abs(A - B);
} else if (Operation == 1) {
  # Minimum value
  output = min(A, B);
} else if (Operation == 2) {
  # Maximum value
  output = max(A, B);
} else {
  # Bitwise AND with popcount
  output = A & B;
}

# Calculate flags
ones_count = popcount(output);
parity = ones_count & 1; # Odd parity bit
overflow = (output > 255) ? 1 : 0;

# Outputs
Result = output;
Flags[0] = parity; # Parity flag
Flags[1] = overflow; # Overflow flag
Flags[2] = (output == 0); # Zero flag
Flags[3] = (ones_count > 4); # More than half bits set
```
