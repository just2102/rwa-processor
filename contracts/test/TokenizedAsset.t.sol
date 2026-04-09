// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/TokenizedAsset.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenizedAssetTest is Test {
    TokenizedAsset public token;
    address public owner;
    address public nonOwner;

    function setUp() public {
        owner = address(this);
        nonOwner = address(0xBEEF);
        
        token = new TokenizedAsset(owner);
    }

    function test_MintAsOwner() public {
        token.mint(owner, 1000);
        assertEq(token.balanceOf(owner), 1000);
    }

    function test_RevertWhen_MintAsNonOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nonOwner));
        token.mint(nonOwner, 1000);
    }
}
