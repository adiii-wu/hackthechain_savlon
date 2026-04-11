// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AegisSBT (Soulbound Token)
 * @dev Implementation of a non-transferable ERC721 credential for the Aegis Protocol.
 * Once minted to an address, it is permanently locked and cannot be moved, sold, or delegated.
 * Targeted for the Polygon Network for high speed and low cost issuing.
 */
contract AegisSBT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event CredentialIssued(address indexed candidate, uint256 indexed tokenId, string uri);

    constructor(address initialOwner) 
        ERC721("Aegis VeriCert SBT", "AVCERT") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Simple mint function. Only the authorized Aegis authority can issue credentials.
     * @param to The candidate address receiving the credential.
     * @param uri The IPFS hash/URI containing the metadata.
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CredentialIssued(to, tokenId, uri);
    }

    /**
     * @dev Soulbound logic: Overriding the internal _update function (Standard in OpenZeppelin 5.0).
     * We allow minting (from address(0)) and burning (to address(0)), but revert on any other transfer.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // If 'from' is not address(0), this is not a mint.
        // If 'to' is not address(0), this is not a burn.
        if (from != address(0) && to != address(0)) {
            revert("AegisSBT: Transfer is prohibited. Credentials are Soulbound.");
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Disable approvals entirely to prevent any delegation of the token.
     */
    function approve(address /*to*/, uint256 /*tokenId*/) public virtual override(ERC721, IERC721) {
        revert("AegisSBT: Approvals are disabled for Soulbound tokens.");
    }

    function setApprovalForAll(address /*operator*/, bool /*approved*/) public virtual override(ERC721, IERC721) {
        revert("AegisSBT: Approvals are disabled for Soulbound tokens.");
    }

    // Single source of truth: tokenURI can only be set at mint to prevent unauthorized alteration.
}
