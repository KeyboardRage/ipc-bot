# Modules & Plugins
The system uses a plugin approach. Each plugin registers itself to the main system, and knows how to set up itself.

- the app core holds all services. It's just a glorified global object we pass around that holds arbitrary services
  - in one way or another you just pick services from this object and inject them as dependencies
  - this is basically a dependency injection approach, as opposed to importing singletons
- a plugin isn't limited to registering one service; it can do 0 or multiple, it is simply an arbitrary entry-point
- a plugin has multiple lifecycle hooks. You can combine the order plugins are registered with lifecycle hooks to make sure dependency orchestration is correct
  - each Plugin class just hold arbitrary pre-defined functions (lifecycle hooks), all of which are optional to use

![Example flow diagram](https://i.thevirt.us/05/H2d5g.png)

## Example Scenario #1
You want to set up a new DB, e.g. Redis.
You can either extend the `database` plugin to also set up Redis, or you can create a new module/plugin called `redis` or `cache`.
Inside that module, it has all the types, the services, repository, schemas, etc..
It also deals with starting up the connection and tearing it down. It also deals with registering the service to the global AppCore repository, if you want the service to be available everywhere.

## Example Scenario #2
You want to set up a system that mirrors activity in server A to server B.
You could extend the `client` module (which is the bot client), or you can create a new `server-mirror` module that has `client` as a dependency.
Inside that module, you e.g. set up event listeners on `client` or do the necessary changes to receive new messages and what to do with them.

# A module
A module is just encapsulating some arbitrary feature or set of features, for example database(s), the HTTP server, the bot, etc..
A feature can also be a module that depends on another module. Usually you'd want bigger features to have their own module that depends on other modules.
For example, we can have an XP shop module, which has the bot module as a dependency.
This module would then register the necessary DB schemas, add event listeners to the bot to capture messages to be converted to XP, expose API endpoints for frontend related to the shop, and likely even have one or more services related to it, like "EconomyService" and "ShopService".

# Module structure
### Index
The structure usually uses the data/repo/domain pattern.
The index file of the module is the plugin that sets everything up.

Sometimes you'd also have filesin the root of the moduel folder, like `types.ts`, `constants.ts`, and `configs.ts` etc. that are related to the module, but it is global inside the module (*e.g. is used by both data-access and domain, or even other modules*).

### Data access
Inside "data-access" you have your data access repository, DB schema, or for example an API service.
Basically, things that are responsible for reaching the outside world (DB's, API's).
An example could be a repo class for the XP system that uses MongoDB, Redis, and Discord as dependencies. It exposes the methods that store DB records, retrieve DB records, or asks Discord API for data.

### Domain
Inside the "domain" you have business logic. This is our arbitrary services, like "ShopService", "EconomyService", "FastifyServer", database clients, etc..
In here you could also have the actual HTTP handlers that are responsible for taking input data (e.g. params and body), dependencies, and produce an output. For example, an exported class that takes message as input and is responsible for converting it to XP using the injected "EconomyService".

### Entry points
The "entry-points" is almost like the opposite of "data-access"; data-access is us reaching _out_, while entry-point is things reaching _in_.
For example: WebSocket events from the bot, HTTP requests from the frontend, scheduler triggers, or even internal event from other services; module A has a service that emits events. You want to hook into events from this one in another system. For example, the bot client module emits "messageCreated", and in your economy module you want to set up a hook to convert messages sent to XP.

Entry-points are basically responsible for setting up avenues of triggers, extracts the data it needs, and then just calls functions and handlers from domain.

For example, inside `entry-point`, we registered a HTTP route for `/store/buyItem/:itemId`. This route defines the schema for validation, configures whether auth is needed, and so on.
When the request finally reaches `(req, res) => {...}`, all it does inside this function is to call a handler located in the "domain" folder:
```ts
import { HandleBuyItem } from "../../domain/HTTPHandlers";

server.post<ReqResTypes>("/store/buyItem/:itemId", authMiddleware, (req) => {
    return HandleBuyItem(
        server.core.getService("EconomyService"),
        req.user.id,
        {
            itemId: req.params.itemId,
            quantity: req.body.qty,
        },
    );
});
```

Another example with a different entry-point, which is internal events emitted from other modules:
```ts
import { HandleConvertMessageToXP } from "../../domain/EventHandlers";

export default function(core: AppCore) {
    core.getService("bot").on("messageCreated", (message) => {
        return HandleConvertMessageToXP(
            core.getService("EconomyService"),
            message,
        );
    });
}
```
