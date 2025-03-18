# Stark Infra Node SDK - Beta

Welcome to the Stark Infra Node SDK! This tool is made for Node
developers who want to easily integrate with our API.
This SDK version is compatible with the Stark Infra API v2.

# Introduction

## Index

- [Introduction](#introduction)
  - [Supported Node versions](#supported-node-versions)
  - [API documentation](#stark-infra-api-documentation)
  - [Versioning](#versioning)
- [Setup](#setup)
  - [Install our SDK](#1-install-our-sdk)
  - [Create your Private and Public Keys](#2-create-your-private-and-public-keys)
  - [Register your user credentials](#3-register-your-user-credentials)
  - [Setting up the user](#4-setting-up-the-user)
  - [Setting up the error language](#5-setting-up-the-error-language)
- [Resource listing and manual pagination](#resource-listing-and-manual-pagination)
- [Testing in Sandbox](#testing-in-sandbox)
- [Usage](#usage)
    - [Issuing](#issuing)
        - [Products](#query-issuingproducts): View available sub-issuer Products (a.k.a. card number ranges)
        - [Holders](#create-issuingholders): Manage cardholders
        - [Cards](#create-issuingcards): Create virtual and/or physical cards
        - [Design](#query-issuingdesigns): View your current card or package designs
        - [EmbossingKit](#query-issuingembossingkits): View your current embossing kits
        - [Stock](#query-issuingstocks): View your current stock of a certain IssuingDesign linked to an Embosser on the workspace
        - [Restock](#create-issuingrestocks): Create restock orders of a specific IssuingStock object
        - [EmbossingRequest](#create-issuingembossingrequests): Create embossing requests
        - [TokenRequest](#create-an-issuingtokenrequest): Generate the payload to create the token
        - [Token](#process-token-authorizations): Authorize and manage your tokens
        - [TokenActivation](#process-token-activations): Get notified on how to inform the activation code to the holder 
        - [TokenDesign](#get-an-issuingtokendesign): View your current token card arts
        - [Purchases](#process-purchase-authorizations): Authorize and view your past purchases
        - [Invoices](#create-issuinginvoices): Add money to your issuing balance
        - [Withdrawals](#create-issuingwithdrawals): Send money back to your Workspace from your issuing balance
        - [Balance](#get-your-issuingbalance): View your issuing balance
        - [Transactions](#query-issuingtransactions): View the transactions that have affected your issuing balance
    - [Pix](#pix)
        - [PixRequests](#create-pixrequests): Create Pix transactions
        - [PixReversals](#create-pixreversals): Reverse Pix transactions
        - [PixBalance](#get-your-pixbalance): View your account balance
        - [PixStatement](#create-a-pixstatement): Request your account statement
        - [PixKey](#create-a-pixkey): Create a Pix Key
        - [PixClaim](#create-a-pixclaim): Claim a Pix Key
        - [PixDirector](#create-a-pixdirector): Create a Pix Director
        - [PixInfraction](#create-pixinfractions): Create Pix Infraction reports
        - [PixChargeback](#create-pixchargebacks): Create Pix Chargeback requests
        - [PixDomain](#query-pixdomains): View registered SPI participants certificates
        - [StaticBrcode](#create-staticbrcodes): Create static Pix BR codes
        - [DynamicBrcode](#create-dynamicbrcodes): Create dynamic Pix BR codes
        - [BrcodePreview](#create-brcodepreviews): Read data from BR Codes before 
    - [Lending](#lending)
        - [CreditNote](#create-creditnotes): Create credit notes
        - [CreditPreview](#create-creditpreviews): Create credit previews
        - [CreditHolmes](#create-creditholmes): Create credit holmes debt verification
    - [Identity](#identity)
        - [IndividualIdentity](#create-individualidentities): Create individual identities
        - [IndividualDocument](#create-individualdocuments): Create individual documents
    - [Webhook](#webhook):
        - [Webhook](#create-a-webhook-subscription): Configure your webhook endpoints and subscriptions
        - [WebhookEvents](#process-webhook-events): Manage Webhook events
        - [WebhookEventAttempts](#query-failed-webhook-event-delivery-attempts-information): Query failed webhook event deliveries
- [Handling errors](#handling-errors)
- [Help and Feedback](#help-and-feedback)

## Supported Node Versions

This library supports the following Node versions:

* Node 10+

If you have specific version demands for your projects, feel free to contact us.

## Stark Infra API documentation

Feel free to take a look at our [API docs](https://www.starkinfra.com/docs/api).

## Versioning

This project adheres to the following versioning pattern:

Given a version number MAJOR.MINOR.PATCH, increment:

- MAJOR version when the **API** version is incremented. This may include backwards incompatible changes;
- MINOR version when **breaking changes** are introduced OR **new functionalities** are added in a backwards compatible manner;
- PATCH version when backwards compatible bug **fixes** are implemented.

# Setup

## 1. Install our SDK

1.1 To install the package with npm, run:
```sh
npm install starkinfra
```

## 2. Create your Private and Public Keys

We use ECDSA. That means you need to generate a secp256k1 private
key to sign your requests to our API, and register your public key
with us, so we can validate those requests.

You can use one of the following methods:

2.1. Check out the options in our [tutorial](https://starkbank.com/faq/how-to-create-ecdsa-keys).

2.2. Use our SDK:

```javascript
const starkinfra = require('starkinfra');

let privateKey, publicKey;

[privateKey, publicKey] = starkinfra.key.create();

// or, to also save .pem files in a specific path
[privateKey, publicKey] = starkinfra.key.create('file/keys/');
```

**NOTE**: When you are creating new credentials, it is recommended that you create the
keys inside the infrastructure that will use it, in order to avoid risky internet
transmissions of your **private-key**. Then you can export the **public-key** alone to the
computer where it will be used in the new Project creation.

## 3. Register your user credentials

You can interact directly with our API using two types of users: Projects and Organizations.

- **Projects** are workspace-specific users, that is, they are bound to the workspaces they are created in.
  One workspace can have multiple Projects.
- **Organizations** are general users that control your entire organization.
  They can control all your Workspaces and even create new ones. The Organization is bound to your company's tax ID only.
  Since this user is unique in your entire organization, only one credential can be linked to it.

3.1. To create a Project in Sandbox:

3.1.1. Log into [StarkInfra Sandbox](https://web.sandbox.starkinfra.com)

3.1.2. Go to Menu > Integrations

3.1.3. Click on the 'New Project' button

3.1.4. Create a Project: Give it a name and upload the public key you created in section 2

3.1.5. After creating the Project, get its Project ID

3.1.6. Use the Project ID and private key to create the object below:

```javascript
const starkinfra = require('starkinfra');

// Get your private key from an environment variable or an encrypted database.
// This is only an example of a private key content. You should use your own key.
let privateKeyContent = `
-----BEGIN EC PARAMETERS-----
BgUrgQQACg==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIMCwW74H6egQkTiz87WDvLNm7fK/cA+ctA2vg/bbHx3woAcGBSuBBAAK
oUQDQgAE0iaeEHEgr3oTbCfh8U2L+r7zoaeOX964xaAnND5jATGpD/tHec6Oe9U1
IF16ZoTVt1FzZ8WkYQ3XomRD4HS13A==
-----END EC PRIVATE KEY-----
`;

let project = new starkinfra.Project({
    environment: 'sandbox',
    id: '5656565656565656',
    privateKey: privateKeyContent
});
```

3.2. To create Organization credentials in Sandbox:

3.2.1. Log into [Starkinfra Sandbox](https://web.sandbox.starkinfra.com)

3.2.2. Go to Menu > Integrations

3.2.3. Click on the 'Organization public key' button

3.2.4. Upload the public key you created in section 2 (only a legal representative of the organization can upload the public key)

3.2.5. Click on your profile picture and then on the 'Organization' menu to get the Organization ID

3.2.6. Use the Organization ID and private key to create the object below:

```javascript
const starkinfra = require('starkinfra');

//  Get your private key from an environment variable or an encrypted database.
//  This is only an example of a private key content. You should use your own key.
let privateKeyContent = `
-----BEGIN EC PARAMETERS-----
BgUrgQQACg==
-----END EC PARAMETERS-----
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIMCwW74H6egQkTiz87WDvLNm7fK/cA+ctA2vg/bbHx3woAcGBSuBBAAK
oUQDQgAE0iaeEHEgr3oTbCfh8U2L+r7zoaeOX964xaAnND5jATGpD/tHec6Oe9U1
IF16ZoTVt1FzZ8WkYQ3XomRD4HS13A==
-----END EC PRIVATE KEY-----
`;

let organization = new starkinfra.Organization({
    id: '5656565656565656',
    privateKey: privateKeyContent,
    environment: 'sandbox',
    workspaceId: null // You only need to set the workspaceId when you are operating a specific workspaceId
});


// To dynamically use your organization credentials in a specific workspaceId,
// you can use the organization.replace() method:
(async() => {
    let balance = await starkinfra.issuingBalance.get({
        user: starkinfra.organization.replace(organization, '4848484848484848')
    });
    console.log(balance);
})();
```

NOTE 1: Never hard-code your private key. Get it from an environment variable or an encrypted database.

NOTE 2: We support `'sandbox'` and `'production'` as environments.

NOTE 3: The credentials you registered in `sandbox` do not exist in `production` and vice versa.


## 4. Setting up the user

There are three kinds of users that can access our API: **Organization**, **Project**, and **Member**.

- `Project` and `Organization` are designed for integrations and are the ones meant for our SDKs.
- `Member` is the one you use when you log into our webpage with your e-mail.

There are two ways to inform the user to the SDK:

4.1 Passing the user as an argument in all functions:

```javascript
const starkinfra = require('starkinfra');
(async() => {
    let balance = await starkinfra.issuingBalance.get({user: project}); // or organization
})();
```

4.2 Set it as a default user in the SDK:

```javascript
const starkinfra = require('starkinfra');

starkinfra.user = project; // or organization

(async() => {
    let balance = await starkinfra.issuingBalance.get();
})();
```

Just select the way of passing the user that is more convenient to you.
On all following examples, we will assume a default user has been set.

## 5. Setting up the error language

The error language can also be set in the same way as the default user:

```javascript
const starkinfra = require('starkinfra');

starkinfra.language = 'en-US';
```

Language options are 'en-US' for English and 'pt-BR' for Brazilian Portuguese. English is the default.

# Resource listing and manual pagination

Almost all SDK resources provide a `query` and a `page` function.

- The `query` function provides a straightforward way to efficiently iterate through all results that match the filters you inform,
  seamlessly retrieving the next batch of elements from the API only when you reach the end of the current batch.
  If you are not worried about data volume or processing time, this is the way to go.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let transactions = await starkinfra.transaction.query({
        after: '2020-01-01',
        before: '2020-03-01'
    });
  
    for await (let transaction of transactions) {
        console.log(transaction);
    }
})();
```

- The `page` function gives you full control over the API pagination. With each function call, you receive up to
  100 results and the cursor to retrieve the next batch of elements. This allows you to stop your queries and
  pick up from where you left off whenever it is convenient. When there are no more elements to be retrieved, the returned cursor will be `null`.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let cursor = null;
    let page = null;
    while (true) {
        [page, cursor] = await starkinfra.transaction.page({ limit: 5, cursor: cursor });
        for (let transaction of page) {
            console.log(transaction);
        }
        if (cursor == null) {
            break;
        }
    }
})();
```

To simplify the following SDK examples, we will only use the `query` function, but feel free to use `page` instead.

# Testing in Sandbox

Your initial balance is zero. For many operations in Stark Infra, you'll need funds
in your account, which can be added to your balance by creating a starkbank.Invoice.

In the Sandbox environment, most of the created starkbank.Invoices will be automatically paid,
so there's nothing else you need to do to add funds to your account. Just create
a few starkbank.Invoices and wait around a bit.

In Production, you (or one of your clients) will need to actually pay this Pix Request
for the value to be credited to your account.


# Usage

Here are a few examples on how to use the SDK. If you have any doubts, use the built-in
`help()` function to get more info on the desired functionality
(for example: `help(starkinfra.issuinginvoice.create)`)

## Issuing

### Query IssuingProducts

To take a look at the sub-issuer card products available to you, just run the following:

```javascript
await (async() => {
    let products = await starkinfra.issuingProduct.query();

    for await (let product of products) {
        console.log(product);
    }
})();
```

This will tell which card products and card number prefixes you have at your disposal.

### Create IssuingHolders

You can create cardholders to which your cards will be bound.
They support spending rules that will apply to all underlying cards.

```javascript
await (async() => {
    let holders = await starkinfra.issuingHolder.create([
        new starkinfra.IssuingHolder({
            'name': 'Iron Bank S.A.',
            'taxId': '012.345.678-90',
            'externalId': '1234',
            'tags': ['Traveler Employee'],
            'rules': [
                new starkinfra.IssuingRule({
                    'name': 'General USD',
                    'interval': 'day',
                    'amount': 100000,
                    'currencyCode': 'USD',
                })
            ]
        })
    ]);

    for await (let holder of holders) {
        console.log(holder);
    }
})();
```

**Note**: Instead of using IssuingHolder objects, you can also pass each element in dictionary format

### Query IssuingHolders

You can query multiple holders according to filters.

```javascript
await (async() => {
    let holders = await starkinfra.issuingHolder.query();
  
    for await (let holder of holders) {
        console.log(holder);
    }
})();
```

### Cancel an IssuingHolder

To cancel a single Issuing Holder by its id, run:

```javascript
await (async () => {
  let holder = await starkinfra.issuingHolder.cancel('5155165527080960');

  console.log(holder);
})();
```

### Get an IssuingHolder

To get a single Issuing Holder by its id, run:

```javascript
await (async() => {
    let holder = await starkinfra.issuingHolder.get('5155165527080960');
  
    console.log(holder);
})();
```

### Query IssuingHolder logs

You can query holder logs to better understand holder life cycles.

```javascript
await (async() => {
    let logs = await starkinfra.issuingHolder.log.query({'limit': 50});

    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingHolder log

You can also get a specific log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingHolder.log.get('5155165527080960');
  
    console.log(log);
})();
```

### Create IssuingCards

You can issue cards with specific spending rules.

```javascript
await (async() => {
    let cards = await starkinfra.issuingCard.create([
        new starkinfra.IssuingCard({
            'holderName': 'Developers',
            'holderTaxId': '012.345.678-90',
            'holderExternalId': '1234',
            'rules': [
                new starkinfra.IssuingRule({
                    'name': 'general',
                    'interval': 'week',
                    'amount': 50000,
                    'currencyCode': 'USD',
                })
            ]
        })
    ]);
  
    for await (let card of cards) {
        console.log(card);
    }
})();
```

### Query IssuingCards

You can get a list of created cards given some filters.

```javascript
await (async() => {
    let cards = await starkinfra.issuingCard.query({
        'after': '2022-01-01',
        'before': '2022-03-01'
    });
  
    for await (let card of cards) {
        console.log(card);
    }
})();
```

### Get an IssuingCard

After its creation, information on a card may be retrieved by its id.

```javascript
await (async() => {
    let card = await starkinfra.issuingCard.get('5155165527080960');
  
    console.log(card);
})();
```

### Update an IssuingCard

You can update a specific IssuingCard by its id.

```javascript
await (async() => {
   let card = await starkinfra.issuingCard.update('5155165527080960', {'status': 'blocked'});
  
    console.log(card);
})();
```

### Cancel an IssuingCard

You can also cancel a card by its id.

```javascript
await (async () => {
  let card = await starkinfra.issuingCard.cancel('5155165527080960');

  console.log(card);
})();
```

### Query IssuingCard logs

Logs are pretty important to understand the life cycle of a card.

```javascript
await (async() => {
    let logs = await starkinfra.issuingCard.log.query({'limit': 150});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingCard log

You can get a single log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingCard.log.get('5155165527080960');
  
    console.log(log);
})();
```

### Query IssuingDesigns

You can get a list of available designs given some filters.

```javascript
await (async() => {
    let design = await starkinfra.issuingDesign.query({
        limit: 1
    });
  
    for await (let design of designs) {
        console.log(design);
    }
})();
```

### Get an IssuingDesign

Information on a design may be retrieved by its id.

```javascript
await (async() => {
    let design = await starkinfra.issuingDesign.get('5747368922185728');
  
    console.log(design);
})();
```

### Query IssuingEmbossingKits

You can get a list of created embossing kits given some filters.

```javascript
await (async() => {
    let kits = await starkinfra.issuingEmbossingKit.query({
        'after': '2022-11-01',
        'before': '2022-12-01'
    });
  
    for await (let kit of kits) {
        console.log(kit);
    }
})();
```

### Get an IssuingEmbossingKit

After its creation, information on an embossing kit may be retrieved by its id.

```javascript
await (async() => {
    let kit = await starkinfra.issuingEmbossingKit.get('5155165527080960');
  
    console.log(kit);
})();
```

### Query IssuingStocks

You can get a list of available stocks given some filters.

```javascript
await (async() => {
    let stocks = await starkinfra.issuingStock.query({
        'after': '2023-01-01',
        'before': '2023-03-01'
    });
  
    for await (let stock of stocks) {
        console.log(stock);
    }
})();
```

### Get an IssuingStock

Information on a stock may be retrieved by its id.

```javascript
await (async() => {
    let stock = await starkinfra.issuingStock.get('5792731695677440');
  
    console.log(stock);
})();
```

### Query IssuingStock logs

Logs are pretty important to understand the life cycle of a stock.

```javascript
await (async() => {
    let logs = await starkinfra.issuingStock.log.query({'limit': 150});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingStock log

You can get a single log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingStock.log.get('5809977331548160');
  
    console.log(log);
})();
```

### Create IssuingRestocks

You can order restocks for a specific IssuingStock.

```javascript
await (async() => {
    let restocks = await starkinfra.issuingRestock.create([
        new starkinfra.issuingRestock({
            'count': 100,
            'stockId': "5136459887542272"
        })
    ]);
  
    for await (let restock of restocks) {
        console.log(restock);
    }
})();
```

### Query IssuingRestocks

You can get a list of created restocks given some filters.

```javascript
await (async() => {
    let restocks = await starkinfra.issuingRestock.query({
        'after': '2023-01-01',
        'before': '2023-03-01'
    });
  
    for await (let restock of restocks) {
        console.log(restock);
    }
})();
```

### Get an IssuingRestock

After its creation, information on a restock may be retrieved by its id.

```javascript
await (async() => {
    let restock = await starkinfra.issuingRestock.get('5664445921492992');
    
    console.log(restock);
})();
```

### Query IssuingRestock logs

Logs are pretty important to understand the life cycle of a restock.

```javascript
await (async() => {
    let logs = await starkinfra.issuingRestock.log.query({'limit': 150});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingRestock log

You can get a single log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingRestock.log.get('6310318875607040');
  
    console.log(log);
})();
```

### Create IssuingEmbossingRequests

You can create a request to emboss a physical card.

```javascript
await (async() => {
    let requests = await starkinfra.issuingEmbossingRequest.create([
        new starkinfra.issuingEmbossingRequest({
            'kitId': "5648359658356736", 
            'cardId': "5714424132272128", 
            'displayName1': "Antonio Stark", 
            'shippingCity': "Sao Paulo",
            'shippingCountryCode': "BRA",
            'shippingDistrict': "Bela Vista",
            'shippingService': "loggi",
            'shippingStateCode': "SP",
            'shippingStreetLine1': "Av. Paulista, 200",
            'shippingStreetLine2': "10 andar",
            'shippingTrackingNumber': "My_custom_tracking_number",
            'shippingZipCode': "12345-678",
            'embosserId': "5746980898734080"
        })
    ]);
  
    for await (let request of requests) {
        console.log(request);
    }
})();
```

### Query IssuingEmbossingRequests

You can get a list of created embossing requests given some filters.

```javascript
await (async() => {
    let requests = await starkinfra.issuingEmbossingRequest.query({
        'after': '2023-01-01',
        'before': '2023-03-01'
    });
  
    for await (let request of requests) {
        console.log(request);
    }
})();
```

### Get an IssuingEmbossingRequest

After its creation, information on an embossing request may be retrieved by its id.

```javascript
await (async() => {
    let card = await starkinfra.issuingEmbossingRequest.get('5191752558313472');
  
    console.log(card);
})();
```

### Query IssuingEmbossingRequest logs

Logs are pretty important to understand the life cycle of an embossing request.

```javascript
await (async() => {
    let logs = await starkinfra.issuingEmbossingRequest.log.query({'limit': 150});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingEmbossingRequest log

You can get a single log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingEmbossingRequest.log.get('5191752558313472');
  
    console.log(log);
})();
```

### Create an IssuingTokenRequest

You can create a request that provides the required data you must send to the wallet app.

```javascript
await (async() => {
    let request = await starkinfra.issuingTokenRequest.create({
        cardId: '5189831499972623',
        walletId: 'google',
        methodCode: 'app'
    });
  
    console.log(request);
})();
```

### Process Token authorizations

It's easy to process token authorizations delivered to your endpoint.
Remember to pass the signature header so the SDK can make sure it's StarkInfra that sent you the event.
If you do not approve or decline the authorization within 2 seconds, the authorization will be denied.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let authorization = await starkinfra.issuingToken.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
        });
        res.send(
            starkinfra.issuingToken.responseAuthorization( // this optional method just helps you build the response JSON
                status: 'accepted',
                activationMethods: [
                    {
                        'type': 'app',
                        'value': 'com.subissuer.android'
                    },
                    {
                        'type': 'text',
                        'value': '** *****-5678'
                    }
                ],
                designId: '4584031664472031',
                tags=['token', 'user/1234']
            )
        );

        // or

        res.send(
            starkinfra.issuingToken.responseAuthorization(
                status: 'denied',
                reason: 'other'
            )
        );
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Process Token activations

It's easy to process token activation notifications delivered to your endpoint.
Remember to pass the signature header so the SDK can make sure it's Stark Infra that sent you the event.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let authorization = await starkinfra.issuingToken.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

After that, you may generate the activation code and send it to the cardholder.
The cardholder enters the received code in the wallet app. We'll receive and send it to
tokenAuthorizationUrl for your validation. Completing the provisioning process. 

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        res.send(
            starkinfra.issuingToken.responseActivation( // this optional method just helps you build the response JSON
                status: 'approved',
                tags: ['token', 'user/1234']
            )
        );

        // or

        res.send(
            starkinfra.issuingToken.responseActivation(
                status: 'denied',
                reason: 'other'
            )
        );
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Get an IssuingToken

You can get a single token by its id.

```javascript
await (async() => {
    let token = await starkinfra.issuingToken.get('5749080709922816');
  
    console.log(token);
})();
```

### Query IssuingTokens

You can get a list of created tokens given some filters.

```javascript
await (async() => {
    let tokens = await starkinfra.issuingInvoice.query({
        'limit': 5,
        'after': '2022-01-01',
        'before': '2023-03-01',
        'status': 'active',
        'cardIds': ['5656565656565656', '4545454545454545'],
        'externalIds': ['DSHRMC00002626944b0e3b539d4d459281bdba90c2588791', 'DSHRMC00002626941c531164a0b14c66ad9602ee716f1e85']
    });
  
    for await (let token of tokens) {
        console.log(token);
    }
})();
```

### Update an IssuingToken

You can update a specific token by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let token = await starkinfra.issuingToken.update('5155165527080960', { status: 'blocked' });

    console.log(token);
})();
```

### Cancel an IssuingToken

You can also cancel a token by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let token = await starkinfra.issuingToken.cancel('5155165527080960');

    console.log(token);
})();
```

### Get an IssuingTokenDesign

You can get a single design by its id.

```javascript
await (async() => {
    let token = await starkinfra.issuingTokenDesign.get('5749080709922816');
  
    console.log(token);
})();
```

### Query IssuingTokenDesigns 

You can get a list of available designs given some filters.

```javascript
await (async() => {
    let designs = await starkinfra.issuingInvoice.query({
        'limit': 5,
        'after': '2022-01-01',
        'before': '2023-03-01'
    });
  
    for await (let design of designs) {
        console.log(design);
    }
})();
```

## Get an IssuingTokenDesign PDF

A design PDF can be retrieved by its id. 

```javascript
await (async() => {
    let pdf = await starkinfra.issuingTokenDesign.pdf('5155165527080960');
    await fs.writeFile('token.pdf', pdf);
})();
```

### Process Purchase authorizations

It's easy to process purchase authorizations delivered to your endpoint.
If you do not approve or decline the authorization within 2 seconds, the authorization will be denied.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let authorization = await starkinfra.issuingAuthorization.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
        });
        res.send(
            starkinfra.issuingAuthorization.response( // this optional method just helps you build the response JSON
                status: 'accepted',
                amount: authorization.amount,
                tags: ['my-purchase-id/123']
            )
        );

        // or

        res.send(
            starkinfra.issuingAuthorization.response(
                status: 'denied',
                reason: 'other',
                tags: ['other-id/456']
            )
        );
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Query IssuingPurchases

You can get a list of created purchases given some filters.

```javascript
await (async() => {
    let purchases = await starkinfra.issuingPurchase.query({
        'after': '2022-01-01',
        'before': '2022-03-01'
    });
  
    for await (let purchase of purchases) {
        console.log(purchase);
    }
})();
```

### Get an IssuingPurchase

After its creation, information on a purchase may be retrieved by its id.

```javascript
await (async() => {
    let purchase = await starkinfra.issuingPurchase.get('5155165527080960');
  
    console.log(purchase);
})();
```

### Query IssuingPurchase logs

Logs are pretty important to understand the life cycle of a purchase.

```javascript
await (async() => {
    let logs = await starkinfra.issuingPurchase.log.query({'limit': 150});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingPurchase log

You can get a single log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingPurchase.log.get('5155165527080960');
  
    console.log(log);
})();
```

### Create IssuingInvoices

You can create Pix invoices to transfer money from accounts you have in any bank to your Issuing balance,
allowing you to run your issuing operation.

```javascript
await (async() => {
    let invoice = await starkinfra.issuingInvoice.create({
        'amount': 1000,
        'name': 'Tony Stark',
        'taxId': '012.345.678-90',
        'tags': ['iron', 'suit']
    });
  
    console.log(invoice);
})();
```

**Note**: Instead of using Invoice objects, you can also pass each element in dictionary format

### Get an IssuingInvoice

After its creation, information on an invoice may be retrieved by its id.
Its status indicates whether it's been paid.

```javascript
await (async() => {
    let invoice = await starkinfra.issuingInvoice.get('5155165527080960');
  
    console.log(invoice);
})();
```

### Query IssuingInvoices

You can get a list of created invoices given some filters.

```javascript
await (async() => {
    let invoices = await starkinfra.issuingInvoice.query({
        'after': '2022-01-01',
        'before': '2022-03-01'
    });
  
    for await (let invoice of invoices) {
        console.log(invoice);
    }
})();
```

### Query IssuingInvoice logs

Logs are pretty important to understand the life cycle of an invoice.

```javascript
await (async() => {
    let logs = await starkinfra.issuingInvoice.log.query({'limit': 50});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IssuingInvoice log

You can also get a specific log by its id.

```javascript
await (async() => {
    let log = await starkinfra.issuingInvoice.log.get('5155165527080960');
  
    console.log(log);
})();
```

### Create IssuingWithdrawals

You can create withdrawals to send cash back from your Issuing balance to your Banking balance
by using the Withdrawal resource.

```javascript
await (async() => {
    let withdrawal = await starkinfra.issuingWithdrawal.create({
        'amount': 1000,
        'externalId': '123',
        'description': 'Sending back',
    });
  
    console.log(withdrawal);
})();
```

**Note**: Instead of using Withdrawal objects, you can also pass each element in dictionary format

### Get an IssuingWithdrawal

After its creation, information on a withdrawal may be retrieved by its id.

```javascript
await (async() => {
    let withdrawal = await starkinfra.issuingWithdrawal.get('5155165527080960');
  
    console.log(withdrawal);
})();
```

### Query IssuingWithdrawals

You can get a list of created invoices given some filters.

```javascript
await (async() => {
    let withdrawals = await starkinfra.issuingWithdrawal.query({
        'after': '2022-01-01',
        'before': '2022-03-01'
    });
  
    for await (let withdrawal of withdrawals) {
        console.log(withdrawal);
    }
})();
```

**Note**: the Organization user can only update a workspace with the Workspace ID set.

### Get your IssuingBalance

To know how much money you have in your workspace, run:

```javascript
await (async() => {
    let balance = await starkinfra.issuingBalance.get();
  
    console.log(balance);
})();
```

### Query IssuingTransactions

To understand your balance changes (issuing statement), you can query
transactions. Note that our system creates transactions for you when
you make purchases, withdrawals, receive issuing invoice payments, for example.

```javascript
await (async() => {
    let transactions = await starkinfra.issuingTransaction.query({
        after: '2020-01-01',
        before: '2020-03-01'
    });

    for await (let transaction of transactions) {
        console.log(transaction);
    }
})();
```

### Get an IssuingTransaction

You can get a specific transaction by its id:

```javascript
await (async() => {
    let transaction = await starkinfra.issuingTransaction.get('5155165527080960');
    
    console.log(transaction);
})();
```

## Pix

### Create PixRequests

You can create a Pix request to transfer money from one of your users to anyone else:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let requests = await starkinfra.pixRequest.create([
        {    
            amount: 1000,
            externalId: 'my-external-id:021243543252345',
            senderAccountNumber: '76543-8',
            senderBranchCode: '2201',
            senderAccountType: 'checking',
            senderName: 'checking',
            senderTaxId: '594.739.480-42',
            receiverBankCode: '341',
            receiverAccountNumber: '00000-0',
            receiverBranchCode: '0001',
            receiverAccountType: 'checking',
            receiverName: 'Daenerys Targaryen Stormborn',
            receiverTaxId: '012.345.678-90',
            endToEndId: endToEndId.create('20018183')
        }
    ])

    for (let request of requests) {
        console.log(request);
    }
})();
```

**Note**: Instead of using PixRequest objects, you can also pass each element in dictionary format

### Query PixRequests

You can query multiple Pix requests according to filters.

```javascript
(async() => {
    let requests = await starkinfra.pixRequest.query({
        after: '2020-01-01',
        before: '2020-03-01'
    });

    for await (let request of requests) {
        console.log(request);
    }
})();
```

### Get a PixRequest

After its creation, information on a Pix request may be retrieved by its id. Its status indicates whether it has been paid.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.pixRequest.get('5155165527080960');
    console.log(request);
})();
```

### Process inbound PixRequest authorizations

It's easy to process authorization requests that arrived at your endpoint.
Remember to pass the signature header so the SDK can make sure it's StarkInfra that sent you the event.
If you do not approve or decline the authorization within 1 second, the authorization will be denied.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let reversal = await starkinfra.pixRequest.parse({
            content: req.body.toString(),
            signature: req.headers['Digital-Signature']
        });
        res.end()
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Query PixRequest logs

You can query Pix request logs to better understand Pix request life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let logs = await starkinfra.pixRequest.log.query({limit: 50});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixRequest log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixRequest.log.get('5155165527080960');
    console.log(log);
})();
```

### Create PixReversals

You can reverse a PixRequest either partially or totally using a PixReversal.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let revrersals = await starkinfra.pixReversal.create([
        {
            amount: 1000,
            externalId: 'my-external-id:17238435823958934',
            endToEndId: 'E00000000202201060100rzsJzG9PzMg',
            reason: 'fraud'
        }
    ])
  
    for (let revrersal of revrersals) {
        console.log(revrersal);
    }
})();
```

### Query PixReversals

You can query multiple Pix reversals according to filters.

```javascript
(async() => {
    let requests = await starkinfra.pixRequest.query({
        after: '2020-01-01',
        before: '2020-03-01'
    });
  
    for await (let request of requests) {
        console.log(request);
    }
})();
```

### Get a PixReversal

After its creation, information on a Pix reversal may be retrieved by its id.
Its status indicates whether it has been successfully processed.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let reversal = await starkinfra.pixReversal.get('5155165527080960');
    console.log(reversal);
})();
```

### Process inbound PixReversal authorizations

It's easy to process authorization requests that arrived at your endpoint.
Remember to pass the signature header so the SDK can make sure it's StarkInfra that sent you the event.
If you do not approve or decline the authorization within 1 second, the authorization will be denied.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let reversal = await starkinfra.pixReversal.parse({
            content: req.body.toString(),
            signature: req.headers['Digital-Signature']
        });
        res.end()
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Query PixReversal logs

You can query Pix reversal logs to better understand their life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let logs = await starkinfra.pixReversal.log.query({limit: 50});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixReversal log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixReversal.log.get('5155165527080960');
    console.log(log);
})();
```

### Get your PixBalance

To see how much money you have in your account, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let balance = await starkinfra.pixBalance.get();
    console.log(balance)
})();
```

### Create a PixStatement

Statements are generated directly by the Central Bank and are only available for direct participants.
To create a statement of all the transactions that happened on your account during a specific day, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let statement = await starkinfra.pixStatement.create(
        {
            after: '2022-01-01', // This is the date that you want to create a statement.
            before: '2022-01-01', // After and before must be the same date.
            type: 'transaction' // Options are 'interchange', 'interchangeTotal', 'transaction'.
        }
    )
    console.log(statement)
});
```
### Query PixStatements

You can query multiple Pix statements according to filters.

```javascript
(async() => {
    let statements = await starkinfra.pixStatement.query({
        limit: 10,
    });
  
    for await (let statement of statements) {
        console.log(statement);
    }
})();
```

### Get a PixStatement

Statements are only available for direct participants. To get a Pix statement by its id:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.pixRequest.get('5155165527080960');
    console.log(request);
})();
```

### Get a PixStatement .csv file

To get the .csv file corresponding to a Pix statement using its id, run:

```javascript
const starkinfra = require('starkinfra');
const fs = require('fs').promises;

(async() => {
    let csv = await starkinfra.pixStatement.csv('5155165527080960');
    await fs.writeFile('statement.zip', csv);
})();
```

### Create a PixKey

You can create a Pix Key to link a bank account information to a key id:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let key = await starkinfra.pixKey.create({
        accountCreated: '2022-02-01T00:00:00.00',
        accountNumber: '00000',
        accountType: 'savings',
        branchCode: '0000',
        name: 'Jamie Lannister',
        taxId: '012.345.678-90',
        id: '+5511989898989',
    });
    console.log(key);
})();
```

### Query PixKeys

You can query multiple Pix keys you own according to filters.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let keys = await starkinfra.pixKey.query({
        'limit': 1,
        'after': '2022-01-01',
        'before': '2022-01-12',
        'status': 'registered',
        'tags': ['iron', 'bank'],
        'ids': ['+5511989898989'],
        'type': 'phone'
    });
    for await (let key of keys) {
        console.log(key);
    }
})();
```

### Get a PixKey

Information on any Pix key may be retrieved by its id and the tax ID of the consulting agent.
If the request results in the creation of a Pix Request, the same end to end id should be used. 
If this parameter is not passed, one endToEndId will be automatically created.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let key = await starkinfra.pixKey.get('5155165527080960', '012.345.678-90', { endToEndId: starkinfra.endToEndId.create(bankCode) });
    console.log(key);
})();
```

### Patch a PixKey

Update the account information linked to a Pix Key.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let key = await starkinfra.pixKey.update('+5511989898989', 'branchTransfer', { name: 'Jamie Lannister' });
    console.log(key);
})();
```

### Cancel a PixKey

Cancel a specific Pix Key using its id.

```javascript
const starkinfra = require('starkinfra');

(async () => {
  let key = await starkinfra.pixKey.cancel('5155165527080960');
  console.log(key);
})();
```

### Query PixKey logs

You can query Pix key logs to better understand a Pix key life cycle.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const logs = await starkinfra.pixKey.log.query({
        limit: 50,
        ids: ['5729405850615808'],
        after: '2020-04-01',
        before: '2021-04-30',
        types: ['created'],
        keyIds: ['+5511989898989'],
    });
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixKey log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixKey.log.get('5155165527080960');
    console.log(log);
})();
```

### Create a PixClaim

You can create a Pix claim to request the transfer of a Pix key from another bank to one of your accounts:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let claim = await starkinfra.pixClaim.create({
        accountCreated: '2022-02-01T00:00:00.00',
        accountNumber: '5692908409716736',
        accountType: 'checking',
        branchCode: '0000',
        name: 'testKey',
        taxId: '012.345.678-90',
        keyId: '+5511989898989'
    });
    
    console.log(claim);
})();
```

### Query PixClaims

You can query multiple Pix claims according to filters.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let claims = await starkinfra.pixClaim.query({
        limit: 1,
        after: '2022-01-01',
        before: '2022-01-12',
        status: 'registered',
        ids: ['5729405850615808'],
        type: 'ownership',
        flow: 'in',
        keyType: 'phone',
        keyId: '+5511989898989'
    });
    
    for await (let claim of claims) {
        console.log(claim);
    }
})();
```

### Get a PixClaim

After its creation, information on a Pix claim may be retrieved by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let claim = await starkinfra.pixClaim.get('5155165527080960');
    console.log(claim);
})();
```

### Patch a PixClaim

A Pix Claim can be confirmed or canceled by patching its status.
A received Pix Claim must be confirmed by the donor to be completed.
Ownership Pix Claims can only be canceled by the donor if the reason is 'fraud'.
A sent Pix Claim can also be canceled.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let claim = await starkinfra.pixClaim.update('5155165527080960', 'confirmed');
    console.log(claim);
})();
```

### Query PixClaim logs

You can query Pix claim logs to better understand Pix claim life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const logs = await starkinfra.pixClaim.log.query({
        limit: 50,
        ids: ['5729405850615808'],
        after: '2022-01-01',
        before: '2022-01-20',
        types: ['registered'],
        claimIds: ['5719405850615809']
    });
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixClaim log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixClaim.log.get('5155165527080960');
    console.log(log);
})();
```

### Create a PixDirector

To register the Pix director contact information at the Central Bank, run the following:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let director = await starkinfra.pixDirector.create({
        name: 'Edward Stark',
        taxId: '03.300.300/0001-00',
        phone: '+55-11999999999',
        email: 'ned.stark@company.com',
        password: '12345678',
        teamEmail: 'pix.team@company.com',
        teamPhones: ['+55-11988889999', '+55-11988889998']
    });
    
    console.log(director);
})();
```

### Create PixInfractions

Pix infractions are used to report transactions that raise fraud suspicion, to request a refund or to
reverse a refund. Pix infractions can be created by either participant of a transaction.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let infractions = await starkinfra.pixInfraction.create([
        {
            referenceId: 'E20018183202201201450u34sDGd19lz',
            type: 'fraud',
            method: 'scam',
            operatorPhone: 'fraud@company.com',
            operatorEmail: '+5511999999999',
        }
    ]);
    for (let infraction of infractions) {
        console.log(infraction);
    }
})();
```

### Query PixInfractions

You can query multiple infraction reports according to filters.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let reports = await starkinfra.pixInfraction.query({
        limit: 1,
        after: '2022-01-01',
        before: '2022-01-12',
        status: 'registered',
        ids: ['5729405850615808']
    });
    
    for await (let report of reports) {
        console.log(report);
    }
})();
```

### Get a PixInfraction

After its creation, information on a Pix infraction may be retrieved by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let report = await starkinfra.pixInfraction.get('5155165527080960');
    console.log(report);
})();
```

### Patch a PixInfraction

A received Pix infraction can be confirmed or declined by patching its status.
After a Pix infraction is patched, its status changes to closed.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let report = await starkinfra.pixInfraction.update('5155165527080960', 'agreed');
    console.log(report);
})();
```

### Cancel a PixInfraction

Cancel a specific Pix infraction using its id.

```javascript
const starkinfra = require('starkinfra');

(async () => {
  let report = await starkinfra.pixInfraction.cancel('5155165527080960');
  console.log(report);
})();
```

### Query PixInfraction logs

You can query Pix infraction logs to better understand their life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const logs = await starkinfra.pixInfraction.log.query({
        limit: 50,
        ids: ['5729405850615808'],
        after: '2022-01-01',
        before: '2022-01-20',
        types: ['registered'],
        reportIds: ['5719405850615809']
    });
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixInfraction log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixInfraction.log.get('5155165527080960');
    console.log(log);
})();
```

### Create PixChargebacks

Pix chargebacks can be created when fraud is detected on a transaction or a system malfunction results in an erroneous transaction.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let chargebacks = await starkinfra.pixChargeback.create([
        {
            amount: 100,
            referenceId: 'E20018183202201201450u34sDGd19lz',
            reason: 'fraud',
        }
    ]);

    for (let chargeback of chargebacks) {
        console.log(chargeback);
    }
})();
```

### Query PixChargebacks

You can query multiple Pix chargebacks according to filters.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let requests = await starkinfra.pixChargeback.query({
        limit: 1,
        after: '2022-01-01',
        before: '2022-01-12',
        status: 'registered',
        ids: ['5729405850615808']
    });
    
    for await (let request of requests) {
        console.log(request);
    }
})();
```

### Get a PixChargeback

After its creation, information on a Reversal Request may be retrieved by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.pixChargeback.get('5155165527080960');
    console.log(request);
})();
```

### Patch a PixChargeback

A received Reversal Request can be accepted or rejected by patching its status.
After a Reversal Request is patched, its status changes to closed.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let chargeback = starkinfra.pixChargeback.update(
        '5719405850615809',
        'accepted',
        {
            analysis:'Upon investigation fraud was confirmed.',
            reversalReferenceId:'D20018183202201201450u34sDGd19lz'
        }
    )
    console.log(chargeback)
})()
```

### Cancel a PixChargeback

Cancel a specific Reversal Request using its id.

```javascript
const starkinfra = require('starkinfra');

(async () => {
  let request = await starkinfra.pixChargeback.cancel('5155165527080960');
  console.log(request);
})();
```

### Query PixChargeback logs

You can query Pix chargeback logs to better understand Pix chargeback life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const logs = await starkinfra.pixChargeback.log.query({
        limit: 50,
        ids: ['5729405850615808'],
        after: '2022-01-01',
        before: '2022-01-20',
        types: ['created'],
        requestIds: ['5155165527080960']
    });
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a PixChargeback log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixChargeback.log.get('5155165527080960');
    console.log(log);
})();
```

### Query PixDomains

Here you can list all Pix domains registered at the Brazilian Central Bank. The PixDomain object displays the domain 
name and the QR Code domain certificates of registered Pix participants able to issue dynamic QR Codes.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let pixDomains = await starkinfra.pixDomain.query();
    for await (let certificate of pixDomains) {
        console.log(certificate);
    }
})();
```

### Create StaticBrcodes

StaticBrcodes store account information via a BR code or an image (QR code)
that represents a PixKey and a few extra fixed parameters, such as an amount 
and a reconciliation ID. They can easily be used to receive Pix transactions.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let brcodes = await starkinfra.staticBrcode.create([
        new starkinfra.StaticBrcode({
            name: 'Jamie Lannister',
            keyId: '+5511988887777',
            amount: 100,
            reconciliationId: '123',
            city: 'São Paulo'
        })
    ]);

    for await (let brcode of brcodes) {
        console.log(brcode);
    }
})();
```

### Query StaticBrcodes

You can query multiple StaticBrcodes according to filters.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let brcodes = await starkinfra.staticBrcode.query({
        limit: 1,
        after: '2022-06-01',
        before: '2022-06-30',
        uuids: ['5ddde28043a245c2848b08cf315effa2']
    });
    
    for await (let brcode of brcodes) {
        console.log(brcode);
    }
})();
```

### Get a StaticBrcode

After its creation, information on a StaticBrcode may be retrieved by its UUID.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let brcode = await starkinfra.staticBrcode.get('5ddde28043a245c2848b08cf315effa2');
    
    console.log(brcode);
})();
```

### Create DynamicBrcodes

BR codes store information represented by Pix QR Codes, which are used to send 
or receive Pix transactions in a convenient way.
DynamicBrcodes represent charges with information that can change at any time,
since all data needed for the payment is requested dynamically to an URL stored
in the BR Code. Stark Infra will receive the GET request and forward it to your
registered endpoint with a GET request containing the UUID of the BR code for
identification.

```javascript
const starkinfra = require('starkinfra')

(async() => {
    let brcodes = await starkinfra.dynamicBrcode.create([
        new starkinfra.DynamicBrcode({
            name: "Jamie Lannister",
            city: "Rio de Janeiro",
            externalId: "my_unique_id_05",
            type: "instant"
        })
    ]);

    for (let brcode of brcodes) {
        console.log(brcode);
    }
})();
```

### Query DynamicBrcodes

You can query multiple DynamicBrcodes according to filters.

```javascript
const starkinfra = require('starkinfra')

(async() => {
    let brcodes = await starkinfra.dynamicBrcode.query({
        limit: 1,
        after: '2022-07-01',
        before: '2022-07-30',
        uuids: ['47bfcd05713f4b3aa6a94a24f295de55']
    });
    
    for await (let brcode of brcodes) {
        console.log(brcode);
    }
})();
```

### Get a DynamicBrcode

After its creation, information on a DynamicBrcode may be retrieved by its UUID.

```javascript
const starkinfra = require('starkinfra')

(async() => {
    let brcode = await starkinfra.dynamicBrcode.get('47bfcd05713f4b3aa6a94a24f295de55');
    
    console.log(brcode);
})();
```

### Verify a DynamicBrcode read

When a DynamicBrcode is read by your user, a GET request will be made to the your regitered URL to 
retrieve additional information needed to complete the transaction.
Use this method to verify the authenticity of a GET request received at your registered endpoint.
If the provided digital signature does not check out with the StarkInfra public key, a starkinfra.error.InvalidSignatureError will be raised.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.get('/', async (req, res) => {
    let uuid = await starkinfra.dynamicBrcode.verify({
        uuid: getUuid(req.url), // you should implement this method to extract the uuid from the request's URL
        signature: req.headers["Digital-Signature"],
    });
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
```

### Answer to a Due DynamicBrcode read

When a Due DynamicBrcode is read by your user, a GET request containing 
the BR code UUID will be made to your registered URL to retrieve additional 
information needed to complete the transaction.

The GET request must be answered in the following format within 5 seconds 
and with an HTTP status code 200.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.get('/', async (req, res) => {
    try {
        let uuid = await starkinfra.dynamicBrcode.verify({
            uuid: getUuid(req.url), // you should implement this method to extract the uuid from the request's URL
            signature: req.headers["Digital-Signature"],
        });

        invoice = await get_my_invoice(uuid) // you should implement this method to get the information of the BR code from its uuid

        res.send(
            starkinfra.dynamicbrcode.responseDue({ // this optional method just helps you build the response JSON
                version: invoice.version,
                created: invoice.created,
                due: invoice.due,
                keyId: invoice.keyId,
                status: invoice.status,
                reconciliationId: invoice.reconciliationId,
                amount: invoice.amount,
                senderName: invoice.senderName,
                senderTaxId: invoice.senderTaxId,
                receiverName: invoice.receiverName,
                receiverTaxId: invoice.receiverTaxId,
                receiverStreetLine: invoice.receiverStreetLine,
                receiverCity: invoice.receiverCity,
                receiverStateCode: invoice.receiverStateCode,
                receiverZipCode: invoice.receiverZipCode
            })
        );
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
```

### Answer to an Instant DynamicBrcode read

When an Instant DynamicBrcode is read by your user, a GET request 
containing the BR code UUID will be made to your registered URL to retrieve 
additional information needed to complete the transaction.

The get request must be answered in the following format 
within 5 seconds and with an HTTP status code 200.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.get('/', async (req, res) => {
    try {
        let uuid = await starkinfra.dynamicBrcode.verify({
            uuid: getUuid(req.url), // you should implement this method to extract the uuid from the request's URL
            signature: req.headers["Digital-Signature"],
        });

        invoice = await get_my_invoice(uuid) // you should implement this method to get the information of the BR code from its uuid

        res.send(
            starkinfra.dynamicbrcode.responseInstant({ // this optional method just helps you build the response JSON
                version: invoice.version,
                created: invoice.created,
                keyId: invoice.keyId,
                status: invoice.status,
                reconciliationId: invoice.reconciliationId,
                amount: invoice.amount,
                cashierType: invoice.cashierType,
                cashierBankCode: invoice.cashierBankCode,
                cashAmount: invoice.cashAmount
            })
        );
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
```

## Create BrcodePreviews
You can create BrcodePreviews to preview BR Codes before paying them.

```javascript
const starkinfra = require('starkinfra')

(async () => {
    let previews = await starkinfra.brcodePreview.create([
        new starkinfra.BrcodePreview({
            id: "00020126420014br.gov.bcb.pix0120nedstark@hotmail.com52040000530398654075000.005802BR5909Ned Stark6014Rio de Janeiro621605126674869738606304FF71",
            payerId: "20.018.183/0001-80"
        }),
        new starkinfra.BrcodePreview({
            id: "00020126430014br.gov.bcb.pix0121aryastark@hotmail.com5204000053039865406100.005802BR5910Arya Stark6014Rio de Janeiro6216051262678188104863042BA4",
            payerId: "20.018.183/0001-80"
        }),
    ])

    for (let preview of previews) {
        console.log(preview);
    }
})();
```

## Lending
If you want to establish a lending operation, you can use Stark Infra to
create a CCB contract. This will enable your business to lend money without
requiring a banking license, as long as you use a Credit Fund 
or Securitization company.

The required steps to initiate the operation are:
 1. Have funds in your Credit Fund or Securitization account
 2. Request the creation of an [Identity Check](#create-individualidentities)
for the credit receiver (make sure you have their documents and express authorization)
 3. (Optional) Create a [Credit Simulation](#create-creditpreviews) 
with the desired installment plan to display information for the credit receiver
 4. Create a [Credit Note](#create-creditnotes)
with the desired installment plan

### Create CreditNotes
You can create a Credit Note to generate a CCB contract:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let notes = await starkinfra.creditNote.create([
        {
            templateId: '5745297539989504',
            name: 'Jamie Lannister',
            taxId: '012.345.678-90',
            nominalAmount: 100000,
            scheduled: '2022-04-28',
            invoices: [
                starkinfra.creditNote.Invoice({
                    amount: 120000,
                    due: '2023-06-25',
                    fine: 10,
                    interest: 2
                })
            ],
            transfer: starkinfra.creditNote.Invoice({
                bankCode: '00000000',
                branchCode: '1234',
                accountNumber: '129340-1',
                name: 'Jamie Lannister',
                taxId: '012.345.678-90'
            }),
            signers: [
                starkinfra.creditNote.Signer({
                    name: 'Jamie Lannister',
                    contact: 'jamie.lannister@gmail.com',
                    method: 'link'
                })
            ],
            externalId: '1234',
            streetLine1: 'Av. Paulista, 200',
            streetLine2: '10 andar',
            district: 'Bela Vista',
            city: 'Sao Paulo',
            stateCode: 'SP',
            zipCode: '01310-000'
        }
    ])

    for (let note of notes) {
        console.log(note);
    }
})();
```

**Note**: Instead of using CreditNote objects, you can also pass each element in dictionary format

### Query CreditNotes

You can query multiple credit notes according to filters.

```javascript
(async() => {
    let notes = await starkinfra.creditNote.query({
        after: '2020-01-01',
        before: '2020-03-01',
        status: 'success',
        tags: ['iron', 'suit']
    });

    for await (let note of notes) {
        console.log(note);
    }
})();
```

### Get a CreditNote

After its creation, information on a credit note may be retrieved by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let note = await starkinfra.creditNote.get('5155165527080960');
    console.log(note);
})();
```

### Query CreditNote logs

You can query credit note logs to better understand credit note life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let logs = await starkinfra.creditNote.log.query({
        limit: 50,
        after: '2022-01-01',
        before: '2022-01-20'
    });
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a CreditNote log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.creditNote.log.get('5155165527080960');
    console.log(log);
})();
```

## Credit Preview
You can preview different types of credits before creating them (Currently we only have CreditNote previews):

### Create CreditNotePreviews
You can preview a CreditNote before creation of the CCB contract:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let previews = await starkinfra.creditPreview.create([
        new starkinfra.CreditPreview({
            type: "credit-note",
            credit: new starkinfra.creditPreview.CreditNotePreview({
                initialAmount: 2478,
                initialDue: "2022-10-22",
                nominalAmount: 90583,
                nominalInterest: 3.7,
                rebateAmount: 23,
                scheduled: "2022-09-28",
                taxId: "477.954.506-44",
                type: "sac"
            })
        }),
        new starkinfra.CreditPreview({
            type: "credit-note",
            credit:  new starkinfra.creditPreview.CreditNotePreview({
                initialAmount: 4449,
                initialDue: "2022-10-16",
                interval: "year",
                nominalAmount: 96084,
                nominalInterest: 3.1,
                rebateAmount: 239,
                scheduled: "2022-09-02",
                taxId: "81.882.684/0001-02",
                type: "price"
            })
        }),
        new starkinfra.CreditPreview({
            type: "credit-note",
            credit:  new starkinfra.creditPreview.CreditNotePreview({
                count: 8,
                initialDue: "2022-10-18",
                nominalAmount: 6161,
                nominalInterest: 3.2,
                scheduled: "2022-09-03",
                taxId: "59.352.830/0001-20",
                type: "american"
            })
        }),
        new starkinfra.CreditPreview({
            type: "credit-note",
            credit:  new starkinfra.creditPreview.CreditNotePreview({
                initialDue: "2022-10-13",
                nominalAmount: 86237,
                nominalInterest: 2.6,
                scheduled: "2022-09-03",
                taxId: "37.293.955/0001-94",
                type: "bullet"
            })
        }),
        new starkinfra.CreditPreview({
            type: "credit-note",
            credit:  new starkinfra.creditPreview.CreditNotePreview({
                invoices: [
                    new starkinfra.creditNote.Invoice({
                        amount: 14500,
                        due: "2022-09-19"
                    }),
                    new starkinfra.creditNote.Invoice({
                        amount: 14500,
                        due: "2022-10-25"
                    }),
                ],
                nominalAmount: 29000,
                rebateAmount: 900,
                scheduled: "2022-09-22",
                taxId: "36.084.400/0001-70",
                type: "custom"
            })
        })
    ])

    for (preview of previews) {
        console.log(preview)
    }
})()
```

**Note**: Instead of using dictionary objects, you can also pass each invoice element in the native CreditNotePreview object format

### Create CreditPreviews

You can preview a credit operation before creating them (Currently we only have CreditNote / CCB previews):

```javascript
await (async() => {
    let previews = await starkinfra.creditPreview.create([
        new starkinfra.CreditPreview({
            'type': 'credit-note',
            'credit': new starkinfra.creditPreview.CreditNotePreview ({
                'initialAmount': 2478,
                'initialDue': '2022-07-22',
                'nominalAmount': 90583,
                'nominalInterest': 3.7,
                'rebateAmount': 23,
                'scheduled': '2022-06-28',
                'taxId': "477.954.506-44",
                'type': "sac"
            })
        }),
        new starkinfra.CreditPreview({
            'type': 'credit-note',
            'credit': new starkinfra.creditPreview.CreditNotePreview ({
                'initialAmount': 4449,
                'initialDue': '2022-07-16',
                'interval': 'year',
                'nominalAmount': 96084,
                'nominalInterest': 3.1,
                'rebateAmount': 239,
                'scheduled': '2022-07-02',
                'taxId': '81.882.684/0001-02',
                'type': 'price',
            })
        }),
        new starkinfra.CreditPreview({
            'type': 'credit-note',
            'credit': new starkinfra.creditPreview.CreditNotePreview ({
                'count': 8,
                'initialDue': '2022-07-18',
                'nominalAmount': 6161,
                'nominalInterest': 3.2,
                'scheduled': '2022-07-03',
                'taxId': '59.352.830/0001-20',
                'type': 'american'
            })
        }),
        new starkinfra.CreditPreview({
            'type': 'credit-note',
            'credit': new starkinfra.creditPreview.CreditNotePreview ({
                'initialDue': '2022-07-13',
                'nominalAmount': 86237,
                'nominalInterest': 2.6,
                'scheduled': '2022-07-03',
                'taxId': '37.293.955/0001-94',
                'type': 'bullet'
            })
        }),
        new starkinfra.CreditPreview({
            'type': 'credit-note',
            'credit': new starkinfra.creditPreview.CreditNotePreview ({
                'invoices': [
                    new starkinfra.creditNote.Invoice({
                        'amount': 14500,
                        'due': '2022-08-19'
                    }),
                    new starkinfra.creditNote.Invoice({
                        'amount': 14500,
                        'due': '2022-09-25'
                    })
                ],
                'nominalAmount': 29000,
                'rebateAmount': 900,
                'scheduled': '2022-07-31',
                'taxId': "36.084.400/0001-70",
                'type': "custom"
            })
        })
    ]);
  
    for await (let preview of previews) {
        console.log(preview);
    }
})();
```

**Note**: Instead of using CreditPreview objects, you can also pass each element in dictionary format

### Create CreditHolmes

Before you request a credit operation, you may want to check previous credit operations
the credit receiver has taken.

For that, open up a CreditHolmes investigation to receive information on all debts and credit
operations registered for that individual or company inside the Central Bank's SCR.

```javascript
await (async() => {
    let holmes = await starkinfra.creditHolmes.create([
        new starkinfra.CreditHolmes({
            'taxId': "123.456.789-00",
            'competence': "2022-09"
        }),
        new starkinfra.CreditHolmes({
            'taxId': "123.456.789-00",
            'competence': "2022-08"
        }),
        new starkinfra.CreditHolmes({
            'taxId': "123.456.789-00",
            'competence': "2022-07"
        })
    ]);
  
    for await (let sherlock of holmes) {
        console.log(sherlock);
    }
})();
```

### Query CreditHolmes

You can query multiple credit holmes according to filters.

```javascript
await (async() => {
    let holmes = await starkinfra.creditHolmes.query({
        'after': '2022-06-01',
        'before': '2022-10-30',
        'status': 'success'
    });
  
    for await (let sherlock of holmes) {
        console.log(sherlock);
    }
})();
```

### Get a CreditHolmes

After its creation, information on a credit holmes may be retrieved by its id.

```javascript
await (async() => {
    let holmes = await starkinfra.creditHolmes.get('5657818854064128');
  
    console.log(holmes);
})();
```

### Query CreditHolmes logs

You can query credit holmes logs to better understand their life cycles. 

```javascript
await (async() => {
    let logs = await starkinfra.creditHolmes.log.query({
        'limit': 50,
        'ids': ["5729405850615808"],
        'after': '2022-01-01',
        'before': '2022-01-20',
        'types': ["created"]
    });
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get a CreditHolmes log

You can also get a specific log by its id.

```javascript
await (async() => {
    let log = await starkinfra.creditHolmes.log.get('5155165527080960');
  
    console.log(log);
})();
```

## Identity

Several operations, especially credit ones, require that the identity
of a person or business is validated beforehand.

Identities are validated according to the following sequence:
1. The Identity resource is created for a specific Tax ID
2. Documents are attached to the Identity resource
3. The Identity resource is updated to indicate that all documents have been attached
4. The Identity is sent for validation and returns a webhook notification to reflect
the success or failure of the operation

### Create IndividualIdentities

You can create an IndividualIdentity to validate a document of a natural person

```javascript
await (async() => {
    let identities = await starkinfra.individualIdentity.create([
        new starkinfra.IndividualIdentity({
            'name': "Walter White",
            'taxId': "012.345.678-90",
            'tags': ["breaking", "bad"]
        })
    ]);
  
    for await (let identity of identities) {
        console.log(identity);
    }
})();
```

**Note**: Instead of using IndividualIdentity objects, you can also pass each element in dictionary format

### Query IndividualIdentity

You can query multiple individual identities according to filters.

```javascript
await (async() => {
    let identities = await starkinfra.individualIdentity.query({
        'limit': 10,
        'after': '2022-01-01',
        'before': '2022-04-01',
        'status': "success",
        'tags': ["breaking", "bad"]
    });
  
    for await (let identity of identities) {
        console.log(identity);
    }
})();
```

### Get an IndividualIdentity

After its creation, information on an individual identity may be retrieved by its id.

```javascript
await (async() => {
    let identity = await starkinfra.individualIdentity.get('5155165527080960');
  
    console.log(identity);
})();
```

### Update an IndividualIdentity

You can update a specific identity status to "processing" for send it to validation.

```javascript
await (async() => {
   let identity = await starkinfra.individualIdentity.update('5155165527080960', {'status': 'processing'});
  
    console.log(identity);
})();
```

**Note**: Before sending your individual identity to validation by patching its status, you must send all the required documents using the create method of the CreditDocument resource. Note that you must reference the individual identity in the create method of the CreditDocument resource by its id.


### Cancel an IndividualIdentity

You can cancel an individual identity before updating its status to processing.

```javascript
await (async () => {
  let identity = await starkinfra.individualIdentity.cancel('5155165527080960');

  console.log(identity);
})();
```

### Query IndividualIdentity logs

You can query individual identity logs to better understand individual identity life cycles. 

```javascript
await (async() => {
    let logs = await starkinfra.individualIdentity.log.query({
        'limit': 50,
        'after': '2022-01-01',
        'before': '2022-01-20'
    });
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IndividualIdentity log

You can also get a specific log by its id.

```javascript
await (async() => {
    let log = await starkinfra.individualIdentity.log.get('5155165527080960');
  
    console.log(log);
})();
```

### Create IndividualDocuments

You can create an individual document to attach images of documents to a specific individual Identity.
You must reference the desired individual identity by its id.

```javascript
await (async() => {
    let documents = await starkinfra.individualDocument.create([
        new starkinfra.IndividualDocument({
            'type': "identity-front",
            'content': "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...",
            'identityId': '5155165527080960',
            'tags': ["breaking", "bad"]
        })
    ]);

    console.log(documents[0]);

    documents = await starkinfra.individualDocument.create([
        new starkinfra.IndividualDocument({
            'type': "identity-back",
            'content': "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...",
            'identityId': '5155165527080960',
            'tags': ["breaking", "bad"]
        })
    ]);

    console.log(documents[0]);

    documents = await starkinfra.individualDocument.create([
        new starkinfra.IndividualDocument({
            'type': "selfie",
            'content': "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD...",
            'identityId': '5155165527080960',
            'tags': ["breaking", "bad"]
        })
    ]);

    console.log(documents[0]);
})();
```

**Note**: Instead of using IndividualDocument objects, you can also pass each element in dictionary format

### Query IndividualDocuments

You can query multiple individual documents according to filters.

```javascript
await (async() => {
    let documents = await starkinfra.individualDocument.query({
        'after': '2022-01-01',
        'before': '2022-03-01',
        'status': "success",
        'tags': ["breaking", "bad"],
    });
  
    for await (let document of documents) {
        console.log(document);
    }
})();
```

### Get an IndividualDocument

After its creation, information on an individual document may be retrieved by its id.

```javascript
await (async() => {
    let documents = await starkinfra.individualDocument.get('5155165527080960');
  
    console.log(documents);
})();
```
  
### Query IndividualDocument logs

You can query individual document logs to better understand individual document life cycles. 

```javascript
await (async() => {
    let logs = await starkinfra.individualDocument.log.query({
        'limit': 50
        'after': '2022-01-01',
        'before': '2022-01-20'
    });
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

### Get an IndividualDocument log

You can also get a specific log by its id.

```javascript
await (async() => {
    let log = await starkinfra.individualDocument.log.get('5155165527080960');
  
    console.log(log);
})();
```

## Webhook

### Create a webhook subscription

To create a webhook subscription and be notified whenever an event occurs, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let webhook = await starkinfra.webhook.create({
        url: 'https://webhook.site/dd784f26-1d6a-4ca6-81cb-fda0267761ec',
        subscriptions: [
            'contract', 'credit-note', 'signer',
            'issuing-card', 'issuing-invoice', 'issuing-purchase',
            'pix-request.in', 'pix-request.out', 'pix-reversal.in', 'pix-reversal.out', 'pix-claim', 'pix-key', 'pix-chargeback', 'pix-infraction',
        ],
    });

    console.log(webhook);
})();
```

### Query webhook subscriptions

To search for registered webhooks, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let webhooks = await starkinfra.webhook.query();

    for await (let webhook of webhooks) {
        console.log(webhook);
    }
})();
```

### Get a webhook subscription

You can get a specific webhook by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let webhook = await starkinfra.webhook.get('5155165527080960');
    console.log(webhook);
})();
```

### Delete a webhook subscription

You can also delete a specific webhook by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let webhook = await starkinfra.webhook.delete('5155165527080960');
    console.log(webhook);
})();
```

### Process Webhook events

It's easy to process events delivered to your Webhook endpoint. Remember to pass the
signature header so the SDK can make sure it was really StarkInfra that sent you
the event.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: '*/*'}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let event = await starkinfra.event.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
        });
        if (event.subscription.includes('pix-request')) {
            console.log(event.log.request);
        } else if (event.subscription.includes('pix-reversal')) {
            console.log(event.log.reversal);
        } else if (event.subscription.includes('issuing-card')) {
            console.log(event.log.reversal);
        } else if (event.subscription.includes('issuing-invoice')) {
            console.log(event.log.reversal);
        } else if (event.subscription.includes('issuing-embossing')) {
            console.log(event.log.reversal);
        } else if (event.subscription.includes('issuing-purchase')) {
            console.log(event.log.reversal);
        res.end()
      }
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

### Query webhook events

To search for webhooks events, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const events = await starkinfra.event.query({
        after: '2020-03-20',
        isDelivered: false
    });
    for await (let event of events) {
        console.log(event);
    }
})();
```

### Get a webhook event

You can get a specific webhook event by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let event = await starkinfra.event.get('1082736198236819');
    console.log(event);
})();
```

### Delete a webhook event

You can also delete a specific webhook event by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let event = await starkinfra.event.delete('1082736198236817');
    console.log(event);
})();
```

### Set webhook events as delivered

This can be used in case you've lost events.
With this function, you can manually set events retrieved from the API as
'delivered' to help future event queries with `isDelivered=False`.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let event = await starkinfra.event.update('1298371982371921', { isDelivered: true });
    console.log(event);
})();
```

### Query failed webhook event delivery attempts information

You can also get information on failed webhook event delivery attempts.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    const attempts = await starkinfra.event.attempt.query({
        after: '2020-03-20',
    });
    for await (let attempt of attempts) {
        console.log(attempt.code);
        console.log(attempt.message);
    }
})();
```

### Get a failed webhook event delivery attempt information

To retrieve information on a single attempt, use the following function:

```javascript
const starkinfra = require('starkinfra');

(async() => {
  let attempt = await starkinfra.event.attempt.get('5155165527080960');
  console.log(attempt);
})();
```

# request

This resource allows you to send HTTP requests to StarkInfra routes.

## GET

You can perform a GET request to any StarkInfra route.

It's possible to get a single resource using its id in the path.

```javascript
const starkinfra = require('starkinfra');
(async() => {
    const exampleId = "5699165527090460"
    let path = `/pix-request/${exampleId}`;
    let request = await starkinfra.request.get(path);
    console.log(request)
})();
```

You can also get the specific resource log,

```javascript
const starkinfra = require('starkinfra');
(async() => {
    const exampleId = "5699165527090460"
    let path = `/pix-request/log/${exampleId}`;
    let request = await starkinfra.request.get(path);
    console.log(request)
})();
```

This same method will be used to list all created items for the requested resource.

```javascript
const starkinfra = require('starkinfra');
(async() => {
    const after = "2024-01-01"
    const before = "2024-02-01"
    let cursor = null
    while(true){
        let request = starkinfra.request.get(
            '/pix-request/',
            {"after": after, "before": before, "cursor": cursor}
        )
        cursor = request["content"]["cursor"]
        if(cursor == null){
            break
        }
    }
})();
```

To list logs, you will use the same logic as for getting a single log.

```javascript
const starkinfra = require('starkinfra');
(async() => {
    const after = "2024-01-01"
    const before = "2024-02-01"
    let cursor = null
    while(true){
        let request = starkinfra.request.get(
            '/pix-request/log',
            {"after": after, "before": before, "cursor": cursor}
        )
        cursor = request["content"]["cursor"]
        if(cursor == null){
            break
        }
    }
})();
```

## POST

You can perform a POST request to any StarkInfra route.

This will create an object for each item sent in your request

**Note**: It's not possible to create multiple resources simultaneously. You need to send separate requests if you want to create multiple resources, such as invoices and boletos.

```javascript
const starkinfra = require('starkinfra');
(async() => {
    const data = {
        "holders": [
            {
                "name": "Jaime Lannister",
                "externalId": "my_external_id",
                "taxId": "012.345.678-90"
            }
        ]
    }
    let request = starkinfra.request.post(
        "/issuing-holder",
        data,
    )
    console.log(request["content"])
})();
```

## PATCH

You can perform a PATCH request to any StarkInfra route.

It's possible to update a single item of a StarkInfra resource.

```javascript
const starkinfra = require('starkinfra');
(async() => {
    let exampleId = "5155165527080960"
    let request = starkinfra.request.patch(
        `/issuing-holder/${exampleId}`,
        {"tags": ["Arya", "Stark"]}
    )
    console.log(request["content"])
})();
```

## DELETE

You can perform a DELETE request to any StarkInfra route.

It's possible to delete a single item of a StarkInfra resource.
```javascript
const starkinfra = require('starkinfra');
(async() => {
    let exampleId = "5155165527080960"
    let request = starkinfra.request.delete(
        `/issuing-holder/${exampleId}`
    )
    console.log(request["content"])
})();       
```

# Handling errors

The SDK may raise one of four types of errors: __InputErrors__, __InternalServerError__, __UnknownError__, __InvalidSignatureError__

__InputErrors__ will be raised whenever the API detects an error in your request (status code 400).
If you catch such an error, you can get its elements to verify each of the
individual errors that were detected in your request by the API.
For example:

```javascript
const starkinfra = require('starkinfra');
const { InputErrors } = starkinfra.errors;

(async() => {
    try{
        let statement = await starkinfra.pixStatement.create(
            {
                after: '2022-01-01',
                before: '2022-01-01',
                type: 'transaction'
            }
        );
    } catch (e) {
        if (e instanceof InputErrors) {
            for (error of e.errors) {
                console.log(error.code, error.message);
            }
        } else {
            throw e;
        }
    }
})();
```

__InternalServerError__ will be raised if the API runs into an internal error.
If you ever stumble upon this one, rest assured that the development team
is already rushing in to fix the mistake and get you back up to speed.

__UnknownError__ will be raised if a request encounters an error that is
neither __InputErrors__ nor an __InternalServerError__, such as connectivity problems.

__InvalidSignatureError__ will be raised specifically by starkinfra.event.parse()
when the provided content and signature do not check out with the Stark Infra public
key.

# Help and Feedback

If you have any questions about our SDK, just send us an email.
We will respond you quickly, pinky promise. We are here to help you integrate with us ASAP.
We also love feedback, so don't be shy about sharing your thoughts with us.

Email: help@starkbank.com
