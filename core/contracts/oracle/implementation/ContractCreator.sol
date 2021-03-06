pragma solidity ^0.6.0;

import "../interfaces/FinderInterface.sol";
import "./Registry.sol";


/**
 * @title Base contract for all financial contract creators
 */
abstract contract ContractCreator {
    address internal finderAddress;

    constructor(address _finderAddress) public {
        finderAddress = _finderAddress;
    }

    function _registerContract(address[] memory parties, address contractToRegister) internal {
        FinderInterface finder = FinderInterface(finderAddress);
        bytes32 registryInterface = "Registry";
        Registry registry = Registry(finder.getImplementationAddress(registryInterface));
        registry.registerContract(parties, contractToRegister);
    }
}
