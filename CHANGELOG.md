# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to the following versioning pattern:

Given a version number MAJOR.MINOR.PATCH, increment:

- MAJOR version when the **API** version is incremented. This may include backwards incompatible changes;
- MINOR version when **breaking changes** are introduced OR **new functionalities** are added in a backwards compatible manner;
- PATCH version when backwards compatible bug **fixes** are implemented.


## [Unreleased]
### Added
- CreditSigner resendToken method
### Fixed
- language attribute
- parse functions

## [0.14.0] - 2025-07-23
### Added
- CreditNote payment method

## [0.13.0] - 2025-06-27
### Added
- subcription and due attribute to BrcodePreview resource

## [0.12.0] - 2025-05-27
### Added
- CreditNote pdf method

## [0.11.0] - 2025-05-19
### Added
- get PixUser resource

## [0.10.0] - 2025-04-14
### Added
- priority parameter to PixRequest resource

## [0.9.0] - 2025-03-20
### Added
- operatorEmail and operatorPhone to PixInfraction resource

## [0.8.1] - 2024-07-10
### Fixed
- issuingWithdrawal create

## [0.8.0] - 2024-07-05
## Changed
- core version to v0.1.1
### Added
- request methods

## [0.7.2] - 2024-05-09
## Changed
- core version to v0.0.5

## [0.7.1] - 2024-04-01
### Fixed
- IssuingBalance return

## [0.7.0] - 2024-03-13
### Added
- update method to IssuingPurchase resource

## [0.6.2] - 2024-02-21
### Changed
- core version to v0.0.4

## [0.6.1] - 2024-01-12
### Fixed
- user export to rest resource
- Readme credentials examples

## [0.6.0] - 2024-01-08
### Changed
- internal structure to use starkcore as a dependency.
### Fixed
- sdk version

## [0.5.0] - 2023-12-12
### Added
- IssuingToken resource
- IssuingTokenLog resource
- IssuingTokenDesign resource
- IssuingTokenRequest sub-resource
- IssuingTokenActivation sub-resource
- merchantCategoryType, description, productId and holderId attributes to IssuingPurchase resource
### Changed
- senderTaxId and receiverTaxId parameters to DynamicBrcode resource

## [0.4.0] - 2023-05-18
### Added
- metadata attributes to IssuingPurchase resource

## [0.3.0] - 2023-05-11
### Added
- CreditHolmes resource
- IndividualDocument resource
- IndividualIdentity resource
- IssuingRestock resource
- IssuingStock resource
- IssuingDesign resource
- IssuingEmbossingRequest resource
- IssuingEmbossingKit resource
- pin attribute to update method in IssuingCard resource
- payerId and endToEndId parameter to BrcodePreview resource
- cashier_bank_code and description parameter to StaticBrcode resource
### Changed
- change nominalAmount and amount parameter to conditionally required to CreditNote resource

## [0.2.0] - 2022-09-16
### Added
- StaticBrcode resource
- DynamicBrcode resource 
- CardMethod sub-resource
- MerchantCountry sub-resource
- MerchantCategory sub-resource
- CreditPreview sub-resource
- BrcodePreview resource
- code attribute to IssuingProduct resource
- expand parameter to create method in IssuingHolder resource
- default to fee, externalId and tags parameters to parse method in PixRequest and PixReversal resources
- tags parameter to PixClaim, PixInfraction, Pix Chargeback resources
- flow parameter to PixClaim resource
- flow parameter to query and page methods in PixClaim resource
- tags parameter to query and page methods in PixChargeback, PixClaim and PixInfraction resources
- zipCode, purpose, purchase, isPartialAllowed, cardTags and holderTags attributes to IssuingPurchase resource
- brcode, link and due attributes to IssuingInvoice resource
### Fixed
- JSON body returned from response method of PixRequest resource
- JSON body returned from response method of PixReversal resource
### Changed
- resource name from IssuingBin to IssuingProduct
- settlement parameter to fundingType in Issuing Product resource
- client parameter to holderType in Issuing Product resource
- CreditNotePreview sub-resource to creditPreview.CreditNotePreview sub-resource
- agent parameter to flow in PixInfraction and PixChargeback resources
- bankCode parameter to claimerBankCode in PixClaim resource
- agent parameter to flow on query and page methods in PixInfraction and PixChargeback resources
- creditnote.Signer sub-resource to CreditSigner resource
- PixDirector resource to sub-resource
### Removed 
- IssuingAuthorization resource
- bankCode attribute from PixReversal resource
- category parameter from IssuingProduct resource
- bacenId parameter from PixChargeback and PixInfraction resources
- agent parameter from PixClaim.Log resource

## [0.1.0] - 2022-06-03
### Added
- CreditNotePreview sub-resource
- credit receiver's billing address on CreditNote
### Removed
- updated attribute from IssuingBin resource
### Changed
- fine and interest attributes to return only on CreditNote.Invoice sub-resource

## [0.0.2] - 2022-05-23
### Added
- CreditNote resource for money lending with Stark Infra's endorsement
- IssuingAuthorization resource for Sub Issuers
- IssuingBalance resource for Sub Issuers
- IssuingBin resource for Sub Issuers
- IssuingCard resource for Sub Issuers
- IssuingHolder resource for Sub Issuers
- IssuingInvoice resource for Sub Issuers
- IssuingPurchase resource for Sub Issuers
- IssuingTransaction resource for Sub Issuers
- IssuingWithdrawal resource for Sub Issuers
- PixDirector resource for Direct Participants
- PixKey resource for Indirect and Direct Participants
- PixClaim resource for Indirect and Direct Participants
- PixChargeback resource for Indirect and Direct Participants
- PixInfraction resource for Indirect and Direct Participants
- PixDomain resource for Indirect and Direct Participants
- Event.get(), Event.query(), Event.page(), Event.delete() and Event.update() functions
- Event.Attempt sub-resource to allow retrieval of information on failed webhook event delivery attempts
- Webhook resource to receive Events

## [0.0.1] - 2022-03-18
### Added
- PixRequest resource for Indirect and Direct Participants
- PixReversal resource for Indirect and Direct Participants
- PixBalance resource for Indirect and Direct Participants
- PixStatement resource for Direct Participants
- Event resource for webhook receptions
