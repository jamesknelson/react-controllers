import * as React from 'react'

let renderer = (propNames, controllers, children, parentOutputs, output) => {
  let outputs = {
    ...parentOutputs,
    [propNames[0]]: output,
  }
  let remainingPropNames = propNames.slice(1)
  if (remainingPropNames.length === 0) {
    return children(outputs)
  }
  else {
    let controller = controllers[propNames[1]]
    let innerRenderer = output => renderer(remainingPropNames, controllers, children, outputs, output)
    return controller(innerRenderer)
  }
}

interface CombineProps {
  [name: string]: (children) => React.ReactElement<{ children: (output) => React.ReactElement<any> }>,
}

type CombineOutput<Props extends CombineProps> = {
  [K in keyof Props]: FirstArgumentType<ReturnType<Props[K]>["props"]["children"]>
}

type FirstArgumentType<T extends (output: any) => React.ReactElement<any>> = T extends (output: infer O) => React.ReactElement<any> ? O : never

type Writeable<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P];
}

export class Combine<Props extends CombineProps> extends React.Component<Props & { children: (props: CombineOutput<Props>) => React.ReactElement<any> }> {
  render() {
    let children = this.props.children
    let controllerRenderers: Props = {} as any
    let propNames = Object.keys(this.props)
    let controllerNames: string[] = []
    for (let i = 0; i < propNames.length; i++) {
      let propName = propNames[i]
      if (propName !== 'children') {
        controllerNames.push(propName)
        let controller = this.props[propName]
        if (typeof controller !== 'function') {
          // Support passing controller elements directly when not using TypeScript.
          controllerRenderers[propName] = (children) => React.cloneElement(controller as any, { children })
        }
        else {
          controllerRenderers[propName] = <any>controller
        }
      }
    }

    let controller = controllerRenderers[controllerNames[0]]
    let finalRenderer = output => renderer(controllerNames, controllerRenderers, children, undefined, output)
    return controller(finalRenderer)
  }
}