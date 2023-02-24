**React 18 runs effects twice on mount** (in strict mode)
```typescript
function Component(props) {
    useEffect(() => {
        // Do something

        return () => {/* Cleanup */}
    }, [/* Dependencies */]);

    // ...

    return (
        <div>{/* ... */}</div>
    )
}
```
**Before using effect** 
componentDidMount -> componentDidUpdate -> componentWillUnmount

```typescript
useEffect(() => {
    // componentDidMount?
}, []);

useEffect(() => {
    // componentDidUpdate?
}, [something, anotherThing]);

useEffect(() => {
    return () => {
        // componentWillUnmount?
    }
}, []);
```
**useEffect** is not a life-cycle hook.

## **Imperative** approach
- When something happens, like an event or a button is pushed, a form is submitted.
- **execute this effect.**

## **Declarative** approach 
- When something happens,
- it will cause the state to change
- and depending on which parts of the state changed,
- **this effect should be executed,** 
- but only if some condition is true inside of my useEffect
- And React may execute it again 
- for some future reason.
- But only in Strict mode!
- Which you shouldn't disable
- for some future reason

## Ideal
```typescript
useEffect(() => {
    doSomething();

    return () => cleanup();
}, [whenThisChanges]);
```

## ~~Ideal~~ Reality
```typescript
useEffect(() => {
    if(foo && bar && (baz || quo)) {
        doSomething();
    } else {
        doSomethingElse();
    }

    // oops, forgot the cleanup
}, [foo, bar, baz, quo]);
```

## React 18 run effects twice on mount (in strict mode)
- React is actually doing this on purpose.
  - it's mounting the components (effect)
  - and then it's doing a simulated unmount of that component which is calling the cleanup of the effect
  - and immediately afterwards, it's remounting the effect.

**This is react 18's way telling you hey you're using the use effect hook wrong**

## What is useEffect() for?
**Synchronization.**
```typescript
useEffect(() => {
    const sub = createThing(input).subscribe(value => {
        // do something with value
    });

    return sub.unsubscribe;
}, [input]);
```

## Effect Types
### Fire-and-forget (action effects)
- You don't care what the results are. This could be a console.log, an analytics call, maybe you're sending some data asynchronously but you're not awaiting a response.

### Synchronized effect (activity effects)
- When you're actually communicating with an external system. So this effect could actually be long-lived and so that's why it's find for it to unmount and remount because just like changing channels on the TV, you are just changing subscription bu t you still get the same values. 

## Where do Fire-and-forget (action effects) go?
- We **shouldn't** really be putting side effect in render.
- We already know that putting it in useEffect is **awkward**
=> outside component

When we mentioned that **useEffect** is going to run twice when you mount a component. Here's what's happening we're attaching that effect to the components mounting and unmounting, so when an event handler causes a state change that is going to cause the components to re-render, but also remember that react can remount that component and so this effect might be executing multiple times.

**The effects that we put outside of the component rendering and outside of useEffect is only going to be executed once. So these action event effects should actually happen outside of rendering.**

## Where do Event handlers (action effects) go?
```html
<form onSubmit={event => {
    // side-effect!
    submitData(event);
}}>
{/*...*/}
</form>
```

## You Might Not Need an Effect
Effects are an escape hatch from the React paradigm. They let you "step outside" of React and synchronize your components with some external system like a non-React widget, network, or the browser DOM. If there is no external system involved (for example, if you want to update a component's state when some props or state change), you shouldn't need an Effect. Removing unnecessary Effects will make your code easier to follow, faster to fun, and less error-prone.

### You don't need useEffect for **transforming data**
`useEffect()` -> `useMemo()`

```typescript
function Cart() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(
            items.reduce((currentTotal, item) => {
                return currentTotal + item.price;
            }, 0)
        );
    }, [items]);

    // ...
}
```

```typescript
function Cart() {
    const [items, setItems] = useState([]);
    const total = items.reduce((currentTotal, item) => {
        return currentTotal + item.price;
    }, 0)
    // ...
}
```

```typescript
function Cart() {
    const [items, setItems] = useState([]);
    const total = useMemo(
        () => items.reduce((currentTotal, item) => currentTotal + item.price, 0),
        [items]
    );
}
```

### You don't need useEffect for **communicating with parents**
`useEffect()` -> `eventHandler()`

```typescript
function Product({onOpen, onClose}) {
    const [isOpen, setIdOpen] = useState(false);

    useEffect(() => {
        if (isOpen) onOpen();
        else onClose();
    }, [isOpen]);

    return (
        <div>
            <button onClick={setIsOpen(!isOpen)}>
                Open
            </button>
        </div>
    );
}
```
The problem with this is that you might be accidentally introducing additional renders, because of the state change -> it's re-rendering and then it is in the next cycle like when `useEffect()` is called it is telling the parents to do something which might tell the component to do something so you might be introducing additional re-renders inside of there.

So a better pattern to do is move these effects like 
```typescript
function Product({ onOpen, onClose}) {
    const [isOpen, setIsOpen] = useState(false);

    function toggleView() {
        const nextIsOpen = !isOpen;
        setIsOpen(!isOpen);
        if (nextIsOpen) onOpen();
        else onClose();
    }

    return (
        <div>
            <button onClick={toggleView}>Toggle quick view</button>
        </div>
    )
}
```

Or refactor it to a separate hook
```typescript
function useToggle({ onOpen, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    function toggler() {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);

        if(nextIsOpen) onOpen();
        else onClose();
    }

    return [isOpen, toggler];
}

function Product({ onOpen, onClose }) {
    const [isOpen, toggler] = useToggle({ onOpen, onClose });

    return (
        <div>
            <button onClick={toggler}>Toggle quick view</button>
        </div>
    )
}
```

### You don't need useEffect for **subscribing to external stores.**
`useEffect()` -> `useSyncExternalStore()`

```typescript
function Store() {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const sub = storeApi.subscribe(({ status }) => {
            setIsConnected(status === 'connected');
        });

        return () => { sub.unsubscribe(); }
    }, []);
}
```

```typescript
function Product({ id }) {
    const isConnected = useSyncExternalStore(
        // subscribe
        storeApi.subscribe,
        // get snapshot
        () => storeApi.getStatus() === 'connected',
        // get server snapshot
        true
    );
    // ...
}
```

### You don't need useEffect for **fetching data**
`useEffect()` -> `renderAsYouFetch()`

```typescript
function Store() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let isCanceled = false;

        getItems().then((data) => {
            if (isCanceled) return;

            setItems(data);
        });

        return () => { isCanceled = true; };
    });
}
```

Use **Remix** library
```typescript
import { useLoaderDat } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getItems } from "../storeApi";

export const loader = async () => {
    const items = await getItems();

    return json(items);
}

export default function Store() {
    const items = useLoaderData(); 

    // ...
}
```

or use **React Query**
```typescript
import { getItems } from '../storeApi';
import { useQuery, useQueryClient } from 'react-query';

function Store() {
    const queryClient = useQueryClient();

    return (
        <button onClick={ queryClient.prefetchQuery("items", getItems) }>
            See items
        </button>
    )
}
```