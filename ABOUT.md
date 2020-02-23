# FixidityLib
An overflow-protected fixed-point arithmetic library for Solidity.

## Introduction
FixidityLib provide fixed point arithmetic for Solidity. This is achieved by
using int256 as the type throughout the library and designating a number of
digits in each int256 for holding the fractional part. This is equivalent to
displacing the comma in a non-integer number a fixed number of positions to the
left. All the arithmetic operations that have been implemented maintain 
constant the number of digits to the left of the comma that are represented.

The main arithmetic operations currently supported are addition, subtraction,
multiplication, division and logarithms. In a near future exponentials and
square roots might be supported.

In addition to fixed point arithmetic operations, FixidityLib is fully 
protected against overflow. Any operation that causes an overflow to happen
will revert. 

A number of constants have been provided that identify the safe
limits for operation. When fixed-point arithmetic operations are done with 
values between zero and a limit there will be no overflows and therefore the
functions will never revert. It would be then useful in some cases to use 
those limits to reject user inputs with an informative message when those 
inputs might cause erratic behaviour. With careful consideration it is 
possible to perform operations with values that are beyond the limits, but 
doing so must only be done with appropriate knowledge of range of each 
operator.

FixidityLib currently assumes 24 digits as the desired size for the decimal
part. To change this to a different value the constants need to be adjusted.
The formulas used to calculate the constants have been provided to facilitate
this. All other functions will work as long as the constants are consistent.

An extensive collection of tests was created to prove the robustness of
FixidityLib, and they should be run whenever a change in the digits is done.

Currently FixidityLib doesn't use its own type, so it is up to the user to 
remember whether a given int256 is a FixidityLib fixed point number or not,
and to take care to use the toFixed() and toUint() functions accordingly
to create fixed point numbers and convert them back to integers.

