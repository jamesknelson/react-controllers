react-controllers
=================

Utilities for working with React controller components.

[![npm version](https://img.shields.io/npm/v/react-controllers.svg)](https://www.npmjs.com/package/react-controllers)

```sh
npm install react-controllers --save
```

## React Controllers

A [controller](https://frontarm.com/articles/controller-components/) is a term for a React components that follow three rules:

- It expects to receive a **render function** via its `children` prop
- It passes an **output object** to that render function
- It does not define `shouldComponentUpdate` or `PureComponent`

For example:

```jsx
render() {
  return (
    <AuthController>
      {output =>
        <div className="identity">{output.name}</div>
      }
    </AuthController>
  )
}
```

Some common controllers include the `<Consumer>` component of React's [Context API](https://reactjs.org/docs/context.html#consumer), and the `<Route>` component from [react-router 4](https://reacttraining.com/react-router/web/api/Route/children-func).

## `<Combine>`

When composing a number of controllers, you'll encounter the **controller mountain** problem: whitespace starts stacking up in a way reminiscent of callback pyramids.

```js
<AuthController>
  {auth =>
    <NavContext.Consumer>
      {nav =>
        <StoreContext.Consumer>
          {store =>
            <MyScreen auth={auth} nav={nav} store={store} />
          }
        </StoreContext.Consumer>
      }
    </NavContext.Consumer>
  }
</AuthController>
```

The `<Combine>` controller solves this by combining controllers together.

Each prop for `<Combine>` should be a function that returns a controller element. It then threads the outputs of each controller into the output of its own `children` function. For example, the above could be rewritten as:

```js
import { Combine } from 'react-controllers'

<Combine
  auth={children => <AuthController children={children} />}
  nav={children => <NavContext.Consumer children={children} />}
  store={children => <StoreContext.Consumer children={children} />}
>
  {output =>
    <MyScreen {...output} />
  }
</Combine>
```
