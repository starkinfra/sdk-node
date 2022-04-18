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
  - [PixRequests](#create-pix-requests): Pix receivables
  - [PixReversals](#create-pix-reversals): Reverse Pix transactions
  - [PixBalance](#get-pix-balance): Account balance
  - [PixStatement](#create-pix-statement): Account statement entry
  - [WebhookEvents](#process-webhook-events): Manage webhook events
  - [CreditNote](#create-credit-notes): Manage credit notes
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

3.1.3. Click on the "New Project" button

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

3.2.3. Click on the "Organization public key" button

3.2.4. Upload the public key you created in section 2 (only a legal representative of the organization can upload the public key)

3.2.5. Click on your profile picture and then on the "Organization" menu to get the Organization ID

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

Language options are "en-US" for English and "pt-BR" for Brazilian Portuguese. English is the default.

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
  pick up from where you left off whenever it is convenient. When there are no more elements to be retrieved, the returned cursor will be `None`.

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
in your account, which can be added to your balance by creating a Pix Request.

In the Sandbox environment, most of the created Pix Requests will be automatically paid,
so there's nothing else you need to do to add funds to your account. Just create
a few Pix Request and wait around a bit.

In Production, you (or one of your clients) will need to actually pay this Pix Request
for the value to be credited to your account.


# Usage

Here are a few examples on how to use the SDK. If you have any doubts, use the built-in
`help()` function to get more info on the desired functionality
(for example: `help(starkinfra.boleto.create)`)

## Create pix requests
You can create a Pix request to charge a user:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let requests = await starkinfra.pixRequest.create([
        {    
            amount: 1000,
            externalId: "my-external-id:021243543252345",
            senderAccountNumber: "76543-8",
            senderBranchCode: "2201",
            senderAccountType: "checking",
            senderName: "checking",
            senderTaxId: "594.739.480-42",
            receiverBankCode: "341",
            receiverAccountNumber: "00000-0",
            receiverBranchCode: "0001",
            receiverAccountType: "checking",
            receiverName: "Daenerys Targaryen Stormborn",
            receiverTaxId: "012.345.678-90",
            endToEndId: endToEndId.create("20018183")
        }
    ])

    for (let request of requests) {
        console.log(request);
    }
})();
```


**Note**: Instead of using Pix Request objects, you can also pass each transaction element in dictionary format

## Query pix requests

You can query multiple pix requests according to filters.

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

## Get a pix request

After its creation, information on a pix request may be retrieved by its id. Its status indicates whether it has been paid.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.pixRequest.get('5155165527080960');
    console.log(request);
})();
```

## Process pix request authorization requests

It's easy to process authorization reversals that arrived in your handler. Remember to pass the
signature header so the SDK can make sure it's StarkInfra that sent you the authorization
request.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: "*/*"}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let reversal = await starkinfra.pixRequest.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
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

## Query pix request logs

You can query pix request logs to better understand pix request life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let logs = await starkinfra.pixRequest.log.query({limit: 50});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

## Get a pix request log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixRequest.log.get('5155165527080960');
    console.log(log);
})();
```

## Create pix reversals

You can reverse a pix request by whole or by a fraction of its amount using a pix reversal.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let revrersals = await starkinfra.pixReversal.create([
        {
            amount: 1000,
            externalId: "my-external-id:17238435823958934",
            endToEndId: "E00000000202201060100rzsJzG9PzMg",
            reason: "fraud"
        }
    ])
  
    for (let revrersal of revrersals) {
        console.log(revrersal);
    }
})();
```

## Query pix reversals

You can query multiple pix reversals according to filters.

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

## Get a pix reversal

After its creation, information on a pix reversal may be retrieved by its id. Its status indicates whether it has been paid.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let reversal = await starkinfra.pixReversal.get('5155165527080960');
    console.log(reversal);
})();
```

## Process pix reversal authorization reversals

It's easy to process authorization reversals that arrived in your handler. Remember to pass the
signature header so the SDK can make sure it's StarkInfra that sent you the authorization 
request.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: "*/*"}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let reversal = await starkinfra.pixReversal.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
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

## Query pix reversal logs

You can query pix reversal logs to better understand pix reversal life cycles.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let logs = await starkinfra.pixReversal.log.query({limit: 50});
  
    for await (let log of logs) {
        console.log(log);
    }
})();
```

## Get a pix reversal log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.pixReversal.log.get('5155165527080960');
    console.log(log);
})();
```

## Get pix balance

To know how much money you have in your workspace, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let balance = await starkinfra.pixBalance.get();
    console.log(balance)
})();
```

## Create pix statement

Statements are only available for direct participants. To create a statement of all the transactions that happened on your workspace during a specific day, run:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let statement = await starkinfra.pixStatement.create(
        {
            after: '2022-01-01',
            before: '2022-01-01',
            type: 'transaction'
        }
    )
    console.log(statement)
});
```
## Query pix statements

You can query multiple pix statements according to filters.

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

## Get a pix statement

Statements are only available for direct participants. To get a pix statement by its id:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.pixRequest.get('5155165527080960');
    console.log(request);
})();
```

## Get a pix statement .csv file

To get a .csv file of a pix statement using its id, run:

```javascript
const starkinfra = require('starkinfra');
const fs = require('fs').promises;

(async() => {
    let csv = await starkinfra.pixStatement.csv('5155165527080960');
    await fs.writeFile('statement.zip', csv);
})();
```

## Process webhook events

It's easy to process events delivered to your Webhook endpoint. Remember to pass the
signature header so the SDK can make sure it was really StarkInfra that sent you
the event.

```javascript
const starkinfra = require('starkinfra');
const express = require('express')
const app = express()

app.use(express.raw({type: "*/*"}));

const port = 3000
app.post('/', async (req, res) => {
    try {
        let event = await starkinfra.event.parse({
            content: req.body.toString(),
            signature: req.headers['digital-signature']
        });
        if (event.subscription.includes("pix-request")) {
            console.log(event.log.request);
        } else if (event.subscription.includes("pix-reversal")) {
            console.log(event.log.reversal);
        }
        res.end()
    }
    catch (err) {
        console.log(err)
        res.status(400).end()
    }
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

## Create credit notes
You can create a Credit Note to generate a CCB contract:

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let requests = await starkinfra.creditNote.create([
        {
            templateId: '5745297539989504',
            name: 'Jamie Lannister',
            taxId: '012.345.678-90',
            nominalAmount: 100000,
            scheduled: '2022-04-28',
            invoices: [
                {
                    due: '2023-06-25',
                    amount: 120000,
                    fine: 10,
                    interest: 2
                }
            ],
            transfer: {
                bankCode: '00000000',
                branchCode: '1234',
                accountNumber: '129340-1',
                name: 'Jamie Lannister',
                taxId: '012.345.678-90'
            },
            signers:[
                {
                    name: 'Jamie Lannister',
                    contact: 'jamie.lannister@gmail.com'
                }
            ]
        },
        {
            templateId: '5745297539989504',
            name: 'Jamie Lannister',
            taxId: '012.345.678-90',
            nominalAmount: 240000,
            scheduled: '2022-04-28',
            invoices: [
                {
                    due: '2023-06-25',
                    amount: 100000,
                    fine: 10,
                    interest: 2
                },
                {
                    due: '2023-07-25',
                    amount: 100000,
                    fine: 11,
                    interest: 2.1
                },
                {
                    due: '2023-08-25',
                    amount: 100000,
                    fine: 12.5,
                    interest: 2.2
                }
            ],
            tags: ['test', 'testing'],
            transfer: {
                bankCode: '00000000',
                branchCode: '1234',
                accountNumber: '129340-1',
                name: 'Jamie Lannister',
                taxId: '012.345.678-90'
            },
            signers:[
                {
                    name: 'Jamie Lannister',
                    contact: 'jamie.lannister@gmail.com'
                }
            ]
        }
    ])

    for (let request of requests) {
        console.log(request);
    }
})();
```

**Note**: Instead of using Credit Note objects, you can also pass each transaction element in dictionary format

## Query credit notes

You can query multiple credit notes according to filters.

```javascript
(async() => {
    let requests = await starkinfra.creditNote.query({
        after: '2020-01-01',
        before: '2020-03-01',
        status: 'success',
        tags: ['iron', 'suit']
    });

    for await (let request of requests) {
        console.log(request);
    }
})();
```

## Get a credit note

After its creation, information on a credit note may be retrieved by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let request = await starkinfra.creditNote.get('5155165527080960');
    console.log(request);
})();
```

## Query credit note logs

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

## Get a credit note log

You can also get a specific log by its id.

```javascript
const starkinfra = require('starkinfra');

(async() => {
    let log = await starkinfra.creditNote.log.get('5155165527080960');
    console.log(log);
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
