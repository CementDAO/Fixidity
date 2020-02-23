# FixidityLib
An overflow-protected fixed-point arithmetic library for Solidity.

## Testing
`yarn`
In a separate terminal: `yarn start:ganache:local`
`npx truffle compile`
`npx truffle migrate`
`npx truffle test`

## Usage
Fixidity implements fixed point arithmetic by keeping a "virtual comma" in an int256.

With the current implementation that uses 24 digits, 1 in Fixidity is 1 * 10**24.
In a similar manner, 0.5 would be 5 * 10**23.

Fixidity stores fixed point numbers in an int256, and it is up to the developer to remember whether a specific int256 is a Fixidity fixed point number or not.

To create Fixidity fixed point numbers use `toFixed()`.

```
using FixidityLib for uint256;
uint256 x = 1;
int256 xFixed;
xFixed = x.toFixed();
...
```

To convert Fixidity fixed point number back to uint use `toUint()`.
```
...
using FixidityLib for uint256;
using FixidityLib for int256;
uint256 x = 1;
uint256 y = 1;
int256 xFixed = x.toFixed();
int256 yFixed = y.toFixed();
int256 zFixed = x.add(y);
uint256 z = zFixed.toUint();
``` 

FixidityLib can keep 24 digits, when using `toUint()` only the integer part will be returned.

## Fixed Point Math with Tokens
Ether and the ERC20 implementation use an implicit fixed point representation, although no arithmetic comes bundled up with them.

The `decimals()` field from `ERC20Detailed` states how many digits are in the fractional part of a token. For Ether the fractional part of a token takes 18 digits.

When using Fixidity to operate on wei or `ERC20Detailed` tokens, it is recommended to remember that these already have an implicit fractional part. When converting an `uint` to a fixed point number Fixidity will just add 24 zeros at the end. If the uint contains a number representing a large number of tokens an overflow will be more likely that it needs to be.

When converting an ether wei amount to Fixidity fixed point use `toFixed(18)`. When converting from Fixidity fixed point to we use `toUint(18)`.
When converting an ERC20 wei amount to Fixidity fixed point use `toFixed(token.decimals())`. When converting from Fixidity fixed point to we use `toUint(token.decimals())`.


## FixidityLib.sol
This library implements  addition, subtraction,
multiplication and division, along with the related constants and limits.

**function digits() public pure returns(uint8)**
Number of positions that the comma is shifted to the right.
Default: 24

**function fixed1() public pure returns(int256)**
This is 1 in the fixed point units used in this library. 
Calculated as fixed1() = equals 10^digits()
Default: 1000000000000000000000000000000000000

**function mulPrecision() public pure returns(int256)**
The amount of decimals lost on each multiplication operand.
Calculated as mulPrecision() = sqrt(fixed1)
Default: 1000000000000000000

**function maxInt256() public pure returns(int256)**
Maximum value that can be represented in an int256
Calculated as maxInt256() = 2^255 -1
Default: 57896044618658097711785492504343953926634992332820282019728792003956564819967

**function minInt256() public pure returns(int256)**
Minimum value that can be represented in an int256
Calculated as minInt256() = (2^255) * (-1)
Default: -57896044618658097711785492504343953926634992332820282019728792003956564819968

**function maxNewFixed() public pure returns(int256)**
Maximum value that can be converted to fixed point.
Default: 57896044618658097711785492504343953926634

**function minNewFixed() public pure returns(int256)**
Maximum value that can be converted to fixed point.
Calculated as minNewFixed() = -(maxInt256()) / fixed1()
Default: -57896044618658097711785492504343953926634

**function maxFixedAdd() public pure returns(int256)**
Maximum value that can be safely used as an addition operand. 
Additions with one operand over this value might overflow, but not necessarily 
so.
Calculated as maxFixedAdd() equals maxInt256()-1 / 2
Default: 28948022309329048855892746252171976963317496166410141009864396001978282409983

**function maxFixedSub() public pure returns(int256)**
Maximum negative value that can be safely subtracted. Operations where values
larger than maxFixedSub() are subtracted might overflow, but not necessarily 
so.
Calculated as maxFixedSub() = minInt256() / 2
Default: -28948022309329048855892746252171976963317496166410141009864396001978282409984

**function maxFixedMul() public pure returns(int256)**
Maximum value that can be safely used as a multiplication operator. 
Divisions where a value is divided by another over this value might overflow, 
but not necessarily so.
Calculated as maxFixedMul() = sqrt(maxNewFixed())*fixed1().
Default: 240615969168004511545033772477625056927114980741063

**function maxFixedDiv() public pure returns(int256)**
Maximum value that can be safely used as a dividend.
Operations where values larger than maxFixedDiv() are divided might 
overflow, but not necessarily so.
Calculated as divide(maxFixedDiv,newFixedFraction(1,fixed1())) = maxInt256().
Default: 57896044618658097711785492504343953926634
    }

**function maxFixedDivisor() public pure returns(int256)**
Maximum value that can be safely used as a divisor. The divide(x, y) function 
uses reciprocal(y), and numbers above maxFixedDivisor() will cause a division
by zero.
Calculated as maxFixedDivisor() = fixed1()*fixed1()
Default: 1000000000000000000000000000000000000000000000000000000000000000000000000

**function convertFixed(int256 x, uint8 _originDigits, uint8 _destinationDigits)**
Converts an int256 which is already in some fixed point representation to a
different fixed precision representation. Both the origin and destination 
precisions must be 38 or less digits. Origin values with a precision higher 
than the destination precision will be truncated accordingly.

**function toFixed(int256 x)**
Converts an int256 to fixed point units, equivalent to multiplying by 
10^digits().

**function toFixed(uint256 x)**
Converts an uint256 to fixed point units, equivalent to multiplying by 
10^digits().

**function toFixed(int256 x, uint8 _originDigits)**
Converts an int256 which is already in some fixed point representation to that 
of this library. The _originDigits parameter is the precision of x. Values with
a precision higher than FixidityLib.digits() will be truncated accordingly.

**function toFixed(uint256 x, uint8 _originDigits)**
Converts an uint256 which is already in some fixed point representation to that 
of this library. The _originDigits parameter is the precision of x. Values with
a precision higher than FixidityLib.digits() will be truncated accordingly.

**function toUint(int256 x)**
Converts an int256 in the fixed point representation of this library to an uint. All decimal digits will be truncated.

**function toInt(int256 x)**
Converts an int256 in the fixed point representation of this library to an uint. All decimal digits will be truncated.

**function toUint(int256 x, uint8 _destinationDigits)**
Converts an int256 in the fixed point representation of this library to a 
different fixed point representation stored in an uint256. The _destinationDigits parameter is the precision of
the output x. Values with a precision below than FixidityLib.digits() will be
truncated accordingly.

**function toInt(int256 x, uint8 _destinationDigits)**
Converts an int256 in the fixed point representation of this library to a 
different fixed point representation stored in uint256. The _destinationDigits parameter is the precision of
the output x. Values with a precision below than FixidityLib.digits() will be
truncated accordingly.

**function integer(int256 x) public pure returns (int256)**
Returns the integer part of a fixed point number, still in fixed point format.

**function fractional(int256 x) public pure returns (int256)**
Returns the fractional part of a fixed point number. In the case of a negative
number the fractional is also negative.

**function abs(int256 x) public pure returns (int256)**
Converts to positive if negative.
Due to int256 having one more negative number than positive numbers 
abs(minInt256) reverts.

**function add(int256 x, int256 y) public pure returns (int256)**
x+y. If any operator is higher than maxFixedAdd() it might overflow.

**function subtract(int256 x, int256 y) public pure returns (int256)**
x-y. You can use add(x,-y) instead. 

**function multiply(int256 x, int256 y) public pure returns (int256)**
x*y. If any of the operators is higher than maxFixedMul() it might overflow.

**function reciprocal(int256 x) public pure returns (int256)**
1/x.

**function divide(int256 x, int256 y) public pure returns (int256)**
x/y. If the dividend is higher than maxFixedDiv() it might overflow. You can 
use multiply(x,reciprocal(y)) instead.
There is a loss of precision on division for the lower mulPrecision() decimals.

** Obsolete functions kept for backwards compatibility**

**function newFixed(int256 x)**
Converts an int256 to fixed point units, equivalent to multiplying by 
10^digits().

**function fromFixed(int256 x)**
Converts an int256 in the fixed point representation of this library to a non 
decimal. All decimal digits will be truncated.

**function newFixed(int256 x, uint8 _originDigits)**
Converts an int256 which is already in some fixed point representation to that 
of this library. The _originDigits parameter is the precision of x. Values with
a precision higher than FixidityLib.digits() will be truncated accordingly.

**function fromFixed(int256 x, uint8 _destinationDigits)**
Converts an int256 in the fixed point representation of this library to a 
different representation. The _destinationDigits parameter is the precision of
the output x. Values with a precision below than FixidityLib.digits() will be
truncated accordingly.

**function newFixedFraction(int256 numerator, int256 denominator)**
Converts two int256 representing a fraction to fixed point units, equivalent to
multiplying dividend and divisor by 10^digits() and then dividing them.



## LogarithmLib.sol
This library extends FixidityLib by implementing logarithms, along with the related constants and limits.

**function fixedE() public pure returns(int256)**
This is e in the fixed point units used in this library.
Default: 27182818284590452353602874713526624977572470936999595749669676277240766303535/fixed1()

**function fixedLn1_5() public pure returns(int256)**
ln(1.5)
Default: 405465108108164381978013115464349137;

**function fixedLn10() public pure returns (int256)**
ln(10)
Default: 2302585092994045684017991454684364208;

**function ln(int256 value) public pure returns (int256)**
ln(x). This function has a 1/50 deviation close to ln(-1), 1/maxFixedMul() deviation at fixedE()**2, but diverges to 10x deviation at maxNewFixed().

**function log_b(int256 b, int256 x) public pure returns (int256)**
log_b(x)
 - int256 b Base in fixed point representation.
 - int256 x Value to calculate the logarithm for in fixed point representation.
