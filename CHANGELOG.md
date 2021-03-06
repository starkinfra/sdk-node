# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to the following versioning pattern:

Given a version number MAJOR.MINOR.PATCH, increment:

- MAJOR version when the **API** version is incremented. This may include backwards incompatible changes;
- MINOR version when **breaking changes** are introduced OR **new functionalities** are added in a backwards compatible manner;
- PATCH version when backwards compatible bug **fixes** are implemented.


## [Unreleased]

## [0.1.0] - 2022-06-03
### Added
- CreditNotePreview sub-resource
### Removed
- updated attribute from IssuingBin resource
### Changed
- fine and interest attributes to return only on CreditNote.Invoice sub-resource

## [0.1.0] - 2022-06-03
### Added
- credit receiver's billing address on CreditNote

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
