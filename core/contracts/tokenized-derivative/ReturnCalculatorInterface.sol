pragma solidity ^0.6.0;


/**
 * @title Computes the synthetic asset return based on the underlying asset's return.
 * @dev Different implementations can compute different return structures.
 */
interface ReturnCalculatorInterface {
    /**
     * @notice Computes the synthetic asset return when the underlying asset price changes from `oldPrice` to
     * `newPrice`.
     * @dev This can be implemented in many different ways, but a simple one would just be levering (or multiplying)
     * the return by some fixed integer.
     */
    function computeReturn(int256 oldPrice, int256 newPrice) external view returns (int256 assetReturn);

    /**
     * @notice Gets the effective leverage for the return calculator.
     * @dev If there is no sensible leverage value for a return calculator, this method should return 1.
     */
    function leverage() external view returns (int256 _leverage);
}
