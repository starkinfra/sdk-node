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
    - [BINs](#query-issuingbins): View available sub-issuer BINs (a.k.a. card number ranges)
    - [Holders](#create-issuingholders): Manage cardholders
    - [Cards](#create-issuingcards): Create virtual and/or physical cards
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
  - [Credit Note](#credit-note)
    - [CreditNote](#create-creditnotes): Create credit notes
  - [Webhook](#webhook):
    - [Webhook](#create-a-webhook-subscription): Configure your webhook endpoints and subscriptions
  - [Webhook Events](#webhook-events):
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
    let balance = await starkinfra.balance.get({
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
    let balance = await starkinfra.balance.get({user: project}); // or organization
})();
```

4.2 Set it as a default user in the SDK:

```javascript
const starkinfra = require('starkinfra');

starkinfra.user = project; // or organization

(async() => {
    let balance = await starkinfra.balance.get();
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

### Query IssuingBINs

To take a look at the sub-issuer BINs available to you, just run the following:

```javascript
await (async() => {
    let bins = await starkinfra.issuingBin.query();

    for await (let bin of bins) {
        console.log(bin);
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
        new starkinfra.issuingCard({
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
                status='accepted',
                amount=authorization.amount,
                tags=['my-purchase-id/123']
            )
        );

        // or

        res.send(
            starkinfra.issuingAuthorization.response(
                status='denied',
                reason='other',
                tags=['other-id/456']
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
        agent: 'claimed',
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
            type: 'fraud'
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

## Credit Note

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

## Webhook Events

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
