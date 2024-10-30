# salt-shopping-api

In this exercise you will explore the most widely used framework for building Node.js applications: _Express_.

The playground will be a (slightly limited) web shop with some dummy products. Basically it's just a list of products which you can put in a cart. Each session has a unique cart.

## API

You will first build the API, which will be a classic REST API using lots of Express features. This is a very common way of building REST API's in node today!

We will build the front-end part of the application in a later lab.

## What's already there

The basic project structure is already laid out for you in the `package.json` file of this project. You will also find small pieces of starting code (a config module and a [Joi](https://github.com/hapijs/joi) validator) that might be useful.

There are also a complete set of e2e tests that will guide you to a (hopefully) complete API.

_Note: Just because there is an end to end (e2e) test suite __does not__ mean that you can skip the unit tests!!!_ Unit test the small functions and then ensure that all the units goes together with the e2e tests.

### Products

Some products are already created in the "database" (files in the `db`-folder). Feel free to add more products, but don't spend too much mob time on this. The API should either list all products or one product by id. See the e2e test to learn what is expected to be returned.
It's enough to implement HTTP GET methods on this resource.

### Carts

The carts are created by the client on demand, which means that the `/api/carts/:id` endpoint must support more than just GET.
The endpoint must also support both _json_ and _form data_. Again, let the e2e test guide you.

You can use the module [uuid](https://www.npmjs.com/package/uuid) to generate new universally unique ids for your carts and products.

### Logging

All incoming requests should be logged using `console.log` in the format

```text
[request_id] [timestamp] [http method][http headers]
```

For example:

```text
eacc82 2018-08-13T11:13:33.865Z GET /api/carts {"host":"localhost:3001","user-agent":"curl/7.61.0","accept":"*/*"}
```

If there are any errors the response should also be logged, on the format

```text
[request_id] [timestamp] [http status]
```

For example:

```text
a1f66c 2018-08-13T11:11:31.667Z 500
```

### Express

The project comes loaded with dependencies to [Express](https://github.com/expressjs/express) and [Express Body Parser](https://github.com/expressjs/body-parser), so try to use all the nice middleware possiblities there are in this framework to reduce duplication and make the code both robust and easy to reason about.
