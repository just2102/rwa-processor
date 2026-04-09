// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TokenizedAsset.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        new TokenizedAsset(msg.sender);

        vm.stopBroadcast();
    }
}
